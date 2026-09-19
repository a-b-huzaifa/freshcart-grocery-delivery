import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        FreshCart
      </Link>
      <nav className="navbar-links">
        <Link to="/">Shop</Link>
        {user && <Link to="/cart">Cart</Link>}
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
