import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import './toastify-custom.css'; // Replace the default CSS import

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" // Use "light" as base for custom colors
      toastClassName="custom-toast" // Optional additional class
    />
  </>
);