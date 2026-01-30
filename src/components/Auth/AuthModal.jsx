import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { authAPI, adminAPI } from '../../services/api';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'face-capture'
  const [step, setStep] = useState(1); // Registration steps
  const webcamRef = useRef(null);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: '',
  });

  const [capturedImages, setCapturedImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [faceGuideText, setFaceGuideText] = useState('Center your face in the circle');

  useEffect(() => {
    if (mode === 'face-capture') {
      const messages = [
        'Center your face in the circle',
        'Perfect, now smile :)',
        'Turn slightly to the left',
        'Turn slightly to the right',
        'Look straight ahead',
      ];
      const index = capturedImages.length % messages.length;
      setFaceGuideText(messages[index]);
    }
  }, [capturedImages.length, mode]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(loginData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!registerData.student_id || !registerData.name || !registerData.email) {
        setError('Please fill all fields');
        return;
      }
      setStep(2);
      setError('');
    } else if (step === 2) {
      // Validate step 2
      if (!registerData.password || !registerData.department || !registerData.year) {
        setError('Please fill all fields');
        return;
      }
      if (registerData.password !== registerData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (registerData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setMode('face-capture');
      setError('');
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc]);
      setMessage(`✅ Captured ${capturedImages.length + 1}/5 images`);
      setError('');
    }
  };

  const handleCompleteRegistration = async () => {
    if (capturedImages.length < 5) {
      setError('Please capture at least 5 images');
      return;
    }

    setLoading(true);
    setMessage('⏳ Step 1/3: Creating your account...');

    try {
      // Step 1: Register student
      await adminAPI.registerStudent({
        student_id: registerData.student_id,
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        department: registerData.department,
        year: registerData.year,
      });

      setMessage('⏳ Step 2/3: Uploading face images...');
      
      // Step 2: Upload face images
      await adminAPI.uploadFace(registerData.student_id, capturedImages);

      setMessage('⏳ Step 3/3: Training AI model... Please wait (this takes 10-30 seconds)...');
      
      // Step 3: Automatically train the model (NEW!)
      try {
        const trainResponse = await adminAPI.trainModel();
        console.log('✅ Model trained:', trainResponse.data);
        
        setMessage(
          `✅ Registration Complete!\n\n` +
          `🎉 Your account is ready!\n` +
          `🤖 AI Model trained successfully\n` +
          `📸 ${capturedImages.length} face images saved\n` +
          `✨ You can now login and mark attendance!`
        );
      } catch (trainError) {
        console.error('❌ Training failed:', trainError);
        
        // Even if training fails, registration was successful
        setMessage(
          `✅ Registration Successful!\n\n` +
          `⚠️ Model training failed - Please contact admin\n` +
          `📧 Login: ${registerData.email}\n` +
          `🔒 Password: ${registerData.password}\n\n` +
          `Note: Admin needs to train the model manually before you can mark attendance.`
        );
      }
      
      // Reset form and switch to login after 5 seconds
      setTimeout(() => {
        resetForm();
        setMode('login');
        setStep(1);
        setCapturedImages([]);
        setMessage('');
        setError('');
      }, 5000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      console.error('❌ Registration error:', errorMsg);
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({
      student_id: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      year: '',
    });
    setError('');
    setMessage('');
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    setStep(1);
    setCapturedImages([]);
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose}>✕</button>

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <div className="auth-modal-content">
            <div className="auth-modal-header">
              <div className="auth-icon">🎓</div>
              <h2>Login Account</h2>
              <p>Sign in to continue your progress</p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group-modal">
                <label>Student ID</label>
                <input
                  type="text"
                  placeholder="Enter your student ID"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group-modal">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <div className="show-password-toggle">
                  <input type="checkbox" id="showPassword" />
                  <label htmlFor="showPassword">Show password</label>
                </div>
              </div>

              {error && <div className="error-message-modal">{error}</div>}

              <button type="submit" className="btn-modal-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="auth-modal-footer">
              <p>Don't have an account?</p>
              <button 
                className="btn-modal-link" 
                onClick={() => { setMode('register'); resetForm(); }}
              >
                Register your Account
              </button>
              <button className="btn-modal-secondary">Sign up</button>
            </div>
          </div>
        )}

        {/* REGISTER MODE - STEP 1 */}
        {mode === 'register' && step === 1 && (
          <div className="auth-modal-content">
            <div className="auth-modal-header">
              <div className="auth-icon">📝</div>
              <h2>Student Registration System</h2>
              <p>Register your Account</p>
            </div>

            <div className="auth-form">
              <div className="form-group-modal">
                <label>Student ID</label>
                <input
                  type="text"
                  placeholder="STU0001"
                  value={registerData.student_id}
                  onChange={(e) => setRegisterData({ ...registerData, student_id: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>

              {error && <div className="error-message-modal">{error}</div>}

              <button 
                type="button" 
                className="btn-modal-primary" 
                onClick={handleRegisterNext}
              >
                Next Step →
              </button>
            </div>

            <div className="auth-modal-footer">
              <p>Already have an account?</p>
              <button 
                className="btn-modal-link" 
                onClick={() => { setMode('login'); resetForm(); }}
              >
                Login here
              </button>
            </div>
          </div>
        )}

        {/* REGISTER MODE - STEP 2 */}
        {mode === 'register' && step === 2 && (
          <div className="auth-modal-content">
            <div className="auth-modal-header">
              <div className="auth-icon">🔒</div>
              <h2>Complete Registration</h2>
              <p>Set your password and details</p>
            </div>

            <div className="auth-form">
              <div className="form-group-modal">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group-modal">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Department</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={registerData.department}
                  onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Year</label>
                <select 
                  value={registerData.year} 
                  onChange={(e) => setRegisterData({ ...registerData, year: e.target.value })}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>

              {error && <div className="error-message-modal">{error}</div>}

              <div className="button-group">
                <button 
                  type="button" 
                  className="btn-modal-secondary" 
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button 
                  type="button" 
                  className="btn-modal-primary" 
                  onClick={handleRegisterNext}
                >
                  Next: Face Scan →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FACE CAPTURE MODE */}
        {mode === 'face-capture' && (
          <div className="auth-modal-content face-capture-modal">
            <div className="auth-modal-header">
              <div className="auth-icon">📸</div>
              <h2>Photo Verification</h2>
              <p>Take a selfie</p>
              <p className="sub-text">
                For verifying your identity we will match your selfie to your provided document photo
              </p>
            </div>

            <div className="face-capture-container">
              <div className="webcam-wrapper">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: 'user',
                  }}
                  className="webcam-feed"
                />
                
                {/* Face Guide Overlay */}
                <div className="face-guide-overlay">
                  <div className="face-circle">
                    <div className="face-guide-dots">
                      <div className="dot top-left"></div>
                      <div className="dot top-right"></div>
                      <div className="dot bottom-left"></div>
                      <div className="dot bottom-right"></div>
                    </div>
                  </div>
                  <p className="face-guide-text">{faceGuideText}</p>
                </div>

                {/* Capture Button */}
                <button 
                  className="capture-button"
                  onClick={captureImage}
                  disabled={loading || capturedImages.length >= 10}
                >
                  <div className="capture-button-inner"></div>
                </button>
              </div>

              {/* Captured Images Preview */}
              {capturedImages.length > 0 && (
                <div className="captured-preview">
                  <div className="preview-header">
                    <span>📷 Captured: {capturedImages.length}/5 minimum</span>
                  </div>
                  <div className="preview-grid">
                    {capturedImages.map((img, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={img} alt={`Capture ${idx + 1}`} />
                        <button 
                          className="preview-delete"
                          onClick={() => setCapturedImages(capturedImages.filter((_, i) => i !== idx))}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Info */}
              <div className="security-info">
                <div className="security-icon">🔒</div>
                <p>Stored data is encrypted securely and only used for identity verification</p>
              </div>

              {message && <div className="success-message-modal">{message}</div>}
              {error && <div className="error-message-modal">{error}</div>}

              {/* Action Buttons */}
              <div className="button-group">
                <button 
                  className="btn-modal-secondary" 
                  onClick={() => { setMode('register'); setStep(2); setCapturedImages([]); }}
                  disabled={loading}
                >
                  ← Back
                </button>
                {capturedImages.length >= 5 && (
                  <button 
                    className="btn-modal-primary" 
                    onClick={handleCompleteRegistration}
                    disabled={loading}
                  >
                    {loading ? '⏳ Processing...' : '✅ Sign up'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
