# Backend REST API Test Cases

This document defines the direct HTTP test cases for the ProjectXplain backend API server (`http://localhost:4000/api`).

---

| Test ID | Endpoint & Method | Payload / Params | Expected Status | Expected Response Body | Actual Result | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :---: |
| **TC-API-01** | `GET /api/health` | None | `200 OK` | `{"status":"ok","service":"projectxplain-backend"}` | Confirmed running in dev | **Pass** |
| **TC-API-02** | `POST /api/projects` | `{"name":"Demo","idea":"Test idea"}` | `201 Created` | `{"message":"Project created successfully","project":{"id":X,...}}` | Project created and ID returned | **Pass** |
| **TC-API-03** | `POST /api/projects` | `{"name":"","idea":"Test"}` | `400 Bad Request` | `{"error":"Project name and idea are required"}` | Returns 400 with error message | **Pass** |
| **TC-API-04** | `GET /api/projects` | None | `200 OK` | Array of project objects ordered by `created_at DESC` | Array returned with projects | **Pass** |
| **TC-API-05** | `GET /api/projects/:id` | Valid ID (e.g., `1`) | `200 OK` | Single project object | Project record returned | **Pass** |
| **TC-API-06** | `GET /api/projects/:id` | Non-existent ID (`99999`) | `404 Not Found` | `{"error":"Project not found"}` | Returns 404 with error message | **Pass** |
| **TC-API-07** | `POST /api/projects/:projectId/requirements` | `{"title":"R1","description":"D1","priority":"High"}` | `201 Created` | Requirement object with `id` | Requirement inserted | **Pass** |
| **TC-API-08** | `GET /api/projects/:projectId/requirements` | Valid `projectId` | `200 OK` | Array of requirement records | Array of requirements returned | **Pass** |
| **TC-API-09** | `DELETE /api/requirements/:id` | Valid `id` | `200 OK` | `{"message":"Requirement deleted successfully"}` | Requirement deleted from DB | **Pass** |
| **TC-API-10** | `POST /api/requirements/:requirementId/user-stories` | `{"title":"Story 1","description":"As a user..."}` | `201 Created` | User story object with `id` | Story created under requirement | **Pass** |
| **TC-API-11** | `GET /api/requirements/:requirementId/user-stories` | Valid `requirementId` | `200 OK` | Array of user stories | Array of stories returned | **Pass** |
| **TC-API-12** | `DELETE /api/user-stories/:id` | Valid `id` | `200 OK` | `{"message":"User story deleted successfully"}` | Story deleted | **Pass** |
| **TC-API-13** | `POST /api/projects/:projectId/entities` | `{"name":"users","description":"User accounts"}` | `201 Created` | Entity object with `id` | Entity created in DB | **Pass** |
| **TC-API-14** | `POST /api/entities/:entityId/attributes` | `{"name":"email","data_type":"VARCHAR(100)","key_type":"None"}` | `201 Created` | Attribute object with `id` | Attribute attached to entity | **Pass** |
| **TC-API-15** | `POST /api/projects/:projectId/relationships` | `{"from_entity_id":1,"to_entity_id":2,"relationship_type":"One-to-Many"}` | `201 Created` | Relationship object with `id` | Relationship stored | **Pass** |
| **TC-API-16** | `POST /api/projects/:projectId/apis` | `{"name":"List Users","method":"GET","endpoint":"/api/users"}` | `201 Created` | Documented API record with `id` | API record persisted | **Pass** |
| **TC-API-17** | `POST /api/projects/:projectId/architecture/components` | `{"name":"React Client","type":"Frontend","description":"UI"}` | `201 Created` | Component object with `id` | Component inserted | **Pass** |
| **TC-API-18** | `POST /api/projects/:projectId/architecture/connections` | `{"from_component_id":1,"to_component_id":2,"description":"REST"}` | `201 Created` | Connection record with `id` | Connection created | **Pass** |
| **TC-API-19** | `POST /api/projects/:projectId/data-flow` | `{"step_number":1,"from_component_id":1,"to_component_id":2,"action":"Fetch"}` | `201 Created` | Flow step record with `id` | Step record saved | **Pass** |
| **TC-API-20** | `GET /api/cse-concepts/subjects` | None | `200 OK` | Array containing 5 subjects (DBMS, Networks, OOPS, OS, System Design) | 5 subjects returned | **Pass** |
| **TC-API-21** | `GET /api/cse-concepts` | None | `200 OK` | Array containing 17 core concepts with explanations | 17 concepts returned | **Pass** |
| **TC-API-22** | `POST /api/projects/:projectId/cse-concepts` | `{"concept_id":1,"reason":"Used in MySQL tables"}` | `201 Created` | Concept mapping record | Mapping record saved | **Pass** |
| **TC-API-23** | `POST /api/projects/:projectId/mentor` (Valid) | `{"question":"How are foreign keys used in my project?"}` | `200 OK` | `{"answer":"In your project, foreign keys connect..."}` | Detailed answer generated | **Pass** |
| **TC-API-24** | `POST /api/projects/:projectId/mentor` (Missing Q) | `{"question":""}` | `400 Bad Request` | `{"error":"Please enter a question for the AI Mentor"}` | Returns 400 bad request | **Pass** |
| **TC-API-25** | `POST /api/projects/:projectId/mentor` (Invalid ID) | `projectId="abc"` | `400 Bad Request` | `{"error":"Invalid project ID"}` | Returns 400 bad request | **Pass** |
| **TC-API-26** | `POST /api/projects/:projectId/mentor` (No API Key) | Valid Q, `OPENROUTER_API_KEY=""` | `500 Internal Server Error` | `{"error":"AI Mentor service is not configured (missing OPENROUTER_API_KEY)"}` | Not yet executed in formal regression | **Not yet executed** |
| **TC-API-27** | `POST /api/projects/:projectId/mentor` (Upstream Fail) | Valid Q, invalid OpenRouter endpoint | `500 Internal Server Error` | `{"error":"<Upstream error message>"}` | Not yet executed in formal regression | **Not yet executed** |
