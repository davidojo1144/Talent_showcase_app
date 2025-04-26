import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure this is imported!
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <AuthProvider>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </AuthProvider>
);
