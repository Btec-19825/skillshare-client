import React, { useState } from 'react';
import api from '../api/axiosConfig';

function LearningPlanForm({ onPlanCreated }) {
  const [username, setUsername] = useState('');
  const [topic, setTopic] = useState('');
  const [resources, setResources] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Not Started');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/plans', {
        username, topic, resources, deadline, status
      });
      setUsername('');
      setTopic('');
      setResources('');
      setDeadline('');
      setStatus('Not Started');
      onPlanCreated();
    } catch {
      alert("Failed to create plan.");
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title">Create Learning Plan</h4>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Your name" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="form-control mb-2" placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} required />
          <textarea className="form-control mb-2" placeholder="Resources or Links" value={resources} onChange={e => setResources(e.target.value)} />
          <input className="form-control mb-2" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          <select className="form-select mb-2" value={status} onChange={e => setStatus(e.target.value)}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="btn btn-success">Create Plan</button>
        </form>
      </div>
    </div>
  );
}

export default LearningPlanForm;
