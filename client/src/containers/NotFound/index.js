import error from "../../assets/error.png"

const NotFound = () => {
    return (
        <div style={{ textAlign: "center"}}>
            <img src={error} alt="Error 404" width={"70%"} />
            <h1 >Looks like you are lost</h1>
        </div>
    )
}

export default NotFound;