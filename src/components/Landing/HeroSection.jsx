import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroPortrait from '../../assets/AI2.png';
import './HeroSection.css';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section 
      className="hero-section" 
      id="home"
      style={{
        paddingTop: '72px' // ✅ Responsive padding that clears navbar on mobile
      }}
    >
      <div className="hero-content" style={{ paddingTop: '0rem' }}> {/* ✅ Extra spacing for content */}
        <div 
          className="hero-badge"
          style={{
            marginTop: 'clamp(0.2rem, 2vw, 0)', // ✅ Extra top margin on small screens
            fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', // ✅ Responsive font size
          }}
        >
          🚀AI Smart Attendance System with Face Recognition
        </div>
        <h1 className="hero-title">
          Attendify
          <span className="gradient-text"> AI Smart Attendance</span>
        </h1>
        <p className="hero-description">
          Experience the future of attendance management with AI-powered face recognition 
          and geo-fencing technology. Say goodbye to proxy attendance and manual marking.
        </p>
        <div className="hero-buttons">
          <button className="btn-hero-primary" onClick={() => navigate('/login')}>🚀 Get Started</button>
          <button
            className="btn-hero-secondary"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            📖 Learn More
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Accurate Recognition</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Proxy Attendance</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Real-time</div>
            <div className="stat-label">Verification</div>
          </div>
        </div>
      </div>

      <div className="hero-illustration">
        <div className="floating-card">
          {/* choose a preset: portrait-sm / portrait-md / portrait-lg
              or override per-instance using inline style:
              style={{ '--portrait-width': '320px', '--portrait-height': '420px' }} */}
          <div className="portrait-frame portrait-md">
            <img src={heroPortrait} alt="Landing hero" />
            <div className="scan-line"></div>
            <div className="face-outline"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
