# Database Test Cases

This document defines the schema, referential integrity, and constraint test cases for the ProjectXplain MySQL database.

---

| Test ID | Test Target | Preconditions / Setup | Test Steps / Query | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-DB-01** | Table Auto-Creation | Clean database created | 1. Start Node.js backend (`backend/db/connection.js`)<br>2. Inspect MySQL tables via `SHOW TABLES;` | All 13 tables created (`projects`, `requirements`, `user_stories`, `database_entities`, `entity_attributes`, `entity_relationships`, `api_endpoints`, `architecture_components`, `architecture_connections`, `data_flow_steps`, `cse_subjects`, `cse_concepts`, `project_concepts`) | Verified: tables created automatically | **Pass** |
| **TC-DB-02** | Automatic Curriculum Seeding | Fresh tables created | 1. Query `SELECT COUNT(*) FROM cse_subjects;`<br>2. Query `SELECT COUNT(*) FROM cse_concepts;` | Exactly 5 subjects and 17 concepts seeded | Verified: 5 subjects, 17 concepts present | **Pass** |
| **TC-DB-03** | Project Cascade Deletion | Project exists with requirements, entities, and APIs | 1. Execute `DELETE FROM projects WHERE id = ?;`<br>2. Query child tables | Child records in `requirements`, `database_entities`, `api_endpoints`, `architecture_components`, `data_flow_steps`, `project_concepts` automatically deleted via `ON DELETE CASCADE` | Cascade verified on project deletion | **Pass** |
| **TC-DB-04** | Requirement Cascade Deletion | Requirement with 2 user stories | 1. Execute `DELETE FROM requirements WHERE id = ?;`<br>2. Query `user_stories` | Linked user stories automatically removed | Cascade deletion verified | **Pass** |
| **TC-DB-05** | Entity Cascade Deletion | Database entity with 3 attributes | 1. Execute `DELETE FROM database_entities WHERE id = ?;`<br>2. Query `entity_attributes` | Linked attributes removed | Cascade deletion verified | **Pass** |
| **TC-DB-06** | Component Cascade Deletion | Architecture component with active connections | 1. Execute `DELETE FROM architecture_components WHERE id = ?;`<br>2. Query `architecture_connections` | Connections linked as `from_component_id` or `to_component_id` removed | Cascade deletion verified | **Pass** |
| **TC-DB-07** | Data Flow Step Null Preservation | Data flow step referencing an `api_id` | 1. Execute `DELETE FROM api_endpoints WHERE id = ?;`<br>2. Query `data_flow_steps` | Flow step record remains intact; its `api_id` column is set to `NULL` via `ON DELETE SET NULL` | Not yet executed in formal regression | **Not yet executed** |
| **TC-DB-08** | Subject Name Uniqueness | Subject "DBMS" exists | 1. Attempt `INSERT INTO cse_subjects (name) VALUES ('DBMS');` | MySQL rejects insertion with `ER_DUP_ENTRY` error | Unique constraint on `name` enforced | **Pass** |
| **TC-DB-09** | Prevent Duplicate Concept Mapping | Concept 1 mapped to Project 1 | 1. Attempt `INSERT INTO project_concepts (project_id, concept_id) VALUES (1, 1);` a second time | Duplicate entry rejected by composite key `unique_project_concept` | Duplicate mapping prevented | **Pass** |
| **TC-DB-10** | SQL Injection Resistance | Backend API endpoint | 1. Send input: `name: "Project' OR '1'='1"` | Parameterized SQL query treats input strictly as literal string value; no syntax error or unauthorized data dump | Parameterized queries prevent injection | **Pass** |
