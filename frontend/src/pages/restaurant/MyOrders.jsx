import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/restaurant/my-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="My Orders" />
      <div style={{ padding: '2rem' }}>
        <button onClick={() => navigate('/restaurant/dashboard')} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>&larr; Back to Dashboard</button>
        
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>My Orders</h2>
          
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No orders found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Delivery Date</th>
                  <th style={{ padding: '1rem' }}>Delivery Time</th>
                  <th style={{ padding: '1rem' }}>Total Quantity</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>#{order.orderNumber}</td>
                    <td style={{ padding: '1rem' }}>{order.deliveryDate}</td>
                    <td style={{ padding: '1rem' }}>{order.deliveryTime}</td>
                    <td style={{ padding: '1rem' }}>{order.totalQuantity} kg</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '6px',
                        backgroundColor: order.status === 'PENDING' ? 'rgba(255,193,7,0.1)' : order.status === 'REJECTED' ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)',
                        color: order.status === 'PENDING' ? 'var(--warning)' : order.status === 'REJECTED' ? 'var(--danger)' : 'var(--success)'
                      }}>{order.status}</span>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => navigate(`/restaurant/order/${order.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>View Details</button>
                      {order.status === 'PENDING' && (
                        <button onClick={() => navigate(`/restaurant/edit-order/${order.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--warning)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Order</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
