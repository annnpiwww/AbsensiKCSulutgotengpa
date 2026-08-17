# Step-by-Step Deployment Guide

Panduan lengkap untuk commit, push ke Git, dan upload versi baru ke Vercel.

## Prerequisites Checklist

Sebelum deploy, pastikan:
- [ ] Node.js terinstall
- [ ] Git terinstall
- [ ] Vercel CLI terinstall (`npm install -g vercel`)
- [ ] Sudah login ke Vercel (`vercel login`)
- [ ] Project sudah di-link dengan Vercel

## Workflow Standard

### Step 1: Cek Perubahan

```bash
# Lihat file yang berubah
git status

# Lihat detail perubahan
git diff

# Lihat perubahan untuk file tertentu
git diff src/App.tsx
```

**Output yang normal:**
```
Changes not staged for commit:
  modified:   src/components/LoginForm.tsx
  modified:   src/services/auth.ts
Untracked files:
  src/components/SuperAdmin.tsx
```

### Step 2: Test Build Lokal

**PENTING**: Selalu test build sebelum deploy!

```bash
# Build project
npm run build
```

**Expected output:**
```
vite v8.1.5 building for production...
✓ 3788 modules transformed.
dist/index.html                   0.78 kB
dist/assets/index-xxx.css        87.85 kB
dist/assets/index-xxx.js        986.38 kB
✓ built in 849ms
```

**Jika build error:**
```bash
# Cek error message
# Fix error yang muncul
# Build ulang sampai sukses
npm run build
```

### Step 3: Test Lokal (Optional tapi Recommended)

```bash
# Preview hasil build
npm run preview
```

Buka http://localhost:4173 dan test:
- Semua halaman loading dengan benar
- Tidak ada console error
- Fitur baru berfungsi
- Tidak ada regression pada fitur lama

Press `Ctrl+C` untuk stop preview.

### Step 4: Add Files ke Git

```bash
# Add semua file yang berubah
git add .
```

**Atau add file tertentu:**
```bash
# Add file spesifik
git add src/components/LoginForm.tsx
git add src/services/auth.ts

# Add semua file di folder
git add src/components/

# Add berdasarkan extension
git add *.tsx
```

**Cek file yang sudah di-add:**
```bash
git status
```

Output:
```
Changes to be committed:
  modified:   src/components/LoginForm.tsx
  new file:   src/components/SuperAdmin.tsx
```

### Step 5: Commit Changes

```bash
# Commit dengan pesan yang jelas
git commit -m "feat: add superadmin user"
```

**Format pesan commit yang baik:**
```bash
# Feature baru
git commit -m "feat: add user authentication"
git commit -m "feat: implement attendance report"

# Bug fix
git commit -m "fix: resolve login validation error"
git commit -m "fix: correct date timezone calculation"

# Update UI
git commit -m "style: improve dashboard layout"
git commit -m "ui: update color scheme"

# Refactor
git commit -m "refactor: simplify date processing"

# Documentation
git commit -m "docs: update deployment guide"

# Chore (maintenance)
git commit -m "chore: update dependencies"
git commit -m "chore: cleanup unused files"
```

**Commit dengan detail lebih:**
```bash
git commit -m "feat: add superadmin user" -m "- Add superadmin to auth service
- Update login validation
- Add admin dashboard access"
```

### Step 6: Push ke Git Repository

```bash
# Push ke main branch
git push origin main
```

**Output yang sukses:**
```
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Writing objects: 100% (4/4), 412 bytes | 412.00 KiB/s, done.
To https://github.com/username/repo.git
   abc1234..def5678  main -> main
```

**Jika ada conflict:**
```bash
# Pull dulu
git pull origin main

# Resolve conflict jika ada
# (edit file yang conflict)

# Add resolved files
git add .

# Commit merge
git commit -m "merge: resolve conflicts"

# Push lagi
git push origin main
```

**Jika branch diverged:**
```bash
git pull --rebase origin main
# atau
git pull origin main
```

