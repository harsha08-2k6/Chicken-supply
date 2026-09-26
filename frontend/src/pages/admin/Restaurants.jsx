import React from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="Manage Restaurants" />
      <div style={{ padding: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>&larr; Back</button>
        <div className="card">
          <h2>Manage Restaurants</h2>
          <p style={{ color: 'var(--muted)' }}>This page is under construction.</p>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
