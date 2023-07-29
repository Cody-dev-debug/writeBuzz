import { MongoClient } from "mongodb";
import { createAdapter } from "@socket.io/mongo-adapter";

let db,articlesChangeStream;

/* Start the mongo demon with => mongod --port 27018 --dbpath mongodb-data --noauth*/

const connectToDB = async (io,listen) => {
    const client = new MongoClient("mongodb://127.0.0.1:27018");
    await client.connect();
    db = client.db("react-blog-db");
    // const articles = db.collection("articles")
    // articlesChangeStream = articles.watch();
    // // set up a listener when change events are emitted
    // articlesChangeStream.on("change", next => {
    //   // process any change event
    //   console.log("received a change to the collection: \t", next);
    // });
    listen()
}

export {
    db,
    connectToDB,
}