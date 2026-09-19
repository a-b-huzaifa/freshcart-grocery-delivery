import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ordersApi from '../api/ordersApi';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(user?.address || '');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadCart() {
    setLoading(true);
    ordersApi
      .getCart()
      .then(setCart)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  async function handleQuantityChange(productId, quantity) {
    setError(null);
    try {
      const updated = await ordersApi.updateCartItem(productId, quantity);
      setCart(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleRemove(productId) {
    setError(null);
    try {
      const updated = await ordersApi.removeFromCart(productId);
      setCart(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setError(null);
    setPlacingOrder(true);
    try {
      await ordersApi.createOrder(address);
      navigate('/orders');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) return <p className="status">Loading cart…</p>;

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="page">
      <h1>Your Cart</h1>
      {error && <div className="error-banner">{error}</div>}

      {items.length === 0 ? (
        <p className="status">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-row" key={item.product._id}>
                <div className="cart-row-info">
                  <h3>{item.product.name}</h3>
                  <p>
                    ${item.product.price.toFixed(2)} / {item.product.unit}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product._id, Number(e.target.value))
                  }
                />
                <button className="delete-btn" onClick={() => handleRemove(item.product._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">Total: ${total.toFixed(2)}</div>

          <form className="checkout-form" onSubmit={handleCheckout}>
            <input
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <button type="submit" disabled={placingOrder}>
              {placingOrder ? 'Placing order…' : 'Place order'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default CartPage;
