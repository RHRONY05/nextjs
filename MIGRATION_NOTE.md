# Next.js 16 Migration Note

## ⚠️ Important Change

Next.js 16 has **deprecated `middleware.ts`** in favor of **`proxy.ts`**.

### What Changed

**Before (Next.js 15 and earlier):**
```
src/middleware.ts  ← Old convention
```

**Now (Next.js 16+):**
```
src/proxy.ts  ← New convention
```

### What We Did

1. ✅ Deleted `src/middleware.ts`
2. ✅ Updated `src/proxy.ts` with onboarding redirect logic
3. ✅ Updated all documentation references

### Current Implementation

The `src/proxy.ts` file now handles:
- Authentication checks (via NextAuth)
- Onboarding status verification
- Automatic redirects:
  - Unauthenticated → `/api/auth/signin`
  - Incomplete onboarding → `/onboarding`
  - Complete onboarding on `/onboarding` → `/dashboard`

### No Action Required

Everything is already migrated and working! The proxy file is functionally identical to the old middleware, just with the new naming convention.

### Learn More

- [Next.js Proxy Documentation](https://nextjs.org/docs/messages/middleware-to-proxy)
- [Migration Guide](https://nextjs.org/docs/messages/middleware-to-proxy)
