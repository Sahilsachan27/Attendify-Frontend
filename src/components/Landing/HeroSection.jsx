import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroPortrait from '../../assets/ai.png';
import './HeroSection.css';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <div className="hero-badge">🎓 Smart Attendance System</div>
        <h1 className="hero-title">
          Secure Attendance Tracking with
          <span className="gradient-text"> Face Recognition</span>
        </h1>
        <p className="hero-description">
          Revolutionary attendance management system powered by AI face authentication
          and geofencing technology. Say goodbye to proxy attendance and manual tracking.
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
