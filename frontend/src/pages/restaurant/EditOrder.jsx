import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryTime: '',
    notes: '',
  });
  
  const [items, setItems] = useState({
    'Dum Piece': '',
    'Fry Piece': '',
    'Boneless': '',
    'Wings': '',
    'Joints': '',
    'No. Of Hens': '',
    'No. Of Tandoori': '',
    'Live Weight': ''
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.status !== 'PENDING') {
            toast.error("Only pending orders can be edited.");
            navigate(-1);
            return;
          }
          setFormData({
            deliveryDate: data.deliveryDate || '',
            deliveryTime: data.deliveryTime || '',
            notes: data.notes || '',
          });
          
          const newItems = { ...items };
          if (data.items) {
            data.items.forEach(item => {
              newItems[item.type] = item.quantity;
            });
          }
          setItems(newItems);
        } else {
          toast.error("Order not found");
          navigate(-1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleItemChange = (type, value) => {
    setItems({ ...items, [type]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderItems = Object.entries(items)
      .filter(([_, qty]) => qty && parseFloat(qty) > 0)
      .map(([type, qty]) => ({ type, quantity: parseFloat(qty) }));
      
    if (orderItems.length === 0) {
      toast.error("Please add at least one item.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          notes: formData.notes,
          items: orderItems
        })
      });

      if (response.ok) {
        toast.success("Order updated successfully!");
        navigate(-1);
      } else {
        toast.error("Failed to update order.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar title="Edit Order" />
      
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>&larr; Back</button>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Delivery Date</label>
                <input type="date" required value={formData.deliveryDate} onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Delivery Time</label>
                <input type="time" required value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Special Instructions</label>
                <input type="text" placeholder="E.g. Cut into medium pieces" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Chicken Types</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {Object.keys(items).map(type => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{type}</span>
                  <input type="number" min="0" step="0.1" placeholder="Qty" value={items[type]} onChange={(e) => handleItemChange(type, e.target.value)} style={{ width: '100px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => navigate(-1)} style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', backgroundColor: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}>Update Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
