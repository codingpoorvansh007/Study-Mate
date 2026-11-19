import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import api, { errorMessage } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/tasks/stats'), api.get('/tasks')])
      .then(([s, t]) => {
        setStats(s.data);
        const open = t.data
          .filter((task) => task.status !== 'Completed')
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5);
        setUpcoming(open);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats && [
    { label: 'Total Tasks', value: stats.total, color: 'text-primary' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-warning' },
    { label: 'Due Soon', value: stats.dueSoon, color: 'text-danger' },
    { label: 'Completed', value: stats.completed, color: 'text-success' },
  ];

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h1 className="fw-bold">Hey, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-secondary mb-4">Here is a quick overview of your academic tasks.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="spinner-border text-primary" role="status" />}

        {stats && (
          <div className="row g-3 mb-4">
            {cards.map((c) => (
              <div className="col-6 col-md-3" key={c.label}>
                <div className="card sm-card text-center h-100">
                  <div className="card-body">
                    <div className={'stat-number ' + c.color}>{c.value}</div>
                    <div className="text-secondary small">{c.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Upcoming Tasks</h5>
              <Link to="/add-task" className="btn btn-primary btn-sm">+ Add Task</Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="card sm-card"><div className="card-body text-center text-secondary py-5">
                No upcoming tasks. <Link to="/add-task">Add your first task</Link>.
              </div></div>
            ) : (
              upcoming.map((t) => <TaskCard key={t._id} task={t} readOnly />)
            )}
          </>
        )}
      </div>
    </>
  );
}
