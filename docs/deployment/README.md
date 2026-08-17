# Panduan Deployment

Dokumentasi lengkap untuk deployment project AbsensiKCSulutgotengpa.

## Daftar Isi

1. [Setup Awal Vercel](./VERCEL_SETUP.md)
2. [Workflow Git](./GIT_WORKFLOW.md)
3. [Deployment ke Vercel](./DEPLOYMENT_GUIDE.md)

## Quick Reference

### Commit & Push
```bash
git add .
git commit -m "pesan commit"
git push origin main
```

### Deploy ke Vercel
```bash
npm run build
vercel --prod
```

## Struktur Dokumentasi

- **VERCEL_SETUP.md** - Setup project Vercel pertama kali
- **GIT_WORKFLOW.md** - Best practices untuk Git workflow
- **DEPLOYMENT_GUIDE.md** - Step-by-step deployment ke production

## Link Penting

- **Production URL**: https://absensikcsulutgotengpa.vercel.app
- **Vercel Dashboard**: https://vercel.com/hermessd/absensikcsulutgotengpa
- **Repository**: (sesuaikan dengan repo Anda)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel
- **Package Manager**: npm
