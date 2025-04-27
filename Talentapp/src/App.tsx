import { useAuth } from './context/AuthContext';
import { AuthForm } from './components/AuthForm';
import ProfilePage from './Pages/Profile';
import Home from './Pages/Home';
import { LoadingSpinner } from './components/LoadingSpinner';

export const App = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="overflow-x-hidden">
      <Home />
    </main>
  );
};
