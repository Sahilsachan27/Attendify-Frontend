import React from 'react'

function Instructions() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="card-3d p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
            ℹ️
          </span>{' '}
          Instructions & Guidelines
        </h2>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 border-b border-gray-100 pb-6">
          Follow these rules for successful attendance marking
        </p>

        {/* Main Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="glass bg-blue-50/50 border border-blue-200 rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <span className="text-lg">📸</span> Face Scanning
            </h3>
            <ul className="space-y-2.5 text-xs text-blue-800/90 font-bold relative z-10">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 text-sm leading-none">✓</span>{' '}
                Ensure good lighting - avoid backlighting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 text-sm leading-none">✓</span>{' '}
                Face the camera directly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 text-sm leading-none">✓</span>{' '}
                Keep distance between 1-2 feet
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 text-sm leading-none">✓</span>{' '}
                Remove glasses, masks, or face coverings
              </li>
            </ul>
          </div>

          <div className="glass bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <span className="text-lg">📍</span> Location Check
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-800/90 font-bold relative z-10">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm leading-none">✓</span>{' '}
                Must be inside campus area
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm leading-none">✓</span>{' '}
                Enable location services
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm leading-none">✓</span>{' '}
                Allow browser GPS access
              </li>
            </ul>
          </div>

          <div className="glass bg-purple-50/50 border border-purple-200 rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="text-sm font-black text-purple-900 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <span className="text-lg">⚡</span> System Rules
            </h3>
            <ul className="space-y-2.5 text-xs text-purple-800/90 font-bold relative z-10">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 text-sm leading-none">✓</span>{' '}
                One attendance per session
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 text-sm leading-none">✓</span>{' '}
                Both face AND location required
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 text-sm leading-none">✓</span>{' '}
                Attendance is real-time only
              </li>
            </ul>
          </div>

          <div className="glass bg-rose-50/50 border border-rose-200 rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <span className="text-lg">⚠️</span> Avoid Mistakes
            </h3>
            <ul className="space-y-2.5 text-xs text-rose-800/90 font-bold relative z-10">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 text-sm leading-none">✗</span>{' '}
                Don't use photos/videos (live only)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 text-sm leading-none">✗</span>{' '}
                Don't mark outside campus
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 text-sm leading-none">✗</span>{' '}
                Don't use someone else's account
              </li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
            ❓
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">
              Need Help?
            </h3>
            <p className="text-xs text-gray-500 font-bold mb-3">
              If you face any issues while marking attendance:
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Check Internet
              </span>
              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Enable Camera
              </span>
              <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Turn on Location
              </span>
              <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                Contact Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Instructions
