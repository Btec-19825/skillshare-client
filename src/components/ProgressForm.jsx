import React, { useState } from 'react';
import api from '../api/axiosConfig';

function ProgressForm({ onProgressAdded }) {
  const [username, setUsername] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const templates = [
    "Completed a tutorial",
    "Practiced for 30 minutes",
    "Learned a new concept",
    "Built a mini project"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const progress = {
      username,
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post('/progress', progress);
      setUsername('');
      setType('');
      setMessage('');
      onProgressAdded();
    } catch (err) {
      alert("Failed to save progress update.");
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title">Add Learning Progress</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Your name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select"  
              value={type}
              onChange={e => setType(e.target.value)}
              required
            >
              <option value="">Select a progress type</option>
              {templates.map((template, idx) => (
                <option key={idx} value={template}>{template}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Optional message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-success">Add Update</button>
        </form>
      </div>
    </div>
  );
}

export default ProgressForm;
