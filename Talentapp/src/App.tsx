import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import {AuthForm} from './components/AuthForm';
import ProfilePage from './Pages/Profile';
import { LoadingSpinner } from './components/LoadingSpinner';

export  const App = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main>
      <div className='overflow-x-hidden'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/profile" /> : <AuthForm />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </main>
  );
};