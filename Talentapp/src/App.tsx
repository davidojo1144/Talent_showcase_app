import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';

// Named export (no "default")
export const App = () => {
  const { user } = useAuth();

  return (
    <main>
      <div className=' container'>
          {/* <h1>Skill Link</h1> */}
      <AuthForm />
      {/* {user && <pre>{JSON.stringify(user, null, 2)}</pre>} */}
      </div>
    </main>
  );
}