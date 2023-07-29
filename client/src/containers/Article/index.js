import { useNavigate, useParams } from "react-router-dom";
import articles from "./article-content";
import { useEffect, useState } from "react";
import axios from "axios";
// import { io } from "socket.io-client";
import { Comments, Modal } from "../../components";
import { useUser } from "../../hooks";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import "./styles.css";

const Article = () => {
  const [articleInfo, setArticleInfo] = useState({
    downvote: 0,
    upvote: 0,
    comments: [],
  });
  const [modal, setModal] = useState({open:false, text:""});
  const [authToken, setAuthToken] = useState("");

  // const socket = io("http://localhost:8000");

  const { user } = useUser();
  const { articleId } = useParams();
  const navigate = useNavigate();

  const article = articles.find((item) => item.name === articleId);

  if (!article) navigate("/*", { replace: true });

  // socket.on("connect", () => {
  //     console.log("Connected");
  // });

  useEffect(() => {
    user && user.getIdToken(true).then((auth) => setAuthToken(auth));
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authToken]);

  const checkUser =(text) => () => {
    if (!user) {
      setModal({text,open:true});
      return false;
    }
    return true;
  };

  const nonAuthUserText = "Please Login First to comment, upvote or downvote an article"

  const alreadyVoted = "You can only upvote or downvote only once";

  const voting = (type) => async () => {
    if (!checkUser(nonAuthUserText)()) return;
    try {
      const response = await axios.post(
        `http://localhost:8000/api/article/${articleId}/voting/${type}`,
        {},
        {
          headers: { authToken: authToken },
        }
      );
      console.log(response);
      setData();
    }catch(err){
      console.log("🚀 ~ file: index.js:66 ~ voting ~ err:", err)
      const { response: error } = err
      if( error?.status === 400 && error?.data === `User already ${type}d`){
        setModal({text: alreadyVoted,open:true});
      }
    }
  };
  const setData = async () => {
    const response = await axios
      .get(
        `http://localhost:8000/api/article/${articleId}`,
        {},
        {
          headers: { authToken: authToken },
        }
      )
      setArticleInfo(response.data);
  };

  const handleOnCommentSubmit = (text) => async () => {
    const date = new Date();
    const response = await axios.post(
      `http://localhost:8000/api/article/${articleId}/comments`,
      {
        commentedAt: date,
        comment: text,
      },
      { headers: { authToken: authToken } }
    );
    console.log(response.data);
    setData();
  };

  return (
    <>
      <h1>{article.title}</h1>
      {article.content.map((item, idx) => (
        <p key={idx}>{item}</p>
      ))}
      <div>
        <div className="vote">
          <span className="votetext">{articleInfo.upvote}</span>
          <ThumbUp
            color="action"
            sx={{
              "&:hover": {
                color: "black",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              },
            }}
            fontSize="large"
            onClick={voting("upvote")}
          />
        </div>

        <div className="vote">
          <span className="votetext">{articleInfo.downvote}</span>
          <ThumbDown
            color="action"
            sx={{
              "&:hover": {
                color: "black",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              },
            }}
            fontSize="large"
            onClick={voting("downvote")}
          />
        </div>
      </div>

      <Comments
        comments={articleInfo.comments}
        checkUser={checkUser}
        handleSubmit={handleOnCommentSubmit}
      />
      <Modal open={modal.open} setOpen={(value) => setModal({...modal,open:value})}>
        {modal.text}
      </Modal>
    </>
  );
};

export default Article;
