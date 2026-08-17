# Git Workflow

Panduan lengkap untuk mengelola kode dengan Git.

## Basic Git Commands

### Check Status
```bash
git status
```

### Add Files
```bash
# Add specific file
git add src/App.tsx

# Add all files
git add .

# Add all files in folder
git add src/

# Add files by pattern
git add *.tsx
```

### Commit
```bash
# Commit with message
git commit -m "feat: add login feature"

# Commit with detailed message
git commit -m "feat: add login feature" -m "- Add login form component
- Add authentication service
- Add token storage"

# Add and commit in one command
git add . && git commit -m "fix: resolve build error"
```

### Push
```bash
# Push to main branch
git push origin main

# Push to other branch
git push origin feature-branch

# Force push (hati-hati!)
git push --force origin main
```

### Pull
```bash
# Pull latest changes
git pull origin main

# Pull with rebase
git pull --rebase origin main
```

## Commit Message Best Practices

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: Fitur baru
- **fix**: Bug fix
- **docs**: Perubahan dokumentasi
- **style**: Format kode (whitespace, semicolon, dll)
- **refactor**: Refactor kode
- **test**: Tambah atau update test
- **chore**: Maintenance (update dependencies, dll)
- **perf**: Performance improvement
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

#### Feature
```bash
git commit -m "feat: add user authentication"
git commit -m "feat(auth): add login and logout functionality"
```

#### Bug Fix
```bash
git commit -m "fix: resolve incorrect date format"
git commit -m "fix(calendar): fix timezone calculation"
```

#### Documentation
```bash
git commit -m "docs: update deployment guide"
git commit -m "docs(readme): add installation instructions"
```

#### Refactor
```bash
git commit -m "refactor: simplify data processing logic"
git commit -m "refactor(utils): extract validation functions"
```

#### Chore
```bash
git commit -m "chore: update dependencies"
git commit -m "chore(deps): bump react to v19.2.7"
```

## Branching Strategy

### Main Branch (Production)
```bash
# main atau master
# Selalu dalam kondisi deployable
# Protected branch (tidak boleh push langsung)
```

### Development Branch
```bash
# dev atau develop
# Untuk development ongoing
git checkout -b dev
```

### Feature Branch
```bash
# Untuk fitur baru
git checkout -b feature/user-profile
git checkout -b feature/attendance-report

# Naming convention:
# feature/nama-fitur
# feature/TICKET-123-deskripsi
```

### Bugfix Branch
```bash
# Untuk fix bug
git checkout -b bugfix/login-error
git checkout -b fix/date-calculation

# Naming convention:
# bugfix/nama-bug
# fix/nama-bug
```

### Hotfix Branch
```bash
# Untuk fix urgent di production
git checkout -b hotfix/critical-security-fix

# Naming convention:
# hotfix/nama-fix
```

## Standard Workflow

### 1. Start New Feature

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes...
# (edit files)

# 4. Check changes
git status
git diff

# 5. Add and commit
git add .
git commit -m "feat: implement new feature"

# 6. Push to remote
git push origin feature/new-feature
```

### 2. Continue Working on Feature

```bash
# 1. Make sure you're on feature branch
git checkout feature/new-feature

# 2. Make changes...
# (edit files)

# 3. Commit
git add .
git commit -m "feat: add validation"

# 4. Push
git push origin feature/new-feature
```

### 3. Merge Feature to Main

#### Option A: Direct Merge (Simple)
```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Merge feature
git merge feature/new-feature

# 3. Push
git push origin main

# 4. Delete feature branch (optional)
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

#### Option B: Pull Request (Recommended)
```bash
# 1. Push feature branch
git push origin feature/new-feature

# 2. Create Pull Request di GitHub/GitLab
# (via web interface)

# 3. Review dan merge via web

# 4. Update local main
git checkout main
git pull origin main

# 5. Delete feature branch
git branch -d feature/new-feature
```

## Useful Git Commands

### Undo Changes

```bash
# Discard unstaged changes
git checkout -- filename.txt
git restore filename.txt

# Discard all unstaged changes
git checkout -- .
git restore .

# Unstage file
git reset HEAD filename.txt
git restore --staged filename.txt

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (create new commit)
git revert commit-hash
```

### View History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View with graph
git log --graph --oneline --all

# View specific file history
git log -- filename.txt

# View changes in commit
git show commit-hash
```

### Branch Management

```bash
# List branches
git branch

# List all branches (including remote)
git branch -a

# Create branch
git branch branch-name

# Switch branch
git checkout branch-name
git switch branch-name

# Create and switch
git checkout -b branch-name
git switch -c branch-name

# Delete branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name
```

### Remote Management

```bash
# View remotes
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git

# Remove remote
git remote remove origin
```

### Stash (Temporary Save)

```bash
# Save current changes
git stash

# Save with message
git stash save "work in progress"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply specific stash
git stash apply stash@{0}

# Apply and remove stash
git stash pop

# Remove stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

## Git Configuration

### User Setup

```bash
# Set name
git config --global user.name "Your Name"

# Set email
git config --global user.email "your.email@example.com"

# View config
git config --list
git config user.name
git config user.email
```

### Useful Aliases

```bash
# Short status
git config --global alias.st status

# Short log
git config --global alias.lg "log --oneline --graph --all"

# Undo last commit
git config --global alias.undo "reset --soft HEAD~1"

# Usage:
git st
git lg
git undo
```

## Troubleshooting

### Conflict Resolution

```bash
# When merge conflict occurs:

# 1. Check conflicted files
git status

# 2. Open and edit conflicted files
# Look for:
# <<<<<<< HEAD
# (your changes)
# =======
# (incoming changes)
# >>>>>>> branch-name

# 3. Resolve conflicts manually

# 4. Add resolved files
git add resolved-file.txt

# 5. Complete merge
git commit -m "merge: resolve conflicts"
```

### Accidental Commit to Wrong Branch

```bash
# 1. Undo commit (keep changes)
git reset --soft HEAD~1

# 2. Stash changes
git stash

# 3. Switch to correct branch
git checkout correct-branch

# 4. Apply changes
git stash pop

# 5. Commit
git add .
git commit -m "feat: correct commit"
```

### Need to Sync with Remote

```bash
# If local is behind remote
git pull origin main

# If local is ahead of remote
git push origin main

# If diverged (conflict)
git pull --rebase origin main
# or
git pull origin main
# (resolve conflicts if any)
git push origin main
```

## Best Practices

1. **Commit Often**: Small, focused commits lebih baik dari big commits
2. **Write Clear Messages**: Jelaskan apa dan mengapa, bukan bagaimana
3. **Pull Before Push**: Selalu pull dulu sebelum push
4. **Don't Commit Secrets**: Jangan commit `.env`, passwords, API keys
5. **Use .gitignore**: Ignore build files, dependencies, IDE files
6. **Branch for Features**: Jangan langsung ke main
7. **Review Before Push**: Check `git diff` dan `git status`
8. **Test Before Commit**: Pastikan code berjalan
9. **Keep Main Clean**: Main branch harus selalu deployable
10. **Delete Merged Branches**: Clean up setelah merge

## Next Steps

- Lanjut ke [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Kembali ke [README](./README.md)
