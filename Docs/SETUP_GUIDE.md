# AlgoBoard - Complete Setup Guide

## Overview
Your AlgoBoard app now connects to real Codeforces data! Here's how everything works:

## 🚀 User Flow

### 1. **Sign In with Google**
- User visits `/` (landing page)
- Clicks "Sign in with Google"
- NextAuth handles OAuth flow
- User is created in MongoDB

### 2. **Onboarding Flow** (`/onboarding`)
The middleware automatically redirects new users to onboarding.

#### Step 1: Connect Handle
- User enters their CF handle
- System calls `POST /api/onboarding/handle`
- Validates handle exists on Codeforces API
- Checks for duplicate claims
- Shows CF profile (rating, rank, avatar)

#### Step 2: Verify Ownership
- System calls `POST /api/onboarding/verify/initiate`
- Assigns random verification problem (10-minute window)
- User submits solution on Codeforces
- System polls `GET /api/onboarding/verify/status` every 5 seconds
- Detects submission via CF API
- Marks handle as verified

#### Step 3: Set Preferences
- User selects target rank (Specialist, Expert, Candidate Master, Master)
- Configures email reminders
- System calls `POST /api/onboarding/complete`
- Saves preferences and marks `onboardingComplete: true`
- Redirects to `/dashboard`

### 3. **Dashboard** (`/dashboard`)
Shows real CF data from the database:

#### Data Displayed:
- **Profile Header**: CF handle, rating, rank, peak rating, country, organization
- **Stats Cards**: Problems solved, contests participated, current streak
- **Submission Heatmap**: Activity calendar (currently placeholder)
- **Rating Bucket Chart**: Problems grouped by rating (800-2500)
- **Topic Tag Chart**: Top 10 most solved tags
- **Rating Graph**: Contest rating history over time
- **Contest Table**: Recent contest performances

#### Sync Button:
- Calls `POST /api/cf/sync`
- Fetches latest data from CF API:
  - User profile (rating, rank, etc.)
  - Last 100 submissions (filters accepted solutions)
  - Contest rating history
- Updates MongoDB
- Refreshes page to show new data

### 4. **Settings** (`/settings`)
- View and edit profile information
- See verified CF handle and rating
- Change target rank
- Update email preferences
- Re-verify handle (redirects to onboarding)
- Danger zone: Disconnect CF or delete account

## 📁 File Structure

### API Routes
```
src/app/api/
├── auth/[...nextauth]/     # NextAuth handlers (auto-generated)
├── user/
│   └── route.ts            # GET user data, PATCH update profile
├── onboarding/
│   ├── handle/route.ts     # POST - validate CF handle
│   ├── verify/
│   │   ├── initiate/route.ts  # POST - start verification
│   │   └── status/route.ts    # GET - poll verification status
│   └── complete/route.ts   # POST - save preferences
└── cf/
    └── sync/route.ts       # POST - sync CF data
```

### Components
```
src/components/
├── onboarding/
│   ├── HandleStep.tsx      # Step 1: Enter handle
│   ├── VerifyStep.tsx      # Step 2: Verify ownership
│   ├── PreferencesStep.tsx # Step 3: Set preferences
│   └── StepIndicator.tsx   # Progress indicator
└── dashboard/
    ├── ProfileHeader.tsx   # User profile card
    ├── SyncButton.tsx      # CF data sync button
    ├── RatingGraph.tsx     # Contest rating chart
    ├── RatingBucketChart.tsx  # Problems by rating
    ├── TopicTagChart.tsx   # Problems by tag
    ├── SubmissionHeatmap.tsx  # Activity calendar
    └── ContestTable.tsx    # Contest history table
```

### Pages
```
src/app/
├── (public)/
│   └── page.tsx            # Landing page
├── (dashboard)/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── dashboard/page.tsx  # Main dashboard (server component)
│   ├── settings/page.tsx   # Settings page (client component)
│   ├── board/page.tsx      # Kanban board (placeholder)
│   ├── topics/page.tsx     # Topic ladder (placeholder)
│   ├── badges/page.tsx     # Badges showcase (placeholder)
│   ├── leaderboard/page.tsx # Leaderboard (placeholder)
│   └── compare/page.tsx    # Compare users (placeholder)
└── onboarding/page.tsx     # Onboarding wizard
```

