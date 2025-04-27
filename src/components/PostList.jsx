import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Modal, Button, Form } from 'react-bootstrap';

function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState({
    id: '', username: '', title: '', description: '', mediaUrls: []
  });
  const [newFiles, setNewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      alert('Failed to fetch posts.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  const handleEdit = (post) => {
    setEditPost({ ...post });
    setNewFiles([]);
    setPreviewUrls([]);
    setShowModal(true);
  };

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setNewFiles(selected);
    const previews = selected.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleSaveEdit = async () => {
    let updatedMediaUrls = editPost.mediaUrls;

    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach(file => formData.append("files", file));

      try {
        const uploadRes = await api.post('/posts/upload', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        updatedMediaUrls = uploadRes.data;
      } catch (err) {
        alert("Failed to upload new media.");
        return;
      }
    }

    try {
      await api.put(`/posts/${editPost.id}`, {
        username: editPost.username,
        title: editPost.title,
        description: editPost.description,
        mediaUrls: updatedMediaUrls
      });
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      alert("Failed to update post.");
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const username = e.target.username.value;
    const message = e.target.message.value;
    if (!username || !message) return;
    await api.post(`/posts/${postId}/comments`, { username, message });
    fetchPosts();
    e.target.reset();
  };

  const handleCommentUpdate = async (postId, commentId, currentMessage) => {
    const updated = prompt("Edit your comment:", currentMessage);
    if (updated)
      await api.put(`/posts/${postId}/comments/${commentId}`, { message: updated });
    fetchPosts();
  };

  const handleCommentDelete = async (postId, commentId) => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
    fetchPosts();
  };
    
  const handleReaction = async (postId, action) => {
    try {
      await api.put(`/posts/${postId}/${action}`, { username: user });
      fetchPosts();
    } catch {
      alert(`Failed to ${action} post.`);
    }
  };

  return (
    <div>
      <h3 className="mb-4">All Skill Posts</h3>
      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div key={post.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">By: {post.username}</h6>
            <p className="card-text">{post.description}</p>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="row">
                {post.mediaUrls.map((url, index) => (
                  <div key={index} className="col-md-4 mb-2">
                    {url.endsWith('.mp4') ? (
                      <video width="100%" controls>
                        <source src={`http://localhost:8080${url}`} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:8080${url}`}
                        alt={`media-${index}`}
                        className="img-fluid rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="outline-success" onClick={() => handleReaction(post.id, "like")}>
                👍 Like ({post.likes || 0})
              </Button>

              <Button size="sm" variant="outline-secondary" onClick={() => handleReaction(post.id, "unlike")}> 
                👎 Unlike ({post.unlikes || 0})
              </Button>

              <Button size="sm" variant="outline-primary" onClick={() => handleEdit(post)}>
                Edit
              </Button>

              <Button size="sm" variant="outline-danger" onClick={() => deletePost(post.id)}>
                Delete
              </Button>
            </div>

            <Form className="mt-4" onSubmit={(e) => handleCommentSubmit(e, post.id)}>
              <Form.Group className="mb-2">
                <Form.Control name="username" placeholder="Your name" required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control name="message" placeholder="Write a comment..." required />
              </Form.Group>
              <Button type="submit" size="sm" variant="primary">Comment</Button>
            </Form>

            <div className="mt-3">
              <h6>Comments</h6>
              {post.comments && post.comments.length === 0 && <p className="text-muted">No comments yet.</p>}
              {post.comments && post.comments.map((c, i) => (
                <div key={i} className="border rounded p-2 mb-2">
                  <strong>{c.username}</strong> <span className="text-muted small">({new Date(c.timestamp).toLocaleString()})</span>
                  <p className="mb-1">{c.message}</p>
                  <>
                    <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => handleCommentUpdate(post.id, c.id, c.message)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleCommentDelete(post.id, c.id)}>Delete</Button>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={editPost.username} onChange={(e) => setEditPost({ ...editPost, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={editPost.title} onChange={(e) => setEditPost({ ...editPost, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={editPost.description} onChange={(e) => setEditPost({ ...editPost, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Replace Media (max 3)</Form.Label>
              <Form.Control type="file" multiple accept="image/*,video/mp4" onChange={handleFilesChange} />
            </Form.Group>
            {previewUrls.length > 0 && (
              <div className="d-flex flex-wrap gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index}>
                    {url.endsWith(".mp4") ? (
                      <video width="200" controls src={url}></video>
                    ) : (
                      <img src={url} alt={`preview-${index}`} width="200" className="img-thumbnail" />
                    )}
                  </div>
                ))}
              </div>
            )}
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

export default PostList;
