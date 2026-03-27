import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { adminAPI, studentAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    student_id: '', name: '', email: '', password: '', department: '', year: '',
  })
  const [images, setImages] = useState([])
  const [supportsCamera, setSupportsCamera] = useState(true)
  const [studentIdStatus, setStudentIdStatus] = useState(null)
  const [studentIdMessage, setStudentIdMessage] = useState('')

  useEffect(() => {
    const hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    setSupportsCamera(hasMedia)
  }, [])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const checkStudentId = async (studentId) => {
    if (!studentId || studentId.length < 3) { setStudentIdStatus(null); setStudentIdMessage(''); return }
    setStudentIdStatus('checking'); setStudentIdMessage('⏳ Checking...')
    try {
      const response = await adminAPI.checkStudentId(studentId.trim().toUpperCase())
      const data = response.data
      if (data.exists) { setStudentIdStatus('taken'); setStudentIdMessage(`❌ Already registered by ${data.registered_name}`) }
      else { setStudentIdStatus('available'); setStudentIdMessage('✅ Student ID available') }
    } catch (err) { setStudentIdStatus(null); setStudentIdMessage('') }
  }

  const handleStudentIdChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, student_id: value })
    if (window.studentIdTimeout) clearTimeout(window.studentIdTimeout)
    window.studentIdTimeout = setTimeout(() => checkStudentId(value), 500)
  }

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const toDataUrl = (file) => new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res(reader.result)
      reader.onerror = rej
      reader.readAsDataURL(file)
    })
    try {
      const newImages = []
      for (const f of files.slice(0, 10)) newImages.push(await toDataUrl(f))
      setImages((prev) => [...prev, ...newImages])
      setMessage(`📸 Captured ${images.length + newImages.length} image(s).`)
    } catch (err) { setError('Failed to read selected images.') }
  }

  const submitRegistration = async () => {
    if (images.length < 5) { setError('Please capture at least 5 images.'); return }
    setStep(3); setLoading(true); setError(''); setMessage('⏳ Creating account...')
    try {
      await adminAPI.registerStudent(formData)
      setMessage('✅ Account created!\n⏳ Uploading face images to cloud...')
      const response = await studentAPI.registerFace({ student_id: formData.student_id.trim().toUpperCase(), images })
      const data = response.data
      if (!data.success) throw new Error(data.error || 'Face image upload failed')
      setMessage(data.training_result?.success
        ? `✅ Registration complete!\n✅ ${data.face_images_count} images uploaded\n✅ AI model trained automatically\n🎉 You can now login!`
        : `✅ Registration complete!\n✅ ${data.face_images_count} images uploaded\n⚠️ AI model training pending\n🎉 You can now login!`)
      setTimeout(() => { window.location.href = '/login' }, 3000)
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed'
      if (errorMessage.includes('Student ID') && errorMessage.includes('already registered'))
        setError(`❌ ${errorMessage}\n\n💡 Tip: Try using a different Student ID`)
      else if (errorMessage.includes('Email') && errorMessage.includes('already registered'))
        setError(`❌ ${errorMessage}\n\n💡 Tip: Use a different email or login.`)
      else setError(`❌ ${errorMessage}`)
      setMessage('')
    } finally { setLoading(false) }
  }

  const bgStyle = {
    background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 40%, #faf5ff 70%, #ffffff 100%)',
  }

  const cardStyle = {
    boxShadow: '0 8px 60px -12px rgba(99,102,241,0.25), 0 2px 20px -4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
  }

  const steps = ['Details', 'Face Capture', 'Complete']

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={bgStyle}>
      {/* Background Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a5b4fc, #818cf8)' }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c4b5fd, #8b5cf6)' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[460px] bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 pb-8" style={cardStyle}>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 mb-2">
            <img src="/attendifyy.png" alt="Attendify" className="h-8 w-auto" />
            <span className="text-2xl font-black tracking-tight"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ATTENDIFY
            </span>
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">✍️ Registration</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mt-1">Create Account & Register Face</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-7">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${step === i + 1 ? 'bg-indigo-600 text-white shadow-sm' : step > i + 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? '✓' : i + 1} {s}
              </div>
              {i < 2 && <div className="w-4 h-0.5 bg-gray-200 rounded-full" />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1 — Details */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {/* Student ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] ml-1">📝 Student ID</label>
              <input
                className={`input-3d w-full text-sm ${studentIdStatus === 'available' ? 'ring-1 ring-emerald-400' : studentIdStatus === 'taken' ? 'ring-1 ring-red-400' : ''}`}
                name="student_id" value={formData.student_id} onChange={handleStudentIdChange}
                placeholder="e.g. STU001" required
              />
              {studentIdMessage && (
                <p className={`text-xs font-bold ml-1 ${studentIdStatus === 'available' ? 'text-emerald-600' : studentIdStatus === 'taken' ? 'text-red-600' : 'text-gray-400'}`}>
                  {studentIdMessage}
                </p>
              )}
            </div>
            {[
              { label: '👤 Full Name', name: 'name', placeholder: 'John Doe', type: 'text' },
              { label: '📧 Email', name: 'email', placeholder: 'student@example.com', type: 'email' },
              { label: '🔒 Password', name: 'password', placeholder: 'Min. 6 characters', type: 'password', minLength: 6 },
              { label: '🏢 Department', name: 'department', placeholder: 'Computer Science', type: 'text' },
            ].map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] ml-1">{f.label}</label>
                <input className="input-3d w-full text-sm" type={f.type} name={f.name} value={formData[f.name]}
                  onChange={onChange} placeholder={f.placeholder} required minLength={f.minLength} />
              </div>
            ))}
            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] ml-1">📚 Year</label>
              <select className="input-3d w-full text-sm cursor-pointer" name="year" value={formData.year} onChange={onChange} required>
                <option value="">Select Year</option>
                {['First', 'Second', 'Third', 'Fourth'].map((y, i) => <option key={y} value={i + 1}>{y}</option>)}
              </select>
            </div>
            {error && <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-semibold whitespace-pre-wrap">{error}</div>}
            <button className="btn-3d-primary w-full py-4 mt-1 rounded-2xl font-black text-base disabled:opacity-50"
              type="button" onClick={() => setStep(2)} disabled={studentIdStatus === 'taken'}>
              Next: Face Capture →
            </button>
            <button className="text-center text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors mt-1"
              onClick={() => navigate('/login')}>← Already have an account? Login</button>
          </div>
        )}

        {/* STEP 2 — Face Capture */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {supportsCamera ? (
              <>
                <div className="mx-auto rounded-3xl overflow-hidden shadow-md border-4 border-white"
                  style={{ width: '100%', maxWidth: 340, aspectRatio: '1/1' }}>
                  <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg"
                    videoConstraints={{ width: 640, height: 640, facingMode: 'user' }}
                    mirrored={true} className="w-full h-full object-cover" playsInline />
                </div>
                <div className="flex flex-col gap-3">
                  <button className="btn-3d-secondary w-full py-3 rounded-xl font-bold disabled:opacity-50"
                    type="button"
                    onClick={() => {
                      const shot = webcamRef.current?.getScreenshot()
                      if (shot) { setImages((p) => [...p, shot]); setMessage(`📸 Captured ${images.length + 1} image(s).`) }
                    }}
                    disabled={loading || images.length >= 10}>
                    📷 Capture ({images.length}/10)
                  </button>
                  <div className="flex gap-3">
                    <button className="btn-3d-secondary flex-1 py-3 rounded-xl font-bold disabled:opacity-50"
                      type="button" onClick={() => setStep(1)} disabled={loading}>← Back</button>
                    <button className="btn-3d-success flex-1 py-3 rounded-xl font-black disabled:opacity-50"
                      type="button" onClick={submitRegistration} disabled={loading || images.length < 5}>
                      {loading ? '⏳ Wait...' : '✅ Submit'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl text-center">
                  <p className="text-indigo-800 font-bold text-sm mb-3">📱 Browser blocked camera. Use phone camera below.</p>
                  <input id="mobile-photo-input" type="file" accept="image/*" capture="environment" multiple
                    onChange={handleFileInput}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700" />
                </div>
                <div className="flex gap-3">
                  <button className="btn-3d-secondary flex-1 py-3 rounded-xl font-bold" type="button" onClick={() => setStep(1)} disabled={loading}>← Back</button>
                  <button className="btn-3d-success flex-1 py-3 rounded-xl font-black" type="button" onClick={submitRegistration} disabled={loading || images.length < 5}>
                    {loading ? '⏳ Wait...' : '✅ Submit'}
                  </button>
                </div>
              </>
            )}

            {/* Captured Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <img key={i} src={src} alt={`cap-${i}`} className="w-full h-16 sm:h-20 object-cover rounded-xl border border-gray-100 shadow-sm" />
                ))}
              </div>
            )}
            {message && <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl text-xs font-bold">{message}</div>}
            {error && <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-semibold whitespace-pre-wrap">{error}</div>}
          </div>
        )}

        {/* STEP 3 — Processing */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-10 text-center min-h-[320px]">
            {loading && !error && (
              <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
            )}
            {!loading && !error && message.includes('complete') && (
              <div className="text-6xl mb-6 animate-fade-in">🎉</div>
            )}
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              {loading ? 'Processing...' : error ? 'Registration Failed' : 'Success!'}
            </h3>
            <div className="text-sm font-semibold text-gray-600 mb-6 max-w-[260px] whitespace-pre-line leading-relaxed">
              {message || (loading ? 'Uploading data to server...' : '')}
            </div>
            {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl w-full text-sm font-semibold mb-5 text-left whitespace-pre-line">{error}</div>}
            {error && (
              <button onClick={() => setStep(2)} className="btn-3d-secondary w-full py-4 rounded-xl font-bold text-sm">← Go Back and Try Again</button>
            )}
            {!loading && !error && (
              <button onClick={() => window.location.href = '/login'} className="btn-3d-success w-full py-4 rounded-xl font-black text-sm">Proceed to Login →</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
