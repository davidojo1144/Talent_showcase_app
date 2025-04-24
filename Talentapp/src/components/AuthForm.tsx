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
      <h2 className=''>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button 
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        className="toggle-auth"
      >
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};