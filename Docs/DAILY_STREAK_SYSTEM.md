# Daily Streak System & Problem Recommendations

## Overview
Implemented a complete daily streak tracking system with intelligent problem recommendations based on user's current rating and target rank.

## Features Implemented

### 1. **Improved CF Data Sync**
- ✅ Fetches **ALL submissions** (not just 100)
- ✅ Uses batching to handle large submission histories
- ✅ Fetches 10,000 submissions per batch
- ✅ Continues until all submissions are retrieved

### 2. **Streak Calculation**
The system now calculates:
- **Current Streak**: Consecutive days with at least one solved problem
- **Longest Streak**: Best streak ever achieved
- **Last Solved Date**: Most recent problem solve date

#### How Streak Works:
```
Day 1: Solve problem → Streak = 1
Day 2: Solve problem → Streak = 2
Day 3: No solve → Streak = 0
Day 4: Solve problem → Streak = 1 (new streak starts)
```

#### Streak Rules:
- Solving any problem on a day counts
- Missing a day resets current streak to 0
- Longest streak is preserved
- Streak continues if you solved today OR yesterday

### 3. **Daily Problem Recommendation**
Smart algorithm that recommends problems based on:

#### Factors Considered:
1. **Current Rating**: User's CF rating
2. **Target Rating**: User's goal rank
3. **Difficulty Range**: 
   - Minimum: `currentRating - 200` (but not below 800)
   - Maximum: `targetRating + 200` (but not above `currentRating + 400`)
4. **Unsolved**: Only problems user hasn't solved
5. **Quality**: Problems with tags (better quality)

#### Difficulty Levels:
- **Challenging**: Problem rating > current + 100
- **Moderate**: Problem rating > current (but ≤ current + 100)
- **Practice**: Problem rating ≤ current

#### Daily Consistency:
- Uses date-based seed for consistent daily problem
- Same problem for entire day (UTC)
- Changes at midnight UTC

### 4. **Dashboard Integration**
New "Daily Problem Challenge" card shows:
- Problem name and ID
- Problem rating
- Tags (up to 4)
- Difficulty badge
- Current vs target rating
- Direct link to solve on CF

## API Endpoints

### GET /api/daily-problem
Returns recommended problem for the day.

**Response:**
```json
{
  "problem": {
    "contestId": 1234,
    "index": "A",
    "name": "Problem Name",
    "rating": 1400,
    "tags": ["dp", "greedy"],
    "url": "https://codeforces.com/problemset/problem/1234/A"
  },
  "recommendation": {
    "currentRating": 1342,
    "targetRating": 1600,
    "difficulty": "moderate"
  }
}
```

### POST /api/cf/sync (Updated)
Now includes streak calculation.

**New Response Fields:**
```json
{
  "message": "Sync completed",
  "syncedAt": "2026-04-21T...",
  "solvedProblems": 186,
  "contests": 23
}
```

**Updated User Model:**
```typescript
gamification: {
  currentStreak: 5,      // Days in a row
  longestStreak: 12,     // Best ever
  lastSolvedDate: Date   // Most recent solve
}
```

## How It Works

### Streak Calculation Algorithm:
```typescript
1. Get all accepted submissions
2. Extract unique solve dates (YYYY-MM-DD)
3. Sort dates descending (newest first)
4. Check if today or yesterday has a solve
   - Yes → Start counting current streak
   - No → Current streak = 0
5. Walk backwards through dates
   - Consecutive days → Increment streak
   - Gap found → Reset temp counter
6. Track longest streak seen
```

### Problem Recommendation Algorithm:
```typescript
1. Determine rating range:
   minRating = max(800, currentRating - 200)
   maxRating = min(targetRating + 200, currentRating + 400)

2. Fetch all CF problems

3. Filter problems:
   - Has rating in range
   - Not already solved
   - Has tags (quality indicator)

4. Select problem:
   - Use date-based seed for consistency
   - Same problem all day
   - Changes at midnight UTC
```

