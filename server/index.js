// server/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // Modern: use instead of body-parser

// ✅ API Routes
app.use('/api/employees', employeeRoutes);

// ✅ Serve frontend (static files)
app.use(express.static(path.join(__dirname, '..', 'client')));

// ✅ Default fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
