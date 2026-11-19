const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set in the environment.');
  process.exit(1);
}

const app = express();

const origins = (process.env.CLIENT_URL || '*').split(',').map((s) => s.trim());
app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/api', (req, res) => res.json({ name: 'StudyMate API', status: 'running' }));
app.get('/api/healthz', (req, res) => res.json({ status: 'ok' }));

// Optional: serve the built React app from the same server (single deployment)
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('StudyMate server running on port ' + PORT));
