# Mid-Semester Evaluation Demonstration Script

**Project Title**: ProjectXplain: An Educational Full-Stack Software Engineering Platform  
**Target Duration**: 5 to 7 Minutes  
**Team Members**: Saksham, Ravi, Ram Kishor, Priyanshu  
**Presenter Roles**: Distributed across all 4 team members *[Specific speaking allocations to be finalized by team]*

---

## 1. Timing and Section Breakdown

```text
┌──────────────┬───────────────────────────────────────────┬──────────────┐
│ Time Window  │ Presentation Section                      │ Lead Speaker │
├──────────────┼───────────────────────────────────────────┼──────────────┤
│ 0:00 - 0:45  │ 1. Team Introduction & Academic Problem   │ Speaker 1    │
│ 0:45 - 1:30  │ 2. Proposed Solution & Architecture       │ Speaker 2    │
│ 1:30 - 4:00  │ 3. Live Walkthrough: Features 1 to 9      │ Speaker 3    │
│ 4:00 - 5:15  │ 4. Live Walkthrough: Feature 10 AI Mentor │ Speaker 4    │
│ 5:15 - 6:00  │ 5. Testing & Database Verification        │ Speaker 2/3  │
│ 6:00 - 7:00  │ 6. Limitations, Next Steps & Conclusion   │ All Members  │
└──────────────┴───────────────────────────────────────────┴──────────────┘
```

---

## 2. Minute-by-Minute Script & Cues

### Minute 0:00 – 0:45: Introduction & The Problem
- **Speaker 1**:
  > *"Good morning respected evaluators. We are Team ProjectXplain: Saksham, Ravi, Ram Kishor, and Priyanshu.*  
  > *During our undergraduate software labs, we noticed a consistent challenge: students can build basic web interfaces, but during viva examinations, they struggle to explain their database normalization, REST API contracts, request lifecycles, and underlying CSE theory.*  
  > *Industry tools like Jira or Enterprise Architect are too complex and lack educational context. We built **ProjectXplain**—an integrated software engineering workbench tailored specifically for students to design, understand, and defend their projects."*

---

### Minute 0:45 – 1:30: Proposed Solution & System Architecture
- **Speaker 2**:
  > *"ProjectXplain bridges academic theory and code through a 10-feature guided progression.*  
  > *Architecturally, our system uses a clean 3-tier client-server structure: a modern React single-page application built with Vite and Tailwind CSS running on port 5173, communicating via RESTful HTTP with our Node.js and Express backend on port 4000.*  
  > *Our backend connects to a MySQL database with 13 relational tables enforcing referential integrity. Crucially, our AI Mentor communicates server-side with OpenRouter—meaning sensitive API keys never leave the server."*

---

### Minute 1:30 – 4:00: Live Application Walkthrough (Features 1 to 9)
- **Speaker 3 (Navigating Live UI)**:
  > **[Screen: Dashboard & Feature 1]**  
  > *"Here is the live ProjectXplain interface. We start by creating a project—for example, 'Blood Donor Connect'—and entering its core problem statement. Notice how our Project Overview dashboard displays live aggregate counts across all design stages.*  
  >  
  > **[Screen: Features 3 & 4 - Requirements & User Stories]**  
  > *Under Requirements, we define functional requirements with explicit priorities—High, Medium, and Low. Under each requirement, we decompose the functionality into user stories with acceptance criteria. Deleting a requirement cascades cleanly in MySQL.*  
  >  
  > **[Screen: Feature 5 - Database Design]**  
  > *Next, in Database Design, students model their data layer. We define entities like 'Users' and 'Donations', add attributes with SQL data types and key constraints, and establish One-to-Many relationships. Our Schema View provides an instant structural summary.*  
  >  
  > **[Screen: Feature 6 - API Design]**  
  > *In API Design, students document planned REST endpoints—such as POST /api/donations—complete with HTTP methods and JSON payloads.*  
  >  
  > **[Screen: Features 7 & 8 - Architecture & Request Flow]**  
  > *In System Architecture, we define structural components and communication links. In Request/Data Flow, we trace sequential steps—showing how an HTTP request moves from the React client to the Express server and executes SQL in MySQL.*  
  >  
  > **[Screen: Feature 9 - CSE Concepts]**  
  > *Finally, under CSE Concepts, our system seeds 17 core curriculum concepts across DBMS, Networks, OOPS, OS, and System Design. Students map concepts to their project with their own written rationale, reviewing key viva talking points."*

---

### Minute 4:00 – 5:15: Live Walkthrough: Feature 10 AI Mentor
- **Speaker 4 (Operating AI Mentor)**:
  > **[Screen: Feature 10 - AI Mentor]**  
  > *"Now we showcase Feature 10: our AI Mentor. The mentor is not just a generic chatbot. When a student asks: 'What questions can the examiner ask me about my database relationships and API design?', our backend assembles the complete context of all 9 previous features from MySQL and sends it securely to OpenRouter.*  
  > *Let's run this query live.*  
  > *[Submit Query]*  
  > *As you can see, the AI Mentor immediately analyzes the student's actual tables and endpoints, giving structured viva guidance and probing questions on foreign keys and HTTP status codes."*

---

### Minute 5:15 – 6:00: Verification & Database Integrity
- **Speaker 2**:
  > *"Behind this UI, we have executed 55 test cases covering functional flows, backend REST endpoints, and MySQL database constraints. Our tables enforce foreign key cascades, unique constraints, and SQL injection prevention via parameterized queries. Zero secrets or API keys are exposed to the client bundle."*

---

### Minute 6:00 – 7:00: Limitations, Next Steps & Conclusion
- **Speaker 1**:
  > *"For our Mid-Semester scope, Features 1 through 10 are fully functional. Current limitations include local single-user execution without authentication and the absence of one-click PDF export. For our End-Semester milestone, we will implement full test automation, interactive visual canvas diagrams, and PDF report export.*  
  > *Thank you, and we are now ready for your questions."*
