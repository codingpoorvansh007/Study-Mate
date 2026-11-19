import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Please enter your full name';
    if (!EMAIL_RE.test(form.email)) found.email = 'Please enter a valid email';
    if (form.password.length < 6) found.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) found.confirm = 'Passwords do not match';
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    setServerError('');
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(errorMessage(err));
      setLoading(false);
    }
  };

  const cls = (n) => 'form-control' + (errors[n] ? ' is-invalid' : '');

  return (
    <div className="auth-wrap">
      <div className="card sm-card auth-card">
        <div className="card-body p-4">
          <h2 className="text-center fw-bold">Create your account</h2>
          <p className="text-center text-secondary">Join StudyMate and stay on top of your tasks.</p>
          {serverError && <div className="alert alert-danger py-2">{serverError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input name="name" className={cls('name')} value={form.name} onChange={change} />
              <div className="invalid-feedback">{errors.name}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input name="email" type="email" className={cls('email')} value={form.email} onChange={change} />
              <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input name="password" type="password" className={cls('password')} value={form.password} onChange={change} />
              <div className="invalid-feedback">{errors.password}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input name="confirm" type="password" className={cls('confirm')} value={form.confirm} onChange={change} />
              <div className="invalid-feedback">{errors.confirm}</div>
            </div>
            <button className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-center small text-secondary mt-3 mb-0">
            Already have an account? <Link to="/login" className="fw-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
