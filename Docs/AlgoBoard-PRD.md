# Product Requirements Document — API Reference
## AlgoBoard — The Codeforces Productivity Dashboard

**Version:** 1.0
**Date:** April 7, 2026
**Base URL (Next.js API Routes):** `/api`
**Base URL (Express Server):** `/api/worker`
**Auth:** NextAuth session cookie (Next.js routes) | JWT Bearer token (Express routes)

---

## Auth Endpoints (Next.js — handled by NextAuth)

### GET /api/auth/signin
**Purpose:** Initiates Google OAuth flow
**Auth required:** No
**Handled by:** NextAuth.js automatically
**Behavior:** Redirects user to Google consent screen

---

### GET /api/auth/callback/google
**Purpose:** Google OAuth callback — creates or logs in user
**Auth required:** No
**Handled by:** NextAuth.js automatically
**Behavior:** On success, creates JWT session cookie and redirects to /dashboard or /onboarding

---

### GET /api/auth/session
**Purpose:** Returns current session for the logged-in user
**Auth required:** No (returns null if not logged in)

**Success response (200):**
```json
{
  "user": {
    "id": "mongo_user_id",
    "name": "Rony Das",
    "email": "rony@gmail.com",
    "avatar": "https://googleavatar.url"
  },
  "expires": "2026-05-07T00:00:00.000Z"
}
```

---

### POST /api/auth/signout
**Purpose:** Ends the user session
**Auth required:** Yes
**Handled by:** NextAuth.js automatically

---

## Onboarding Endpoints (Next.js API Routes)

### POST /api/onboarding/handle
**Purpose:** Submit CF handle to check existence before verification
**Auth required:** Yes

**Request body:**
```json
{
  "cfHandle": "tourist"
}
```

**Success response (200):**
```json
{
  "exists": true,
  "cfProfile": {
    "handle": "tourist",
    "rating": 1400,
    "rank": "specialist",
    "avatar": "https://userpic.codeforces.com/..."
  }
}
```

**Error responses:**
- `400` — cfHandle field missing
- `404` — Handle does not exist on Codeforces
- `409` — Handle already claimed by another AlgoBoard user

---

### POST /api/onboarding/verify/initiate
**Purpose:** Starts the handle verification process — assigns verification problem
**Auth required:** Yes

**Request body:**
```json
{
  "cfHandle": "tourist"
}
```

**Success response (200):**
```json
{
  "verificationProblem": {
    "contestId": 4,
    "problemIndex": "A",
    "problemName": "Watermelon",
    "url": "https://codeforces.com/problemset/problem/4/A"
  },
  "expiresAt": "2026-04-07T09:10:00.000Z",
  "instructions": "Submit any solution to problem 4A on Codeforces within 10 minutes"
}
```

**Error responses:**
- `400` — Handle not provided
- `429` — Verification already in progress for this user

---

### GET /api/onboarding/verify/status
**Purpose:** Poll endpoint — checks if verification submission has been detected
**Auth required:** Yes

**Success response (200) — pending:**
```json
{
  "status": "pending",
  "message": "Waiting for your submission...",
  "timeRemainingSeconds": 420
}
```

**Success response (200) — verified:**
```json
{
  "status": "verified",
  "cfHandle": "tourist",
  "message": "Handle verified successfully!"
}
```

**Success response (200) — expired:**
```json
{
  "status": "expired",
  "message": "Verification window expired. Please try again."
}
```

---

### POST /api/onboarding/complete
**Purpose:** Save target rank, email preferences, and mark onboarding as complete
**Auth required:** Yes

**Request body:**
```json
{
  "targetRank": "expert",
  "emailPreferences": {
    "enabled": true,
    "frequency": "daily",
    "preferredHour": 8,
    "timezone": "Asia/Dhaka"
  }
}
```

**Success response (200):**
```json
{
  "message": "Onboarding complete",
  "redirectTo": "/dashboard"
}
```

**Error responses:**
- `400` — targetRank is invalid or missing
- `400` — preferredHour out of range (must be 0-23)

