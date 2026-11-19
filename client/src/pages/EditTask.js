import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import api, { errorMessage } from '../api';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/tasks/' + id)
      .then((res) => {
        const t = res.data;
        setTask({
          title: t.title,
          description: t.description || '',
          subject: t.subject,
          priority: t.priority,
          status: t.status,
          deadline: new Date(t.deadline).toISOString().slice(0, 10), // yyyy-mm-dd
        });
      })
      .catch((err) => setError(errorMessage(err, 'Task not found')));
  }, [id]);

  const handleSubmit = async (form) => {
    try {
      await api.put('/tasks/' + id, form);
      navigate('/tasks');
    } catch (err) {
      throw new Error(errorMessage(err));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4 d-flex justify-content-center">
        <div className="card sm-card w-100" style={{ maxWidth: 700 }}>
          <div className="card-body p-4">
            <h2 className="fw-bold">Edit Task</h2>
            <p className="text-secondary">Update details or mark the task as completed.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            {!task && !error && <div className="spinner-border text-primary" role="status" />}
            {task && (
              <TaskForm
                initial={task}
                onSubmit={handleSubmit}
                submitLabel="Save Changes"
                showStatus
                onCancel={() => navigate('/tasks')}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
