import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../Auth/AuthModal'

// ─── Design tokens (Ethereal Professionalism - Stitch MCP) ───────────────────
const GRAD = 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)'
const NAV_SHADOW =
  '0 1px 40px -8px rgba(99,102,241,0.12), 0 1px 8px -2px rgba(0,0,0,0.04)'

const features = [
  {
    icon: '👤',
    title: 'Face Authentication',
    desc: 'Advanced AI-powered face recognition using DeepFace ArcFace technology for accurate real-time identification.',
    bullets: [
      'Multiple angle capture',
      'High accuracy matching',
      'Anti-spoofing detection',
    ],
  },
  {
    icon: '📍',
    title: 'Geofencing Security',
    desc: 'Location-based verification ensures students are physically within campus boundaries when marking attendance.',
    bullets: [
      'Real-time location tracking',
      'Customizable radius',
      'Prevents remote proxy',
    ],
  },
  {
    icon: '🔒',
    title: 'Zero Proxy Attendance',
    desc: 'Dual verification combining face recognition and location makes proxy attendance impossible.',
    bullets: [
      'One attendance per session',
      'Face + Location match',
      'Tamper-proof records',
    ],
  },
  {
    icon: '⚡',
    title: 'Instant Processing',
    desc: 'Lightning-fast attendance marking with real-time face recognition and immediate database updates.',
    bullets: [
      'Under 3 seconds verification',
      'Live camera feed',
      'Instant confirmation',
    ],
  },
  {
    icon: '📊',
    title: 'Admin Dashboard',
    desc: 'Comprehensive admin panel for managing students, viewing reports, and monitoring attendance patterns.',
    bullets: [
      'Real-time reports',
      'Student management',
      'Attendance analytics',
    ],
  },
  {
    icon: '☁️',
    title: 'Cloud-Based Storage',
    desc: 'Secure MongoDB Atlas cloud storage ensures data safety, scalability, and accessibility from anywhere.',
    bullets: ['Encrypted data', 'Auto backups', '99.9% uptime'],
  },
]

const howItWorks = [
  {
    step: 1,
    icon: '📝',
    title: 'Register',
    desc: 'Create your account with basic details and capture multiple face images from different angles',
  },
  {
    step: 2,
    icon: '🤖',
    title: 'AI Training',
    desc: 'System trains AI model with your face data using advanced machine learning algorithms',
  },
  {
    step: 3,
    icon: '📸',
    title: 'Scan Face',
    desc: 'During attendance, scan your face live with webcam for instant authentication',
  },
  {
    step: 4,
    icon: '✅',
    title: 'Verified!',
    desc: 'Attendance marked after successful face match and location verification',
  },
]

const security = [
  {
    icon: '🎭',
    title: 'Face Authentication',
    desc: 'Live face detection prevents photo/video spoofing',
  },
  {
    icon: '🌍',
    title: 'GPS Verification',
    desc: 'Real-time location matching with campus boundaries',
  },
  {
    icon: '⏱️',
    title: 'Time-Based Sessions',
    desc: 'One attendance per session prevents duplicates',
  },
  {
    icon: '🔐',
    title: 'Encrypted Storage',
    desc: 'All data encrypted at rest and in transit',
  },
  {
    icon: '📱',
    title: 'Device Tracking',
    desc: 'Monitor suspicious multiple device logins',
  },
  {
    icon: '🚨',
    title: 'Admin Alerts',
    desc: 'Real-time notifications for anomalies',
  },
]

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#features' },
  { label: 'Contact', href: '#contact' },
]

