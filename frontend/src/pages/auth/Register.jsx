import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, Lock, Store, Briefcase, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import '../../styles/global.css';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('RESTAURANT'); // or WORKER
  const [formData, setFormData] = useState({
    restaurantName: '', ownerName: '', workerName: '',
    email: '', phone: '', address: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccess(data.message || 'Account created successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Registration failed. Server unreachable.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      background: 'radial-gradient(circle at 15% 20%, rgba(245, 203, 92, 0.16), transparent 35%), radial-gradient(circle at 85% 80%, rgba(207, 219, 213, 0.10), transparent 35%), #242423'
    }}>
      
      <div className="card" style={{ maxWidth: '680px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Create Your Account</h2>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '15px' }}>Join Sri Venkateswara Chicken Centre</p>
          <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0 0 0' }} />
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        
        {success && (
          <div style={{ backgroundColor: 'rgba(245, 203, 92, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', border: '1px solid rgba(245, 203, 92, 0.2)' }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Select Role</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => { setRole('RESTAURANT'); setError(''); }}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '15px',
                border: `1px solid ${role === 'RESTAURANT' ? 'var(--primary)' : 'var(--border)'}`, 
                backgroundColor: role === 'RESTAURANT' ? 'rgba(245,203,92,0.1)' : 'var(--input-bg)', 
                color: role === 'RESTAURANT' ? 'var(--primary)' : 'var(--text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}>
              <Store size={18} /> Restaurant
            </button>
            <button 
              type="button" 
              onClick={() => { setRole('WORKER'); setError(''); }}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '15px',
                border: `1px solid ${role === 'WORKER' ? 'var(--primary)' : 'var(--border)'}`, 
                backgroundColor: role === 'WORKER' ? 'rgba(245,203,92,0.1)' : 'var(--input-bg)', 
                color: role === 'WORKER' ? 'var(--primary)' : 'var(--text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}>
              <Briefcase size={18} /> Worker
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', gapY: '1.5rem' }}>
          
          <style>
            {`
              @media (max-width: 600px) {
                form { grid-template-columns: 1fr !important; }
              }
            `}
          </style>

          {role === 'RESTAURANT' ? (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Restaurant Name</label>
                <input name="restaurantName" type="text" onChange={handleChange} placeholder="Restaurant name" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Owner Name</label>
                <input name="ownerName" type="text" onChange={handleChange} placeholder="Owner full name" required />
              </div>
            </>
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Full Worker Name</label>
              <input name="workerName" type="text" onChange={handleChange} placeholder="Enter full name" required />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Phone Number</label>
            <input name="phone" type="tel" onChange={handleChange} placeholder="Enter phone" required />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Email Address</label>
            <input name="email" type="email" onChange={handleChange} placeholder="Enter email" required />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Password</label>
            <input name="password" type="password" onChange={handleChange} placeholder="Enter password" required minLength="6" />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Confirm Password</label>
            <input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm password" required minLength="6" />
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', gap: '0.5rem' }} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px' }}>
          <span style={{ color: 'var(--muted)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
