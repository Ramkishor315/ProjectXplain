const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((error) => {
  if (error) {
    console.log('Database connection failed:', error.message);
    return;
  }

  console.log('MySQL connected successfully');

  // Ensure requirements table exists
  const createRequirementsTableQuery = `
    CREATE TABLE IF NOT EXISTS requirements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      priority VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `;

  connection.query(createRequirementsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring requirements table exists:', err.message);
    }
  });

  // Ensure user_stories table exists
  const createUserStoriesTableQuery = `
    CREATE TABLE IF NOT EXISTS user_stories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      requirement_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requirement_id) REFERENCES requirements(id) ON DELETE CASCADE
    )
  `;

  connection.query(createUserStoriesTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring user_stories table exists:', err.message);
    }
  });

  // Ensure database_entities table exists (Feature 5)
  const createEntitiesTableQuery = `
    CREATE TABLE IF NOT EXISTS database_entities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `;

  connection.query(createEntitiesTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring database_entities table exists:', err.message);
    }
  });

  // Ensure entity_attributes table exists (Feature 5)
  const createAttributesTableQuery = `
    CREATE TABLE IF NOT EXISTS entity_attributes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      entity_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      data_type VARCHAR(50) NOT NULL,
      key_type VARCHAR(50) DEFAULT 'None',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entity_id) REFERENCES database_entities(id) ON DELETE CASCADE
    )
  `;

  connection.query(createAttributesTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring entity_attributes table exists:', err.message);
    }
  });

  // Ensure entity_relationships table exists (Feature 5)
  const createRelationshipsTableQuery = `
    CREATE TABLE IF NOT EXISTS entity_relationships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      from_entity_id INT NOT NULL,
      to_entity_id INT NOT NULL,
      relationship_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (from_entity_id) REFERENCES database_entities(id) ON DELETE CASCADE,
      FOREIGN KEY (to_entity_id) REFERENCES database_entities(id) ON DELETE CASCADE
    )
  `;

  connection.query(createRelationshipsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring entity_relationships table exists:', err.message);
    }
  });

  // Ensure api_endpoints table exists (Feature 6)
  const createApiEndpointsTableQuery = `
    CREATE TABLE IF NOT EXISTS api_endpoints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      method VARCHAR(20) NOT NULL,
      endpoint VARCHAR(255) NOT NULL,
      description TEXT,
      request_body TEXT,
      response_body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `;

  connection.query(createApiEndpointsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring api_endpoints table exists:', err.message);
    }
  });
});

module.exports = connection;