# Codeforces Account Connection - Implementation Summary

## Overview
Complete onboarding flow for users to connect and verify their Codeforces accounts using the CF API.

## What Was Built

### 1. API Routes (Backend)

#### `POST /api/onboarding/handle`
- **Location**: `src/app/api/onboarding/handle/route.ts`
- **Purpose**: Looks up a CF handle via Codeforces API
- **Features**:
  - Validates handle exists on Codeforces
  - Checks for duplicate claims by other users
  - Returns profile data (handle, rating, rank, avatar)
- **Response**: `{ exists: true, cfProfile: {...} }`

#### `POST /api/onboarding/verify/initiate`
- **Location**: `src/app/api/onboarding/verify/initiate/route.ts`
- **Purpose**: Starts verification by assigning a random problem
- **Features**:
  - Picks from 5 easy verification problems (4A, 71A, 158A, 231A, 263A)
  - Sets 10-minute verification window
  - Stores verification state in user document
  - Prevents duplicate verification attempts
- **Response**: `{ verificationProblem: {...}, expiresAt: "...", instructions: "..." }`

#### `GET /api/onboarding/verify/status`
- **Location**: `src/app/api/onboarding/verify/status/route.ts`
- **Purpose**: Polls CF API to check for verification submission
- **Features**:
  - Fetches last 10 submissions from CF API
  - Checks if user submitted to verification problem after initiation
  - Marks handle as verified when submission detected
  - Returns time remaining or expiry status
- **Response**: `{ status: "pending" | "verified" | "expired", ... }`

#### `POST /api/onboarding/complete`
- **Location**: `src/app/api/onboarding/complete/route.ts`
- **Purpose**: Saves preferences and marks onboarding complete
- **Features**:
  - Validates target rank (specialist, expert, candidate_master, master)
  - Maps rank to target rating (1400, 1600, 1900, 2100)
  - Saves email preferences (enabled, frequency, preferredHour, timezone)
  - Sets `onboardingComplete: true`
- **Response**: `{ message: "Onboarding complete", redirectTo: "/dashboard" }`

### 2. Frontend Components (Updated)

#### `HandleStep.tsx`
- **Location**: `src/components/onboarding/HandleStep.tsx`
- **Changes**:
  - Calls `POST /api/onboarding/handle` instead of mock data
  - Shows real CF profile data from API
  - Displays error messages for invalid handles or conflicts
  - Handles network errors gracefully

#### `VerifyStep.tsx`
- **Location**: `src/components/onboarding/VerifyStep.tsx`
- **Changes**:
  - Calls `POST /api/onboarding/verify/initiate` on mount
  - Displays assigned verification problem dynamically
  - Polls `GET /api/onboarding/verify/status` every 5 seconds
  - Shows countdown timer synced with server expiry
  - Auto-advances to next step when verified

#### `PreferencesStep.tsx`
- **Location**: `src/components/onboarding/PreferencesStep.tsx`
- **Changes**:
  - Calls `POST /api/onboarding/complete` with form data
  - Redirects to dashboard on success
  - Shows error alerts on failure

## User Flow

1. **Step 1: Enter Handle**
   - User types CF handle → clicks "Look up Handle"
   - System validates via CF API
   - Shows profile card if found

2. **Step 2: Verify Ownership**
   - System assigns random verification problem
   - User submits solution on Codeforces (any verdict counts)
   - System polls CF API every 5s for submission
   - Auto-advances when submission detected

3. **Step 3: Set Preferences**
   - User selects target rank
   - Configures email reminders
   - Clicks "Go to My Dashboard"
   - System saves preferences and redirects

## Environment Variables Used

From `.env.local`:
- `CF_API`: Codeforces API key (stored but not required for public endpoints)
- `CF_SECRET`: Codeforces API secret (stored but not required for public endpoints)
- `MONGODB_URI`: Database connection
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`: NextAuth config

## Database Schema Updates

The existing `User` model already supports:
- `cfHandle`: string
- `cfHandleVerified`: boolean
- `cfVerification`: { initiatedAt, problem, expiresAt }
- `targetRank`: string
- `targetRating`: number
- `emailPreferences`: { enabled, frequency, preferredHour, timezone }
- `onboardingComplete`: boolean

No schema changes were needed.

## Testing the Flow

1. Start the dev server: `npm run dev`
2. Sign in with Google
3. Navigate to `/onboarding`
4. Enter a real CF handle (e.g., "tourist", "Petr", or your own)
5. When verification problem appears, submit any solution on Codeforces
6. Wait for polling to detect submission (~5-10 seconds)
7. Complete preferences and verify redirect to dashboard

## Notes

- **CF API Rate Limits**: Public endpoints have no auth required but may rate limit. The verification polling is set to 5s intervals to be respectful.
- **Verification Window**: 10 minutes (configurable in `verify/initiate/route.ts`)
- **Problem Pool**: 5 easy problems (expandable in `verify/initiate/route.ts`)
- **Polling Frequency**: Every 5 seconds (configurable in `VerifyStep.tsx`)
- **Submission Count**: Fetches last 10 submissions (configurable in `verify/status/route.ts`)

## Next Steps (Optional Enhancements)

- Add WebSocket for real-time verification instead of polling
- Expand verification problem pool
- Add retry mechanism for expired verifications
- Show submission history during verification
- Add analytics tracking for onboarding completion rate
