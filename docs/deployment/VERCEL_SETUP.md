# Setup Vercel Project

Panduan setup project baru di Vercel dari awal.

## Prerequisites

- Node.js terinstall (v18 atau lebih baru)
- npm terinstall
- Git terinstall
- Akun Vercel (gratis di https://vercel.com)

## 1. Install Vercel CLI

### Menggunakan npm (Global)
```bash
npm install -g vercel
```

### Menggunakan npm (Project-specific)
```bash
npm install --save-dev vercel
```

### Verifikasi Instalasi
```bash
vercel --version
```

## 2. Login ke Vercel

```bash
vercel login
```

Pilih metode login:
- Email
- GitHub
- GitLab
- Bitbucket

## 3. Setup Project Baru

### A. Dari Folder Kosong

```bash
# Buat folder project
mkdir my-new-project
cd my-new-project

# Inisialisasi Vercel
vercel
```

### B. Dari Project yang Sudah Ada

```bash
# Masuk ke folder project
cd /path/to/your/project

# Link dengan Vercel
vercel
```

Vercel CLI akan menanyakan:
1. **Set up and deploy?** → Yes
2. **Which scope?** → Pilih akun Anda
3. **Link to existing project?** → No (untuk project baru)
4. **Project name?** → (enter nama atau biarkan default)
5. **In which directory is your code located?** → ./ (atau sesuai struktur)
6. **Want to override settings?** → No (untuk setup default)

## 4. Konfigurasi Build Settings

Vercel akan otomatis mendeteksi framework (Vite, Next.js, dll).

### Manual Configuration (jika perlu)

Buat file `vercel.json` di root project:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Build Script di package.json

Pastikan `package.json` punya script build:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

## 5. Environment Variables (Optional)

### Via CLI
```bash
vercel env add VARIABLE_NAME
```

### Via Dashboard
1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan variable yang diperlukan

### Untuk Development
```bash
vercel env add VARIABLE_NAME development
```

### Untuk Production
```bash
vercel env add VARIABLE_NAME production
```

## 6. Domain Settings (Optional)

### Default Domain
Setiap deploy dapat domain otomatis:
- `your-project.vercel.app`
- `your-project-git-branch.vercel.app`

### Custom Domain
1. Buka Vercel Dashboard
2. Project → Settings → Domains
3. Add Domain
4. Ikuti instruksi untuk update DNS

## 7. Git Integration

### Link dengan GitHub/GitLab/Bitbucket

1. Buka Vercel Dashboard
2. Project → Settings → Git
3. Connect Git Repository
4. Pilih repository
5. Configure:
   - **Production Branch**: main (atau master)
   - **Auto-deploy**: enabled

Setelah setup:
- Push ke production branch = auto deploy production
- Push ke branch lain = preview deployment

## 8. Struktur Folder Project

```
my-project/
├── .vercel/              # Config Vercel (auto-generated)
│   ├── project.json
│   └── README.txt
├── dist/                 # Build output (jangan commit)
├── src/                  # Source code
├── public/               # Static assets
├── package.json
├── vite.config.ts        # atau config framework lain
└── vercel.json           # (optional) Vercel config
```

## 9. File .gitignore

Pastikan `.gitignore` include:

```gitignore
# Vercel
.vercel

# Build output
dist
build
.output

# Dependencies
node_modules

# Environment
.env
.env.local
.env.production
```

## 10. Test Setup

### Development Deploy
```bash
vercel
```

Akan deploy ke URL preview: `your-project-xxx.vercel.app`

### Production Deploy
```bash
vercel --prod
```

Akan deploy ke URL production: `your-project.vercel.app`

## Troubleshooting

### Error: "No framework detected"
Tambahkan `vercel.json` dengan framework explicit.

### Error: "Build failed"
1. Cek `npm run build` berjalan lokal
2. Cek build logs di Vercel Dashboard
3. Pastikan semua dependencies di `package.json`

### Error: "Command not found: vercel"
```bash
# Install global
npm install -g vercel

# Atau gunakan npx
npx vercel
```

### Error: "Not authorized"
```bash
vercel logout
vercel login
```

## Useful Commands

```bash
# Check current project
vercel inspect

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url

# Switch project
vercel switch

# Pull environment variables
vercel env pull

# Logs
vercel logs
```

## Next Steps

- Lanjut ke [Git Workflow](./GIT_WORKFLOW.md)
- Lanjut ke [Deployment Guide](./DEPLOYMENT_GUIDE.md)
