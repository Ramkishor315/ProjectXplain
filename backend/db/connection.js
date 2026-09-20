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

  // Ensure architecture_components table exists (Feature 7)
  const createArchitectureComponentsTableQuery = `
    CREATE TABLE IF NOT EXISTS architecture_components (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `;

  connection.query(createArchitectureComponentsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring architecture_components table exists:', err.message);
    }
  });

  // Ensure architecture_connections table exists (Feature 7)
  const createArchitectureConnectionsTableQuery = `
    CREATE TABLE IF NOT EXISTS architecture_connections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      from_component_id INT NOT NULL,
      to_component_id INT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (from_component_id) REFERENCES architecture_components(id) ON DELETE CASCADE,
      FOREIGN KEY (to_component_id) REFERENCES architecture_components(id) ON DELETE CASCADE
    )
  `;

  connection.query(createArchitectureConnectionsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring architecture_connections table exists:', err.message);
    }
  });

  // Ensure data_flow_steps table exists (Feature 8)
  const createDataFlowStepsTableQuery = `
    CREATE TABLE IF NOT EXISTS data_flow_steps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      step_number INT NOT NULL,
      from_component_id INT NOT NULL,
      to_component_id INT NOT NULL,
      api_id INT NULL,
      action VARCHAR(150) NOT NULL,
      method VARCHAR(30),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (from_component_id) REFERENCES architecture_components(id) ON DELETE CASCADE,
      FOREIGN KEY (to_component_id) REFERENCES architecture_components(id) ON DELETE CASCADE,
      FOREIGN KEY (api_id) REFERENCES api_endpoints(id) ON DELETE SET NULL
    )
  `;

  connection.query(createDataFlowStepsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring data_flow_steps table exists:', err.message);
    }
  });

  // Ensure cse_subjects table exists (Feature 9)
  const createCseSubjectsTableQuery = `
    CREATE TABLE IF NOT EXISTS cse_subjects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    )
  `;

  connection.query(createCseSubjectsTableQuery, (err) => {
    if (err) {
      console.error('Error ensuring cse_subjects table exists:', err.message);
      return;
    }

    // Ensure cse_concepts table exists (Feature 9)
    const createCseConceptsTableQuery = `
      CREATE TABLE IF NOT EXISTS cse_concepts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        explanation TEXT NOT NULL,
        project_relevance TEXT NOT NULL,
        project_usage TEXT NOT NULL,
        what_to_learn TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES cse_subjects(id) ON DELETE CASCADE
      )
    `;

    connection.query(createCseConceptsTableQuery, (err) => {
      if (err) {
        console.error('Error ensuring cse_concepts table exists:', err.message);
        return;
      }

      // Ensure project_concepts table exists (Feature 9)
      const createProjectConceptsTableQuery = `
        CREATE TABLE IF NOT EXISTS project_concepts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          concept_id INT NOT NULL,
          reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          FOREIGN KEY (concept_id) REFERENCES cse_concepts(id) ON DELETE CASCADE,
          UNIQUE KEY unique_project_concept (project_id, concept_id)
        )
      `;

      connection.query(createProjectConceptsTableQuery, (err) => {
        if (err) {
          console.error('Error ensuring project_concepts table exists:', err.message);
          return;
        }

        // Seed initial CSE Subjects and Concepts if empty
        seedCseData(connection);
      });
    });
  });
});