### Step 7: Build untuk Production

```bash
# Build project (pastikan sukses)
npm run build
```

Pastikan tidak ada error dan build berhasil.

### Step 8: Deploy ke Vercel

#### Option A: Production Deploy (Recommended)

```bash
# Deploy ke production
vercel --prod
```

**Process:**
```
Vercel CLI 58.4.4
Deploying hermessd/absensikcsulutgotengpa
Uploading [====================] (1.0MB/1MB)
Building...
✓ Ready in 34s
Production: https://absensikcsulutgotengpa.vercel.app
```

#### Option B: Preview Deploy (untuk testing)

```bash
# Deploy ke preview URL
vercel
```

Preview URL: `https://absensikcsulutgotengpa-xxx.vercel.app`

**Kapan pakai preview:**
- Testing fitur baru sebelum production
- QA testing
- Demo untuk client
- Eksperimen yang belum final

### Step 9: Verify Deployment

1. **Buka production URL:**
   ```
   https://absensikcsulutgotengpa.vercel.app
   ```

2. **Test basic functionality:**
   - Homepage loading
   - Login berfungsi
   - Fitur baru muncul
   - Tidak ada console error

3. **Check Vercel Dashboard:**
   ```
   https://vercel.com/hermessd/absensikcsulutgotengpa
   ```
   - Status: Ready
   - Build logs: Success
   - Tidak ada error

### Step 10: Rollback (jika ada masalah)

#### Via Vercel Dashboard

1. Buka https://vercel.com/hermessd/absensikcsulutgotengpa
2. Tab **Deployments**
3. Cari deployment yang stable
4. Klik menu (⋯) → **Promote to Production**

#### Via CLI

```bash
# List deployments
vercel ls

# Rollback ke deployment tertentu
vercel promote deployment-url
```

## Complete Workflow Example

### Scenario: Menambah fitur superadmin

```bash
# 1. Pastikan di main branch dan up-to-date
git checkout main
git pull origin main

# 2. Buat perubahan code
# (edit files...)

# 3. Test build
npm run build

# 4. Preview lokal (optional)
npm run preview
# Test di browser, lalu Ctrl+C

# 5. Check perubahan
git status
git diff

# 6. Add files
git add .

# 7. Commit
git commit -m "feat: add superadmin user"

# 8. Push
git push origin main

# 9. Build production
npm run build

# 10. Deploy
vercel --prod

# 11. Verify
# Buka https://absensikcsulutgotengpa.vercel.app
# Test fitur baru
```

**Total waktu:** ~2-5 menit (tergantung ukuran perubahan)

## Quick Commands Cheat Sheet

```bash
# Full deployment workflow
git add .
git commit -m "feat: your message"
git push origin main
npm run build
vercel --prod

# One-liner (hati-hati, skip verification)
git add . && git commit -m "feat: quick fix" && git push origin main && npm run build && vercel --prod
```

## Common Issues & Solutions

### Issue 1: Build Error

**Error:**
```
ERROR: Failed to compile
```

**Solution:**
```bash
# Check error details
npm run build

# Fix the error shown
# Rebuild
npm run build

# Only proceed when build succeeds
```

### Issue 2: Git Push Rejected

**Error:**
```
! [rejected] main -> main (non-fast-forward)
```

**Solution:**
```bash
# Pull first
git pull origin main

# Resolve conflicts if any
# Then push
git push origin main
```

### Issue 3: Vercel Deploy Failed

**Error:**
```
Error: Build failed
```

**Solution:**
1. Check Vercel dashboard logs
2. Pastikan build sukses lokal
3. Check environment variables di Vercel
4. Coba deploy ulang:
   ```bash
   vercel --prod
   ```

### Issue 4: Forgot to Commit Some Files

**Solution:**
```bash
# Add missed files
git add missed-file.tsx

# Amend last commit
git commit --amend --no-edit

# Force push (hati-hati!)
git push --force origin main

# Redeploy
vercel --prod
```

