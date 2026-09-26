import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ordersApi from '../api/ordersApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function CartPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { cart, updateCartItem, removeFromCart, loadCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(!cart);

  useEffect(() => {
    if (!cart) {
      loadCart().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [cart, loadCart]);

  async function handleQuantityChange(productId, quantity) {
    if (quantity < 1) return;
    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  }

  async function handleRemove(productId) {
    try {
      await removeFromCart(productId);
      addToast('Item removed', 'success');
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      await ordersApi.createOrder(address);
      addToast('Order placed successfully!', 'success');
      clearCart();
      navigate('/orders');
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Your Cart</h1>
        <div className="cart-list">
          {[1, 2, 3].map((n) => (
            <div className="cart-row skeleton" key={n} style={{ height: '64px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="page">
      <h1>Your Cart</h1>

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
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <input
                    readOnly
                    value={item.quantity}
                    style={{ width: '40px', textAlign: 'center', padding: '9px 4px' }}
                  />
                  <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</button>
                </div>
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
