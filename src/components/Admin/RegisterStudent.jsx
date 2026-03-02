import React, { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { adminAPI } from '../../services/api'
import './AdminStyles.css'

function RegisterStudent() {
  const webcamRef = useRef(null)
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
  })
  const [capturedImages, setCapturedImages] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [registeredStudentId, setRegisteredStudentId] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await adminAPI.registerStudent(formData)
      setMessage('✅ Student registered successfully! Now capture face images.')
      setRegisteredStudentId(formData.student_id)
      setShowCamera(true)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed'
      setError(errorMsg)

      // If duplicate error, don't show camera
      if (errorMsg.includes('already')) {
        setShowCamera(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc])
      setMessage(
        `📸 Captured ${capturedImages.length + 1} image(s) - Need at least 5`,
      )
      setError('')
    }
  }

  const uploadImages = async () => {
    if (capturedImages.length < 5) {
      setError('❌ Please capture at least 5 images')
      return
    }

    setLoading(true)
    setMessage('⏳ Step 1/2: Uploading face images...')

    try {
      // Step 1: Upload face images
      await adminAPI.uploadFace(registeredStudentId, capturedImages)

      setMessage('⏳ Step 2/2: Training AI model automatically...')

      // Step 2: Automatically train the model (NEW!)
      try {
        const trainResponse = await adminAPI.trainModel()
        console.log('✅ Model trained:', trainResponse.data)

        setMessage(
          `✅ Student Registration Complete!\n\n` +
            `📸 ${capturedImages.length} face images uploaded\n` +
            `🤖 AI Model trained successfully\n` +
            `🎯 Trained ${trainResponse.data.students_trained} students\n` +
            `📊 Total images: ${trainResponse.data.total_images}\n\n` +
            `✨ Student can now mark attendance immediately!`,
        )
      } catch (trainError) {
        console.error('❌ Training failed:', trainError)
        setMessage(
          `✅ Face images uploaded successfully!\n\n` +
            `⚠️ Automatic training failed\n` +
            `Please go to "Train Model" tab to train manually.`,
        )
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
        })
        setCapturedImages([])
        setShowCamera(false)
        setRegisteredStudentId(null)
        setMessage('')
        setError('')
      }, 5000)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Upload failed'
      setError(`❌ ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const cancelRegistration = () => {
    setFormData({
      student_id: '',
      name: '',
      email: '',
      password: '',
      department: '',
      year: '',
    })
    setCapturedImages([])
    setShowCamera(false)
    setRegisteredStudentId(null)
    setMessage('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="flex items-center gap-4 mb-2 sm:mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg text-white">
          ➕
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Register Student
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Add new student profile & face data
          </p>
        </div>
      </div>

      <div className="card-3d p-6 sm:p-8">
        {!showCamera ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <h3 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xl shadow-sm">
                📝
              </span>{' '}
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Student ID
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  placeholder="STU0001"
                  className="input-field font-mono"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@example.com"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 6 characters"
                  className="input-field"
                  minLength="6"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Computer Science"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="input-field text-gray-700 cursor-pointer"
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

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-bold shadow-sm">
                {error}
              </div>
            )}
            {message && !showCamera && (
              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl text-sm font-bold shadow-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-3d w-full mt-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : 'Next: Face Capture →'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                📸 Photo Verification
              </h3>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-2">
                Capture face data for{' '}
                <span className="text-indigo-600">{formData.name}</span>
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-md border-[6px] border-white w-full max-w-[400px] aspect-[4/3] bg-gray-900 mb-6">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: 'user',
                }}
                mirrored={true}
                className="w-full h-full object-cover"
              />
              {/* Face Guide Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/50 rounded-full relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={captureImage}
                className="btn-3d py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading || capturedImages.length >= 10}
              >
                <span>📷</span> Capture ({capturedImages.length}/10)
              </button>

              {capturedImages.length >= 5 && (
                <button
                  onClick={uploadImages}
                  className="btn-3d py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 animate-bounce-in"
                  disabled={loading}
                >
                  {loading ? '⏳ Uploading...' : '✅ Save Face Data'}
                </button>
              )}

              <button
                onClick={cancelRegistration}
                className="btn-3d py-3 px-6 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold shadow-sm disabled:opacity-50 hover:bg-rose-100 flex items-center justify-center gap-2"
                disabled={loading}
              >
                ❌ Cancel
              </button>
            </div>

            {capturedImages.length > 0 && (
              <div className="w-full mt-8">
                <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-t border-gray-100 pt-6">
                  Captured Images Preview
                </p>
                <div className="grid grid-cols-5 gap-2 sm:gap-4">
                  {capturedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <img
                        src={img}
                        alt={`Cap ${idx}`}
                        className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {message && showCamera && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold text-center whitespace-pre-line shadow-sm animate-fade-in">
            {message}
          </div>
        )}
        {error && showCamera && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold text-center shadow-sm animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterStudent
