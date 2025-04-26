import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, signIn, signUp } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  return (
    <div className="auth-container">
      <h2 className='prata-regular text-center md:text-3xl text-2xl pb-5'>
        {isLogin ? 'Login' : 'Register'}
      </h2>
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
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
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