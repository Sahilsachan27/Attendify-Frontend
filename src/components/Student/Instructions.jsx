import React from 'react';

function Instructions() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          ℹ️ Instructions & Guidelines
        </h2>
        <p className="text-sm text-gray-600 mb-4">Follow these rules for successful attendance marking</p>

        {/* Main Instructions */}
        <div className="space-y-3">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
            <h3 className="text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
              📸 Face Scanning Guidelines
            </h3>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold text-xs">✓</span>
                <span>Ensure <strong>good lighting</strong> - avoid dark rooms or backlighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold text-xs">✓</span>
                <span>Face the camera <strong>directly</strong> - look straight at the camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold text-xs">✓</span>
                <span>Keep distance between <strong>1-2 feet</strong> from camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold text-xs">✓</span>
                <span>Remove glasses, masks, or face coverings if possible</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded p-4">
            <h3 className="text-base font-bold text-green-900 mb-2 flex items-center gap-2">
              📍 Location Requirements
            </h3>
            <ul className="space-y-1.5 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xs">✓</span>
                <span>Must be <strong>inside campus area</strong> when marking attendance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xs">✓</span>
                <span>Enable <strong>location services</strong> on your device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xs">✓</span>
                <span>Allow browser to access your <strong>GPS location</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 rounded p-4">
            <h3 className="text-base font-bold text-purple-900 mb-2 flex items-center gap-2">
              ⚡ System Rules
            </h3>
            <ul className="space-y-1.5 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-xs">✓</span>
                <span><strong>One attendance per session</strong> - cannot mark multiple times</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-xs">✓</span>
                <span>Both <strong>face match AND location</strong> must be verified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-xs">✓</span>
                <span>Attendance is <strong>real-time</strong> - no backdating allowed</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded p-4">
            <h3 className="text-base font-bold text-red-900 mb-2 flex items-center gap-2">
              ⚠️ Common Mistakes to Avoid
            </h3>
            <ul className="space-y-1.5 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xs">✗</span>
                <span>Don't use <strong>photos or videos</strong> - only live camera feed works</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xs">✗</span>
                <span>Don't try to mark attendance from <strong>outside campus</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xs">✗</span>
                <span>Don't use someone else's account - it will be detected</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 bg-gray-50 rounded p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-2">❓ Need Help?</h3>
          <p className="text-sm text-gray-700 mb-2">
            If you face any issues while marking attendance:
          </p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            <li>• Check your internet connection</li>
            <li>• Ensure camera permissions are enabled</li>
            <li>• Verify location services are turned on</li>
            <li>• Contact admin if face registration failed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
