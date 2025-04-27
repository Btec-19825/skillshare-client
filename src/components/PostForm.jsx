import React, { useState } from 'react';
import api from '../api/axiosConfig';

function PostForm({ onPostCreated }) {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setFiles(selected);
    const previews = selected.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let mediaUrls = [];

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));

      try {
        const uploadRes = await api.post('/posts/upload', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        mediaUrls = uploadRes.data;
      } catch (err) {
        alert("Failed to upload media files.");
        return;
      }
    }

    try {
      await api.post('/posts', {  
        username,
        title,
        description,
        mediaUrls,
      });

      setUsername('');
      setTitle('');
      setDescription('');
      setFiles([]);
      setPreviewUrls([]);
      onPostCreated();
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title">Share a Skill</h4>
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
            <input
              className="form-control"
              type="text"
              placeholder="Skill Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Skill Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="file"
              multiple
              accept="image/*,video/mp4"
              onChange={handleFilesChange}
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="mb-3 d-flex flex-wrap gap-3">
              {previewUrls.map((url, index) => (
                <div key={index}>
                  {url.endsWith(".mp4") ? (
                    <video width="200" controls src={url}></video>
                  ) : (
                    <img src={url} alt={`media-${index}`} width="200" className="img-thumbnail" />
                  )}
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary">Post</button>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
