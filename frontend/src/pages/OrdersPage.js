import { useState, useEffect } from 'react';
import * as ordersApi from '../api/ordersApi';
import { useToast } from '../context/ToastContext';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function OrdersPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadOrders() {
    setLoading(true);
    ordersApi
      .getMyOrders()
      .then(setOrders)
      .catch((err) => addToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }

  async function handleCancel(id) {
    try {
      const updated = await ordersApi.cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      addToast('Order cancelled', 'success');
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Your Orders</h1>
        <div className="order-list">
          {[1, 2].map((n) => (
            <div className="order-card skeleton" key={n} style={{ height: '120px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalItems = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.items.reduce((acc, i) => acc + i.quantity, 0) : 0), 0);

  return (
    <div className="page">
      <h1>Your Orders</h1>
      
      {!loading && orders.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '16px', border: '2px solid var(--ink)', background: '#fff' }}>
          <strong>Lifetime Stats:</strong> You've ordered {totalItems} items, spending a total of ${totalSpent.toFixed(2)}.
        </div>
      )}

      {orders.length === 0 ? (
        <p className="status">No orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <span>Order #{order._id.slice(-6)}</span>
                <span className={`status-tag status-${order.status}`}>{order.status}</span>
              </div>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="order-total">Total: ${order.totalAmount.toFixed(2)}</p>
              <p className="order-address">Deliver to: {order.deliveryAddress}</p>
              {order.status === 'pending' && (
                <button className="delete-btn" onClick={() => handleCancel(order._id)}>
                  Cancel order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
