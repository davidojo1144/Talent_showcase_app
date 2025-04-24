import { useAuth } from './hooks/useAuth';
import Home from './Pages/Home';

// Named export (no "default")
export const App = () => {
  const { user } = useAuth();

  return (
    <main>
      <div className='overflow-x-hidden'>
        <Home/>
      {/* {user && <pre>{JSON.stringify(user, null, 2)}</pre>} */}
      </div>
    </main>
  );
}