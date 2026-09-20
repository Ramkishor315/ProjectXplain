require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const projectRoutes = require('./routes/projects');
const requirementRoutes = require('./routes/requirements');
const userStoryRoutes = require('./routes/userStories');
const databaseRoutes = require('./routes/database');
const apiRoutes = require('./routes/apis');
const architectureRoutes = require('./routes/architecture');
const dataFlowRoutes = require('./routes/dataFlow');
const cseConceptsRoutes = require('./routes/cseConcepts');
const mentorRoutes = require('./routes/mentor');

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
app.use('/api', projectRoutes);
app.use('/api', requirementRoutes);
app.use('/api', userStoryRoutes);
app.use('/api', databaseRoutes);
app.use('/api', apiRoutes);
app.use('/api', architectureRoutes);
app.use('/api', dataFlowRoutes);
app.use('/api', cseConceptsRoutes);
app.use('/api', mentorRoutes);

module.exports = app;