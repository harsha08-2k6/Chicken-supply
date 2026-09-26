import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Admin
import Accounts from './pages/admin/Accounts';
import Restaurants from './pages/admin/Restaurants';
import Workers from './pages/admin/Workers';
import Orders from './pages/admin/Orders';
import OrderHistory from './pages/admin/OrderHistory';
import Reports from './pages/admin/Reports';
import AdminOrderDetails from './pages/admin/OrderDetails';

// Restaurant
import MyOrders from './pages/restaurant/MyOrders';
import RestaurantOrderDetails from './pages/restaurant/OrderDetails';
import EditOrder from './pages/restaurant/EditOrder';

// Worker
import TodaysOrders from './pages/worker/TodaysOrders';
import UpcomingOrders from './pages/worker/UpcomingOrders';
import WorkerOrderDetails from './pages/worker/OrderDetails';


// Restaurant
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import PlaceOrder from './pages/restaurant/PlaceOrder';
// import MyOrders from './pages/restaurant/MyOrders';

// Worker
import WorkerDashboard from './pages/worker/WorkerDashboard';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600'
          },
          success: { iconTheme: { primary: 'var(--success)', secondary: '#fff' } },
          error: { iconTheme: { primary: 'var(--danger)', secondary: '#fff' } }
        }} 
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route path="/restaurant" element={<Navigate to="/restaurant/dashboard" />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/place-order" element={<PlaceOrder />} />
          
          <Route path="/worker" element={<Navigate to="/worker/dashboard" />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/accounts" element={<Accounts />} />
          <Route path="/admin/restaurants" element={<Restaurants />} />
          <Route path="/admin/workers" element={<Workers />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/order-history" element={<OrderHistory />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/order/:id" element={<AdminOrderDetails />} />

          {/* Restaurant Routes */}
          <Route path="/restaurant/my-orders" element={<MyOrders />} />
          <Route path="/restaurant/order/:id" element={<RestaurantOrderDetails />} />
          <Route path="/restaurant/edit-order/:id" element={<EditOrder />} />

          {/* Worker Routes */}
          <Route path="/worker/todays-orders" element={<TodaysOrders />} />
          <Route path="/worker/upcoming-orders" element={<UpcomingOrders />} />
          <Route path="/worker/order/:id" element={<WorkerOrderDetails />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
