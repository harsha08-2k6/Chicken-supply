import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ title }) => {
  const { logout } = useContext(AuthContext);

  return (
    <nav style={{
      backgroundColor: 'var(--surface-alt)',
      color: 'var(--text)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src="/src/assets/images/logo.jpg" alt="SV Chicken Logo" style={{ height: '40px', width: '40px', objectFit: 'cover', objectPosition: 'center 15%', borderRadius: '50%', border: '2px solid var(--primary)' }} />
        <h3 style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>{title}</h3>
      </div>
      <button 
        onClick={logout}
        style={{
          color: 'var(--text)',
          border: '1px solid var(--border)',
          background: 'var(--input-bg)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 500,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
