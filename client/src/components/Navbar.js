import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const link = ({ isActive }) => 'nav-link sm-link' + (isActive ? ' active-link' : '');

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom sm-nav">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand sm-logo">Study<span>Mate</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav mx-auto gap-md-3">
            <li className="nav-item"><NavLink to="/dashboard" className={link}>Dashboard</NavLink></li>
            <li className="nav-item"><NavLink to="/add-task" className={link}>Add Task</NavLink></li>
            <li className="nav-item"><NavLink to="/tasks" className={link}>My Tasks</NavLink></li>
            <li className="nav-item"><NavLink to="/stats" className={link}>Statistics</NavLink></li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="small text-secondary">{user?.name}</span>
            <button className="btn btn-sm btn-outline-primary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
