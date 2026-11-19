import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card sm-card auth-card">
        <div className="card-body p-4">
          <h2 className="text-center fw-bold">Welcome back</h2>
          <p className="text-center text-secondary">Log in to view your tasks.</p>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={change} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input name="password" type="password" className="form-control" value={form.password} onChange={change} />
            </div>
            <button className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="text-center small text-secondary mt-3 mb-0">
            New here? <Link to="/register" className="fw-semibold">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
