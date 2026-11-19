import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing">
      <header className="container d-flex justify-content-between align-items-center py-3">
        <span className="sm-logo">Study<span>Mate</span></span>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-primary">Log In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>
      <main className="container text-center landing-hero">
        <span className="badge badge-subject mb-3">YOUR ACADEMIC TASK MANAGER</span>
        <h1 className="display-3 fw-bold">Study<span className="text-primary">Mate</span></h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: 620 }}>
          Create, organize and track assignments, lab reports and deadlines in one simple dashboard.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/register" className="btn btn-primary btn-lg px-4">Get Started</Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg px-4">Log In</Link>
        </div>
      </main>
    </div>
  );
}
