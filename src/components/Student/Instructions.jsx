import React from 'react'

const sections = [
  {
    icon: '📸',
    label: 'Face Scanning',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    textHead: 'text-blue-900',
    items: [
      'Ensure good lighting — avoid backlighting',
      'Face the camera directly',
      'Keep distance between 1–2 feet',
      'Remove glasses, masks, or face coverings',
    ],
    tick: 'text-blue-500',
    tickText: 'text-blue-800/90',
  },
  {
    icon: '📍',
    label: 'Location Check',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    textHead: 'text-emerald-900',
    items: [
      'Must be inside campus area',
      'Enable location services on your device',
      'Allow browser GPS access',
    ],
    tick: 'text-emerald-500',
    tickText: 'text-emerald-800/90',
  },
  {
    icon: '⚡',
    label: 'System Rules',
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    textHead: 'text-purple-900',
    items: [
      'One attendance per session',
      'Both face AND location required',
      'Attendance is real-time only',
    ],
    tick: 'text-purple-500',
    tickText: 'text-purple-800/90',
  },
  {
    icon: '⚠️',
    label: 'Avoid Mistakes',
    color: 'rose',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    textHead: 'text-rose-900',
    items: [
      "Don't use photos/videos (live only)",
      "Don't mark outside campus",
      "Don't use someone else's account",
    ],
    tick: 'text-rose-500',
    tickText: 'text-rose-800/90',
  },
]

function Instructions() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-6">
      <div className="card-3d-modern p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-sm">ℹ️</span>
          Instructions & Guidelines
        </h2>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 pb-6">
          Follow these rules for successful attendance marking
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {sections.map((s, idx) => (
            <div key={idx} className={`${s.bg} border ${s.border} rounded-2xl p-5 md:p-6 hover:-translate-y-0.5 transition-transform`}>
              <h3 className={`text-sm font-black ${s.textHead} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <span className="text-lg">{s.icon}</span> {s.label}
              </h3>
              <ul className="space-y-2.5">
                {s.items.map((item, i) => (
                  <li key={i} className={`flex items-start gap-2 text-xs ${s.tickText} font-bold`}>
                    <span className={`${s.tick} text-sm leading-none shrink-0`}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Help */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shadow-sm shrink-0">❓</div>
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Need Help?</h3>
            <p className="text-xs text-gray-500 font-medium mb-3">If you face any issues while marking attendance:</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {['Check Internet', 'Enable Camera', 'Turn on Location'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">{tag}</span>
              ))}
              <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">Contact Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Instructions
