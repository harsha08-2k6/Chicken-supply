import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import '../../styles/global.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Defaulting to restaurant login for this UI
    const result = await login(email, password, 'restaurant');
    
    setIsLoading(false);
    if (result.success) {
      if (result.role === 'ADMIN') navigate('/admin/dashboard');
      else if (result.role === 'RESTAURANT') navigate('/restaurant/dashboard');
      else navigate('/worker/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'radial-gradient(circle at 15% 20%, rgba(245, 203, 92, 0.16), transparent 35%), radial-gradient(circle at 85% 80%, rgba(207, 219, 213, 0.10), transparent 35%), #242423',
      color: 'var(--text)'
    }}>
      
      {/* Left Side: Brand Section (Hidden on mobile) */}
      <div style={{ 
        flex: 1, 
        display: 'none', 
        '@media (min-width: 768px)': { display: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 2rem 4rem 8rem', /* Adjusted padding to bring it closer to center */
        position: 'relative'
      }} className="brand-section">
        <style>
          {`
            @media (min-width: 900px) {
              .brand-section { display: flex !important; }
            }
            .brand-section { display: none; }
          `}
        </style>
        
        <div style={{ maxWidth: '480px', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            padding: '4px',
            marginBottom: '1.5rem',
            borderRadius: '50%',
            border: '3px solid transparent',
            background: 'linear-gradient(#242423, #242423) padding-box, linear-gradient(135deg, var(--primary), var(--accent)) border-box'
          }}>
            <img 
              src="/src/assets/images/logo.jpg" 
              alt="SV Chicken Logo" 
              style={{ height: '80px', width: '80px', objectFit: 'cover', objectPosition: 'center 15%', borderRadius: '50%', display: 'block' }} 
              onError={(e) => e.target.style.display = 'none'} 
            />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
            Sri Venkateswara<br/>
            <span style={{ color: 'var(--primary)' }}>Chicken Centre</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted)', fontWeight: 400, marginTop: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
            Fresh food. Simple management.<br/> Better service.
          </p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', /* Change to flex-start to close the gap */
        padding: '2rem 8rem 2rem 2rem', /* Adjusted padding to match left side */
        maxWidth: '100%'
      }} className="form-section">
        <style>
          {`
            @media (max-width: 899px) {
              .form-section { justify-content: center !important; padding: 2rem !important; }
            }
          `}
        </style>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2.5rem', margin: '0' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Welcome Back</h2>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: '15px' }}>Sign in to continue to your account</p>
          </div>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="Enter your email"
                  required 
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  placeholder="Enter password"
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', padding: '0.5rem' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', gap: '0.5rem' }} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px' }}>
            <span style={{ color: 'var(--muted)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
