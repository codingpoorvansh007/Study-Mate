import { useState } from 'react';

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
  'Electronics', 'English', 'History', 'Other',
];
export const PRIORITIES = ['High', 'Medium', 'Low'];
export const STATUSES = ['Pending', 'In Progress', 'Completed'];

export const validate = (form) => {
  const errors = {};
  if (!form.title || form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (!form.subject) {
    errors.subject = 'Please select a subject';
  }
  if (!PRIORITIES.includes(form.priority)) {
    errors.priority = 'Please choose a priority';
  }
  if (!form.deadline) {
    errors.deadline = 'Please select a deadline';
  }
  return errors;
};

// Shared form used by the Add Task and Edit Task pages
export default function TaskForm({ initial, onSubmit, submitLabel, showStatus = false, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setServerError(err.message || 'Could not save the task');
      setSubmitting(false);
    }
  };

  const field = (name) => 'form-control' + (errors[name] ? ' is-invalid' : '');

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert alert-danger py-2">{serverError}</div>}

      <div className="mb-3">
        <label className="form-label fw-semibold">Title</label>
        <input name="title" className={field('title')} value={form.title} onChange={change}
          placeholder="e.g. Data Structures Assignment 3" />
        <div className="invalid-feedback">{errors.title}</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea name="description" rows="3" className="form-control" value={form.description}
          onChange={change} placeholder="Add any details, questions or requirements..." />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Subject</label>
          <select name="subject" className={'form-select' + (errors.subject ? ' is-invalid' : '')}
            value={form.subject} onChange={change}>
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="invalid-feedback">{errors.subject}</div>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Priority</label>
          <select name="priority" className="form-select" value={form.priority} onChange={change}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className={showStatus ? 'col-md-2' : 'col-md-4'}>
          <label className="form-label fw-semibold">Deadline</label>
          <input type="date" name="deadline" className={field('deadline')} value={form.deadline} onChange={change} />
          <div className="invalid-feedback">{errors.deadline}</div>
        </div>
        {showStatus && (
          <div className="col-md-2">
            <label className="form-label fw-semibold">Status</label>
            <select name="status" className="form-select" value={form.status} onChange={change}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline-primary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
