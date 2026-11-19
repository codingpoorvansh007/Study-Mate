import { Link } from 'react-router-dom';

const PRIORITY_CLASS = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
const STATUS_CLASS = { Pending: 'st-pending', 'In Progress': 'st-progress', Completed: 'st-done' };

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Returns a short label such as "Due Tomorrow" or "Overdue" for open tasks
export const dueLabel = (task) => {
  if (task.status === 'Completed') return null;
  const days = Math.ceil((new Date(task.deadline).setHours(23, 59, 59, 999) - Date.now()) / 86400000);
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due Today';
  if (days === 1) return 'Due Tomorrow';
  return null;
};

export default function TaskCard({ task, onDelete, onToggleDone, readOnly = false }) {
  const label = dueLabel(task);
  return (
    <div className="card sm-card mb-3">
      <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <div className={'fw-bold fs-6' + (task.status === 'Completed' ? ' text-decoration-line-through text-secondary' : '')}>
            {task.title}
          </div>
          {task.description && <div className="small text-secondary mt-1">{task.description}</div>}
          <div className="mt-2 d-flex flex-wrap align-items-center gap-2">
            <span className="badge badge-subject">{task.subject}</span>
            <span className={'badge ' + PRIORITY_CLASS[task.priority]}>{task.priority}</span>
            <span className="small text-secondary">Due: {formatDate(task.deadline)}</span>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className={'badge ' + (label === 'Overdue' ? 'st-overdue' : STATUS_CLASS[task.status])}>
            {label || task.status}
          </span>
          {!readOnly && (
            <>
              {task.status !== 'Completed' && (
                <button className="btn btn-sm btn-success" onClick={() => onToggleDone(task)}>Done</button>
              )}
              <Link className="btn btn-sm btn-outline-primary" to={`/tasks/${task._id}/edit`}>Edit</Link>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(task)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
