require('dotenv').config();

const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.json({
    service: 'projectxplain-backend',
    message: 'Backend is running',
    health: '/api/health',
  });
});

app.use('/api', healthRoutes);

module.exports = app;