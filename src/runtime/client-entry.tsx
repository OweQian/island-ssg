import { createRoot } from 'react-dom/client';
import siteData from 'island:site-data';
import App from './App';

const renderInBrowser = () => {
  const container = document.getElementById('root');
  console.log(siteData);
  if (!container) {
    throw new Error('#root element not found');
  }
  createRoot(container).render(<App />);
};

renderInBrowser();
