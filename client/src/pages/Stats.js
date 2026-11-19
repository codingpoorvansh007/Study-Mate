import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api, { errorMessage } from '../api';

function Bar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small mb-1">
        <span>{label}</span>
        <span className="fw-semibold">{value} task{value === 1 ? '' : 's'} ({pct}%)</span>
      </div>
      <div className="progress" style={{ height: 12 }}>
        <div className="progress-bar" style={{ width: pct + '%', background: color }} />
      </div>
    </div>
  );
}

export default function Stats() {
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tasks/stats').then((res) => setS(res.data)).catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h1 className="fw-bold">Task Statistics</h1>
        <p className="text-secondary mb-4">A visual summary of your overall progress.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        {!s && !error && <div className="spinner-border text-primary" role="status" />}
        {s && (
          <>
            <div className="row g-3 mb-4">
              {[
                ['Total Tasks', s.total, 'text-primary'],
                ['Completed', s.completed, 'text-success'],
                ['In Progress', s.inProgress, 'text-warning'],
                ['Pending', s.pending, 'text-danger'],
              ].map(([label, value, color]) => (
                <div className="col-6 col-md-3" key={label}>
                  <div className="card sm-card text-center h-100"><div className="card-body">
                    <div className={'stat-number ' + color}>{value}</div>
                    <div className="text-secondary small">{label}</div>
                  </div></div>
                </div>
              ))}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card sm-card h-100"><div className="card-body">
                  <h5 className="fw-bold mb-4">By Priority</h5>
                  <Bar label="High" value={s.byPriority.High} total={s.total} color="#dc2626" />
                  <Bar label="Medium" value={s.byPriority.Medium} total={s.total} color="#f59e0b" />
                  <Bar label="Low" value={s.byPriority.Low} total={s.total} color="#16a34a" />
                </div></div>
              </div>
              <div className="col-md-6">
                <div className="card sm-card h-100"><div className="card-body">
                  <h5 className="fw-bold mb-4">Overall Completion</h5>
                  <Bar label="Completed" value={s.completed} total={s.total} color="#4f46e5" />
                  <Bar label="In Progress" value={s.inProgress} total={s.total} color="#f59e0b" />
                  <Bar label="Pending" value={s.pending} total={s.total} color="#dc2626" />
                  {s.overdue > 0 && (
                    <div className="alert alert-warning py-2 small mb-0 mt-3">
                      You have {s.overdue} overdue task{s.overdue === 1 ? '' : 's'}.
                    </div>
                  )}
                </div></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
