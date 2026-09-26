import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const WorkerOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setOrder(await response.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrderDetails(); // Refresh
      } else {
        toast.error("Failed to update status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title={`Order #${order.orderNumber}`} />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>&larr; Back</button>
        
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>Order #{order.orderNumber}</h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1.1rem' }}>Restaurant: <strong>{order.restaurantName}</strong></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem', 
                borderRadius: '8px',
                fontWeight: 'bold',
                backgroundColor: order.status === 'PENDING' ? 'rgba(255,193,7,0.1)' : order.status === 'APPROVED' ? 'rgba(40,167,69,0.1)' : 'rgba(108,117,125,0.1)',
                color: order.status === 'PENDING' ? 'var(--warning)' : order.status === 'APPROVED' ? 'var(--success)' : 'var(--muted)'
              }}>
                {order.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Delivery Date</h4>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{order.deliveryDate}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Delivery Time</h4>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{order.deliveryTime}</p>
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Order Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0' }}>Chicken Type</th>
                <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Quantity (kg)</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: '500' }}>{item.type}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 'bold' }}>{item.quantity} kg</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'right', color: 'var(--primary)', fontSize: '1.2rem' }}>{order.totalQuantity} kg</td>
              </tr>
            </tbody>
          </table>

          {order.notes && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--muted)' }}>Notes from Restaurant:</h4>
              <p style={{ margin: 0 }}>{order.notes}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            {order.status === 'PENDING' && (
              <>
                <button onClick={() => handleStatusUpdate('REJECTED')} style={{ padding: '1rem 2rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>Reject Order</button>
                <button onClick={() => handleStatusUpdate('APPROVED')} style={{ padding: '1rem 2rem', backgroundColor: 'var(--success)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>Approve Order</button>
              </>
            )}
            {order.status === 'APPROVED' && (
              <button onClick={() => handleStatusUpdate('DELIVERED')} style={{ padding: '1rem 2rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>Mark as Delivered</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerOrderDetails;
