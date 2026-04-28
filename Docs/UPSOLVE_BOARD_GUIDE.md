# Upsolve Board - Complete Guide

## Overview
A Kanban-style board for tracking problem-solving progress. Drag and drop problems between columns, sync unsolved contest problems, and earn XP for completing challenges.

## Features

### 1. **Three-Column Kanban Board**
- **To Upsolve**: Problems you want to solve
- **Trying**: Problems you're currently working on
- **Solved**: Completed problems

### 2. **Drag & Drop**
- Drag cards between columns
- Visual feedback during drag
- Automatic position updates

### 3. **Contest Sync**
- Automatically adds unsolved problems from your last 5 contests
- Skips problems you've already solved
- Avoids duplicates

### 4. **Manual Problem Addition**
- Add any CF problem by URL
- Supports both formats:
  - `https://codeforces.com/contest/1234/problem/A`
  - `https://codeforces.com/problemset/problem/1234/A`
- Fetches problem details from CF API

### 5. **XP System**
- Earn XP when moving problems to "Solved"
- XP = Problem rating (e.g., 1400 rating = 1400 XP)
- Level progression:
  - Newcomer: 0-5,000 XP
  - Problem Solver: 5,000-35,000 XP
  - Algorithm Adept: 35,000-80,000 XP
  - Code Warrior: 80,000-150,000 XP
  - Grandmaster: 150,000-250,000 XP
  - CF Warrior: 250,000+ XP

### 6. **Problem Cards**
Each card shows:
- Problem ID (e.g., 1234A)
- Problem name
- Rating (if available)
- Contest name (if from contest sync)
- Tags (up to 3)
- Actions: Open on CF, Delete

## API Endpoints

### GET /api/board
Fetch all cards for the user, grouped by column.

**Response:**
```json
{
  "columns": {
    "to_upsolve": [...],
    "trying": [...],
    "solved": [...]
  }
}
```

### POST /api/board
Add a problem manually.

**Request:**
```json
{
  "problemUrl": "https://codeforces.com/contest/1234/problem/A",
  "source": "manual"
}
```

**Response:**
```json
{
  "message": "Card added to board",
  "card": {
    "id": "...",
    "problemName": "Problem Name",
    "rating": 1400,
    "column": "to_upsolve"
  }
}
```

### PATCH /api/board/move
Move a card to a different column.

**Request:**
```json
{
  "cardId": "card_id",
  "newColumn": "trying",
  "newPosition": 0
}
```

**Response (normal move):**
```json
{
  "message": "Card moved successfully",
  "card": {
    "id": "...",
    "column": "trying",
    "position": 0,
    "solvedAt": null
  }
}
```

**Response (moved to solved):**
```json
{
  "message": "Card moved to Solved",
  "card": {...},
  "xpAwarded": 1400,
  "newTotalXp": 26000,
  "newLevel": "Problem Solver",
  "badgesEarned": []
}
```

### DELETE /api/board/:cardId
Delete a card from the board.

**Response:**
```json
{
  "message": "Card deleted successfully"
}
```

### POST /api/board/sync-contests
Sync unsolved problems from recent contests.

**Response:**
```json
{
  "message": "Contest sync completed",
  "addedCards": 12
}
```

## Database Schema

### KanbanCard Model
```typescript
{
  userId: ObjectId (ref: User)
  contestId: number
  problemIndex: string
  problemName: string
  problemUrl: string
  rating?: number
  tags: string[]
  column: "to_upsolve" | "trying" | "solved"
  position: number
  source: "contest_sync" | "topic_ladder" | "manual"
  contestName?: string
  addedAt: Date
  solvedAt?: Date
  autoSolved: boolean
  notes: string
}
```

**Indexes:**
- `userId` (for fast user queries)
- `column` (for filtering by column)
- Compound unique: `userId + contestId + problemIndex` (prevents duplicates)

## User Flow

### Adding Problems

#### Method 1: Contest Sync
1. Click "Sync Contests" button
2. System fetches last 5 contests
3. Finds unsolved problems
4. Adds them to "To Upsolve" column
5. Shows count of added problems

#### Method 2: Manual Addition
1. Click "Add Problem" button
2. Paste CF problem URL
3. System validates and fetches details
4. Problem added to "To Upsolve"

### Working on Problems

1. **Start Working**: Drag card from "To Upsolve" to "Trying"
2. **Open Problem**: Click "Open" to solve on CF
3. **Mark Solved**: Drag card to "Solved" column
4. **Earn XP**: Get XP notification based on rating

### Managing Cards

- **Delete**: Click "Delete" button on any card
- **Reorder**: Drag cards within same column (position updates)
- **View Details**: Hover to see full information

## How It Works

### Contest Sync Algorithm
```typescript
1. Fetch user's last 5 contests from CF API
2. For each contest:
   a. Get all problems from that contest
   b. Filter out already solved problems
   c. Check if problem already on board
   d. If not, add to "To Upsolve" column
3. Return count of added problems
```

