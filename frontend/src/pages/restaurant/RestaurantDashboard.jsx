import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, PlusCircle, ArrowRight } from 'lucide-react';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    todaysOrders: 0,
    pendingOrders: 0,
    totalMonthlyOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/restaurant/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/restaurant/my-orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data); // Removed slice(0, 5) to allow filtering all fetched orders
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = recentOrders.filter(order => {
    return (!filterDate || order.deliveryDate === filterDate) &&
           (!filterStatus || order.status === filterStatus);
  });

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="Restaurant Dashboard" />
      
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', fontWeight: 700 }}>Welcome, {user?.name || 'Restaurant Name'}</h2>
        
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'overview' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'orders' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <ShoppingBag size={18} /> Recent Orders
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button className="btn-primary" onClick={() => navigate('/restaurant/place-order')} style={{ gap: '0.5rem' }}>
                <PlusCircle size={18} /> Place New Order
              </button>
              <button onClick={() => navigate('/restaurant/my-orders')} style={{ padding: '0 1.5rem', height: '52px', fontWeight: 600, backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
                View All Orders <ArrowRight size={18} />
              </button>
            </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Today's Orders</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.todaysOrders}</h2>
          </div>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Pending Orders</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.pendingOrders}</h2>
          </div>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Total Orders This Month</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.totalMonthlyOrders}</h2>
          </div>
        </div>

          </>
        )}

        {activeTab === 'orders' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Recent Orders</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={(e) => setFilterDate(e.target.value)} 
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            {filteredOrders.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>No recent orders.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>Delivery Date</th>
                    <th style={{ padding: '1rem' }}>Total Quantity</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}><strong>#{order.orderNumber}</strong></td>
                      <td style={{ padding: '1rem' }}>{order.deliveryDate}</td>
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
                      <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {order.status === 'PENDING' && (
                          <button onClick={() => navigate(`/restaurant/edit-order/${order.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--warning)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Order</button>
                        )}
                        <button onClick={() => navigate(`/restaurant/order/${order.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
