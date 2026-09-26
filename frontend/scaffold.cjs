const fs = require('fs');
const path = require('path');

const generateComponent = (name, title) => `import React from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate } from 'react-router-dom';

const ${name} = () => {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="${title}" />
      <div style={{ padding: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>&larr; Back</button>
        <div className="card">
          <h2>${title}</h2>
          <p style={{ color: 'var(--muted)' }}>This page is under construction.</p>
        </div>
      </div>
    </div>
  );
};

export default ${name};
`;

const pages = [
  { path: 'src/pages/admin/Accounts.jsx', name: 'Accounts', title: 'Manage Accounts' },
  { path: 'src/pages/admin/Restaurants.jsx', name: 'Restaurants', title: 'Manage Restaurants' },
  { path: 'src/pages/admin/Workers.jsx', name: 'Workers', title: 'Manage Workers' },
  { path: 'src/pages/admin/Orders.jsx', name: 'Orders', title: 'All Orders' },
  { path: 'src/pages/admin/OrderHistory.jsx', name: 'OrderHistory', title: 'Order History' },
  { path: 'src/pages/admin/Reports.jsx', name: 'Reports', title: 'Reports' },
  { path: 'src/pages/restaurant/MyOrders.jsx', name: 'MyOrders', title: 'My Orders' },
  { path: 'src/pages/restaurant/OrderDetails.jsx', name: 'OrderDetails', title: 'Order Details' },
  { path: 'src/pages/worker/TodaysOrders.jsx', name: 'TodaysOrders', title: "Today's Orders" },
  { path: 'src/pages/worker/UpcomingOrders.jsx', name: 'UpcomingOrders', title: 'Upcoming Orders' },
  { path: 'src/pages/worker/OrderDetails.jsx', name: 'WorkerOrderDetails', title: 'Order Details' }
];

pages.forEach(page => {
  const fullPath = path.join(__dirname, page.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  if (!fs.existsSync(fullPath) || fs.readFileSync(fullPath, 'utf8').trim() === '') {
    fs.writeFileSync(fullPath, generateComponent(page.name, page.title));
    console.log(`Created ${page.path}`);
  }
});

// Update App.jsx
let appJsx = fs.readFileSync(path.join(__dirname, 'src/App.jsx'), 'utf8');

const imports = `
// Admin
import Accounts from './pages/admin/Accounts';
import Restaurants from './pages/admin/Restaurants';
import Workers from './pages/admin/Workers';
import Orders from './pages/admin/Orders';
import OrderHistory from './pages/admin/OrderHistory';
import Reports from './pages/admin/Reports';

// Restaurant
import MyOrders from './pages/restaurant/MyOrders';
import RestaurantOrderDetails from './pages/restaurant/OrderDetails';

// Worker
import TodaysOrders from './pages/worker/TodaysOrders';
import UpcomingOrders from './pages/worker/UpcomingOrders';
import WorkerOrderDetails from './pages/worker/OrderDetails';
`;

// Only add if not already added
if (!appJsx.includes('import Accounts')) {
  appJsx = appJsx.replace('// (Add other admin imports here as they are implemented)', imports);
}

const routes = `
          {/* Admin Routes */}
          <Route path="/admin/accounts" element={<Accounts />} />
          <Route path="/admin/restaurants" element={<Restaurants />} />
          <Route path="/admin/workers" element={<Workers />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/order-history" element={<OrderHistory />} />
          <Route path="/admin/reports" element={<Reports />} />

          {/* Restaurant Routes */}
          <Route path="/restaurant/my-orders" element={<MyOrders />} />
          <Route path="/restaurant/order/:id" element={<RestaurantOrderDetails />} />

          {/* Worker Routes */}
          <Route path="/worker/todays-orders" element={<TodaysOrders />} />
          <Route path="/worker/upcoming-orders" element={<UpcomingOrders />} />
          <Route path="/worker/order/:id" element={<WorkerOrderDetails />} />
`;

if (!appJsx.includes('path="/admin/accounts"')) {
  appJsx = appJsx.replace('          <Route path="/worker/*" element={<WorkerDashboard />} />', '          <Route path="/worker/*" element={<WorkerDashboard />} />\n' + routes);
}

fs.writeFileSync(path.join(__dirname, 'src/App.jsx'), appJsx);
console.log('App.jsx updated.');
