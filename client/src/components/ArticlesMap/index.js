import { Link } from "react-router-dom"

const ArticlesMap = ({ articles }) => {
    return (
        <>
        {
            articles.map((article,idx) => (
                <Link key={idx} className="article-list-item" to={`/article/${article.name}`}>
                    <h3>{article.title}</h3>
                    <p>{article.content[0].substring(0,150)}...</p>
                </Link>
            ))
        }
        </>
    )
}

export default ArticlesMap;