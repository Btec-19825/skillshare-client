import React from 'react';

function Login() {
  return (
    <div className="container mt-5 text-center">
      <h3 className="mb-4">Welcome to SkillShare App</h3>
      <a href="http://localhost:8080/oauth2/authorization/google" className="btn btn-primary">
        Login with Google
      </a>
    </div>   
  );
}

export default Login;
