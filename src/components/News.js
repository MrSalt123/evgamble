import React, { useState, useEffect } from 'react';
import './styles/News.css';

const News = () => {
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopHeadlines = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/News/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopHeadlines(data.articles.filter(article => !!article.urlToImage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top headlines:', error);
        setLoading(false);
      }
      
    };

    fetchTopHeadlines();
  }, []);

  return (
    <div className="news">
      <h2>News</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='article-box'>
          {topHeadlines.map((article, index) => (
            <div key={index} className="article">
              <a href={article.url} target="_blank">
				<img src={article.urlToImage} alt={article.title}/>
			  </a>
              <div className='article-description'>{article.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default News;
