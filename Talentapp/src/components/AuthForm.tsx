import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signIn, user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = isLogin 
      ? await signIn(email, password) 
      : await signUp(email, password);

    if (error) setError(error.message);
  };

  if (user) return <div>Welcome, {user.email}! <button onClick={() => signOut()}>Logout</button></div>;

  return (
    <div className="auth-container">
      <h2 className='prata-regular text-center md:text-3xl text-xl pb-5'>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div className="error">{error}</div>}
      <form className='flex flex-col w-full space-y-4' onSubmit={handleSubmit}>
        <input className='py-2 px-10 rounded border-2 border-gray-500 outline-none hover:border-primary focus:border-primary transition duration-200'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input className='py-2 px-10 rounded border-2 border-gray-500 outline-none hover:border-primary focus:border-primary transition duration-200'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
        />
        <button className='bg-primary py-1 px-3 rounded-full text-secondary' type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button  
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        className='text-lg mt-5'
      >
        {isLogin ? 'Need an account? Register' : 'Have an account?  Login'}
      </button>
    </div>
  );
};