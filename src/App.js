import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import ProgressForm from './components/ProgressForm';
import ProgressList from './components/ProgressList';
import LearningPlanForm from './components/LearningPlanForm';
import LearningPlanList from './components/LearningPlanList';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/user", { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data.name))
      .catch(() => setUser(null));
  }, []);

  // const location = window.location.pathname;
  // if (!user && location !== '/login') {
  //   window.location.href = '/';
  // }

  return (
    <Router>
      {user && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
          <Link className="navbar-brand" to="/">SkillShare</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Posts</Link>
            <Link className="nav-link" to="/progress">Progress Updates</Link>
            <Link className="nav-link" to="/plans">Learning Plan Sharing</Link>
          </div>
          <div className="ms-auto">
            <span className="me-3">Logged in as <strong>{user}</strong></span>
            <a href="http://localhost:8080/logout" className="btn btn-outline-danger btn-sm">Logout</a>
          </div>
        </nav>
      )}

      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />

          {user && (
            <>
              <Route path="/" element={
                <>
                  <h2>Skill Sharing Posts</h2>
                  <PostForm onPostCreated={() => {}} />
                  <PostList user={user} />
                </>
              } />
              <Route path="/progress" element={
                <>
                  <h2>Learning Progress</h2>
                  <ProgressForm onProgressAdded={() => {}} />
                  <ProgressList />
                </>
              } />
              <Route path="/plans" element={
                <>
                  <h2>Learning Plan Sharing</h2>
                  <LearningPlanForm onPlanCreated={() => {}} />
                  <LearningPlanList />
                </>
              } />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
