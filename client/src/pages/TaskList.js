import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { SUBJECTS, PRIORITIES, STATUSES } from '../components/TaskForm';
import api, { errorMessage } from '../api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ subject: '', priority: '', status: '' });
  const [sort, setSort] = useState('deadline');

  const load = () => {
    setLoading(true);
    api
      .get('/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.delete('/tasks/' + task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleDone = async (task) => {
    try {
      const res = await api.put('/tasks/' + task._id, { status: 'Completed' });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const shown = useMemo(() => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return tasks
      .filter((t) => (!filters.subject || t.subject === filters.subject)
        && (!filters.priority || t.priority === filters.priority)
        && (!filters.status || t.status === filters.status))
      .sort((a, b) =>
        sort === 'priority'
          ? order[a.priority] - order[b.priority]
          : new Date(a.deadline) - new Date(b.deadline));
  }, [tasks, filters, sort]);

  const set = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="fw-bold mb-1">My Tasks</h1>
            <p className="text-secondary">All your tasks, organized by subject and priority.</p>
          </div>
          <Link to="/add-task" className="btn btn-primary">+ Add Task</Link>
        </div>

        <div className="row g-2 mb-4">
          <div className="col-6 col-md-3">
            <select name="subject" className="form-select" value={filters.subject} onChange={set}>
              <option value="">All subjects</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select name="priority" className="form-select" value={filters.priority} onChange={set}>
              <option value="">All priorities</option>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select name="status" className="form-select" value={filters.status} onChange={set}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="deadline">Sort by deadline</option>
              <option value="priority">Sort by priority</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="spinner-border text-primary" role="status" />}

        {!loading && shown.length === 0 && (
          <div className="card sm-card"><div className="card-body text-center text-secondary py-5">
            {tasks.length === 0 ? 'You have no tasks yet.' : 'No tasks match these filters.'}
          </div></div>
        )}

        {shown.map((t) => (
          <TaskCard key={t._id} task={t} onDelete={handleDelete} onToggleDone={handleDone} />
        ))}
      </div>
    </>
  );
}
