import articles from "../Article/article-content";
import { ArticlesMap } from "../../components";

const ArticlesList = () => {
    return (
        <>
        <h1>Articles</h1>
        <ArticlesMap articles={articles} />
        </>
    )
}

export default ArticlesList;