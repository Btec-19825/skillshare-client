import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Modal, Button, Form } from 'react-bootstrap';

function LearningPlanList() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState({
    id: '', username: '', topic: '', resources: '', deadline: '', status: ''
  });

  const fetchPlans = async () => {
    const res = await api.get('/plans');
    setPlans(res.data);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleDelete = async (id) => {
    await api.delete(`/plans/${id}`);
    fetchPlans();
  };

  const handleEdit = (plan) => {
    setEditPlan({ ...plan });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    await api.put(`/plans/${editPlan.id}`, editPlan);
    setShowModal(false);
    fetchPlans();
  };

  return (
    <div>
      <h3 className="mb-4">Your Learning Plans</h3>
      {plans.map(p => (
        <div key={p.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{p.topic}</h5>
            <h6 className="card-subtitle text-muted">By: {p.username}</h6>
            <p className="card-text"><strong>Resources:</strong> {p.resources}</p>
            <p className="card-text"><strong>Deadline:</strong> {p.deadline}</p>
            <p className="card-text"><strong>Status:</strong> {p.status}</p>
            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(p)} className="me-2 mt-3">Edit</Button>
            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)} className="mt-3">Delete</Button>
          </div>
        </div>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Learning Plan</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control className="mb-2" value={editPlan.username} onChange={e => setEditPlan({ ...editPlan, username: e.target.value })} placeholder="Username" />
            <Form.Control className="mb-2" value={editPlan.topic} onChange={e => setEditPlan({ ...editPlan, topic: e.target.value })} placeholder="Topic" />
            <Form.Control className="mb-2" as="textarea" value={editPlan.resources} onChange={e => setEditPlan({ ...editPlan, resources: e.target.value })} placeholder="Resources" />
            <Form.Control className="mb-2" type="date" value={editPlan.deadline} onChange={e => setEditPlan({ ...editPlan, deadline: e.target.value })} />
            <Form.Select className="mb-2" value={editPlan.status} onChange={e => setEditPlan({ ...editPlan, status: e.target.value })}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Form.Select>
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

export default LearningPlanList;
