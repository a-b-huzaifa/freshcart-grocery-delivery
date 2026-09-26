import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-svg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>FRESHCART</span>
          </div>
          <p>Fresh groceries, delivered fast.</p>
        </div>
        
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/">All Products</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Join the Newsletter</h4>
          <div className="newsletter-input">
            <input type="email" placeholder="Email address" />
            <button>→</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} FreshCart. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