---

## User Profile Endpoints (Next.js API Routes)

### GET /api/user/profile
**Purpose:** Fetch the logged-in user's full profile for the dashboard
**Auth required:** Yes

**Success response (200):**
```json
{
  "user": {
    "id": "mongo_id",
    "name": "Rony Das",
    "email": "rony@gmail.com",
    "avatar": "https://googleavatar.url",
    "cfHandle": "rony_cf",
    "cfHandleVerified": true,
    "cfProfile": {
      "rating": 1342,
      "maxRating": 1400,
      "rank": "specialist",
      "maxRank": "specialist",
      "cfAvatar": "https://userpic.codeforces.com/...",
      "lastSyncedAt": "2026-04-07T06:00:00.000Z"
    },
    "targetRank": "expert",
    "targetRating": 1600,
    "gamification": {
      "xp": 24500,
      "level": "Problem Solver",
      "currentStreak": 5,
      "longestStreak": 12,
      "earnedBadges": [
        { "badgeId": "first_blood", "earnedAt": "2026-03-01T10:00:00.000Z" }
      ]
    },
    "onboardingComplete": true
  }
}
```

**Error responses:**
- `401` — Not authenticated

---

### PATCH /api/user/profile
**Purpose:** Update user preferences (target rank, email settings)
**Auth required:** Yes

**Request body (all fields optional):**
```json
{
  "targetRank": "candidate_master",
  "emailPreferences": {
    "enabled": false,
    "frequency": "weekly",
    "preferredHour": 20,
    "timezone": "Asia/Dhaka"
  }
}
```

**Success response (200):**
```json
{
  "message": "Profile updated successfully",
  "updated": { "targetRank": "candidate_master" }
}
```

**Error responses:**
- `400` — Invalid targetRank value
- `401` — Not authenticated

---

## Stats Dashboard Endpoints (Next.js API Routes)

### GET /api/stats/summary
**Purpose:** Fetch all stats needed for the dashboard — problems by rating, problems by tag, heatmap data
**Auth required:** Yes

**Success response (200):**
```json
{
  "problemsByRating": [
    { "rating": 800, "count": 42 },
    { "rating": 900, "count": 35 },
    { "rating": 1000, "count": 28 }
  ],
  "problemsByTag": [
    { "tag": "implementation", "count": 67 },
    { "tag": "dp", "count": 23 },
    { "tag": "binary search", "count": 18 }
  ],
  "heatmapData": [
    { "date": "2026-04-01", "count": 3 },
    { "date": "2026-04-02", "count": 0 },
    { "date": "2026-04-03", "count": 5 }
  ],
  "totalSolved": 186,
  "uniqueTags": 14
}
```

---

### GET /api/stats/contests
**Purpose:** Fetch contest history for the rating graph and history table
**Auth required:** Yes

**Query params:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Success response (200):**
```json
{
  "ratingGraph": [
    {
      "contestId": 1900,
      "contestName": "Codeforces Round 856 (Div. 2)",
      "rank": 1204,
      "oldRating": 1280,
      "newRating": 1342,
      "ratingChange": 62,
      "participatedAt": "2026-03-15T14:35:00.000Z"
    }
  ],
  "total": 23,
  "page": 1,
  "totalPages": 2
}
```

---

## CF Sync Endpoints (Express Server)

### POST /api/worker/sync
**Purpose:** Trigger a full CF data sync for the logged-in user
**Auth required:** Yes (Bearer token)

**Request body:**
```json
{
  "userId": "mongo_user_id"
}
```

**Success response (200):**
```json
{
  "message": "Sync completed",
  "syncedAt": "2026-04-07T09:00:00.000Z",
  "newCards": 3,
  "updatedProblems": 12,
  "newContests": 1
}
```

**Error responses:**
- `401` — Unauthorized
- `404` — CF handle not found or not verified
- `503` — Codeforces API is currently unavailable

---

## Kanban Board Endpoints (Next.js API Routes)

