import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Clock, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    todaysOrders: 0,
    upcomingOrders: 0,
    totalQtyToday: 0,
    tomorrowOrders: 0
  });
  
  const [todaysOrders, setTodaysOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchTodaysOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/worker/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (e) { console.error(e); }
  };

  const fetchTodaysOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/worker/todays-orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTodaysOrders(data); // Removed slice(0, 5) to allow filtering all fetched orders
      }
    } catch (e) { console.error(e); }
  };

  const filteredOrders = todaysOrders.filter(order => {
    return (!filterDate || order.deliveryDate === filterDate) &&
           (!filterStatus || order.status === filterStatus);
  });

  const handleStatusUpdate = async (id, newStatus) => {
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
        fetchTodaysOrders(); // Refresh
        fetchStats(); // Update stats if necessary
      } else {
        toast.error("Failed to update status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="Worker Dashboard" />
      
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', fontWeight: 700 }}>Welcome, {user?.name || 'Worker Name'}</h2>
        
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'overview' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('todays')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'todays' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'todays' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <Clock size={18} /> Today's Orders
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button className="btn-primary" onClick={() => setActiveTab('todays')} style={{ gap: '0.5rem' }}>
                <Clock size={18} /> View Today's Orders
              </button>
              <button onClick={() => navigate('/worker/upcoming-orders')} style={{ padding: '0 1.5rem', height: '52px', fontWeight: 600, backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
                <Calendar size={18} /> Upcoming Orders <ArrowRight size={18} />
              </button>
            </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Today's Orders</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.todaysOrders}</h2>
          </div>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Upcoming Orders</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.upcomingOrders}</h2>
          </div>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Total Qty Today</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.totalQtyToday} kg</h2>
          </div>
        </div>
        
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/worker/upcoming-orders')}>
          <h3 style={{ marginBottom: '1rem' }}>Upcoming Orders</h3>
          <p style={{ color: 'var(--muted)' }}>Tomorrow: {stats.tomorrowOrders} orders</p>
        </div>
          </>
        )}

        {activeTab === 'todays' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Today's Orders</h3>
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
              <p style={{ color: 'var(--muted)' }}>No orders match the filters.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Restaurant</th>
                  <th style={{ padding: '1rem' }}>Delivery Time</th>
                  <th style={{ padding: '1rem' }}>Total Quantity</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}><strong>#{order.orderNumber}</strong></td>
                    <td style={{ padding: '1rem' }}>{order.restaurantName}</td>
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
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {order.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleStatusUpdate(order.id, 'APPROVED')} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                          <button onClick={() => handleStatusUpdate(order.id, 'REJECTED')} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                        </>
                      )}
                      {order.status === 'APPROVED' && (
                        <button onClick={() => handleStatusUpdate(order.id, 'DELIVERED')} style={{ padding: '0.5rem 1rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Mark Delivered</button>
                      )}
                      <button onClick={() => navigate(`/worker/order/${order.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>View Details</button>
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

export default WorkerDashboard;