function LandingPage() {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAppModal, setShowAppModal] = useState(false)

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    navigate(userData.role === 'admin' ? '/admin' : '/student')
  }

  const handleDownloadApp = () => {
    setShowAppModal(false)
    const link = document.createElement('a')
    link.href = '/Attendifyy.apk'
    link.download = 'Attendifyy.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const scrollTo = (href) => {
    setMobileMenuOpen(false)
    if (href === '#home') window.scrollTo({ top: 0, behavior: 'smooth' })
    else
      document
        .getElementById(href.replace('#', ''))
        ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-white overflow-x-hidden">
      {/* ── NAVBAR ───────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl"
        style={{ boxShadow: NAV_SHADOW }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 md:px-8">
          {/* Logo */}
          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/attendifyy.png"
              alt="Attendify"
              className="h-9 w-auto"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.3))' }}
            />
            <span
              className="text-2xl font-black tracking-tight"
              style={{
                background: GRAD,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ATTENDIFY
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(l.href)
                }}
                className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-3d-secondary px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-3d-primary px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              Register
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] max-w-sm bg-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-black text-indigo-600 text-lg">
                🎓 Attendify
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(l.href)
                  }}
                  className="py-3 px-4 text-center rounded-xl bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/login')
                }}
                className="btn-3d-primary w-full py-3 rounded-xl font-bold text-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/register')
                }}
                className="btn-3d-secondary w-full py-3 rounded-xl font-bold text-sm"
              >
                Register
              </button>
            </nav>
          </div>
        </>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-5 overflow-hidden"
        style={{
          background:
            'linear-gradient(150deg, #eef2ff 0%, #f5f3ff 35%, #faf5ff 65%, #ffffff 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-16 right-[5%] w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a5b4fc, #818cf8)' }}
        />
        <div
          className="absolute bottom-10 left-[3%] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c4b5fd, #8b5cf6)' }}
        />
        <div
          className="absolute top-40 left-[15%] w-48 h-48 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fbcfe8, #f9a8d4)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6 shadow-sm border border-indigo-100/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            AI-Powered Attendance System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.08] mb-6">
            Smart Attendance with{' '}
            <span
              className="block"
              style={{
                background: GRAD,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Face Recognition
            </span>
            & Geofencing
          </h1>
          <p className="text-base sm:text-lg text-gray-500 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            Eliminate proxy attendance with dual-verification: real-time face AI
            and GPS location, all in under 3 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-3d-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest"
            >
              🚀 Get Started Free
            </button>
            <button
              onClick={() => setShowAppModal(true)}
              className="btn-3d-secondary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest"
            >
              📱 Download App
            </button>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              'Face Recognition AI',
              'GPS Geofencing',
              'Zero Proxy',
              'Cloud Secured',
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500"
              >
                <span className="text-emerald-500">✓</span>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-24 px-5"
        style={{ background: '#f9f9fb' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
              ✨ What We Offer
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
              Powerful Features
            </h2>
            <p className="text-gray-400 font-medium text-sm">
              Everything you need for smart attendance management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-3d-modern p-6 hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-2xl mb-4 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-4 leading-relaxed">
                  {f.desc}
                </p>
                <ul className="space-y-1.5">
                  {f.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600"
                    >
                      <span className="text-emerald-500 text-base leading-none">
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
              🔄 Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-400 font-medium text-sm">
              Simple 4-step process for secure attendance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
            {howItWorks.map((s, idx) => (
              <React.Fragment key={s.step}>
                <div className="card-3d-modern p-6 flex-1 text-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm mb-3 mx-auto shadow-sm"
                    style={{ background: GRAD }}
                  >
                    {s.step}
                  </div>
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="text-sm font-black text-gray-900 mb-2 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                {idx < howItWorks.length - 1 && (
                  <div className="hidden sm:flex items-center text-gray-300 text-2xl font-light self-center shrink-0">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-5" style={{ background: '#f2f4f7' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
              🛡️ Multi-Layer Protection
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
              Security & Anti-Proxy
            </h2>
            <p className="text-gray-400 font-medium text-sm">
              Multi-layered security ensures authentic attendance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {security.map((s) => (
              <div key={s.title} className="card-3d-modern p-5 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-5 relative overflow-hidden"
        style={{ background: GRAD }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(circle at 70% 50%, white, transparent)',
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Ready to Transform Your Attendance System?
          </h2>
          <p className="text-white/70 font-medium text-sm mb-8">
            Join hundreds of institutions using smart face recognition
            technology
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-indigo-700 hover:-translate-y-0.5 transition-transform"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
          >
            🚀 Start Free Trial
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎓</span>
              <span
                className="font-black text-lg"
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Attendify
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">
              AI Smart Attendance System with Face Recognition & GPS Geofencing
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ['Features', '#features'],
                ['How It Works', '#home'],
                ['Security', '#contact'],
                ['Contact', '#contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(href)
                    }}
                    className="text-sm text-gray-400 hover:text-white font-medium transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-300 mb-4">
              Contact
            </h4>
            <p className="text-gray-400 text-sm font-medium mb-4">
              📧 sahilsachan2727@gmail.com
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/sahilsachan27"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="#9ca3af"
                  className="hover:fill-white transition-colors"
                >
                  <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.34 6.84 9.7.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.13-4.56-5 0-1.1.38-2 .99-2.7-.1-.25-.43-1.28.09-2.67 0 0 .82-.27 2.7 1.03a9.18 9.18 0 0 1 2.46-.34c.84 0 1.69.11 2.46.34 1.88-1.3 2.7-1.03 2.7-1.03.52 1.39.19 2.42.09 2.67.62.7.99 1.6.99 2.7 0 3.88-2.34 4.74-4.57 5 .36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/sahil_sachan_27"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="group"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="6"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    className="group-hover:stroke-white transition-colors"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    className="group-hover:stroke-white transition-colors"
                  />
                  <circle cx="17" cy="7" r="1.2" fill="#9ca3af" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/sahilsachan2303"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="group"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="4"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    className="group-hover:stroke-white transition-colors"
                  />
                  <path
                    d="M8 10v6M8 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4 2v4m0-4a2 2 0 0 1 4 0v4"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="group-hover:stroke-white transition-colors"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-xs font-medium">
            © 2026 Attendify. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm font-semibold mt-1">
            Developed by{' '}
            <a
              href="https://sahilsachan.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Sahil Sachan
            </a>
          </p>
        </div>
      </footer>



      {/* ── APP DOWNLOAD MODAL ────────────────────────────────────────────────── */}
      {showAppModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            className="bg-white rounded-3xl p-8 text-center w-full max-w-[360px]"
            style={{
              boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
              animation: 'fadeScale 0.25s ease-out',
            }}
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2
              className="text-xl font-black mb-2"
              style={{
                background: GRAD,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Install Attendify App
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-6">
              Faster face recognition, smoother UI and better mobile
              performance.
            </p>
            <button
              onClick={handleDownloadApp}
              className="btn-3d-primary w-full py-3.5 rounded-2xl font-black text-sm block mb-3"
            >
              📥 Download Now
            </button>
            <button
              onClick={() => setShowAppModal(false)}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default LandingPage
