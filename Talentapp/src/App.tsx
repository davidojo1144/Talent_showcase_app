import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';

// Named export (no "default")
export const App = () => {
  const { user } = useAuth();

  return (
    <main>
      <h1>Supabase Auth Demo</h1>
      <AuthForm />
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </main>
  );
}