# Cloudinary Setup Instructions - Step by Step

## Step 1: Login to Cloudinary Dashboard

1. Go to [cloudinary.com](https://cloudinary.com)
2. Login with your account
3. You should see dashboard for cloud name: **drcfmairy**

---

## Step 2: Create Upload Preset

1. In Cloudinary Dashboard, click **Settings** (gear icon)
2. Click **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **"Add New Upload Preset"**

**Fill in these exact values**:

| Field | Value |
|-------|-------|
| **Preset name** | `profile_avatars` |
| **Signing Mode** | ☑️ **Unsigned** (this is critical!) |
| **Folder** | `profiles` |
| **Tags** | (leave blank) |
| **Allowed formats** | ☑️ JPG, ☑️ PNG, ☑️ WebP |
| **Max file size** | `5 MB` |
| **Eager transformations** | (leave blank) |

5. Click **Save**

---

## Step 3: Configure CORS (Allowed Domains)

1. In Settings, click **Security** tab
2. Scroll to **Allowed Origins (CORS)**
3. Click **Add Origin**

**Add these URLs one by one**:

```
https://pilotrecognition.com
https://*.pilotrecognition.com
https://localhost:3000
https://localhost:5173
```

4. Click **Save** for each

**Why?** Browser security prevents uploading to Cloudinary from unknown domains

---

## Step 4: Deploy Database Migration

**In your terminal**:

```bash
# Make sure you're in the project folder
cd /Users/bowler/Documents/apps/app-main

# Deploy the migration
supabase db push
```

**What this does:**
- Adds `profile_image_public_id` column to `profiles` table
- Creates index for faster lookups

---

## Step 5: Test the Upload

1. Run your app locally or go to production URL
2. Login as a pilot
3. Go to **"My Profile"** page
4. Click on your **avatar** (the circular profile image)
5. Select a photo from your computer
6. Should upload in 2-3 seconds and display

---

## Troubleshooting

### Error: "Upload preset not found"
- Go back to Step 2
- Make sure preset name is exactly: `profile_avatars`
- Check it's set to **Unsigned**

### Error: "CORS policy blocked"
- Go back to Step 3
- Make sure your domain is in Allowed Origins
- Add `http://localhost:3000` for local testing

### Error: "File too large"
- Go back to Step 2
- Increase **Max file size** in preset settings
- Or user should select a smaller image

### Image doesn't appear after refresh
- Check browser console for errors
- Verify `supabase db push` completed successfully
- Check Network tab to see if Cloudinary URL returns 200

---

## What You Just Set Up

✅ **Profile images** upload directly from browser to Cloudinary  
✅ **No edge functions** = $0 cost  
✅ **Client-side compression** = 5MB → 30KB  
✅ **IndexedDB caching** = instant repeat views  
✅ **Automatic optimization** = WebP/AVIF format  

---

## Next Steps (Optional)

**Want to use a different Cloudinary account for content images?**

1. Create another Cloudinary account
2. Add to Vercel environment:
   ```
   CONTENT_CLOUDINARY_CLOUD_NAME=your_other_account
   ```
3. Use `uploadContentImage()` for pathway images

**Need help?** Check the full workflow doc: `docs/PROFILE_IMAGE_WORKFLOW.md`
