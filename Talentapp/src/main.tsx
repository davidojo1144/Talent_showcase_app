import { createRoot } from 'react-dom/client';
import { App } from './App'; // Named import
import './index.css' // Must come before React/App imports
//import App from './App'

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);