## User Experience

### Dashboard Flow:
1. User logs in
2. Dashboard loads with real CF data
3. **Daily Problem Card** appears at top
4. Shows personalized recommendation
5. User clicks "Solve on Codeforces"
6. Opens problem in new tab
7. After solving, user clicks "Sync Now"
8. Streak updates automatically

### Streak Display:
- Shows in profile header: "5🔥 Day Streak"
- Shows longest: "Longest: 12 days"
- Updates after each sync

## Example Scenarios

### Scenario 1: Beginner User
```
Current Rating: 1200
Target Rank: Expert (1600)
Recommendation Range: 1000-1800
Difficulty: Moderate (1300-1400 problems)
```

### Scenario 2: Advanced User
```
Current Rating: 1800
Target Rank: Candidate Master (1900)
Recommendation Range: 1600-2100
Difficulty: Challenging (1900-2200 problems)
```

### Scenario 3: Streak Maintenance
```
Day 1: Solve daily problem → Streak = 1
Day 2: Solve daily problem → Streak = 2
Day 3: Solve daily problem → Streak = 3
Day 4: Miss day → Streak = 0
Day 5: Solve daily problem → Streak = 1 (new)
```

## Benefits

### For Users:
- ✅ Consistent daily practice
- ✅ Problems matched to skill level
- ✅ Clear progress tracking
- ✅ Motivation through streaks
- ✅ Gradual difficulty increase

### For Learning:
- ✅ Spaced repetition
- ✅ Skill-appropriate challenges
- ✅ Diverse problem types
- ✅ Goal-oriented practice

## Technical Details

### Performance:
- Batched CF API calls (10k per batch)
- Efficient date-based filtering
- Cached problem recommendations (daily)
- Optimized streak calculation

### Data Storage:
```typescript
User Model:
  solvedProblems: Array<{
    contestId, problemIndex, problemName,
    rating, tags, solvedAt
  }>
  gamification: {
    currentStreak: number
    longestStreak: number
    lastSolvedDate: Date
  }
```

### Error Handling:
- CF API unavailable → Shows error message
- No suitable problems → Suggests sync
- Network errors → Graceful fallback

## Future Enhancements

### Potential Additions:
1. **Streak Freeze**: Allow 1 missed day per week
2. **Problem History**: Track daily problems solved
3. **Difficulty Adjustment**: Learn from user performance
4. **Topic Focus**: Recommend based on weak areas
5. **Streak Rewards**: Badges for milestones
6. **Social Features**: Compare streaks with friends
7. **Push Notifications**: Daily reminders
8. **Problem Sets**: Weekly themed challenges

## Testing

### Test Streak Calculation:
1. Sync CF data
2. Check `user.gamification.currentStreak`
3. Verify against actual solve dates
4. Test edge cases (today, yesterday, gaps)

### Test Problem Recommendation:
1. Visit dashboard
2. Check daily problem card
3. Verify rating is in appropriate range
4. Confirm problem not already solved
5. Test consistency (same problem all day)

### Test Sync:
1. Click "Sync Now"
2. Wait for completion
3. Verify all submissions fetched
4. Check streak updated correctly
5. Confirm problem counts accurate

## Configuration

### Adjustable Parameters:

**In `/api/daily-problem/route.ts`:**
```typescript
const minRating = Math.max(800, currentRating - 200);
const maxRating = Math.min(targetRating + 200, currentRating + 400);
```

**In `/api/cf/sync/route.ts`:**
```typescript
const batchSize = 10000; // Submissions per batch
```

## Summary

The daily streak system provides:
- ✅ Accurate streak tracking
- ✅ Intelligent problem recommendations
- ✅ Complete submission history
- ✅ Goal-oriented practice
- ✅ Motivation through gamification

All data is synced from real Codeforces API and stored in MongoDB for fast access!