### Issue 5: Need to Undo Last Commit

**Solution:**
```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Make corrections
# Commit again
git add .
git commit -m "feat: corrected version"
git push origin main
```

## Best Practices

### Before Deploy

- ✅ Run `npm run build` locally
- ✅ Test di browser dengan `npm run preview`
- ✅ Check console untuk errors
- ✅ Review git diff
- ✅ Write clear commit message
- ✅ Pull latest changes

### During Deploy

- ✅ Monitor build progress
- ✅ Check build logs untuk warnings
- ✅ Wait for "Ready" status

### After Deploy

- ✅ Test production URL
- ✅ Verify new features work
- ✅ Check for regressions
- ✅ Monitor for errors
- ✅ Keep Vercel dashboard open 5-10 menit

### Never Do

- ❌ Deploy tanpa test build lokal
- ❌ Commit dengan pesan unclear ("update", "fix")
- ❌ Push tanpa review changes
- ❌ Deploy langsung ke production tanpa test
- ❌ Ignore build warnings
- ❌ Commit `.env` atau secrets
- ❌ Force push ke shared branches
- ❌ Deploy code yang belum di-commit

## Automated Deployment (Advanced)

### Setup Git Integration

Jika Vercel sudah connected dengan Git repository:

1. **Push = Auto Deploy**
   ```bash
   git push origin main
   # Vercel otomatis build dan deploy
   ```

2. **Branch Preview**
   ```bash
   git checkout -b feature-branch
   git push origin feature-branch
   # Vercel create preview deployment
   ```

3. **Pull Request Preview**
   - Create PR di GitHub/GitLab
   - Vercel bot comment dengan preview URL
   - Review dan merge
   - Production auto-updated

### Disable Auto Deploy

Jika mau manual control:

1. Vercel Dashboard → Settings → Git
2. Uncheck "Production Branch Auto Deploy"
3. Deploy manual dengan `vercel --prod`

## Monitoring & Logs

### View Deployment Logs

```bash
# Via CLI
vercel logs

# Via Dashboard
https://vercel.com/hermessd/absensikcsulutgotengpa/deployments
```

### Check Build Time

```bash
# Via Dashboard
# Deployments → [specific deployment] → Build Logs
```

Normal build time: 30-60 detik

### Analytics

Vercel Dashboard → Analytics:
- Page views
- Load times
- Errors
- Traffic

## Environment Variables

### Add New Variable

```bash
# Via CLI
vercel env add API_KEY

# Input:
# - Value: your-api-key
# - Environment: Production, Preview, Development
```

### Update Variable

```bash
# Via CLI
vercel env rm API_KEY
vercel env add API_KEY

# Via Dashboard
Settings → Environment Variables → Edit
```

### Pull Variables to Local

```bash
vercel env pull
```

Creates `.env.local` with all environment variables.

## Checklist Summary

### Pre-Deployment
- [ ] Code changes completed
- [ ] Build berhasil lokal (`npm run build`)
- [ ] Preview tested (`npm run preview`)
- [ ] No console errors
- [ ] Git status clean

### Git Workflow
- [ ] `git add .`
- [ ] `git commit -m "clear message"`
- [ ] `git push origin main`

### Vercel Deployment
- [ ] `npm run build` (final check)
- [ ] `vercel --prod`
- [ ] Wait for "Ready"
- [ ] Test production URL
- [ ] Verify new features

### Post-Deployment
- [ ] Homepage loads
- [ ] Login works
- [ ] New features functional
- [ ] No regressions
- [ ] No console errors

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Git Docs**: https://git-scm.com/doc
- **Project Dashboard**: https://vercel.com/hermessd/absensikcsulutgotengpa
- **Production URL**: https://absensikcsulutgotengpa.vercel.app

## Related Documentation

- [Setup Vercel](./VERCEL_SETUP.md) - Initial setup guide
- [Git Workflow](./GIT_WORKFLOW.md) - Git best practices
- [README](./README.md) - Documentation overview