### GET /api/board
**Purpose:** Fetch all Kanban cards for the logged-in user, grouped by column
**Auth required:** Yes

**Success response (200):**
```json
{
  "columns": {
    "to_upsolve": [
      {
        "id": "card_mongo_id",
        "contestId": 1900,
        "problemIndex": "C",
        "problemName": "Powering the Hero",
        "problemUrl": "https://codeforces.com/contest/1900/problem/C",
        "rating": 1400,
        "tags": ["greedy", "data structures"],
        "contestName": "Codeforces Round 856 (Div. 2)",
        "source": "contest_sync",
        "position": 0,
        "addedAt": "2026-04-06T10:00:00.000Z"
      }
    ],
    "trying": [],
    "solved": []
  }
}
```

---

### POST /api/board/add
**Purpose:** Manually add a problem card to the board by pasting a CF URL
**Auth required:** Yes

**Request body:**
```json
{
  "problemUrl": "https://codeforces.com/contest/1800/problem/B",
  "source": "manual"
}
```

**Success response (201):**
```json
{
  "message": "Card added to board",
  "card": {
    "id": "new_card_id",
    "problemName": "Sasha and Array",
    "rating": 1600,
    "column": "to_upsolve"
  }
}
```

**Error responses:**
- `400` — Invalid CF problem URL format
- `404` — Problem not found on Codeforces
- `409` — Problem already exists on your board

---

### PATCH /api/board/move
**Purpose:** Move a card to a different column (drag and drop)
**Auth required:** Yes

**Request body:**
```json
{
  "cardId": "card_mongo_id",
  "newColumn": "trying",
  "newPosition": 0
}
```

**Success response (200):**
```json
{
  "message": "Card moved successfully",
  "card": {
    "id": "card_mongo_id",
    "column": "trying",
    "position": 0,
    "solvedAt": null
  }
}
```

**Note:** When newColumn is "solved", response includes XP awarded:
```json
{
  "message": "Card moved to Solved",
  "card": { "id": "...", "column": "solved", "solvedAt": "2026-04-07T..." },
  "xpAwarded": 1400,
  "newTotalXp": 26000,
  "newLevel": "Problem Solver",
  "badgesEarned": []
}
```

**Error responses:**
- `400` — Invalid column value
- `403` — Card does not belong to this user
- `404` — Card not found

---

### DELETE /api/board/:cardId
**Purpose:** Remove a card from the board permanently
**Auth required:** Yes

**Success response (200):**
```json
{
  "message": "Card deleted successfully"
}
```

**Error responses:**
- `403` — Card does not belong to this user
- `404` — Card not found

---

## Topic Ladder Endpoints (Next.js API Routes)

### GET /api/topics
**Purpose:** Fetch all active topics with the user's progress per topic
**Auth required:** Yes

**Success response (200):**
```json
{
  "topics": [
    {
      "slug": "binary-search",
      "displayName": "Binary Search",
      "icon": "🔍",
      "description": "Find elements efficiently in sorted arrays.",
      "layer": 2,
      "difficultyLabel": "Intermediate",
      "recommendedFor": ["specialist", "expert"],
      "prerequisites": ["sorting"],
      "userSolvedCount": 3,
      "totalProblems": 6,
      "isRecommended": true
    }
  ]
}
```

---

### GET /api/topics/:slug
**Purpose:** Fetch the 6 curated problems for a specific topic, with user solve status
**Auth required:** Yes

**URL params:** `slug` — e.g. "binary-search"

**Success response (200):**
```json
{
  "topic": {
    "slug": "binary-search",
    "displayName": "Binary Search",
    "description": "Find elements efficiently in sorted arrays."
  },
  "problems": [
    {
      "id": "curated_problem_id",
      "contestId": 702,
      "problemIndex": "C",
      "problemName": "Cellular Network",
      "problemUrl": "https://codeforces.com/contest/702/problem/C",
      "platform": "codeforces",
      "tier": "canonical",
      "rating": 1600,
      "solveCount": 34821,
      "hasEditorial": true,
      "editorialUrl": "https://codeforces.com/blog/entry/...",
      "worthScore": 0.87,
      "isSolved": false,
      "isOnBoard": false
    }
  ]
}
```

