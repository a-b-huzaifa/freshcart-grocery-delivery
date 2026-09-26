import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-newsletter-wrap">
        <div className="newsletter-inner">
          <h4>Join the Tutti-Frutti Newsletter!</h4>
          <p style={{ margin: '0 0 20px', fontWeight: '500', color: '#fff' }}>Get fresh deals dropped in your inbox every week.</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Email address" />
            <button>→</button>
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-svg" style={{ color: 'var(--ink)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="var(--yellow)"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="var(--blue)"></path>
            </svg>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>FRESHCART</span>
          </div>
          <p>Fresh groceries, delivered fast.</p>
        </div>
        
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/">All Products</Link>
          <Link to="/about">About Us</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-links">
          <h4>Help</h4>
          <Link to="/cart">Your Cart</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} FreshCart. All rights reserved. (Demo App)
      </div>
    </footer>
  );
}

export default Footer;