## 🔧 Configuration

### Environment Variables (`.env.local`)
```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...

# Codeforces API (optional for public endpoints)
CF_API=...
CF_SECRET=...
```

### Proxy (`src/proxy.ts`)
Next.js 16 renamed middleware to proxy. Handles automatic redirects:
- Unauthenticated users → `/api/auth/signin`
- Incomplete onboarding → `/onboarding`
- Completed onboarding on `/onboarding` → `/dashboard`

## 🎯 Testing the Flow

### 1. Fresh User Journey
```bash
npm run dev
```

1. Visit `http://localhost:3000`
2. Click "Sign in with Google"
3. Complete Google OAuth
4. You'll be redirected to `/onboarding`
5. Enter a real CF handle (e.g., "tourist", "Petr", or your own)
6. Wait for verification problem assignment
7. Submit any solution on Codeforces
8. Wait for polling to detect (~5-10 seconds)
9. Select target rank and email preferences
10. Click "Go to My Dashboard"
11. See your real CF data!

### 2. Sync CF Data
1. On dashboard, click "Sync Now"
2. Wait for sync to complete
3. Page refreshes with latest data

### 3. Update Settings
1. Navigate to Settings
2. Change target rank or email preferences
3. Click "Save Changes"

## 🔄 Data Sync Details

### What Gets Synced:
- **Profile**: rating, maxRating, rank, maxRank, country, organization, avatar
- **Submissions**: Last 100 submissions, filters for accepted (verdict: "OK")
- **Contests**: All rated contest participations with rating changes

### Sync Frequency:
- Manual: Click "Sync Now" button
- Automatic: Not implemented yet (would be via cron job)

### CF API Endpoints Used:
- `user.info` - Get user profile
- `user.status` - Get submissions
- `user.rating` - Get contest rating history

## 🚨 Known Limitations

1. **Submission Heatmap**: Currently shows placeholder data (needs date aggregation)
2. **Streak Calculation**: Not implemented (needs daily solve tracking)
3. **Board/Topics/Badges**: Placeholder pages (not implemented)
4. **Email Reminders**: Settings saved but emails not sent (needs worker)
5. **CF API Rate Limits**: Public endpoints may rate limit with heavy usage

## 🔐 Security Notes

- All API routes check authentication via NextAuth session
- CF handle verification prevents account hijacking
- Middleware protects all dashboard routes
- User can only access their own data

## 📊 Database Schema

The `User` model stores:
```typescript
{
  googleId: string
  email: string
  name: string
  avatar?: string
  cfHandle?: string
  cfHandleVerified: boolean
  cfProfile?: {
    rating, maxRating, rank, maxRank,
    country, organization, cfAvatar, lastSyncedAt
  }
  solvedProblems: Array<{
    contestId, problemIndex, problemName,
    rating, tags, solvedAt
  }>
  contestHistory: Array<{
    contestId, contestName, rank,
    oldRating, newRating, ratingChange, participatedAt
  }>
  targetRank?: string
  targetRating?: number
  emailPreferences: { enabled, frequency, preferredHour, timezone }
  gamification: { xp, level, currentStreak, longestStreak, ... }
  onboardingComplete: boolean
}
```

## 🎨 Styling

All styles are in:
- `src/app/globals.css` - Global styles and CSS variables
- `src/assets/css/*.css` - Page-specific styles
- `public/css/*.css` - Legacy styles (can be consolidated)

## 🚀 Next Steps

To complete the app:
1. Implement Kanban board with CF problem cards
2. Build topic ladder with curated problems
3. Add gamification (badges, XP, levels)
4. Create leaderboard with friend comparisons
5. Set up email worker for daily reminders
6. Add automatic CF sync via cron job
7. Implement submission heatmap with real dates
8. Add streak calculation logic

## 📝 Notes

- Dashboard is a **server component** (fetches data on server)
- Settings is a **client component** (needs interactivity)
- Sync button is a **client component** (triggers API calls)
- All CF API calls have error handling for unavailability
- Verification window is 10 minutes (configurable)
- Polling interval is 5 seconds (configurable)
