import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <nav className="navbar">
          <h1>BoilerFixIt</h1>
          <div className="nav-links">
            <button className="btn">Login</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </nav>
        <div className="hero-content">
          <h2>Your One-Stop Solution for Campus Services</h2>
          <p>Connect with skilled Purdue students for all your repair and maintenance needs</p>
        </div>
      </header>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          <div className="service-card">
            <h3>Plumbing</h3>
            <p>Quick fixes for your plumbing issues</p>
          </div>
          <div className="service-card">
            <h3>Bicycle Repair</h3>
            <p>Get your bike back on track</p>
          </div>
          <div className="service-card">
            <h3>Electronics</h3>
            <p>Tech support and repairs</p>
          </div>
          <div className="service-card">
            <h3>Furniture Assembly</h3>
            <p>Expert assembly services</p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="join-section">
        <div className="join-card">
          <h3>Looking for Services?</h3>
          <p>Find reliable service providers for all your needs</p>
          <button className="btn btn-primary">Join as User</button>
        </div>
        <div className="join-card">
          <h3>Want to Provide Services?</h3>
          <p>Share your skills and earn money</p>
          <button className="btn btn-primary">Join as Provider</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 BoilerFixIt. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
