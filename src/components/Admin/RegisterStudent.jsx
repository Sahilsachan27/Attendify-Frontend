import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function RegisterStudent() {
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
  });
  const [capturedImages, setCapturedImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [registeredStudentId, setRegisteredStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await adminAPI.registerStudent(formData);
      setMessage('✅ Student registered successfully! Now capture face images.');
      setRegisteredStudentId(formData.student_id);
      setShowCamera(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      
      // If duplicate error, don't show camera
      if (errorMsg.includes('already')) {
        setShowCamera(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc]);
      setMessage(`📸 Captured ${capturedImages.length + 1} image(s) - Need at least 5`);
      setError('');
    }
  };

  const uploadImages = async () => {
    if (capturedImages.length < 5) {
      setError('❌ Please capture at least 5 images');
      return;
    }

    setLoading(true);
    setMessage('⏳ Step 1/2: Uploading face images...');

    try {
      // Step 1: Upload face images
      await adminAPI.uploadFace(registeredStudentId, capturedImages);
      
      setMessage('⏳ Step 2/2: Training AI model automatically...');
      
      // Step 2: Automatically train the model (NEW!)
      try {
        const trainResponse = await adminAPI.trainModel();
        console.log('✅ Model trained:', trainResponse.data);
        
        setMessage(
          `✅ Student Registration Complete!\n\n` +
          `📸 ${capturedImages.length} face images uploaded\n` +
          `🤖 AI Model trained successfully\n` +
          `🎯 Trained ${trainResponse.data.students_trained} students\n` +
          `📊 Total images: ${trainResponse.data.total_images}\n\n` +
          `✨ Student can now mark attendance immediately!`
        );
      } catch (trainError) {
        console.error('❌ Training failed:', trainError);
        setMessage(
          `✅ Face images uploaded successfully!\n\n` +
          `⚠️ Automatic training failed\n` +
          `Please go to "Train Model" tab to train manually.`
        );
      }
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          student_id: '',
          name: '',
          email: '',
          password: '',
          department: '',
          year: '',
        });
        setCapturedImages([]);
        setShowCamera(false);
        setRegisteredStudentId(null);
        setMessage('');
        setError('');
      }, 5000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Upload failed';
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = () => {
    setFormData({
      student_id: '',
      name: '',
      email: '',
      password: '',
      department: '',
      year: '',
    });
    setCapturedImages([]);
    setShowCamera(false);
    setRegisteredStudentId(null);
    setMessage('');
    setError('');
  };

  return (
    <div className="admin-section">
      <h2>➕ Register New Student</h2>

      {!showCamera ? (
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label>📝 Student ID</label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                placeholder="STU0001"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>📧 Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="student@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>🔒 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 6 characters"
                minLength="6"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>🏢 Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Computer Science"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>📚 Year</label>
              <select 
                name="year" 
                value={formData.year} 
                onChange={handleInputChange} 
                required
                disabled={loading}
              >
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && !showCamera && <div className="success-message">{message}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⏳ Registering...' : '✅ Register Student'}
          </button>
        </form>
      ) : (
        <div className="face-capture">
          <h3>📸 Capture Face Images for {formData.name}</h3>
          <p>Capture at least 5 images from different angles and expressions</p>
          
          <div className="webcam-container">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ 
                width: 640, 
                height: 480, 
                facingMode: 'user' 
              }}
            />
          </div>

          <div className="capture-controls">
            <button 
              onClick={captureImage} 
              className="btn-primary"
              disabled={loading || capturedImages.length >= 10}
            >
              📷 Capture Image ({capturedImages.length}/10)
            </button>
            {capturedImages.length >= 5 && (
              <button 
                onClick={uploadImages} 
                className="btn-success"
                disabled={loading}
              >
                {loading ? '⏳ Uploading...' : '✅ Upload Images'}
              </button>
            )}
            <button 
              onClick={cancelRegistration} 
              className="btn-danger"
              disabled={loading}
            >
              ❌ Cancel
            </button>
          </div>

          {capturedImages.length > 0 && (
            <div className="captured-images">
              {capturedImages.map((img, idx) => (
                <img key={idx} src={img} alt={`Capture ${idx + 1}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {message && showCamera && <div className="success-message">{message}</div>}
      {error && showCamera && <div className="error-message">{error}</div>}
    </div>
  );
}

export default RegisterStudent;
