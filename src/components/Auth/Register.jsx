import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { adminAPI, studentAPI } from '../../services/api';

function Register() {
  const webcamRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
  });
  const [images, setImages] = useState([]);
  const [supportsCamera, setSupportsCamera] = useState(true); // NEW: detect media support
  const [studentIdStatus, setStudentIdStatus] = useState(null); // null | 'available' | 'taken' | 'checking'
  const [studentIdMessage, setStudentIdMessage] = useState('');

  useEffect(() => {
    // detect getUserMedia support (may be blocked on insecure origins)
    const hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setSupportsCamera(hasMedia);
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ NEW: Real-time Student ID validation (Updated to show only name)
  const checkStudentId = async (studentId) => {
    if (!studentId || studentId.length < 3) {
      setStudentIdStatus(null);
      setStudentIdMessage('');
      return;
    }

    setStudentIdStatus('checking');
    setStudentIdMessage('⏳ Checking...');

    try {
      const response = await adminAPI.checkStudentId(studentId.trim().toUpperCase());
      const data = response.data;

      if (data.exists) {
        setStudentIdStatus('taken');
        // ✅ UPDATED: Show only name, no email
        setStudentIdMessage(`❌ Already registered by ${data.registered_name}`);
      } else {
        setStudentIdStatus('available');
        setStudentIdMessage('✅ Student ID available');
      }
    } catch (err) {
      console.error('Error checking Student ID:', err);
      setStudentIdStatus(null);
      setStudentIdMessage('');
    }
  };

  // ✅ Debounced change handler for Student ID
  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, student_id: value });

    // Clear previous timeout
    if (window.studentIdTimeout) {
      clearTimeout(window.studentIdTimeout);
    }

    // Set new timeout (500ms delay after user stops typing)
    window.studentIdTimeout = setTimeout(() => {
      checkStudentId(value);
    }, 500);
  };

  const capture = () => {
    const shot = webcamRef.current?.getScreenshot();
    if (shot) {
      setImages((prev) => [...prev, shot]);
      setMessage(`📸 Captured ${images.length + 1} image(s).`);
    }
  };

  // Handle native file input (mobile camera fallback)
  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const toDataUrl = (file) =>
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

    try {
      const newImages = [];
      for (const f of files.slice(0, 10)) {
        const dataUrl = await toDataUrl(f);
        newImages.push(dataUrl);
      }
      setImages((prev) => [...prev, ...newImages]);
      setMessage(`📸 Captured ${images.length + newImages.length} image(s).`);
    } catch (err) {
      setError('Failed to read selected images.');
    }
  };

  const submitRegistration = async () => {
    if (images.length < 5) {
      setError('Please capture at least 5 images.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('⏳ Creating account...');
    
    try {
      // Step 1: Register student account
      await adminAPI.registerStudent(formData);
      setMessage('✅ Account created!\n⏳ Uploading face images to cloud...');
      
      // ✅ Step 2: Use studentAPI instead of direct fetch
      const response = await studentAPI.registerFace({
        student_id: formData.student_id.trim().toUpperCase(),
        images: images
      });
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.error || 'Face image upload failed');
      }
      
      // Check if auto-training was successful
      if (data.training_result?.success) {
        setMessage(`✅ Registration complete!\n✅ ${data.face_images_count} images uploaded\n✅ AI model trained automatically\n🎉 You can now login!`);
      } else {
        setMessage(`✅ Registration complete!\n✅ ${data.face_images_count} images uploaded\n⚠️ AI model training pending (admin will train manually)\n🎉 You can now login!`);
      }
      
      // Optional: Auto-redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      
      // ✅ ENHANCED ERROR DISPLAY FOR DUPLICATE STUDENT_ID
      if (errorMessage.includes('Student ID') && errorMessage.includes('already registered')) {
        setError(`❌ ${errorMessage}\n\n💡 Tip: Try using a different Student ID like:\n• ${formData.student_id}A\n• ${formData.student_id}_NEW\n• Or contact admin if this is your correct ID`);
      } else if (errorMessage.includes('Email') && errorMessage.includes('already registered')) {
        setError(`❌ ${errorMessage}\n\n💡 Tip: Use a different email address or login with your existing account.`);
      } else {
        setError(`❌ ${errorMessage}`);
      }
      
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container px-2 py-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
      <div className="login-card w-full max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-8 rounded-2xl shadow-lg bg-white">
        <div className="login-header">
          <h1>✍️ Attendify Registration</h1>
          <p>Create your account and register your face</p>
        </div>

        {step === 1 && (
          <div className="login-form">
            {/* Student ID with Real-Time Validation */}
            <div className="form-group">
              <label>📝 Student ID</label>
              <input
                className={`input-field ${
                  studentIdStatus === 'available' ? 'border-green-500' :
                  studentIdStatus === 'taken' ? 'border-red-500' : ''
                }`}
                name="student_id"
                value={formData.student_id}
                onChange={handleStudentIdChange}
                placeholder="stu001"
                required
              />
              {/* Real-time feedback */}
              {studentIdMessage && (
                <div
                  className={`mt-2 text-sm font-semibold ${
                    studentIdStatus === 'available' ? 'text-green-600' :
                    studentIdStatus === 'taken' ? 'text-red-600' :
                    'text-gray-500'
                  }`}
                >
                  {studentIdMessage}
                </div>
              )}
            </div>

            {/* Basic fields */}
            <div className="form-group">
              <label>👤 Full Name</label>
              <input className="input-field" name="name" value={formData.name} onChange={onChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>📧 Email</label>
              <input className="input-field" type="email" name="email" value={formData.email} onChange={onChange} placeholder="student@example.com" required />
            </div>
            <div className="form-group">
              <label>🔒 Password</label>
              <input className="input-field" type="password" name="password" value={formData.password} onChange={onChange} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <div className="form-group">
              <label>🏢 Department</label>
              <input className="input-field" name="department" value={formData.department} onChange={onChange} placeholder="Computer Science" required />
            </div>
            <div className="form-group">
              <label>📚 Year</label>
              <select className="input-field" name="year" value={formData.year} onChange={onChange} required>
                <option value="">Select Year</option>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            <button
              className="btn-login w-full"
              type="button"
              onClick={() => setStep(2)}
              disabled={studentIdStatus === 'taken'}
            >
              Next: Face Capture →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="login-form flex flex-col gap-4">
            {/* Webcam for supported/desktop browsers */}
            {supportsCamera ? (
              <>
                <div className="webcam-container mx-auto rounded-xl overflow-hidden" style={{ width: '100%', maxWidth: 360, aspectRatio: '1/1' }}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ width: 640, height: 640, facingMode: 'user' }}
                    className="w-full h-full object-cover"
                    playsInline
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-login flex-1 min-w-[120px]" type="button" onClick={() => {
                    const shot = webcamRef.current?.getScreenshot();
                    if (shot) { setImages(prev=>[...prev, shot]); setMessage(`📸 Captured ${images.length+1} image(s).`); }
                  }} disabled={loading || images.length >= 10}>
                    📷 Capture ({images.length}/10)
                  </button>
                  <button className="btn-login flex-1 min-w-[120px]" type="button" onClick={() => setStep(1)} disabled={loading}>
                    ← Back
                  </button>
                  <button className="btn-login flex-1 min-w-[120px]" type="button" onClick={submitRegistration} disabled={loading || images.length < 5}>
                    {loading ? '⏳ Processing...' : '✅ Register'}
                  </button>
                </div>
              </>
            ) : (
              /* Mobile fallback: native camera via file input (works on HTTP/LAN) */
              <>
                <div className="mx-auto text-center w-full">
                  <p className="mb-3">📱 Browser blocked camera. Use phone camera below.</p>
                  <input
                    id="mobile-photo-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFileInput}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="btn-login flex-1" type="button" onClick={() => setStep(1)} disabled={loading}>
                    ← Back
                  </button>
                  <button className="btn-login flex-1" type="button" onClick={submitRegistration} disabled={loading || images.length < 5}>
                    {loading ? '⏳ Processing...' : '✅ Register'}
                  </button>
                </div>
              </>
            )}

            {/* Preview */}
            {images.length > 0 && (
              <div className="captured-images grid grid-cols-3 gap-2 mt-3">
                {images.map((src, i) => (
                  <img key={i} src={src} alt={`cap-${i}`} className="w-full h-24 object-cover rounded-md" />
                ))}
              </div>
            )}

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
