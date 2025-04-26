import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Modal, Button, Form } from 'react-bootstrap';

function ProgressList() {
  const [progressList, setProgressList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProgress, setEditProgress] = useState({
    id: '', username: '', type: '', message: ''
  });

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress');
      setProgressList(res.data);
    } catch (err) {
      alert("Failed to fetch progress updates.");
    }
  };

  const deleteProgress = async (id) => {
    try {
      await api.delete(`/progress/${id}`);
      fetchProgress();
    } catch (err) {
      alert("Failed to delete progress.");
    }
  };

  const handleEdit = (item) => {
    setEditProgress({ ...item });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/progress/${editProgress.id}`, {
        username: editProgress.username,
        type: editProgress.type,
        message: editProgress.message
      });
      setShowModal(false);
      fetchProgress();
    } catch (err) {
      alert("Failed to update progress.");
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const templates = [
    "Completed a tutorial",
    "Practiced for 30 minutes",
    "Learned a new concept",
    "Built a mini project"
  ];

  return (
    <div className="mt-4">
      <h3 className="mb-4">All Progress Updates</h3>
      {progressList.length === 0 && <p>No updates yet.</p>}

      {progressList.map((p) => (
        <div key={p.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-1">{p.type}</h5>
            <h6 className="card-subtitle text-muted mb-2">By: {p.username}</h6>
            {p.message && <p className="card-text">{p.message}</p>}
            <small className="text-muted">{new Date(p.timestamp).toLocaleString()}</small>
            <br />
            <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleEdit(p)}
                className="me-2 mt-3"
            >
                Edit
            </Button>
            <Button
                variant="outline-danger"
                size="sm"
                onClick={() => deleteProgress(p.id)}
                className="mt-3"
            >
                Delete
            </Button>
          </div>
        </div>
      ))}

      {/* Modal for Editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Progress Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editProgress.username}
                onChange={(e) => setEditProgress({ ...editProgress, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Progress Type</Form.Label>
              <Form.Select
                value={editProgress.type}
                onChange={(e) => setEditProgress({ ...editProgress, type: e.target.value })}
              >
                <option value="">Select type</option>
                {templates.map((template, i) => (
                  <option key={i} value={template}>{template}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editProgress.message}
                onChange={(e) => setEditProgress({ ...editProgress, message: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProgressList;