### XP Calculation
```typescript
When card moved to "Solved":
1. Check if previously in "Solved" (avoid double XP)
2. Award XP = problem rating (or 800 if no rating)
3. Update user's total XP
4. Calculate new level based on XP thresholds
5. Save to database
6. Return XP and level info
```

### Drag & Drop Flow
```typescript
1. User starts dragging card
2. Store dragged card in state
3. User drops on column
4. Check if column changed
5. If yes, call move API
6. Update UI with new data
7. Show XP notification if solved
```

## UI Components

### Board Layout
```
┌─────────────────────────────────────────┐
│  Header: Title + Sync + Add buttons    │
├─────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ To   │  │Trying│  │Solved│         │
│  │Upsolve│  │      │  │      │         │
│  │      │  │      │  │      │         │
│  │ [12] │  │ [3]  │  │ [45] │         │
│  │      │  │      │  │      │         │
│  │ Card │  │ Card │  │ Card │         │
│  │ Card │  │ Card │  │ Card │         │
│  │ Card │  │      │  │ Card │         │
│  └──────┘  └──────┘  └──────┘         │
└─────────────────────────────────────────┘
```

### Problem Card
```
┌─────────────────────────┐
│ 1234A          [1400]   │ ← ID + Rating
│ Problem Name            │ ← Title
│ Codeforces Round 856    │ ← Contest (if any)
│ [dp] [greedy] [math]    │ ← Tags
│ [Open] [Delete]         │ ← Actions
└─────────────────────────┘
```

### Add Problem Modal
```
┌─────────────────────────────┐
│ Add Problem to Board        │
│                             │
│ Paste a Codeforces URL:     │
│ [____________________]      │
│                             │
│ [Add Problem] [Cancel]      │
└─────────────────────────────┘
```

## Styling

All styles are in `public/css/board.css`:
- `.board-header` - Top bar with buttons
- `.board-area` - Main board container
- `.kanban-col` - Column container
- `.problem-card` - Individual problem card
- `.modal-overlay` - Add problem modal

## Error Handling

### Common Errors

**"Problem already exists on your board"**
- Trying to add duplicate problem
- Check board before adding

**"Invalid CF problem URL format"**
- URL doesn't match expected pattern
- Use format: `/contest/1234/problem/A`

**"Problem not found on Codeforces"**
- Problem doesn't exist or is private
- Verify problem ID

**"CF handle not found or not verified"**
- User hasn't completed onboarding
- Redirect to onboarding

## Performance Optimizations

### Database Queries
- Indexed by `userId` for fast filtering
- Sorted by `position` for correct order
- Lean queries for read-only operations

### API Calls
- Batch problem fetching (one call per contest)
- Cached problemset data
- Debounced drag operations

### UI Updates
- Optimistic UI updates
- Loading states during operations
- Error boundaries for failed operations

## Future Enhancements

### Potential Features
1. **Notes**: Add notes to each card
2. **Filters**: Filter by rating, tags, source
3. **Search**: Search problems by name
4. **Bulk Actions**: Move/delete multiple cards
5. **Auto-Solve Detection**: Automatically move to solved when detected in CF submissions
6. **Problem Recommendations**: Suggest problems for "To Upsolve"
7. **Time Tracking**: Track time spent on each problem
8. **Difficulty Badges**: Visual indicators for problem difficulty
9. **Collaboration**: Share boards with friends
10. **Export**: Export board as CSV/JSON

## Testing

### Test Scenarios

**1. Add Problem Manually**
```
1. Click "Add Problem"
2. Paste: https://codeforces.com/contest/1/problem/A
3. Verify card appears in "To Upsolve"
4. Check problem details are correct
```

**2. Sync Contests**
```
1. Click "Sync Contests"
2. Wait for completion
3. Verify unsolved problems added
4. Check no duplicates created
```

**3. Drag & Drop**
```
1. Drag card from "To Upsolve" to "Trying"
2. Verify card moves
3. Drag to "Solved"
4. Verify XP notification appears
```

**4. Delete Card**
```
1. Click "Delete" on any card
2. Confirm deletion
3. Verify card removed from board
```

**5. XP Award**
```
1. Move 1400-rated problem to "Solved"
2. Verify "+1400 XP" notification
3. Check profile shows updated XP
4. Verify level progression if threshold crossed
```

## Troubleshooting

### Cards Not Appearing
- Check MongoDB connection
- Verify user is authenticated
- Check browser console for errors

### Drag & Drop Not Working
- Ensure `draggable` attribute is set
- Check event handlers are attached
- Verify state updates correctly

### Sync Not Adding Cards
- Verify user has contest history
- Check CF API is accessible
- Ensure problems aren't already solved

### XP Not Updating
- Check move API response
- Verify user model has gamification field
- Check XP calculation logic

## Summary

The Upsolve Board provides:
- ✅ Visual problem tracking
- ✅ Drag & drop interface
- ✅ Contest sync automation
- ✅ Manual problem addition
- ✅ XP and leveling system
- ✅ Problem organization
- ✅ Progress visualization

Perfect for tracking your competitive programming journey! 🎯