**Error responses:**
- `404` — Topic slug not found

---

## Gamification Endpoints (Next.js API Routes)

### GET /api/gamification/status
**Purpose:** Get user's current XP, level, streak, and badge progress
**Auth required:** Yes

**Success response (200):**
```json
{
  "xp": 24500,
  "level": "Problem Solver",
  "nextLevel": "Algorithm Adept",
  "xpToNextLevel": 10500,
  "currentStreak": 5,
  "longestStreak": 12,
  "streakShieldActive": false,
  "earnedBadges": [
    {
      "badgeId": "first_blood",
      "displayName": "First Blood",
      "icon": "🩸",
      "rarity": "common",
      "earnedAt": "2026-03-01T10:00:00.000Z"
    }
  ],
  "unearnedBadges": [
    {
      "badgeId": "upsolve_warrior",
      "displayName": "Upsolve Warrior",
      "icon": "⚔️",
      "rarity": "rare",
      "description": "Move 10 problem cards to Solved",
      "progress": 7,
      "threshold": 10
    }
  ]
}
```

---

### GET /api/gamification/badges
**Purpose:** Fetch all badge definitions (for the badges showcase page)
**Auth required:** Yes

**Success response (200):**
```json
{
  "badges": [
    {
      "badgeId": "first_blood",
      "displayName": "First Blood",
      "description": "Submit your first problem via AlgoBoard",
      "icon": "🩸",
      "rarity": "common",
      "earned": true,
      "earnedAt": "2026-03-01T10:00:00.000Z"
    }
  ]
}
```

---

## Email Preference Endpoints (Next.js API Routes)

### GET /api/email/preferences
**Purpose:** Fetch user's current email reminder settings
**Auth required:** Yes

**Success response (200):**
```json
{
  "enabled": true,
  "frequency": "daily",
  "preferredHour": 8,
  "timezone": "Asia/Dhaka",
  "lastEmailSentAt": "2026-04-07T02:30:00.000Z"
}
```

---

### PATCH /api/email/preferences
**Purpose:** Update email reminder settings
**Auth required:** Yes

**Request body (all fields optional):**
```json
{
  "enabled": true,
  "frequency": "every_2_days",
  "preferredHour": 20,
  "timezone": "Asia/Dhaka"
}
```

**Success response (200):**
```json
{
  "message": "Email preferences updated"
}
```

**Error responses:**
- `400` — frequency must be one of: daily, every_2_days, weekly, off
- `400` — preferredHour must be between 0 and 23

---

## Internal / Worker Endpoints (Express Server)

### POST /api/worker/verify/poll
**Purpose:** Internal endpoint — Express polls CF API to check for verification submission
**Auth required:** Internal service token only (not user-facing)

**Triggered by:** Express polling loop started when user initiates verification

---

### POST /api/worker/cron/sync-all
**Purpose:** Internal cron trigger — syncs CF data for all users (runs every 6 hours)
**Auth required:** Internal service token only

---

### POST /api/worker/cron/send-emails
**Purpose:** Internal cron trigger — sends daily reminder emails to eligible users
**Auth required:** Internal service token only

---

## Standard Error Response Format

All endpoints return errors in this format:

```json
{
  "error": true,
  "message": "Human readable error message",
  "code": "ERROR_CODE"
}
```

**Common error codes:**
- `UNAUTHORIZED` — No valid session found
- `FORBIDDEN` — Authenticated but not allowed to access this resource
- `NOT_FOUND` — Requested resource does not exist
- `VALIDATION_ERROR` — Request body failed validation
- `CF_API_UNAVAILABLE` — Codeforces API is unreachable
- `HANDLE_NOT_VERIFIED` — Action requires a verified CF handle
- `DUPLICATE_ENTRY` — Resource already exists (e.g. card already on board)
- `RATE_LIMITED` — Too many requests; try again later
