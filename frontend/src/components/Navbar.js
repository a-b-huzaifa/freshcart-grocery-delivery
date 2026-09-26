import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemCount, clearCart } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    clearCart();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand logo-svg" style={{ color: 'var(--ink)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="var(--green)"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0" stroke="var(--pink)"></path>
        </svg>
        <span style={{ display: 'flex' }}>
          <span style={{ color: 'var(--purple)' }}>F</span>
          <span style={{ color: 'var(--accent)' }}>R</span>
          <span style={{ color: 'var(--green)' }}>E</span>
          <span style={{ color: 'var(--pink)' }}>S</span>
          <span style={{ color: 'var(--blue)' }}>H</span>
          <span style={{ color: 'var(--ink)' }}>CART</span>
        </span>
      </Link>
      <nav className="navbar-links">
        <Link to="/">Shop</Link>
        <Link to="/about">About</Link>
        {user && (
          <Link to="/cart" style={{ position: 'relative' }}>
            Cart
            {cartItemCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--accent)', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
                {cartItemCount}
              </span>
            )}
          </Link>
        )}
        {user && <Link to="/orders">Orders</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
