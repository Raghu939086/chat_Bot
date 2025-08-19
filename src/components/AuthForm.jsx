import { useState, useRef, useEffect } from 'react';
import { nhost } from '../nhost';
import './Authform.css';

export default function AuthForm() {
  const [mode, setMode] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  // Ref for timeout
  const timerRef = useRef(null);

  useEffect(() => {
    if (msg) {
      setShowMsg(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowMsg(false), 4000); // Hide after 4s
    }
    return () => clearTimeout(timerRef.current);
  }, [msg]);

  async function onSubmit(e) {
    e.preventDefault();
    setPending(true);
    setMsg('');
    try {
      if (mode === 'sign-up') {
        const { error } = await nhost.auth.signUp({ email, password });
        if (error) throw error;
        setMsg('Signed up! You can now sign in.');
        setMode('sign-in');
      } else {
        const { error } = await nhost.auth.signIn({ email, password });
        if (error) throw error;
        setMsg('Signed in!');
      }
    } catch (err) {
      setMsg(err.message || 'Auth error');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-bg">
      {/* Floating error message */}
      <div className={`auth-float-msg ${showMsg ? 'auth-float-msg-show' : ''}`}>
       <span style={{marginRight: 8, fontSize: '1.2em'}}>❌</span>
        {msg}
      </div>
      <form className="auth-box" onSubmit={onSubmit}>
        <div className="auth-logo">💬</div>
        <h1 className="auth-title">AI Chatbot</h1>
        <p className="auth-subtitle">Your intelligent conversation partner</p>

        <h2 className="auth-welcome">{mode === 'sign-in' ? "Welcome back" : "Create a new account"}</h2>

        <input
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          autoComplete={mode === 'sign-in' ? "current-password" : "new-password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="auth-btn"
          disabled={pending}
        >
          {pending ? 'Please wait…' : (mode === 'sign-in' ? 'Sign In' : 'Create Account')}
        </button>

        <div className="auth-switch">
          {mode === 'sign-in' ? (
            <>
              Don&apos;t have an account?
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode('sign-up')}
                disabled={pending}
              >Sign up</button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode('sign-in')}
                disabled={pending}
              >Sign in</button>
            </>
          )}
        </div>

        <div className="auth-help">
          <div className="auth-help-title">Login Help:</div>
          <ul>
            <li>Use the email and password you registered with</li>
            <li>Check your email for verification link if needed</li>
            <li>If account doesn't exist, hit "Sign up"</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
