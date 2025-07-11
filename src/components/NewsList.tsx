import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, ListGroup, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

interface NewsArticle {
  timestamp: string;
  url: string;
  title_jp: string;
  summary_jp: string;
  impact: number;
}

const NewsListComponent: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const extractDomain = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'unknown';
    }
  };

  const fetchTranslations = async (page: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const response = await axios.get(`/api/news/translations?page=${page}&size=10`);
      console.log('API Response:', response.data);
      
      // Handle different response structures
      let newNews: NewsArticle[] = [];
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        newNews = response.data.content;
      } else if (response.data && Array.isArray(response.data)) {
        newNews = response.data;
      } else {
        console.error('Unexpected response structure:', response.data);
        setError('Unexpected response format from server.');
        return;
      }
      
      if (append) {
        setNews(prev => [...prev, ...newNews]);
      } else {
        setNews(newNews);
      }
      
      setHasMore(newNews.length === 10);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch news.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTranslations(0, false);
    const interval = setInterval(() => fetchTranslations(0, false), 300000); // 5分ごと

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= 
        document.documentElement.offsetHeight &&
        !loadingMore &&
        hasMore
      ) {
        fetchTranslations(currentPage + 1, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loadingMore, hasMore]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        News Articles
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="news-articles-tooltip">
              <div style={{ textAlign: 'left', maxWidth: '300px' }}>
                <strong>News Articlesについて</strong><br />
                AIが海外のニュースサイトを自動的に監視し、ビットコイン関連の記事を日本語に翻訳・要約しています。<br /><br />
                <strong>Impactについて</strong><br />
                各記事のImpact値はAIがその記事がビットコイン市場に与える影響を解析した結果です。<br />
                ・ 高い値: 市場に大きな影響を与える可能性<br />
                ・ 低い値: 市場への影響は限定的<br /><br />
                この情報はAIによる分析結果であり、投資判断の参考情報です。
              </div>
            </Tooltip>
          }
        >
          <Button variant="outline-primary" size="sm">
            ℹ️ 説明
          </Button>
        </OverlayTrigger>
      </Card.Header>
      <ListGroup variant="flush">
        {news.map((article, index) => (
          <ListGroup.Item key={index} action href={article.url} target="_blank">
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">{article.title_jp}</h6>
              <small>Impact: {article.impact}</small>
            </div>
            <p className="mb-1">{article.summary_jp}...</p>
            <small>Published: {new Date(new Date(article.timestamp).getTime() + 9 * 60 * 60 * 1000).toLocaleString('ja-JP')} (JST) | Source: {extractDomain(article.url)}</small>
          </ListGroup.Item>
        ))}
        {loadingMore && (
          <ListGroup.Item className="text-center">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Loading more news...</span>
          </ListGroup.Item>
        )}
        {!hasMore && news.length > 0 && (
          <ListGroup.Item className="text-center text-muted">
            No more news to load
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default NewsListComponent;
