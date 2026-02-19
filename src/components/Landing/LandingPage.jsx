import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../Auth/AuthModal'
import './LandingPage.css'
import HeroSection from './HeroSection'

function LandingPage() {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAppModal, setShowAppModal] = useState(false) // ✅ NEW STATE

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#features' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    navigate(userData.role === 'admin' ? '/admin' : '/student')
  }

  // ✅ NEW: Direct APK download handler
  const handleDownloadApp = () => {
    setShowAppModal(false); // Close modal first
    
    // Create temporary download link
    const link = document.createElement("a");
    link.href = "/Attendifyy.apk";  // ✅ Direct path from public folder
    link.download = "Attendifyy.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="landing-page">
      {/* Top Navbar - enhanced */}
      <header className="landing-navbar w-full bg-white/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 z-40">
        <div className="navbar-inner flex items-center justify-between px-4 py-2 md:px-8">
          {/* App Name & 3D Icon (always visible, left side) */}
          <div className="flex items-center gap-2 min-w-[180px]">
            {/* 3D Graduation Cap SVG */}
            <span className="block">
              <svg
                width="32"
                height="32"
                viewBox="0 0 38 38"
                fill="none"
                style={{ filter: 'drop-shadow(0 2px 8px #6366f1)' }}
              >
                <ellipse
                  cx="19"
                  cy="32"
                  rx="14"
                  ry="5"
                  fill="#6366f1"
                  opacity="0.15"
                />
                <path
                  d="M19 5L35 13L19 21L3 13L19 5Z"
                  fill="url(#grad1)"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                <path
                  d="M19 21V32"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="19"
                    y1="5"
                    x2="19"
                    y2="21"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            
            <span
  onClick={() => navigate('/')}
  style={{
    fontWeight: 900,
    fontSize: "28px",
    letterSpacing: "-1px",
    fontFamily: "Poppins, Inter, sans-serif",
    cursor: "pointer",
    background: "linear-gradient(135deg, #f59e0b, #ef4444, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: `
      0 2px 4px rgba(0,0,0,0.15),
      0 6px 18px rgba(99,102,241,0.25)
    `,
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
  }}
>
  ATTENDIFY
</span>


          </div>
          {/* Desktop nav links */}
          <nav className="nav-links hidden md:flex gap-8 font-semibold text-gray-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-primary-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  if (link.href === '#home')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  else
                    document
                      .getElementById(link.href.replace('#', ''))
                      .scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          {/* Desktop actions */}
          <div className="nav-actions hidden md:flex gap-2">
            <button
              className="px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:scale-105 transition-all"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:scale-105 transition-all"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            style={{ zIndex: 51 }}
          >
            {/* Simple hamburger icon */}
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu - Tailwind Only */}
      {mobileMenuOpen && (
        <>
          {/* Blurred Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Centered Panel */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-sm
                 -translate-x-1/2 -translate-y-1/2
                 rounded-2xl bg-white p-5 shadow-2xl
                 animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <span className="font-semibold text-gray-800">
                  Attendify
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    if (link.href === '#home')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    else
                      document
                        .getElementById(link.href.replace('#', ''))
                        ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full text-center py-3 rounded-md
                       bg-gray-100 hover:bg-gray-200
                       font-semibold text-gray-800 transition"
                >
                  {link.label}
                </a>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/login')
                }}
                className="w-full py-3 rounded-md
                     bg-gradient-to-r from-blue-500 to-indigo-600
                     text-white font-semibold shadow-md"
              >
                Login
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/register')
                }}
                className="w-full py-3 rounded-md
                     bg-gradient-to-r from-green-500 to-emerald-600
                     text-white font-semibold shadow-md"
              >
                Register
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>✨ Powerful Features</h2>
          <p>Everything you need for smart attendance management</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Face Authentication</h3>
            <p>
              Advanced AI-powered face recognition using OpenCV LBPH algorithm
              ensures accurate student identification in real-time.
            </p>
            <ul className="feature-list">
              <li>✓ Multiple angle capture</li>
              <li>✓ High accuracy matching</li>
              <li>✓ Anti-spoofing detection</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Geofencing Security</h3>
            <p>
              Location-based verification ensures students are physically
              present within campus boundaries when marking attendance.
            </p>
            <ul className="feature-list">
              <li>✓ Real-time location tracking</li>
              <li>✓ Customizable radius</li>
              <li>✓ Prevents remote proxy</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Zero Proxy Attendance</h3>
            <p>
              Dual verification system combining face recognition and location
              ensures impossible proxy attendance scenarios.
            </p>
            <ul className="feature-list">
              <li>✓ One attendance per session</li>
              <li>✓ Face + Location match</li>
              <li>✓ Tamper-proof records</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Processing</h3>
            <p>
              Lightning-fast attendance marking with real-time face recognition
              processing and immediate database updates.
            </p>
            <ul className="feature-list">
              <li>✓ Under 3 seconds verification</li>
              <li>✓ Live camera feed</li>
              <li>✓ Instant confirmation</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Admin Dashboard</h3>
            <p>
              Comprehensive admin panel for managing students, viewing reports,
              and monitoring attendance patterns.
            </p>
            <ul className="feature-list">
              <li>✓ Real-time reports</li>
              <li>✓ Student management</li>
              <li>✓ Attendance analytics</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Cloud-Based Storage</h3>
            <p>
              Secure MongoDB Atlas cloud storage ensures data safety,
              scalability, and accessibility from anywhere.
            </p>
            <ul className="feature-list">
              <li>✓ Encrypted data</li>
              <li>✓ Auto backups</li>
              <li>✓ 99.9% uptime</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>🔄 How It Works</h2>
          <p>Simple 4-step process for secure attendance</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h3>Register</h3>
            <p>
              Create your account with basic details and capture multiple face
              images from different angles
            </p>
          </div>

          <div className="step-arrow">→</div>
          
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">📸</div>
            <h3>Scan Face</h3>
            <p>
              During attendance, scan your face live with webcam for instant
              authentication
            </p>
          </div>
          

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🤖</div>
            <h3>AI Training</h3>
            <p>
              System trains AI model with your face data using advanced machine
              learning algorithms
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon">✅</div>
            <h3>Verified!</h3>
            <p>
              Attendance marked after successful face match and location
              verification
            </p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="section-header">
          <h2>🛡️ Security & Anti-Proxy Measures</h2>
          <p>Multi-layered security ensures authentic attendance</p>
        </div>

        <div className="security-grid">
          <div className="security-item">
            <div className="security-icon">🎭</div>
            <h4>Face Authentication</h4>
            <p>Live face detection prevents photo/video spoofing</p>
          </div>
          <div className="security-item">
            <div className="security-icon">🌍</div>
            <h4>GPS Verification</h4>
            <p>Real-time location matching with campus boundaries</p>
          </div>
          <div className="security-item">
            <div className="security-icon">⏱️</div>
            <h4>Time-Based Sessions</h4>
            <p>One attendance per session prevents duplicates</p>
          </div>
          <div className="security-item">
            <div className="security-icon">🔐</div>
            <h4>Encrypted Storage</h4>
            <p>All data encrypted at rest and in transit</p>
          </div>
          <div className="security-item">
            <div className="security-icon">📱</div>
            <h4>Device Tracking</h4>
            <p>Monitor suspicious multiple device logins</p>
          </div>
          <div className="security-item">
            <div className="security-icon">🚨</div>
            <h4>Admin Alerts</h4>
            <p>Real-time notifications for anomalies</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Attendance System?</h2>
          <p>
            Join hundreds of institutions using smart face recognition
            technology
          </p>
          <button className="btn-cta" onClick={() => navigate('/login')}>
            🚀 Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎓 Attendify</h3>
            <p>AI Smart Attendance System with Face Recognition</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#security">Security</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 sahilsachan2727@gmail.com</p>
            {/* Social icons row */}
            <div className="flex gap-4 mt-3">
              {/* GitHub */}
              <a
                href="https://github.com/sahilsachan27"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                style={{ color: '#333' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.34 6.84 9.7.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.13-4.56-5 0-1.1.38-2 .99-2.7-.1-.25-.43-1.28.09-2.67 0 0 .82-.27 2.7 1.03a9.18 9.18 0 0 1 2.46-.34c.84 0 1.69.11 2.46.34 1.88-1.3 2.7-1.03 2.7-1.03.52 1.39.19 2.42.09 2.67.62.7.99 1.6.99 2.7 0 3.88-2.34 4.74-4.57 5 .36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                    fill="#333"
                  />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/sahil_sachan_27"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                style={{ color: '#e1306c' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="6"
                    stroke="#e1306c"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="#e1306c"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="17" cy="7" r="1.2" fill="#e1306c" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/sahil-sachan-2727"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{ color: '#0A66C2' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="4"
                    stroke="#0A66C2"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 10v6M8 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4 2v4m0-4a2 2 0 0 1 4 0v4"
                    stroke="#0A66C2"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Attendify. All rights reserved.</p>
          <p className="mt-2 font-semibold text-lg text-white">
            Developed by{' '}
            <a
              href="https://sahilsachan.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-300 hover:text-white font-bold drop-shadow-lg"
            >
              Sahil Sachan
            </a>
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      {/* ✅ SIMPLIFIED: Text-Only Floating Download Button with Badge */}
      <div
        onClick={() => setShowAppModal(true)}
        className="fixed z-50 cursor-pointer group"
        style={{
          bottom: '32px',  /* 🎛️ ADJUST: Distance from bottom (20px-80px) */
          right: '32px'    /* 🎛️ ADJUST: Distance from right (20px-80px) */
        }}
      >
        {/* Animated Glow Background */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-40 group-hover:opacity-70 animate-pulse transition-opacity duration-500"
          style={{
            width: '50px',    /* 🎛️ ADJUST: Glow width */
            height: '40px'     /* 🎛️ ADJUST: Glow height */
          }}
        >
        </div>

        {/* Text Button with Badge */}
        <div className="relative group-hover:-translate-y-1 transition-transform duration-300">
          {/* Text Shadow/Glow */}
          <div className="absolute inset-0 blur-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 rounded-full"></div>
          
          {/* Text Container */}
          <div 
            className="relative rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(99,102,241,0.3),_inset_0_1px_0_rgba(255,255,255,0.8)] border border-indigo-100 group-hover:shadow-[0_6px_28px_rgba(99,102,241,0.5)] transition-shadow"
            style={{
              paddingLeft: '20px',   /* 🎛️ ADJUST: Text padding left (16px-28px) */
              paddingRight: '20px',  /* 🎛️ ADJUST: Text padding right (16px-28px) */
              paddingTop: '10px',    /* 🎛️ ADJUST: Text padding top (8px-14px) */
              paddingBottom: '10px'  /* 🎛️ ADJUST: Text padding bottom (8px-14px) */
            }}
          >
            <span 
              className="font-extrabold tracking-wide bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
              style={{
                fontSize: '14px'  /* 🎛️ ADJUST: Text size (12px-18px) */
              }}
            >
              Get the App
            </span>

            {/* Notification Badge */}
            <div 
              className="absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce"
              style={{
                animationDuration: '2s',
                width: '22px',    /* 🎛️ ADJUST: Badge width (20px-32px) */
                height: '22px'    /* 🎛️ ADJUST: Badge height (20px-32px) */
              }}
            >
              <span 
                className="text-white font-black"
                style={{
                  fontSize: '11px'  /* 🎛️ ADJUST: Badge icon size (10px-16px) */
                }}
              >
                ↓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ UPDATED: App Download Modal with Direct Download */}
      {showAppModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-6 text-center shadow-2xl"
            style={{
              animation: "fadeScale 0.3s ease-out",
              width: '90%',        /* 🎛️ ADJUST: Modal width (85%-95%) */
              maxWidth: '400px'    /* 🎛️ ADJUST: Modal max width (320px-500px) */
            }}
          >
            <div className="mb-3" style={{ fontSize: '64px' }}>
              🚀
            </div>

            <h2 
              className="font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent"
              style={{
                fontSize: '24px'  /* 🎛️ ADJUST: Modal title size (20px-28px) */
              }}
            >
              Install Attendifyy App
            </h2>

            <p 
              className="text-gray-600 mb-5"
              style={{
                fontSize: '14px'  /* 🎛️ ADJUST: Modal description size (12px-16px) */
              }}
            >
              Experience faster face recognition, smoother UI and better mobile performance.
            </p>

            {/* ✅ UPDATED: Direct Download Button */}
            <button
              onClick={handleDownloadApp}
              className="block w-full rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-105 transition cursor-pointer"
              style={{ padding: '12px 0' }}
            >
              📥 Download Now
            </button>

            <button
              onClick={() => setShowAppModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700"
              style={{
                fontSize: '14px'  /* 🎛️ ADJUST: "Maybe Later" text size (12px-16px) */
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
