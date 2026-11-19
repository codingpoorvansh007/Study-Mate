import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import TaskList from './pages/TaskList';
import Stats from './pages/Stats';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-task" element={<PrivateRoute><AddTask /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
        <Route path="/tasks/:id/edit" element={<PrivateRoute><EditTask /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
