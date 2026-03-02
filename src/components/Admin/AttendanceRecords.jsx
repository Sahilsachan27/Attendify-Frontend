import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import './AdminStyles.css'

function AttendanceRecords() {
  const [records, setRecords] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getDailyAttendance(selectedDate)
      setRecords(response.data.records)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="flex items-center gap-4 mb-2 sm:mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg text-white">
          📋
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Attendance Records
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Daily location-verified logs
          </p>
        </div>
      </div>

      {/* Date Filter & Summary Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <div className="card-3d p-6 sm:p-8 flex-1 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                📅 Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field w-full text-lg cursor-pointer"
              />
            </div>
            <button
              className="btn-3d w-full sm:w-auto h-[52px] px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-[0_8px_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95"
              onClick={fetchAttendance}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card-3d p-6 sm:p-8 flex-[0.7] flex gap-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <span className="text-2xl mb-1">✅</span>
            <p className="text-3xl font-black text-gray-800 tracking-tighter">
              {records.length}
            </p>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Present
            </h4>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <span className="text-2xl mb-1">📅</span>
            <p className="text-sm font-bold text-gray-800 tracking-tight leading-tight mt-1">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Date
            </h4>
          </div>
        </div>
      </div>

      {/* Attendance List/Table */}
      <div className="card-3d overflow-hidden flex flex-col">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-3">
            <span className="text-xl">📊</span> Attendance Logs
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-sm" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Loading records...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <span className="text-4xl mb-3 opacity-50">📭</span>
                <p className="text-gray-500 font-bold text-sm tracking-wide">
                  No attendance records found for this date.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Student
                    </th>
                    <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">
                      Time
                    </th>
                    <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap hidden md:table-cell">
                      Location Status
                    </th>
                    <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap hidden lg:table-cell">
                      Face Match
                    </th>
                    <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-black flex items-center justify-center text-lg shadow-inner border border-white">
                            {record.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-gray-800 text-sm sm:text-base tracking-tight">
                              {record.name}
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {record.student_id}
                            </span>
                            {/* Mobile only details */}
                            <div className="flex flex-col sm:hidden mt-1 gap-1">
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-max">
                                🕐 {record.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 hidden sm:table-cell">
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm whitespace-nowrap">
                          {record.time}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap inline-flex items-center gap-1.5 w-max">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Inside Campus
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {record.distance_from_campus?.toFixed(0)}m from
                            center
                          </span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                              style={{ width: `${record.face_confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-gray-600 font-mono">
                            {record.face_confidence?.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="text-[10px] sm:text-xs font-black text-emerald-600 bg-emerald-100/50 border border-emerald-200 px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm whitespace-nowrap inline-flex items-center gap-1.5">
                          <span className="text-sm">✅</span> Present
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceRecords
