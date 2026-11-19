import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import api, { errorMessage } from '../api';

export default function AddTask() {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    try {
      await api.post('/tasks', form);
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
            <h2 className="fw-bold">Add New Task</h2>
            <p className="text-secondary">Fill in the details of your assignment.</p>
            <TaskForm
              initial={{ title: '', description: '', subject: '', priority: 'Medium', deadline: '' }}
              onSubmit={handleSubmit}
              submitLabel="Add Task"
            />
          </div>
        </div>
      </div>
    </>
  );
}
