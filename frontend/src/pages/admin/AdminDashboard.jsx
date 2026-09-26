import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { LayoutDashboard, Users, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({ todaysOrders: 0, totalQuantity: 0, activeRestaurants: 0 });
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPendingUsers();
    fetchStats();
    fetchOrders();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/pending-users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      }
    } catch (error) {
      console.error("Error fetching pending users", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin stats", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching admin orders", error);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success(`User ${action}d successfully`);
        fetchPendingUsers();
        fetchStats();
      } else {
        toast.error(`Failed to ${action} user.`);
      }
    } catch (error) {
      console.error(`Error ${action} user`, error);
      toast.error("An error occurred.");
    }
  };

  const filteredOrders = orders.filter(order => {
    return (!filterDate || order.deliveryDate === filterDate) &&
           (!filterStatus || order.status === filterStatus);
  });

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="Admin Dashboard" />
      
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'overview' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('approvals')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'approvals' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'approvals' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <Users size={18} /> Approvals
            {pendingUsers.length > 0 && (
              <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '0.5rem' }}>{pendingUsers.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('deliveries')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: activeTab === 'deliveries' ? 'rgba(245, 203, 92, 0.1)' : 'transparent', color: activeTab === 'deliveries' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <ClipboardList size={18} /> Deliveries
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Today's Orders</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.todaysOrders}</h2>
          </div>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Total Quantity</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.totalQuantity} kg</h2>
          </div>
          <div className="card">
            <h5 style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Active Restaurants</h5>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{stats.activeRestaurants}</h2>
          </div>
          </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Pending Approvals</h3>
          {pendingUsers.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No pending registrations.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingUsers.map(user => (
                <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{user.role === 'RESTAURANT' ? user.restaurantName : user.workerName} <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--secondary)', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '0.5rem' }}>{user.role}</span></h4>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{user.email} | {user.phone}</p>
                    {user.role === 'RESTAURANT' && <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Owner: {user.ownerName} | Address: {user.address}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleAction(user.id, 'approve')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Approve</button>
                    <button onClick={() => handleAction(user.id, 'reject')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {activeTab === 'deliveries' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>All Deliveries</h3>
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
            <p style={{ color: 'var(--muted)' }}>No orders found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Restaurant</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Time</th>
                  <th style={{ padding: '1rem' }}>Total Quantity</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>#{order.orderNumber}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order.restaurantName}</td>
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
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => navigate(`/admin/order/${order.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>View Details</button>
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

export default AdminDashboard;
