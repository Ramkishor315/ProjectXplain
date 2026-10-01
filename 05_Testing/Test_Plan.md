# Software Test Plan

This document establishes the test strategy, scope, environment, and execution methodology for verifying **ProjectXplain** at the Mid-Semester Evaluation milestone.

---

## 1. Objectives and Scope

The goal of testing is to ensure that all 10 core features of ProjectXplain perform reliably, handle invalid inputs gracefully, maintain relational database integrity, and protect third-party API credentials.

### In-Scope Testing Areas:
1. **Frontend Functional Testing**: Verification of UI state, forms, navigation, dynamic statistics, and error alert rendering.
2. **Backend REST API Verification**: Verification of HTTP status codes (`200`, `201`, `400`, `404`, `500`), JSON payload parsing, and parameter validation.
3. **Database Integrity & Constraint Testing**: Foreign key cascade deletions, unique constraints, and schema creation logic in MySQL.
4. **AI Mentor Integration & Boundary Testing**: Verification of project context aggregation, handling of missing keys, empty queries, and upstream network failures.

---

## 2. Test Environment

| Component | Test Environment Specification |
| :--- | :--- |
| **Operating System** | Windows 10/11 |
| **Runtime Environment** | Node.js v18+, npm v9+ |
| **Database Server** | MySQL 8.0 Community Server running on `localhost:3306` |
| **Backend Server** | Express app running on `http://localhost:4000` |
| **Frontend Development Server** | Vite running on `http://localhost:5173` |
| **Client Browser** | Google Chrome (Latest Version) |
| **API Testing Utility** | cURL / Native fetch test scripts |

---

## 3. Test Classification & Execution Criteria

Test cases are divided into three suites:
1. **Functional Test Cases (`Functional_Test_Cases.md`)**: End-to-end UI user actions across Features 1 through 10.
2. **API Test Cases (`API_Test_Cases.md`)**: Direct HTTP request/response validation against backend route endpoints.
3. **Database Test Cases (`Database_Test_Cases.md`)**: Direct SQL and constraint tests against MySQL tables.

### Integrity Rule on Statuses:
To uphold academic integrity and prevent fabrication:
- Tests that were systematically verified during development are marked **Verified / Pass**.
- Tests that are planned but have not yet undergone formal post-development regression runs are explicitly marked **Not yet executed**.
