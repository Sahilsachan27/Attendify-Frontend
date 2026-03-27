import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function TrainModel() {
  const [training, setTraining] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTrain = async () => {
    setMessage('');
    setError('');
    setTraining(true);

    try {
      await adminAPI.trainModel();
      setMessage('Face recognition model trained successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Training failed');
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="card-3d-modern p-6 sm:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-2 sm:mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-sm text-indigo-600">
          🤖
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Train Model
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Update Facial Recognition Data
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 uppercase tracking-wider mb-4">
          <span>ℹ️</span> Training Instructions
        </h3>
        <ul className="text-sm text-blue-900/80 font-medium space-y-3 ml-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Ensure all students have face images uploaded before training.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Training may take a few minutes depending on the number of students.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Train the model explicitly after adding new students to the system.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            The model will be saved automatically upon successful training.
          </li>
        </ul>
      </div>

      <button
        onClick={handleTrain}
        disabled={training}
        className="w-full btn-3d-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {training ? (
          <>
            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            Training Model...
          </>
        ) : (
          <>🤖 Start Training Model</>
        )}
      </button>

      {message && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold text-center shadow-sm animate-fade-in">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold text-center shadow-sm animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}

export default TrainModel;
