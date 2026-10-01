# Computer Science Concepts Design

This document details the architecture and curriculum design of **Feature 9: CSE Concepts** in **ProjectXplain**.

---

## 1. Pedagogical Objective

A central premise of ProjectXplain is that undergraduate engineering students build web applications without connecting their practical implementation decisions to foundational Computer Science and Engineering (CSE) theory.

Feature 9 establishes an **explicit, deterministic bridge** between theoretical academic subjects and student project artifacts. It equips students to confidently answer examiners during viva voce defense by framing their code within formal academic concepts.

---

## 2. Seeded Curriculum Architecture

Upon initial database startup (`backend/db/connection.js`), ProjectXplain automatically seeds **5 foundational subjects** and **17 core concepts**. Unlike dynamic AI generation, these concepts are **deterministic and academically verified**, providing a consistent baseline for syllabus alignment.

```text
┌────────────────────────────────────────────────────────┐
│                   CSE Curriculum Hub                   │
├───────────────────┬────────────────────────────────────┤
│ Subject           │ Core Seeded Concepts               │
├───────────────────┼────────────────────────────────────┤
│ DBMS              │ • Relational Database              │
│                   │ • Primary Key                      │
│                   │ • Foreign Key                      │
│                   │ • Database Relationships           │
│                   │ • SQL                              │
├───────────────────┼────────────────────────────────────┤
│ Computer Networks │ • HTTP                             │
│                   │ • HTTP Methods                     │
│                   │ • REST API                         │
│                   │ • Client-Server Architecture       │
├───────────────────┼────────────────────────────────────┤
│ OOPS              │ • Encapsulation                    │
│                   │ • Abstraction                      │
│                   │ • Modularity                       │
├───────────────────┼────────────────────────────────────┤
│ Operating Systems │ • Process                          │
│                   │ • Concurrency                      │
├───────────────────┼────────────────────────────────────┤
│ System Design     │ • Layered Architecture             │
│                   │ • Component-Based Design           │
│                   │ • Data Flow                        │
└───────────────────┴────────────────────────────────────┘
```

---

## 3. Four-Facet Concept Structure

Every concept in the repository is populated across four structured facets designed for learning and examination defense:

1. **Explanation**: Clear academic definition of the computer science concept.
2. **Project Relevance**: Explanation of why and how this concept operates in real-world software engineering.
3. **Project Usage**: Concrete examples of where the concept manifests in application code (e.g., MySQL schemas, fetch calls, React component boundaries).
4. **What to Learn (Viva Checklist)**: Specific examination topics, technical questions, and keywords students must prepare for their oral viva.

---

## 4. Project-to-Concept Mapping Mechanism

Students interact with Feature 9 through an active linking workflow:

1. **Browse & Filter**: The student navigates through the subjects (DBMS, Networks, OOPS, OS, System Design).
2. **Map to Project**: The student clicks "Map to Project" on any concept relevant to their application.
3. **Provide Contextual Rationale**: The system prompts the student to enter their own reasoning:
   > *"Why does your project use this concept? Where does it appear in your code?"*
4. **Persistence**: The association is stored in the `project_concepts` table with fields `(project_id, concept_id, reason)`. A unique constraint `(project_id, concept_id)` prevents redundant duplicate mappings.
5. **Dashboard Reflection**: The count of mapped concepts increments on the Project Overview dashboard, showing progress toward viva readiness.
6. **AI Mentor Amplification**: The AI Mentor automatically consumes all mapped concepts and custom student reasons, enabling mock examiner simulations tailored to the student's claimed theoretical knowledge.
