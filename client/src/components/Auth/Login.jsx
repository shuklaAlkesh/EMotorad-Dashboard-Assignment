
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FiMail, FiLock, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import api from '../../utils/axios';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google login success, sending credential to server');
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });
      console.log('Server response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      setError('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="auth-page">
      <div className="brand-column">
        <div className="brand-wrapper">
          <h1 className="brand-title">Welcome to Emotorad Dashboard Assignment</h1>
          <div className="social-icons">
            <FiGithub />
            <FiTwitter />
            <FiLinkedin />
          </div>
        </div>
      </div>
      <div className="form-column">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Welcome Back</h1>
            <p>Sign in to continue</p>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <div className="input-icon">
                  <FiMail className="icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon">
                  <FiLock className="icon" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="auth-button">Sign In</button>
            </form>

            {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="google-auth-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                type="standard"
                theme="filled_blue"
                size="large"
                width="250"
              />
            </div>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
