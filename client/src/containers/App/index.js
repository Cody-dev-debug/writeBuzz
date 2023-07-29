import "./styles.css"
import { About, Article, ArticlesList, Authorization, Home, NotFound } from "../../containers"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "../../components";
import { useState } from "react";

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div id="page-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/articles" element={<ArticlesList />} />
            <Route path="/article/:articleId" element={<Article />} />
            <Route path="/auth/:type" element={<Authorization setUser />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
          
      </div>
    </BrowserRouter>
  );
}

export default App;
