# Cloudinary Setup Checklist - Profile Images

## What You NEED to Do (3 Steps)

### ✅ Step 1: Create Upload Preset in Cloudinary (REQUIRED)
**Where**: [Cloudinary Dashboard](https://cloudinary.com) → Settings → Upload → Upload Presets

**Settings**:
| Setting | Value |
|---------|-------|
| **Preset Name** | `profile_avatars` |
| **Signing Mode** | **Unsigned** |
| **Folder** | `profiles` |
| **Allowed formats** | `jpg, png, webp` |
| **Max file size** | `5 MB` |

**Why unsigned?** Allows browser to upload directly without API keys

---

### ✅ Step 2: Configure CORS (REQUIRED)
**Where**: Cloudinary Dashboard → Settings → Security → Allowed Origins

**Add your domains**:
```
https://pilotrecognition.com
https://*.pilotrecognition.com
https://localhost:3000
```

---

### ✅ Step 3: Deploy Database Migration (REQUIRED)
```bash
supabase db push
```

This adds `profile_image_public_id` column to store Cloudinary IDs.

---

## What You DON'T Need

### ❌ API Key / API Secret (for profiles)
**NOT needed** - Using unsigned preset (client-side only)

### ❌ Edge Function
**NOT needed** - Direct browser → Cloudinary upload

### ❌ Vercel Environment Variables
**NOT needed** - Cloud name is hardcoded in code (`drcfmairy`)

---

## Optional: Vercel Environment Variables

If you want flexibility to change cloud name without redeploying code:

**Add to Vercel**:
```
VITE_CLOUDINARY_CLOUD_NAME=drcfmairy
VITE_CLOUDINARY_UPLOAD_PRESET=profile_avatars
```

**Then update code** to read from env instead of hardcoded:
```typescript
// cloudinaryClient.ts
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drcfmairy';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'profile_avatars';
```

---

## Summary

| Requirement | Needed? | Where |
|-------------|---------|-------|
| Cloudinary account | ✅ Yes | Already have (drcfmairy) |
| Upload preset | ✅ Yes | Cloudinary Dashboard |
| CORS config | ✅ Yes | Cloudinary Dashboard |
| DB migration | ✅ Yes | `supabase db push` |
| API Key/Secret | ❌ No | Not needed for unsigned uploads |
| Edge function | ❌ No | Direct browser upload |
| Vercel env vars | ❌ No | Hardcoded in code |

---

## Test After Setup

1. Go to "My Profile" page
2. Click your avatar (circular image)
3. Select a photo
4. Should upload and display within 2-3 seconds
5. Refresh page - image should appear instantly (from cache)

---

## Troubleshooting

**Error: "Upload preset not found"**
→ Create `profile_avatars` preset in Cloudinary Dashboard

**Error: "CORS policy"**
→ Add your domain to Allowed Origins in Cloudinary

**Error: "File too large"**
→ Increase preset max size OR compression is failing
