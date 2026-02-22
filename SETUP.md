# RaxLearn Setup Guide

This guide will help you set up and run the RaxLearn platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or higher
- npm or yarn package manager
- A Supabase account (free tier works fine)

## Step 1: Environment Configuration

The `.env` file in the project root contains your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values are already configured and connected to your Supabase instance.

## Step 2: Database Setup

The database has been set up with the following migrations:

1. **create_raxlearn_schema** - Creates all necessary tables:
   - user_profiles
   - career_paths
   - programming_concepts
   - projects
   - project_milestones
   - user_progress
   - concept_mastery
   - hints
   - And more...

2. **seed_initial_data** - Populates the database with:
   - 3 career paths (Web Developer, Data Analyst, Mobile Developer)
   - 12 programming concepts
   - Sample projects (Interactive Todo List, Weather Dashboard)
   - Project milestones and hints

All migrations have been applied successfully. The database is ready to use.

## Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Supabase client
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Vite (build tool)

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 5: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Step 6: Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## Usage Instructions

### First Time User

1. **Sign Up**
   - Open the application
   - Click "Sign up" on the login page
   - Enter your full name, email, and password
   - Click "Create Account"

2. **Complete Onboarding**
   - Select your current skill level (Beginner/Intermediate/Advanced)
   - Choose a career path that aligns with your goals
   - Click "Get Started"

3. **Start Learning**
   - Browse available projects on your dashboard
   - Click on a project to view details
   - Work through milestones sequentially
   - Use the hint system when you need guidance

### Returning User

1. **Sign In**
   - Enter your email and password
   - Click "Sign In"
   - You'll be taken directly to your dashboard

2. **Continue Learning**
   - Your progress is automatically saved
   - Pick up where you left off
   - Complete remaining milestones

## Features Overview

### Dashboard
- View all available projects
- Track your progress statistics
- See projects in progress
- Monitor completed projects

### Project View
- Step-by-step milestones
- Integrated code editor
- Context-aware hints
- Progress tracking per milestone

### Hint System
- Level 1: Conceptual hints (understanding)
- Level 2: Directional guidance (approach)
- Level 3: Documentation links (reference)

### Progress Tracking
- Automatic code saving
- Attempt counting
- Time tracking
- Completion status

## Database Structure

### User Data
- **user_profiles**: Extended user information linked to Supabase auth
- **user_progress**: Tracks completion of projects and milestones
- **concept_mastery**: Monitors understanding of programming concepts
- **user_hint_usage**: Records hint usage for learning insights

### Learning Content
- **career_paths**: Available learning paths
- **programming_concepts**: Knowledge graph of concepts
- **projects**: Structured learning projects
- **project_milestones**: Individual steps within projects
- **hints**: Tiered assistance system

## Security Features

All tables use Row Level Security (RLS):
- Users can only access their own data
- Learning content is publicly readable
- Write operations require authentication
- No data leakage between users

## Troubleshooting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Check for type errors
npm run typecheck
```

### Database Connection Issues
1. Verify your `.env` file has correct Supabase credentials
2. Check that your Supabase project is active
3. Ensure migrations have been applied

### Authentication Issues
1. Check Supabase authentication is enabled
2. Verify email confirmation is disabled (or handle confirmation flow)
3. Check browser console for error messages

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

## Project Structure

```
raxlearn/
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── Dashboard.tsx
│   │   ├── ProjectView.tsx
│   │   ├── CodeEditor.tsx
│   │   └── HintPanel.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useMilestones.ts
│   │   ├── useProgress.ts
│   │   ├── useHints.ts
│   │   └── useCareerPaths.ts
│   ├── lib/              # Utilities and configuration
│   │   └── supabase.ts
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── dist/                 # Production build output
├── .env                  # Environment variables
├── README.md            # Project documentation
├── SETUP.md             # This file
└── package.json         # Dependencies and scripts
```

## Adding New Content

### To Add a New Project

1. Insert into the `projects` table via Supabase dashboard
2. Create associated milestones in `project_milestones`
3. Add hints for each milestone in `hints`
4. Link milestones to concepts in `milestone_concepts`

### To Add a New Career Path

1. Insert into `career_paths` table
2. Associate existing or new projects with the career path
3. Update learning objectives array

### To Add Programming Concepts

1. Insert into `programming_concepts` table
2. Add prerequisites in `concept_prerequisites`
3. Link to relevant project milestones

## Support

For questions or issues:
1. Check the README.md for detailed documentation
2. Review database schema in migration files
3. Contact the development team

---

Happy Learning with RaxLearn!
