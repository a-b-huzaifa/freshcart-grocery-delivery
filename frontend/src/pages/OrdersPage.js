import { useState, useEffect } from 'react';
import * as ordersApi from '../api/ordersApi';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    setLoading(true);
    ordersApi
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  async function handleCancel(id) {
    setError(null);
    try {
      const updated = await ordersApi.cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <p className="status">Loading orders…</p>;

  return (
    <div className="page">
      <h1>Your Orders</h1>
      {error && <div className="error-banner">{error}</div>}

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
