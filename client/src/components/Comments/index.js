import AddForm from "../AddForm";

const Comments = ({ comments, handleSubmit, checkUser }) => {
    return (
        <>
        <AddForm type="Comment" handleSubmit={handleSubmit} checkUser={checkUser} />
        <h1>Comments : </h1>
        {
            comments && comments?.map((comment) => (
                <div className="comment" key={`${comment.commentor}:${comment.commentedAt}`}>
                    <h4>{comment.commentor}</h4>
                    <p>{comment.comment}</p>
                </div>
            ))
        }
        </>
    )
}

export default Comments;