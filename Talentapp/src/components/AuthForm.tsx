// components/AuthForm.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        navigate('/profile'); // Redirect after successful auth
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setEmail('');
    setPassword('');
    setError(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className='p-5 border rounded-xl shadow-2xl'>
        <p className='prata-regular text-center md:text-3xl text-xl pb-2'>Welcome,</p> 
        <p className='text-xl text-center'>{user.email}!</p>
        <button 
          className='bg-primary text-secondary py-2 px-5 rounded-full ml-14 mt-5' 
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2 className='prata-regular text-center md:text-3xl text-2xl pb-5'>
        {isLogin ? 'Login' : 'Register'}
      </h2>
      {error && <div className="error">{error}</div>}
      <form className='flex flex-col w-full space-y-4' onSubmit={handleSubmit}>
        <input 
          className='py-2 px-10 rounded border-2 border-gray-500 outline-none hover:border-primary focus:border-primary transition duration-200'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input 
          className='py-2 px-10 rounded border-2 border-gray-500 outline-none hover:border-primary focus:border-primary transition duration-200'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
        />
        <button 
          className='bg-primary py-1 px-3 rounded-full text-secondary' 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button  
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        className='text-lg mt-5'
      >
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};