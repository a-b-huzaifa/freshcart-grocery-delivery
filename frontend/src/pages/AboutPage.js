import React from 'react';

function AboutPage() {
  return (
    <div className="page">
      <div className="about-card bg-pink">
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(32px, 5vw, 48px)', margin: '0 0 16px', textTransform: 'uppercase', textShadow: '3px 3px 0 var(--ink)' }}>
          Welcome to FreshCart
        </h1>
        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, opacity: 0.9 }}>
          Your neighborhood grocery store, delivered right to your door with a pop of color and zero waiting.
        </p>
      </div>

      <h2 style={{ fontFamily: 'var(--mono)', textTransform: 'uppercase', marginBottom: '24px', fontSize: '24px' }}>How it works</h2>
      <div className="about-steps">
        <div className="about-step">
          <div className="icon">🍊</div>
          <h3>1. Browse</h3>
          <p>Pick your favorite fresh produce, dairy, and local staples from our vibrant catalog.</p>
        </div>
        <div className="about-step">
          <div className="icon">🛒</div>
          <h3>2. Cart it</h3>
          <p>Review your colorful haul and adjust quantities. We'll track your total instantly.</p>
        </div>
        <div className="about-step">
          <div className="icon">🚀</div>
          <h3>3. Checkout</h3>
          <p>Place your order and kick back! Our local team preps it fast.</p>
        </div>
        <div className="about-step">
          <div className="icon">🏡</div>
          <h3>4. Delivery</h3>
          <p>Straight to your door in minutes. Fresh, fast, and fun.</p>
        </div>
      </div>

      <div className="about-card bg-yellow" style={{ marginTop: '40px' }}>
        <h2 style={{ borderBottomColor: 'var(--ink)' }}>About the Team</h2>
        <p style={{ fontSize: '16px', fontWeight: '500', lineHeight: 1.5, margin: 0 }}>
          We're just a demo app built for a weekend project, so we don't have a sprawling corporate history! But we do have a passion for bold borders, hard shadows, and vibrant tutti-frutti colors. Happy shopping!
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
