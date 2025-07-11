import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

interface Summary {
  timestamp: string;
  summary1_jp: string;
  summary2_jp: string;
  summary3_jp: string;
  impact: number;
  bitcoin_price: string;
}

const SummaryComponent: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('/api/news/summaries?page=0&size=1');
        if (response.data.content && response.data.content.length > 0) {
          setSummary(response.data.content[0]);
        }
      } catch (err) {
        setError('Failed to fetch summary.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 60000); // 1分ごと

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!summary) {
    return <Alert variant="info">No summary available.</Alert>;
  }

  return (
    <Card className="mb-4">
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        Market Summary
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="market-summary-tooltip">
              <div style={{ textAlign: 'left', maxWidth: '300px' }}>
                <strong>Market Impactについて</strong><br />
                AIが24時間以内のニュースを解析し、ビットコイン市場への影響を-10から+10のスケールで表示しています。<br />
                ・ +10: 非常にポジティブな影響<br />
                ・ 0: 中立的な影響<br />
                ・ -10: 非常にネガティブな影響<br /><br />
                この数値はAIによる分析結果であり、投資判断の参考情報です。
              </div>
            </Tooltip>
          }
        >
          <Button variant="outline-primary" size="sm">
            ℹ️ 説明
          </Button>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body>
        <Card.Title>Market Impact: {summary.impact}</Card.Title>
        <Card.Text>
          <strong>Bitcoin Price:</strong> ${parseFloat(summary.bitcoin_price).toLocaleString()}
        </Card.Text>
        <hr />
        <h6>Key Summaries:</h6>
        <ul>
          <li>{summary.summary1_jp}</li>
          <li>{summary.summary2_jp}</li>
          <li>{summary.summary3_jp}</li>
        </ul>
      </Card.Body>
      <Card.Footer className="text-muted">
        Last updated: {new Date(new Date(summary.timestamp).getTime() + 9 * 60 * 60 * 1000).toLocaleString('ja-JP')} (JST)
      </Card.Footer>
    </Card>
  );
};

export default SummaryComponent;
