# RaxLearn System Architecture

This document provides a comprehensive overview of the RaxLearn platform architecture, data flow, and key design decisions.

## System Overview

RaxLearn is a full-stack web application built using modern technologies to deliver an adaptive, project-driven programming education experience.

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  (React + TypeScript + Tailwind CSS)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Auth      │  │   Dashboard  │  │   Project    │     │
│  │  Components  │  │              │  │     View     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Custom    │  │     Auth     │  │   Supabase   │     │
│  │    Hooks     │  │   Context    │  │    Client    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Backend                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │  PostgreSQL  │  │     RLS      │     │
│  │   Service    │  │   Database   │  │   Policies   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Real-time  │  │     API      │  │   Storage    │     │
│  │ Subscriptions│  │    Layer     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (Auth-aware routing)
├── AuthContext (Global auth state)
│
├── Unauthenticated Flow
│   ├── LoginForm
│   └── SignupForm
│
├── Onboarding Flow (First-time users)
│   └── Onboarding (Career path & skill level selection)
│
└── Authenticated Flow
    └── Dashboard (Main learning interface)
        └── ProjectView (Individual project workspace)
            ├── Milestone Navigation
            ├── CodeEditor (In-browser coding)
            └── HintPanel (Context-aware assistance)
```

### State Management

**Global State (Context API)**
- Authentication state
- User profile information
- Session management

**Local State (React Hooks)**
- Component-specific UI state
- Form inputs
- Modal visibility

**Server State (Custom Hooks)**
- Projects data
- Milestones
- User progress
- Hints
- Career paths

### Custom Hooks Pattern

Each data entity has a dedicated custom hook:

```typescript
// Pattern example: useProjects
const { projects, loading, error } = useProjects(careerPathId);

// Benefits:
// - Encapsulates data fetching logic
// - Handles loading and error states
// - Provides type-safe data
// - Reusable across components
// - Easy to test
```

## Backend Architecture

### Database Schema

#### User Management
```
auth.users (Supabase managed)
    ↓
user_profiles (Extended info)
    ├── career_goal_id → career_paths
    ├── current_skill_level
    └── onboarding_completed
```

#### Learning Content
```
career_paths
    ↓
projects
    ├── career_path_id
    ├── difficulty
    └── technologies[]
        ↓
    project_milestones
        ├── milestone_order
        └── instructions
            ↓
        hints (Tiered assistance)
            ├── hint_level (1-3)
            └── hint_type
```

#### Knowledge Graph
```
programming_concepts
    ↔ concept_prerequisites (Many-to-many)
    ↔ milestone_concepts (Links to milestones)
```

#### Progress Tracking
```
user_progress
    ├── user_id
    ├── project_id
    ├── milestone_id
    ├── status
    ├── code_submitted
    └── attempts

concept_mastery
    ├── user_id
    ├── concept_id
    ├── mastery_level (0-100)
    └── practice_count
```

### Row Level Security (RLS)

**Security Model:**
- Users can only view/edit their own data
- Learning content (projects, concepts, hints) is readable by all authenticated users
- Progress data is strictly isolated per user

**Example Policy:**
```sql
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## Data Flow

### 1. User Authentication Flow

```
User Action → SignUp/SignIn Form
    ↓
Supabase Auth Service
    ↓
JWT Token Generated
    ↓
AuthContext Updates
    ↓
App Re-renders with authenticated state
    ↓
User Profile Fetched
    ↓
Dashboard or Onboarding displayed
```

### 2. Learning Path Creation Flow

```
Onboarding Complete
    ↓
User Profile Updated (career_goal_id, skill_level)
    ↓
Projects Filtered by career path
    ↓
Concepts Organized by prerequisites
    ↓
Personalized Dashboard Generated
```

### 3. Project Execution Flow

```
User Selects Project
    ↓
Project Details Loaded
    ↓
Milestones Retrieved (ordered)
    ↓
First Incomplete Milestone Selected
    ↓
Code Editor Initialized with starter code
    ↓
User Writes Code
    ↓
Auto-save to user_progress (on change)
    ↓
User Requests Hint (optional)
    ↓
Tiered Hints Revealed Progressively
    ↓
User Marks Milestone Complete
    ↓
Progress Updated
    ↓
Next Milestone Unlocked
```

### 4. Adaptive Learning Flow

```
User Completes Milestone
    ↓
Linked Concepts Identified
    ↓
Concept Mastery Updated
    ↓
Performance Analyzed
    ↓
Next Recommendations Generated
    ├── Strong Areas → Advanced Projects
    ├── Weak Areas → Reinforcement Projects
    └── Knowledge Gaps → Prerequisite Review
```

