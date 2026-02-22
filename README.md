# RaxLearn - Project-Driven Adaptive Platform for Programming Education

A comprehensive web-based programming education platform that teaches software development through real-world projects rather than passive content consumption.

## Overview

RaxLearn addresses the "tutorial hell" problem by centering education around hands-on project execution. Instead of isolated lessons, learners acquire skills by building structured, progressively challenging projects aligned with specific programming languages and career paths.

## Key Features

### 1. Project-Based Learning
- Learn by building real, functional projects
- Structured milestones guide learners step-by-step
- Progressive difficulty scaling
- Real-world application focus

### 2. Adaptive Learning Engine
- Personalized learning paths based on user goals
- Dynamic content adjustment based on performance
- Career path alignment (Web Developer, Data Analyst, Mobile Developer)
- Skill level assessment and tracking

### 3. Intelligent Progress Tracking
- Tracks completed projects and milestones
- Identifies knowledge gaps
- Monitors time spent and attempts
- Provides performance analytics

### 4. Context-Aware Assistance System
- Three-tiered hint system:
  - Level 1: Conceptual reminders
  - Level 2: Directional guidance
  - Level 3: Documentation links
- Progressive hint revelation
- Encourages independent problem-solving
- Tracks hint usage for learning insights

### 5. In-Browser Code Editor
- Write and test code directly in the platform
- Syntax highlighting
- Code persistence across sessions
- Real-time progress saving

## Technology Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend & Database
- Supabase (PostgreSQL database)
- Row Level Security (RLS) for data protection
- Real-time subscriptions
- Built-in authentication

### Key Libraries
- @supabase/supabase-js - Database client
- React Hooks for state management

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # User login
│   │   ├── SignupForm.tsx         # User registration
│   │   └── Onboarding.tsx         # Career path selection
│   ├── Dashboard.tsx              # Main learning dashboard
│   ├── ProjectView.tsx            # Individual project viewer
│   ├── CodeEditor.tsx             # In-browser code editor
│   └── HintPanel.tsx              # Context-aware hints
├── contexts/
│   └── AuthContext.tsx            # Authentication state management
├── hooks/
│   ├── useProjects.ts             # Project data fetching
│   ├── useMilestones.ts           # Milestone management
│   ├── useProgress.ts             # Progress tracking
│   ├── useHints.ts                # Hint system
│   └── useCareerPaths.ts          # Career path data
├── lib/
│   └── supabase.ts                # Supabase client configuration
├── App.tsx                        # Main application component
└── main.tsx                       # Application entry point
```

## Database Schema

### Core Tables

1. **user_profiles** - Extended user information
   - Links to Supabase auth.users
   - Stores career goals and skill level
   - Tracks onboarding completion

2. **career_paths** - Available learning paths
   - Web Developer, Data Analyst, Mobile Developer
   - Learning objectives for each path

3. **programming_concepts** - Knowledge graph nodes
   - Individual concepts (variables, loops, APIs, etc.)
   - Difficulty levels and documentation links

4. **projects** - Learning projects
   - Structured projects with starter code
   - Aligned with career paths
   - Technology stacks and learning outcomes

5. **project_milestones** - Project steps
   - Individual features to implement
   - Instructions and test criteria
   - Ordered progression

6. **user_progress** - Learning progress
   - Tracks completion status
   - Stores submitted code
   - Records time spent and attempts

7. **hints** - Assistance system
   - Tiered hints for each milestone
   - Conceptual, directional, and documentation types

8. **concept_mastery** - Knowledge tracking
   - Mastery levels for each concept
   - Practice count and recency

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd raxlearn
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
The `.env` file should contain:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations
The migrations are in the `supabase/migrations` folder and have been applied:
- `create_raxlearn_schema.sql` - Core database schema
- `seed_initial_data.sql` - Sample projects and career paths

5. Start the development server
```bash
npm run dev
```

6. Build for production
```bash
npm run build
```

## Usage Flow

### 1. User Registration
- Create an account with email and password
- Provides full name during signup

### 2. Onboarding
- Select current skill level (Beginner, Intermediate, Advanced)
- Choose a career path
- System creates personalized learning path

### 3. Project Selection
- Browse available projects on dashboard
- View project details, difficulty, and technologies
- See progress on started projects

### 4. Project Execution
- Work through milestones sequentially
- Write code in the integrated editor
- Request hints when stuck (tiered system)
- Mark milestones complete as you progress

### 5. Progress Tracking
- View completed vs. in-progress projects
- Track overall learning statistics
- Identify areas for improvement

## Security Features

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Secure authentication via Supabase
- No exposure of sensitive data to client

## Key Design Decisions

### Why Project-Based Learning?
Traditional programming education focuses on passive consumption. RaxLearn emphasizes active building, which:
- Improves knowledge retention
- Develops problem-solving skills
- Mirrors real development workflows
- Builds portfolio-worthy projects

### Why Tiered Hints?
Rather than revealing solutions, the hint system:
- Encourages independent thinking
- Provides just enough guidance
- Tracks when learners need help
- Adapts to individual learning styles

### Why Career Paths?
Learners have different goals. Career paths:
- Focus learning on relevant technologies
- Provide clear progression
- Align with job market demands
- Create structured learning journeys

## Future Enhancements

1. **Advanced Code Analysis**
   - Automated testing of submitted code
   - Code quality feedback
   - Performance suggestions

2. **Peer Collaboration**
   - Code review features
   - Discussion forums
   - Pair programming sessions

3. **Achievement System**
   - Badges and certificates
   - Skill assessments
   - Portfolio generation

4. **Enhanced Editor**
   - Integration with Monaco Editor
   - Auto-completion
   - Real-time error detection
   - Multi-file support

5. **AI-Powered Assistance**
   - Intelligent error diagnosis
   - Personalized hints based on code analysis
   - Concept recommendations

## Team

**Rax Innovation Team**
- Dylan Oliech - Project Lead & Full Stack Developer
- Gerryshom Nyanusi Ratemo - Backend Developer & Database Architect
- Brian Kiplangat - Frontend Developer & UI/UX Designer

**Faculty Advisors**
- Dr. James Mwangi - Lead Supervisor
- Prof. Sarah Akinyi - Co-Supervisor
- Dr. Peter Ochieng - Technical Advisor

## License

This project was developed for the School of Information Science and Technology as part of the Hackathon: Leveraging Technology in Education and Digital Literacy.

## Contact

For questions or feedback about RaxLearn, please contact the development team through the School of Information Science and Technology.

---

Built with modern web technologies to transform programming education through project-driven learning.
