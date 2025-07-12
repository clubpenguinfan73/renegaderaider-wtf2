# BLACK SCREEN FIX

## The Problem
Your live site at renegaderaider.wtf shows a black screen because the JavaScript is trying to fetch from `/api/profile` but the actual API endpoint is at `/.netlify/functions/api/profile`.

## The Solution
I've updated the code to use the correct API paths. Here's what you need to do:

### Manual Push (Since git is locked)
1. **Open Version Control tab** in Replit (git icon in sidebar)
2. **Click "Push to origin"** or try the shell method:

```bash
# Remove the git lock file first
rm -f .git/index.lock

# Then push
git add client/index.html
git commit -m "Fix API paths for Netlify"
git push origin main
```

### What Changed
- Changed `/api/profile` to `/.netlify/functions/api/profile`
- Changed `/api/links` to `/.netlify/functions/api/links`
- Added proper error handling

### Alternative Quick Fix
If pushing fails, you can manually update the live site by:
1. Going to your Netlify dashboard
2. Manually trigger a redeploy
3. Or wait for the automatic build to complete

## Current Status
- ✅ API working perfectly: `/.netlify/functions/api/profile` returns your data
- ✅ Code fixed with correct paths
- ⏳ Needs to be deployed to fix the black screen

Once deployed, your site will show:
- Your username and bio
- Your social media links
- Working admin panel
- Gaming-themed design

The black screen will be gone!