# Software Testing Summary Report

This document synthesizes the testing outcomes for **ProjectXplain** as evaluated at the Mid-Semester milestone.

---

## 1. Test Execution Metrics

Across the three test suites, test cases were developed to validate functional workflows, REST API contracts, database schema integrity, and the AI Mentor integration:

| Test Suite | Total Test Cases | Verified / Pass | Not Yet Executed | Pass Rate (Executed) |
| :--- | :---: | :---: | :---: | :---: |
| **Functional Test Cases** (`Functional_Test_Cases.md`) | 18 | 15 | 3 | 100% |
| **Backend API Test Cases** (`API_Test_Cases.md`) | 27 | 25 | 2 | 100% |
| **Database Test Cases** (`Database_Test_Cases.md`) | 10 | 9 | 1 | 100% |
| **TOTAL** | **55** | **49** | **6** | **100%** |

---

## 2. Verified Capabilities

The following core behaviors have been verified:
1. **Core CRUD Across 10 Features**: Creation, retrieval, and deletion of projects, requirements, user stories, database entities, entity attributes, entity relationships, documented APIs, architecture components, architecture connections, data flow steps, and concept mappings operate smoothly.
2. **Relational Integrity**: Foreign key constraints with `ON DELETE CASCADE` prevent orphaned records when projects, requirements, or entities are deleted.
3. **Curriculum Seeding**: The backend automatically seeds 5 subjects and 17 core concepts on initial startup without duplicating rows on restart.
4. **Context-Aware AI Responses**: When configured with a valid `OPENROUTER_API_KEY`, the AI Mentor successfully pulls project context across Features 1–9 and generates relevant viva guidance using `openrouter/free`.
5. **Client Security**: API keys and database credentials remain strictly within server-side environment variables and are never transmitted to the frontend.

---

## 3. Items Marked "Not Yet Executed"

To uphold strict academic integrity, the following negative/edge-case tests have been designed but have **not yet been formally executed** in post-development regression:
- **TC-FN-07**: End-to-end UI verification of requirement deletion cascading to user stories inside the React UI.
- **TC-FN-17 & TC-API-26**: Verifying backend and UI behavior when the backend server is intentionally launched with an empty or missing `OPENROUTER_API_KEY`.
- **TC-FN-18 & TC-API-27**: Simulating an upstream OpenRouter API network timeout/failure during an active viva query.
- **TC-DB-07**: Verifying that deleting an API endpoint sets the `api_id` of referencing data flow steps to `NULL` (`ON DELETE SET NULL`) rather than failing or deleting the step.

These tests are scheduled for execution during the End-Semester automated test suite milestone.
