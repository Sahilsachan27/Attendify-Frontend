import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function StudentRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (student) => {
    setDeleteResult(null);
    setDeleteModal({ open: true, student });
  };

  const closeDeleteModal = () => {
    if (deleting) return; // block close while in progress
    setDeleteModal({ open: false, student: null });
    setDeleteResult(null);
  };

  const handleDelete = async () => {
    if (!deleteModal.student) return;
    setDeleting(true);
    setDeleteResult(null);
    try {
      const res = await adminAPI.deleteStudent(deleteModal.student.student_id);
      const data = res.data;
      // Remove from local state immediately
      setStudents((prev) => prev.filter((s) => s.student_id !== deleteModal.student.student_id));
      setDeleteResult({
        type: 'success',
        message: `✅ ${data.message}\n☁️ ${data.cloudinary_photos_deleted} cloud photo(s) deleted\n📋 ${data.attendance_records_deleted} attendance record(s) removed`,
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Deletion failed';
      setDeleteResult({ type: 'error', message: `❌ ${msg}` });
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || student.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(students.map(s => s.department))];

  const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'];
  const getAvatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm text-2xl">👥</span>
          Student Records
        </h2>
        <button className="btn-3d-primary text-sm flex items-center gap-2">
          <span>➕</span> Add New Student
        </button>
      </div>

      {/* Stats Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex-none px-5 py-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[150px]">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 text-sm font-bold">{students.length}</div>
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Total Students</span>
        </div>
        <div className="flex-none px-5 py-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[165px]">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 text-sm font-bold">{students.filter(s => s.face_registered).length}</div>
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Face Registered</span>
        </div>
        <div className="flex-none px-5 py-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[155px]">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 text-sm font-bold">{students.filter(s => !s.face_registered).length}</div>
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Pending Setup</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-3d pl-12 text-sm font-medium"
          />
        </div>
        <select
          className="input-3d text-sm font-medium sm:min-w-[180px]"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 flex items-center justify-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-500">Loading student records...</span>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">
            {searchTerm || filterDept !== 'all' ? 'No students match your filters.' : 'No students registered yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* ── MOBILE: Card List (hidden on md+) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                {/* Top row: avatar + name + badge */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-full flex-shrink-0 ${getAvatarColor(student.name)} flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">{student.name}</p>
                    <p className="mt-0.5">
                      <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">{student.student_id}</span>
                    </p>
                  </div>
                  {student.face_registered ? (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Registered
                    </span>
                  ) : (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending
                    </span>
                  )}
                </div>
                {/* Meta */}
                <div className="mb-3 space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    <span className="text-gray-700 font-semibold">{student.department}</span>
                    {student.year && <span> · Year {student.year}</span>}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{student.email}</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button className="flex-1 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    👁️ View
                  </button>
                  <button className="flex-1 py-2 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(student)}
                    className="flex-1 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP: Full Table (hidden on mobile) ── */}
          <div className="hidden md:block overflow-x-auto card-3d-modern !p-0">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Student ID</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Name</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Email</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Department</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Year</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Face Status</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                    <td className="p-4 align-middle">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{student.student_id}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(student.name)} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-sm text-gray-600 font-medium">{student.email}</td>
                    <td className="p-4 align-middle text-sm text-gray-600 font-medium">{student.department}</td>
                    <td className="p-4 align-middle text-sm text-gray-600 font-medium">Year {student.year}</td>
                    <td className="p-4 align-middle">
                      {student.face_registered ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-blue-100 shadow-sm" title="View Details">👁️</button>
                        <button className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors border border-amber-100 shadow-sm" title="Edit">✏️</button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100 shadow-sm"
                          title="Delete Student"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────── */}
      {deleteModal.open && deleteModal.student && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-[420px] text-center"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.2)', animation: 'fadeScale 0.2s ease-out' }}
          >
            {/* Result state (after action) */}
            {deleteResult ? (
              <>
                <div className={`text-5xl mb-4`}>{deleteResult.type === 'success' ? '✅' : '❌'}</div>
                <h3 className={`text-lg font-black mb-3 ${deleteResult.type === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {deleteResult.type === 'success' ? 'Deleted Successfully' : 'Delete Failed'}
                </h3>
                <p className="text-sm text-gray-500 font-medium whitespace-pre-line leading-relaxed mb-6">
                  {deleteResult.message}
                </p>
                <button
                  onClick={closeDeleteModal}
                  className="btn-3d-primary w-full py-3.5 rounded-2xl font-black text-sm"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                {/* Warning icon */}
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5 border border-rose-100">
                  🗑️
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Delete Student?</h3>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  You are about to permanently delete:
                </p>
                <div className="my-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="font-black text-gray-900 text-base">{deleteModal.student.name}</p>
                  <p className="text-xs font-mono text-rose-700 mt-1">{deleteModal.student.student_id}</p>
                  <p className="text-xs text-gray-500 mt-1">{deleteModal.student.email}</p>
                </div>
                <div className="text-left bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 text-xs text-amber-800 font-medium space-y-1">
                  <p className="font-bold text-amber-900 mb-1">⚠️ This will delete:</p>
                  <p>• Student profile from database</p>
                  {deleteModal.student.face_registered && <p>• {deleteModal.student.face_images_count || 'All'} face photo(s) from Cloudinary</p>}
                  <p>• All attendance records</p>
                  <p className="text-rose-700 font-bold mt-1">This action cannot be undone!</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-rose-600 hover:bg-rose-700 active:scale-95 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ boxShadow: '0 4px 15px rgba(225,29,72,0.35), 0 2px 5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                  >
                    {deleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      '🗑️ Delete Permanently'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentRecords;
