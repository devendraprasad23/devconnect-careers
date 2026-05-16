# DevConnect Careers 🚀

A full-stack job portal connecting developers with top tech companies. Built as a portfolio project to demonstrate end-to-end software engineering skills.

**Live Demo:** [devconnect-careers.netlify.app](https://devconnect-careers.netlify.app)  
**Backend API:** [devconnect-careers-1.onrender.com](https://devconnect-careers-1.onrender.com)

---

## 📸 Screenshots

| Job Board | Job Detail | Recruiter Dashboard |
|-----------|------------|---------------------|
| Browse and filter jobs by type, salary, location | Full job description with apply modal | Manage applicants and update hiring status |

---

## ✨ Features

### For Candidates
- 🔍 **Browse & Filter Jobs** — search by title, skills, company, location, salary range, job type
- 📄 **Apply with Resume** — upload PDF resume + cover letter in one click
- 🤖 **AI Match Score** — see how well your profile matches each job (skill overlap algorithm)
- 📊 **Application Pipeline** — track status across APPLIED → REVIEWED → SHORTLISTED → INTERVIEW → OFFERED
- 👤 **Candidate Profile** — add skills, bio, experience, LinkedIn, GitHub to boost match scores
- 💬 **DevBot AI Assistant** — floating chatbot for job search help and career advice

### For Recruiters
- 📝 **Post Jobs** — full job posting with skills, salary range, experience requirements
- 📋 **Applicant Dashboard** — view all applicants per job with cover letters and resumes
- ⚡ **Status Management** — move candidates through hiring pipeline with one click
- 📥 **Resume Download** — download candidate PDFs directly from dashboard

### Platform
- 🔐 **JWT Authentication** — secure login with access + refresh token rotation
- 🎭 **Role-Based Access** — separate flows for CANDIDATE and RECRUITER roles
- 📱 **Responsive Design** — works on desktop and mobile
- 🌙 **Dark Theme** — modern dark UI throughout

---

## 🛠️ Tech Stack

### Backend
| Technology | Usage |
|------------|-------|
| Java 17 | Core language |
| Spring Boot 3.5 | REST API framework |
| Spring Security | JWT authentication & authorization |
| PostgreSQL | Primary database |
| Flyway | Database migrations |
| Hibernate / JPA | ORM |
| Maven | Build tool |
| Docker | Containerization for deployment |

### Frontend
| Technology | Usage |
|------------|-------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Zustand | State management |
| Axios | HTTP client |
| React Router v6 | Client-side routing |
| React Hot Toast | Notifications |

### Infrastructure
| Service | Usage |
|---------|-------|
| Render | Backend hosting (Docker) |
| Netlify | Frontend hosting |
| Render PostgreSQL | Managed database |
| GitHub | Version control + CI/CD |

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│   React Frontend    │  HTTPS  │   Spring Boot Backend    │
│  (Netlify CDN)      │◄───────►│   (Render Docker)        │
│                     │  REST   │                          │
│  - Job Board        │  API    │  - Auth Controller       │
│  - Apply Modal      │         │  - Job Controller        │
│  - Recruiter Dash   │         │  - Application Controller│
│  - Profile Page     │         │  - User Controller       │
│  - AI Chatbot       │         │                          │
└─────────────────────┘         └──────────┬───────────────┘
                                           │
                                           │ JDBC
                                           ▼
                                ┌──────────────────────┐
                                │  PostgreSQL Database  │
                                │  (Render Managed)     │
                                │                       │
                                │  - users              │
                                │  - jobs               │
                                │  - applications       │
                                │  - refresh_tokens     │
                                └──────────────────────┘
```

---

## 🔐 Security

- JWT access tokens (24hr expiry) + refresh tokens (7 day expiry)
- BCrypt password hashing
- Role-based route protection (`CANDIDATE` / `RECRUITER`)
- CORS configured for production domains
- SQL injection prevention via JPA parameterized queries

---

## 🚀 Getting Started Locally

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.9+

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/devendraprasad23/devconnect-careers.git
cd devconnect-careers/backend

# Update application.yaml with your local DB credentials
# src/main/resources/application.yaml

# Run the backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`  
Flyway auto-runs DB migrations on startup.

### Frontend Setup

```bash
cd devconnect-careers/frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env

# Start dev server
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## 📁 Project Structure

```
devconnect-careers/
├── backend/
│   ├── src/main/java/com/jobportal/backend/
│   │   ├── config/          # Security, CORS config
│   │   ├── controller/      # REST controllers
│   │   ├── domain/          # JPA entities
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── repository/      # Spring Data JPA repos
│   │   ├── security/        # JWT filter, provider
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       ├── application.yaml
│       └── db/migration/    # Flyway SQL migrations
└── frontend/
    └── src/
        ├── api/             # Axios instance
        ├── components/      # Reusable components
        ├── pages/           # Route pages
        │   ├── auth/        # Login, Register
        │   ├── candidate/   # Job Board, Profile, Applications
        │   └── recruiter/   # Dashboard, Post Job
        └── store/           # Zustand auth store
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Public |
| GET | `/api/v1/jobs` | Get all active jobs | Public |
| GET | `/api/v1/jobs/:id` | Get job by ID | Public |
| POST | `/api/v1/jobs` | Post new job | RECRUITER |
| GET | `/api/v1/jobs/my` | Get recruiter's jobs | RECRUITER |
| POST | `/api/v1/applications/jobs/:id` | Apply to job | CANDIDATE |
| GET | `/api/v1/applications/my` | Get my applications | CANDIDATE |
| GET | `/api/v1/applications/jobs/:id` | Get job applicants | RECRUITER |
| PATCH | `/api/v1/applications/:id/status` | Update app status | RECRUITER |
| GET | `/api/v1/users/profile` | Get candidate profile | CANDIDATE |
| PUT | `/api/v1/users/profile` | Update profile | CANDIDATE |

---

## 🧠 AI Match Score Algorithm

The match score is calculated when a candidate applies:

```java
// Skill overlap score (0-70 points)
int skillScore = (matchingSkills / totalJobSkills) * 70;

// Experience score (0-30 points)  
int expScore = candidateYears >= jobMinExp ? 30 : 
               (candidateYears / jobMinExp) * 30;

int totalScore = skillScore + expScore; // 0-100
```

Candidates improve their score by filling out their **Profile** page with relevant skills.

---

## 📦 Deployment

| Component | Platform | Config |
|-----------|----------|--------|
| Frontend | Netlify | Auto-deploy on push to `main` |
| Backend | Render (Docker) | Auto-deploy on push to `main` |
| Database | Render PostgreSQL | Managed, free tier |

Environment variables required on Render:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
JWT_SECRET=...
SPRING_PROFILES_ACTIVE=prod
```

---

## 👨‍💻 Author

**Chinnegowlla Devendra Prasad**  
Full Stack Developer | Java • Spring Boot • React • TypeScript

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/devendra-c-5224h/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/devendraprasad23)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://x.com/Msd_Dev07)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ☕ Java and ⚛️ React*
