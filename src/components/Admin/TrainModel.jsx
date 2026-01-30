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
    <div className="admin-section">
      <h2>Train Face Recognition Model</h2>
      
      <div className="train-info">
        <h3>ℹ️ Training Instructions</h3>
        <ul>
          <li>Ensure all students have face images uploaded</li>
          <li>Training may take a few minutes depending on the number of students</li>
          <li>Train the model after adding new students</li>
          <li>The model will be saved automatically after training</li>
        </ul>
      </div>

      <button
        onClick={handleTrain}
        disabled={training}
        className="btn-primary btn-large"
      >
        {training ? '⏳ Training Model...' : '🤖 Train Model'}
      </button>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default TrainModel;
