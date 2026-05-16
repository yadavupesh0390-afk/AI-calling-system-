require('dotenv').config();
const authRoutes = require('./routes/auth');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(morgan('dev'));

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Calling System Running Successfully'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found'
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
========================================
🚀 AI Calling System Started
🌐 Port: ${PORT}
📅 Time: ${new Date().toLocaleString()}
========================================
  `);
});
