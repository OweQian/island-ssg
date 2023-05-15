import { createRoot } from 'react-dom/client';
import siteData from 'island:site-data';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const renderInBrowser = () => {
  const container = document.getElementById('root');
  console.log(siteData);
  if (!container) {
    throw new Error('#root element not found');
  }
  createRoot(container).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

renderInBrowser();
