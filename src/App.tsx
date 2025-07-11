import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import SummaryComponent from './components/Summary';
import NewsListComponent from './components/NewsList';

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Market News Dashboard for Bitcoin</Navbar.Brand>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="disclaimer-tooltip">
                <div style={{ textAlign: 'left', maxWidth: '300px' }}>
                  <strong>免責事項</strong><br />
                  本サイトの情報は参考目的のみで提供されており、投資の勧誘や特定の投資行動を推奨するものではありません。
                  投資判断は必ずご自身の責任で行い、投資にはリスクが伴うことをご理解ください。
                  本サイトの情報の正確性や完全性について保証するものではありません。
                </div>
              </Tooltip>
            }
          >
            <Button variant="outline-light" size="sm" style={{ marginLeft: 'auto' }}>
              ⚠️ 免責事項
            </Button>
          </OverlayTrigger>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <SummaryComponent />
        
        {/* Advertisement */}
        <div className="text-center my-4 p-3" style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <p className="mb-2">
            <small>広告です。たまにクリックしていただけるとうれしいです。</small>
          </p>
          <a 
            href="https://otieu.com/4/9552196" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-secondary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            スポンサーリンク
          </a>
        </div>
        
        <NewsListComponent />
      </Container>
    </>
  );
}

export default App;
