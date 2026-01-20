# 🚀 Deployment Guide - BET Marketplace

This guide will help you deploy your BET Marketplace application to get a public preview link that works 24/7.

## ✅ Current Status

- ✅ All code fixes complete (no compilation errors)
- ✅ Production build successful
- ✅ GitHub repository up to date
- ✅ Vercel configuration ready (`vercel.json`)
- ✅ Dev server running on http://localhost:5173/

---

## 🎯 Recommended: Deploy with Vercel (Web Interface)

**Why Vercel?**
- Free for personal projects
- Automatic HTTPS
- Global CDN for fast loading
- Auto-deploys when you push to GitHub
- Easy rollback to previous versions
- Custom domain support

### Step 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. Once logged in, click **"Add New..."** → **"Project"**
2. Find your repository: **`yah600/Lafrance`**
3. Click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect your Vite project. Confirm these settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:** (Optional - none required for frontend-only app)

Leave empty for now. The app uses localStorage for all data.

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Get your preview URL: `https://your-app-name.vercel.app`

### 🎉 You're Live!

Your app will be available at a URL like:
```
https://lafrance-bet-marketplace.vercel.app
```

**Share this URL with anyone!** It works:
- ✅ When your computer is closed
- ✅ On any device (mobile, tablet, desktop)
- ✅ Anywhere in the world
- ✅ 24/7 availability

---

## 🔄 Automatic Deploys

Every time you push to GitHub `main` branch:
1. Vercel automatically detects the change
2. Builds your app
3. Deploys the new version
4. Updates the preview URL

No manual work needed!

---

## 🖥️ Alternative: Deploy with Vercel CLI

If you prefer command line:

### Install Vercel CLI

```bash
npm install -g vercel
```

If you get permission errors, use `npx` instead (no installation needed):

```bash
npx vercel
```

### Deploy

```bash
cd /Users/justinleanca/GROUPE-LAFRANCE-APP
npx vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your username
- **Link to existing project?** → No
- **Project name?** → lafrance-bet-marketplace (or choose your own)
- **Directory?** → ./ (press Enter)
- **Override settings?** → No

### Deploy to Production

```bash
npx vercel --prod
```

---

## 📱 Testing Your Deployed App

Once deployed, test these workflows:

### 1. Plumber Flow
1. Go to your Vercel URL
2. Navigate to `/bet-login`
3. Quick login as Plumber (click button)
4. Go to Marketplace
5. Submit a bid on a job
6. Verify bid appears in mockDataService

### 2. Client Flow
1. Go to `/bet-login`
2. Quick login as Client
3. Create a new request
4. Verify it appears in admin review queue

### 3. Admin Flow
1. Go to `/bet-login`
2. Quick login as Admin
3. Review pending jobs
4. Approve a job
5. Verify it appears in marketplace

---

## 🔧 Troubleshooting

### Issue: "Command not found: vercel"

**Solution:** Use `npx vercel` instead of installing globally.

### Issue: Blank page after deployment

**Check:**
1. Browser console for errors (F12)
2. Vercel build logs (in dashboard)
3. Ensure `dist` folder was created

### Issue: Routes not working (404 on refresh)

**Solution:** Vercel should auto-detect SPA routing. If not, ensure `vercel.json` has:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Issue: localStorage data not persisting

**Expected behavior:** Each user's browser has its own localStorage. Data won't sync between devices (by design for frontend-only demo).

---

## 🎨 Custom Domain (Optional)

Want `marketplace.yourcompany.com` instead of `*.vercel.app`?

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel dashboard → **Settings** → **Domains**
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

---

## 📊 Vercel Dashboard Features

After deployment, you get:

- **Analytics** - Page views, visitors, performance
- **Logs** - Real-time build and function logs
- **Deployments** - History of all deployments
- **Domains** - Manage custom domains
- **Environment Variables** - Add API keys (if needed later)
- **Team Collaboration** - Invite others to manage

---

## 🚀 Next Steps After Deployment

1. **Share the URL** with team/clients for testing
2. **Gather feedback** on UX and features
3. **Continue development** - Vercel auto-deploys changes
4. **Monitor usage** in Vercel Analytics
5. **Plan backend integration** when ready for production

---

## 💡 Pro Tips

### Enable Preview Deployments

Every pull request automatically gets its own preview URL. Perfect for testing features before merging!

### Protect Production

Set up branch protection in GitHub:
- Settings → Branches → Add rule for `main`
- Require pull request reviews before merging
- Prevent direct pushes to `main`

### Performance Optimization

Once deployed, check Lighthouse scores:
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Review Performance, Accessibility, Best Practices

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs
**Vercel Support:** https://vercel.com/support
**Community:** https://vercel.com/community

---

## ✅ Deployment Checklist

Before sharing your link:

- [ ] Test login with all 3 user types
- [ ] Test creating a client request
- [ ] Test admin approval flow
- [ ] Test plumber bidding
- [ ] Test mobile job workflow
- [ ] Test payment processing
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Verify localStorage persistence
- [ ] Test all navigation links

---

**🎉 Your app is ready to share with the world!**

Once deployed, your BET Marketplace will be accessible 24/7 at your Vercel URL, even when your computer is off.
