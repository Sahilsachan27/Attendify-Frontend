import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { authAPI, adminAPI } from '../../services/api'
import './AuthModal.css'

function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login') // 'login', 'register', 'face-capture'
  const [step, setStep] = useState(1) // Registration steps
  const webcamRef = useRef(null)

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: '',
  })

  const [capturedImages, setCapturedImages] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [faceGuideText, setFaceGuideText] = useState(
    'Center your face in the circle',
  )

  useEffect(() => {
    if (mode === 'face-capture') {
      const messages = [
        'Center your face in the circle',
        'Perfect, now smile :)',
        'Turn slightly to the left',
        'Turn slightly to the right',
        'Look straight ahead',
      ]
      const index = capturedImages.length % messages.length
      setFaceGuideText(messages[index])
    }
  }, [capturedImages.length, mode])

  if (!isOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(loginData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      onLogin(user)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterNext = () => {
    if (step === 1) {
      // Validate step 1
      if (
        !registerData.student_id ||
        !registerData.name ||
        !registerData.email
      ) {
        setError('Please fill all fields')
        return
      }
      setStep(2)
      setError('')
    } else if (step === 2) {
      // Validate step 2
      if (
        !registerData.password ||
        !registerData.department ||
        !registerData.year
      ) {
        setError('Please fill all fields')
        return
      }
      if (registerData.password !== registerData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (registerData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      setMode('face-capture')
      setError('')
    }
  }

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc])
      setMessage(`✅ Captured ${capturedImages.length + 1}/5 images`)
      setError('')
    }
  }

  const handleCompleteRegistration = async () => {
    if (capturedImages.length < 5) {
      setError('Please capture at least 5 images')
      return
    }

    setLoading(true)
    setMessage('⏳ Step 1/2: Creating your account...')

    try {
      // Step 1: Register student
      await adminAPI.registerStudent({
        student_id: registerData.student_id,
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        department: registerData.department,
        year: registerData.year,
      })

      setMessage('⏳ Step 2/2: Uploading face images...')

      // Step 2: Upload face images
      const response = await studentAPI.registerFace({
        student_id: registerData.student_id.trim().toUpperCase(),
        images: capturedImages,
      })

      const data = response.data

      if (!data.success) {
        throw new Error(data.error || 'Face image upload failed')
      }

      if (data.training_result?.success) {
        setMessage(
          `✅ Registration Complete!\n\n` +
            `🎉 Your account is ready!\n` +
            `🤖 AI Model trained automatically\n` +
            `📸 ${data.face_images_count} face images saved\n` +
            `✨ You can now login and mark attendance!`,
        )
      } else {
        setMessage(
          `✅ Registration Complete!\n\n` +
            `🎉 Your account is ready, but model training is pending.\n` +
            `📸 ${data.face_images_count} face images saved\n` +
            `Note: Admin needs to train the model manually before you can mark attendance.`,
        )
      }

      // Reset form and switch to login after 5 seconds
      setTimeout(() => {
        resetForm()
        setMode('login')
        setStep(1)
        setCapturedImages([])
        setMessage('')
        setError('')
      }, 5000)
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Registration failed'
      console.error('❌ Registration error:', errorMsg)

      if (
        errorMsg.includes('Student ID') &&
        errorMsg.includes('already registered')
      ) {
        setError(`❌ ${errorMsg}\n\n💡 Tip: Try using a different Student ID`)
      } else if (
        errorMsg.includes('Email') &&
        errorMsg.includes('already registered')
      ) {
        setError(`❌ ${errorMsg}\n\n💡 Tip: Use a different email address.`)
      } else {
        setError(`❌ ${errorMsg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setLoginData({ email: '', password: '' })
    setRegisterData({
      student_id: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      year: '',
    })
    setError('')
    setMessage('')
  }

  const handleClose = () => {
    resetForm()
    setMode('login')
    setStep(1)
    setCapturedImages([])
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[450px] relative mt-16 md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-3d w-full p-6 sm:p-8 bg-white/95 backdrop-blur-xl rounded-3xl relative overflow-hidden">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold shadow-sm"
            onClick={handleClose}
          >
            ✕
          </button>

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <div className="flex flex-col animate-fade-in">
              <div className="text-center mb-8">
                <div className="text-5xl mb-3 drop-shadow-sm">🎓</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Login Account
                </h2>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-1">
                  Sign in to continue
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your student ID"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-3d w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Don't have an account?
                </p>
                <button
                  className="btn-3d w-full py-3 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-xl font-bold text-sm"
                  onClick={() => {
                    setMode('register')
                    resetForm()
                  }}
                >
                  Register your Account
                </button>
              </div>
            </div>
          )}

          {/* REGISTER MODE - STEP 1 */}
          {mode === 'register' && step === 1 && (
            <div className="flex flex-col animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3 drop-shadow-sm">📝</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Registration
                </h2>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-1">
                  Create your Account
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="STU0001"
                    value={registerData.student_id}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        student_id: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="student@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  className="btn-3d w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(99,102,241,0.4)]"
                  onClick={handleRegisterNext}
                >
                  Next Step →
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Already have an account?
                </p>
                <button
                  className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors"
                  onClick={() => {
                    setMode('login')
                    resetForm()
                  }}
                >
                  Login here
                </button>
              </div>
            </div>
          )}

          {/* REGISTER MODE - STEP 2 */}
          {mode === 'register' && step === 2 && (
            <div className="flex flex-col animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3 drop-shadow-sm">🔒</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Complete Setup
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Min. 6 characters"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength="6"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Re-enter password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Department
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Computer Science"
                    value={registerData.department}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        department: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Year
                  </label>
                  <select
                    className="input-field text-gray-700 cursor-pointer"
                    value={registerData.year}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, year: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    className="btn-3d flex-1 py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold shadow-sm"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn-3d flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-black shadow-[0_4px_15px_rgba(99,102,241,0.3)]"
                    onClick={handleRegisterNext}
                  >
                    Face Scan →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FACE CAPTURE MODE */}
          {mode === 'face-capture' && (
            <div className="flex flex-col animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3 drop-shadow-sm">📸</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Photo Verification
                </h2>
                <p className="text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1 mx-4">
                  Take selfies to map your face ID
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative rounded-3xl overflow-hidden shadow-md border-[6px] border-white w-full max-w-[300px] aspect-square bg-gray-900 mb-4">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 640,
                      height: 640,
                      facingMode: 'user',
                    }}
                    mirrored={true}
                    className="w-full h-full object-cover"
                  />

                  {/* Face Guide Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-white/50 rounded-full relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>
                    </div>
                    <p className="absolute bottom-4 bg-black/60 text-white font-bold text-xs uppercase tracking-widest py-1 px-3 rounded-full backdrop-blur-md">
                      {faceGuideText}
                    </p>
                  </div>
                </div>

                {/* Capture Button */}
                <button
                  className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center bg-white shadow-lg hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
                  onClick={captureImage}
                  disabled={loading || capturedImages.length >= 10}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                </button>

                {/* Captured Images Preview */}
                {capturedImages.length > 0 && (
                  <div className="w-full mt-4">
                    <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      📷 Captured: {capturedImages.length}/5 minimum
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {capturedImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square">
                          <img
                            src={img}
                            alt={`Cap ${idx}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm"
                            onClick={() =>
                              setCapturedImages(
                                capturedImages.filter((_, i) => i !== idx),
                              )
                            }
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {message && (
                  <div className="w-full mt-4 p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs sm:text-sm font-bold text-center whitespace-pre-line shadow-sm">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 w-full mt-4 border-t border-gray-100 pt-4">
                  <button
                    className="btn-3d flex-1 py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-50"
                    onClick={() => {
                      setMode('register')
                      setStep(2)
                      setCapturedImages([])
                    }}
                    disabled={loading}
                  >
                    ← Back
                  </button>
                  {capturedImages.length >= 5 && (
                    <button
                      className="btn-3d flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:shadow-none"
                      onClick={handleCompleteRegistration}
                      disabled={loading}
                    >
                      {loading ? '⏳ Wait...' : '✅ Sign up'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
