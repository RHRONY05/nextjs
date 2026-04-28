# AlgoBoard - Quick Start Guide

## ✅ What's Been Implemented

### 1. Complete Onboarding Flow
- ✅ Google OAuth sign-in
- ✅ CF handle validation via real CF API
- ✅ Handle verification (submit problem on CF)
- ✅ Preferences setup (target rank, email settings)
- ✅ Automatic redirects based on onboarding status

### 2. Real Codeforces Integration
- ✅ Fetch user profile (rating, rank, country, org)
- ✅ Fetch submissions (last 100, filters accepted)
- ✅ Fetch contest history (all rated contests)
- ✅ Manual sync button with loading state
- ✅ Last synced timestamp

### 3. Dashboard with Real Data
- ✅ Profile header with CF data
- ✅ Problems solved count
- ✅ Contest participation count
- ✅ Rating bucket chart (problems by rating)
- ✅ Topic tag chart (top 10 tags)
- ✅ Rating graph (contest history)
- ✅ Contest table (recent performances)

### 4. Settings Page
- ✅ View/edit profile
- ✅ View CF handle and rating
- ✅ Change target rank
- ✅ Update email preferences
- ✅ Re-verify handle option
- ✅ Save changes to database

### 5. Proxy & Auth
- ✅ Protected routes
- ✅ Automatic onboarding redirect
- ✅ Session-based authentication

## 🚀 How to Test

### Step 1: Start the App
```bash
npm run dev
```

### Step 2: Sign In
1. Visit `http://localhost:3000`
2. Click "Sign in with Google"
3. Complete OAuth flow

### Step 3: Onboarding
You'll be automatically redirected to `/onboarding`

**Handle Step:**
- Enter a real CF handle (try "tourist", "Petr", or your own)
- Click "Look up Handle"
- See CF profile data

**Verify Step:**
- You'll be assigned a random problem (4A, 71A, 158A, 231A, or 263A)
- Submit ANY solution on Codeforces (even Wrong Answer works!)
- Wait 5-10 seconds for polling to detect
- Auto-advances when verified

**Preferences Step:**
- Select target rank
- Configure email reminders
- Click "Go to My Dashboard"

### Step 4: Dashboard
- See your real CF data!
- Click "Sync Now" to refresh data
- Navigate using sidebar

### Step 5: Settings
- Go to Settings
- Change target rank
- Update email preferences
- Click "Save Changes"

## 📊 What Data is Real vs Mock

### ✅ Real Data (from CF API)
- CF handle, rating, rank, peak rating
- Country, organization
- Problems solved (last 100 submissions)
- Contest history (all rated contests)
- Problems by rating bucket
- Problems by topic tag

### ⚠️ Mock/Placeholder Data
- Submission heatmap (shows placeholder)
- Current streak (not calculated yet)
- Longest streak (not calculated yet)
- XP and level (not implemented)
- Badges (not implemented)

## 🔧 API Endpoints

### Onboarding
- `POST /api/onboarding/handle` - Validate CF handle
- `POST /api/onboarding/verify/initiate` - Start verification
- `GET /api/onboarding/verify/status` - Poll verification
- `POST /api/onboarding/complete` - Save preferences

### User & Sync
- `GET /api/user` - Get user data
- `PATCH /api/user` - Update profile
- `POST /api/cf/sync` - Sync CF data

### Auth
- `GET /api/auth/signin` - Google OAuth
- `GET /api/auth/session` - Current session
- `POST /api/auth/signout` - Sign out

## 🎯 Key Features

### 1. Handle Verification
- Prevents account hijacking
- Uses random problem from pool of 5
- 10-minute verification window
- Polls CF API every 5 seconds
- Any verdict counts (even WA)

### 2. Data Sync
- Fetches from 3 CF API endpoints
- Updates MongoDB with latest data
- Shows last synced timestamp
- Loading states during sync

### 3. Smart Redirects
- Proxy checks onboarding status
- Incomplete → `/onboarding`
- Complete → `/dashboard`
- Unauthenticated → `/api/auth/signin`

## 🐛 Troubleshooting

### "Handle does not exist on Codeforces"
- Make sure you're entering a valid CF handle
- Check spelling and capitalization
- Try a known handle like "tourist" to test

### "Verification expired"
- You have 10 minutes to submit
- Click "Go back" and restart verification
- Make sure you're submitting to the correct problem

### "Sync failed"
- CF API might be down temporarily
- Check your internet connection
- Try again in a few seconds

### "Not redirecting to onboarding"
- Clear browser cache
- Check MongoDB connection
- Verify proxy.ts is running

## 📝 Environment Setup

Make sure `.env.local` has:
```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
CF_API=...  # Optional for public endpoints
CF_SECRET=...  # Optional for public endpoints
```

## 🎨 UI Components

All components use CSS variables from `globals.css`:
- `--color-primary` - Indigo accent
- `--color-secondary` - Teal accent
- `--color-surface` - Dark background
- `--color-on-surface` - Light text

## 🔄 Data Flow

```
User Sign In
    ↓
Proxy checks onboarding
    ↓
Onboarding (if incomplete)
    ↓
Dashboard (fetches from MongoDB)
    ↓
Sync Button → CF API → MongoDB → Refresh
```

## 🚀 Next Features to Build

1. **Kanban Board** - Problem upsolving tracker
2. **Topic Ladder** - Curated problem sets
3. **Badges** - Achievement system
4. **Leaderboard** - Compare with friends
5. **Email Worker** - Daily problem reminders
6. **Auto Sync** - Cron job for background sync
7. **Heatmap** - Real submission calendar
8. **Streaks** - Daily solve tracking

## 💡 Tips

- Use a real CF account for testing
- Submit to verification problem quickly (10 min limit)
- Sync data after contests to see updates
- Check MongoDB to see stored data
- Use browser DevTools to debug API calls

## 📚 Documentation

- `SETUP_GUIDE.md` - Detailed technical documentation
- `CODEFORCES_ONBOARDING_SETUP.md` - Onboarding implementation details
- `Docs/AlgoBoard-PRD.md` - Product requirements

## 🎉 You're All Set!

Your AlgoBoard is now connected to real Codeforces data. Test the flow, sync your data, and start building the remaining features!