// Helper function to seed predefined CSE subjects and concepts (Feature 9)
function seedCseData(con) {
  con.query('SELECT COUNT(*) AS count FROM cse_subjects', (err, rows) => {
    if (err) {
      console.error('Error checking cse_subjects count:', err.message);
      return;
    }

    if (rows && rows[0] && rows[0].count > 0) {
      // Data already seeded
      return;
    }

    const subjects = [
      'DBMS',
      'Computer Networks',
      'OOPS',
      'Operating Systems',
      'System Design',
    ];

    const subjectValues = subjects.map((s) => [s]);
    con.query('INSERT INTO cse_subjects (name) VALUES ?', [subjectValues], (err) => {
      if (err) {
        console.error('Error seeding cse_subjects:', err.message);
        return;
      }

      con.query('SELECT id, name FROM cse_subjects', (err, subRows) => {
        if (err || !subRows) {
          console.error('Error fetching seeded subjects:', err ? err.message : 'No rows');
          return;
        }

        const subjectMap = {};
        subRows.forEach((r) => {
          subjectMap[r.name] = r.id;
        });

        const concepts = [
          // DBMS
          {
            subject: 'DBMS',
            name: 'Relational Database',
            explanation: 'A relational database stores structured data in tables consisting of rows and columns.',
            project_relevance: 'ProjectXplain uses MySQL to store structured project information such as projects, requirements, user stories, APIs, architecture components and data-flow steps.',
            project_usage: 'Database Design and MySQL tables.',
            what_to_learn: '• Tables\n• Rows and columns\n• Relational model\n• SQL',
          },
          {
            subject: 'DBMS',
            name: 'Primary Key',
            explanation: 'A primary key uniquely identifies each record in a table.',
            project_relevance: 'ProjectXplain tables use ID fields to uniquely identify projects, requirements, APIs, components and other records.',
            project_usage: 'id columns in the database tables.',
            what_to_learn: '• Primary keys\n• Uniqueness\n• AUTO_INCREMENT',
          },
          {
            subject: 'DBMS',
            name: 'Foreign Key',
            explanation: 'A foreign key creates a relationship between records in different tables.',
            project_relevance: 'ProjectXplain uses relationships such as project_id, requirement_id and component IDs to connect related data.',
            project_usage: 'projects → requirements → user_stories\nprojects → APIs\nprojects → architecture components',
            what_to_learn: '• Foreign keys\n• Referential integrity\n• Parent-child relationships',
          },
          {
            subject: 'DBMS',
            name: 'Database Relationships',
            explanation: 'Tables can be related using relationships such as one-to-one, one-to-many and many-to-many.',
            project_relevance: 'ProjectXplain uses relationships between projects and their requirements, user stories, APIs, architecture components and flow steps.',
            project_usage: 'Database Design feature.',
            what_to_learn: '• One-to-one\n• One-to-many\n• Many-to-many',
          },
          {
            subject: 'DBMS',
            name: 'SQL',
            explanation: 'SQL is used to create, read, update and delete structured data in relational databases.',
            project_relevance: 'The ProjectXplain backend uses SQL queries to interact with MySQL.',
            project_usage: 'Backend database operations.',
            what_to_learn: '• SELECT\n• INSERT\n• UPDATE\n• DELETE\n• WHERE\n• JOIN',
          },

          // COMPUTER NETWORKS
          {
            subject: 'Computer Networks',
            name: 'HTTP',
            explanation: 'HTTP is the protocol used for communication between clients and servers on the web.',
            project_relevance: 'The React frontend communicates with the Node.js backend using HTTP requests.',
            project_usage: 'Frontend → Backend communication.',
            what_to_learn: '• HTTP request\n• HTTP response\n• Headers\n• Status codes',
          },
          {
            subject: 'Computer Networks',
            name: 'HTTP Methods',
            explanation: 'HTTP methods describe the type of operation a client wants to perform.',
            project_relevance: 'ProjectXplain APIs use methods such as GET, POST and DELETE.',
            project_usage: 'API Design feature.',
            what_to_learn: '• GET\n• POST\n• PUT\n• PATCH\n• DELETE',
          },
          {
            subject: 'Computer Networks',
            name: 'REST API',
            explanation: 'A REST API provides a structured way for applications to communicate using HTTP.',
            project_relevance: 'ProjectXplain\'s backend exposes REST-style endpoints for projects, requirements, APIs, architecture and data flow.',
            project_usage: 'Backend API routes.',
            what_to_learn: '• Resources\n• Endpoints\n• HTTP methods\n• Request/response',
          },
          {
            subject: 'Computer Networks',
            name: 'Client-Server Architecture',
            explanation: 'A client requests services and a server processes those requests and returns responses.',
            project_relevance: 'React acts as the client and Node.js/Express acts as the server.',
            project_usage: 'Overall ProjectXplain architecture.',
            what_to_learn: '• Client\n• Server\n• Request\n• Response',
          },

          // OOPS
          {
            subject: 'OOPS',
            name: 'Encapsulation',
            explanation: 'Encapsulation means keeping related data and behavior together and controlling how they are accessed.',
            project_relevance: 'Frontend components encapsulate UI structure and behavior.',
            project_usage: 'React components.',
            what_to_learn: '• Classes\n• Objects\n• Data hiding\n• Methods',
          },
          {
            subject: 'OOPS',
            name: 'Abstraction',
            explanation: 'Abstraction hides unnecessary implementation details and exposes only what is needed.',
            project_relevance: 'Reusable frontend components and backend functions hide implementation details from other parts of the application.',
            project_usage: 'Reusable React components and backend functions.',
            what_to_learn: '• Interfaces\n• Abstraction\n• Reusable components',
          },
          {
            subject: 'OOPS',
            name: 'Modularity',
            explanation: 'Modularity means dividing a large system into smaller independent modules.',
            project_relevance: 'ProjectXplain separates frontend pages, components, backend routes, controllers and database logic.',
            project_usage: 'Project folder structure.',
            what_to_learn: '• Modules\n• Separation of concerns\n• Maintainability',
          },

          // OPERATING SYSTEMS
          {
            subject: 'Operating Systems',
            name: 'Process',
            explanation: 'A process is a program that is currently being executed by the operating system.',
            project_relevance: 'When ProjectXplain\'s frontend development server and backend server run, they execute as processes managed by the operating system.',
            project_usage: 'Running Vite and Node.js.',
            what_to_learn: '• Process\n• Program\n• Process lifecycle',
          },
          {
            subject: 'Operating Systems',
            name: 'Concurrency',
            explanation: 'Concurrency allows multiple tasks to make progress during overlapping periods of time.',
            project_relevance: 'The application can handle multiple requests and operations while the server is running.',
            project_usage: 'Backend server request handling.',
            what_to_learn: '• Concurrency\n• Threads\n• Asynchronous operations',
          },

          // SYSTEM DESIGN
          {
            subject: 'System Design',
            name: 'Layered Architecture',
            explanation: 'A system can be divided into layers where each layer has a specific responsibility.',
            project_relevance: 'ProjectXplain separates frontend, backend and database responsibilities.',
            project_usage: 'React → Express → MySQL.',
            what_to_learn: '• Presentation layer\n• Application/backend layer\n• Data layer',
          },
          {
            subject: 'System Design',
            name: 'Component-Based Design',
            explanation: 'A large system can be divided into smaller reusable components.',
            project_relevance: 'ProjectXplain uses reusable React components and separate backend modules.',
            project_usage: 'Frontend components and backend modules.',
            what_to_learn: '• Components\n• Reusability\n• Separation of concerns',
          },
          {
            subject: 'System Design',
            name: 'Data Flow',
            explanation: 'Data flow describes how information moves between different components of a system.',
            project_relevance: 'ProjectXplain documents request/data flow between frontend, backend and database.',
            project_usage: 'Request / Data Flow feature.',
            what_to_learn: '• Data movement\n• Request/response\n• System interactions',
          },
        ];

        const conceptValues = concepts.map((c) => [
          subjectMap[c.subject],
          c.name,
          c.explanation,
          c.project_relevance,
          c.project_usage,
          c.what_to_learn,
        ]);

        con.query(
          'INSERT INTO cse_concepts (subject_id, name, explanation, project_relevance, project_usage, what_to_learn) VALUES ?',
          [conceptValues],
          (err) => {
            if (err) {
              console.error('Error seeding cse_concepts:', err.message);
            } else {
              console.log('Successfully seeded CSE subjects and 17 core concepts.');
            }
          }
        );
      });
    });
  });
}

module.exports = connection;