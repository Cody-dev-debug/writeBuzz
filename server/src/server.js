import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectToDB,db } from "./db.js";
import fs from 'fs'
import admin from 'firebase-admin'

const credentials = JSON.parse(
  fs.readFileSync('./credentials.json')
)

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,authToken");
  next();
});

// app.use((req,res,next) => {
//   const { authtoken } = req.headers
//   console.log("🚀 ~ file: server.js:30 ~ app.use ~ authtoken:", authtoken)
//   if(authtoken){
//       try{
//         admin.auth().verifyIdToken(authtoken).then((user) => {
//           console.log("🚀 ~ file: server.js:33 ~ app.use ~ req.user:", user)
//           req.user = user
//         })
//       } catch(err){
//         res.status(400).send(err.message)
//       }
//   }
//   next();
// })

app.get("/api/article/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const article = await db.collection("articles").findOne({ name });
    if (article) {
      const { comments,name,_id } = article 
      res.json({ name,_id,comments, upvote: article.upvoteIds.length, downvote: article.downvoteIds.length });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(400).send(error.message);
  // }
});

app.use((req, res, next) => {
  const { authtoken } = req.headers
  console.log("🚀 ~ file: server.js:60 ~ app.use ~ req.headers:", req.headers)
  console.log("🚀 ~ file: server.js:60 ~ app.use ~ authtoken:", authtoken)
  if(authtoken){
      try{
        admin.auth().verifyIdToken(authtoken).then((user) => {
          req.user = user
          next();
        })
      } catch(err){
        res.status(401).send("hello"+err.message)
      }
  } else {
    res.status(401).send("User not authenticated");
  }
})

app.post("/api/article/:name/voting/:type", async (req, res) => {
  const { name, type } = req.params;
  const { uid } = req.user;
  try {
    let article = await db.collection("articles").findOne({ name });
    if(article[`${type}Ids`].includes(uid)){
      res.status(400).send(`User already ${type}d`);
      return;
    }
    await db.collection("articles").updateOne(
      { name },
      {
        $push: { [`${type}Ids`]: uid },
      }
    );

    article = await db.collection("articles").findOne({ name });
    if (article) {
      res.send(
        `The ${name} article now has ${article.upvoteIds.length} upvote${
          article.upvoteIds.length > 1 ? "s" : ""
        } and ${article.downvoteIds.length} downvote${article.downvoteIds.length > 1 ? "s" : ""}`
      );
    } else {
      res.status(404).send(`The ${name} article doesn't exist!!`);
    }
  } catch (error) {
    console.log("🚀 ~ file: server.js:102 ~ app.post ~ error:", error)
    res.status(400).send(error.message);
  }
});

app.post("/api/article/:name/comments",async (req, res) => {
  const { name } = req.params;
  const { commentedAt, comment } = req.body;
  const { name:userName } = req.user;
  try {
    await db.collection("articles").updateOne(
      { name },
      {
        $push: { comments : {comment,commentedAt,commentor: userName } },
      }
    );

    const article = await db.collection("articles").findOne({ name });
    if (article) {
      res.send("Commented Successfully")
    } else {
      res.status(404).send(`The ${name} article doesn't exist!!`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {
  origin: "http://localhost:3000"
}});

io.on("connection", (socket) => {
  console.log("Connected");
});

connectToDB(io,() => {
  console.log("Database connected")
  httpServer.listen(8000, () => console.log("Server is Listening"));
})