## Key Design Patterns

### 1. Separation of Concerns
- **Components**: UI rendering only
- **Hooks**: Data fetching and business logic
- **Context**: Global state management
- **Database**: Data persistence and security

### 2. Progressive Disclosure
- Hints revealed one at a time
- Milestones unlock sequentially
- Complexity increases gradually

### 3. Fail-Safe Defaults
- Skill level: 'beginner'
- Project status: 'not_started'
- Boolean flags: false
- Timestamps: now()

### 4. Type Safety
- TypeScript throughout frontend
- Database types defined in supabase.ts
- Props interfaces for all components

### 5. Real-time Synchronization
- Supabase real-time subscriptions (future)
- Automatic state updates
- Optimistic UI updates

## Security Architecture

### Authentication
- Email/password via Supabase Auth
- JWT tokens for API requests
- Automatic session refresh
- Secure cookie storage

### Authorization
- Row Level Security on all tables
- User-specific data isolation
- Read-only access to learning content
- No client-side secrets

### Data Validation
- Input validation on frontend
- Database constraints
- Type checking with TypeScript
- SQL injection prevention (parameterized queries)

## Scalability Considerations

### Current Architecture (MVP)
- Supports hundreds of concurrent users
- Direct database queries via Supabase
- Client-side state management

### Future Enhancements
1. **Caching Layer**
   - Redis for frequent queries
   - CDN for static content

2. **Code Execution**
   - Sandboxed environments
   - Docker containers per user
   - Queue-based processing

3. **Analytics Pipeline**
   - Event streaming
   - Real-time dashboards
   - ML-powered recommendations

4. **Microservices**
   - Separate hint generation service
   - Code analysis service
   - Recommendation engine

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading of components
- Memoization of expensive computations
- Debounced auto-save

### Database
- Indexed foreign keys
- Composite indexes on frequently queried columns
- Efficient query patterns (select only needed columns)
- Connection pooling

### Network
- Compressed assets
- Minimal bundle size
- Parallel API requests where possible

## Error Handling

### Frontend
```typescript
try {
  await updateProgress(projectId, milestoneId, updates);
} catch (error) {
  console.error('Error updating progress:', error);
  // User-friendly error message displayed
  // State rolled back if needed
}
```

### Database
- Foreign key constraints
- Check constraints for valid values
- Unique constraints
- NOT NULL constraints where appropriate

### User Experience
- Loading states during async operations
- Clear error messages
- Graceful degradation
- Retry mechanisms

## Testing Strategy (Future)

### Unit Tests
- Custom hooks
- Utility functions
- Pure components

### Integration Tests
- Authentication flow
- Data fetching
- State updates

### End-to-End Tests
- Complete user journeys
- Project completion flow
- Multi-user scenarios

## Deployment Architecture

### Development
```
Local Machine
    ↓
npm run dev (Vite dev server)
    ↓
Hot Module Replacement
    ↓
Connected to Supabase Dev Project
```

### Production
```
Git Repository
    ↓
CI/CD Pipeline
    ↓
npm run build
    ↓
Static Assets (dist/)
    ↓
CDN/Static Hosting
    ↓
Supabase Production Instance
```

## Monitoring & Observability (Future)

1. **Application Metrics**
   - User engagement
   - Project completion rates
   - Hint usage patterns

2. **System Metrics**
   - API response times
   - Database query performance
   - Error rates

3. **User Analytics**
   - Learning progression
   - Time spent per milestone
   - Concept mastery trends

## Technology Choices Rationale

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Hooks for clean state management

### Why Supabase?
- PostgreSQL database (reliable, powerful)
- Built-in authentication
- Row Level Security (data protection)
- Real-time subscriptions
- Easy to use, fast to develop

### Why TypeScript?
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Refactoring confidence

### Why Tailwind CSS?
- Utility-first approach
- Rapid UI development
- Consistent design system
- Small production bundle

## Future Architecture Enhancements

1. **AI-Powered Features**
   - Intelligent code analysis
   - Personalized hint generation
   - Adaptive difficulty adjustment

2. **Collaborative Learning**
   - Real-time pair programming
   - Peer code review
   - Discussion forums

3. **Advanced Analytics**
   - Learning pattern recognition
   - Predictive modeling
   - Success metric tracking

4. **Multi-Platform Support**
   - Mobile applications
   - Offline mode
   - Progressive Web App

---

This architecture supports the core mission of RaxLearn: providing adaptive, project-driven programming education through a secure, scalable, and user-friendly platform.
