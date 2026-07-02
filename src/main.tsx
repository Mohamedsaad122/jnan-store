import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Failed to find the root element with id "app"');
}

const root = createRoot(container);
root.render(<App />);
