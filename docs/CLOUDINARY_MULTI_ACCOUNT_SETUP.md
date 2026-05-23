# Multi-Cloudinary Account Setup

## Overview
**STRICT SEPARATION:**
- **Profile Images ONLY**: User avatars → `drcfmairy` account  
- **Content Images**: Pathways, logos → **Must use DIFFERENT account**

⚠️ **drcfmairy is reserved exclusively for user profile photos**

## Configuration

### 1. Profile Images (User Uploads) - drcfmairy ONLY
**Account**: `drcfmairy`  
**Purpose**: Pilot profile photos only  
**IMPORTANT**: This account CANNOT be used for content images

**Env Vars** (set in Supabase Dashboard):
```
CLOUDINARY_CLOUD_NAME=drcfmairy
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Usage**:
```typescript
import { uploadProfileImage, getProfileImageUrl } from '@/src/lib/profileImageUpload';

// Upload
const result = await uploadProfileImage(file, userId);

// Display
const url = getProfileImageUrl(publicId, 200);
```

### 2. Content Images (Platform Content) - MUST BE DIFFERENT ACCOUNT
**Account**: **MUST be different from drcfmairy**
**Purpose**: Pathway images, airline logos, marketing assets

⚠️ **REQUIRED**: Content images MUST use a separate Cloudinary account

**Env Vars** (required - cannot be drcfmairy):
```
CONTENT_CLOUDINARY_CLOUD_NAME=your_content_cloud_name
CONTENT_CLOUDINARY_API_KEY=your_content_api_key
CONTENT_CLOUDINARY_API_SECRET=your_content_api_secret
```

**Usage**:
```typescript
import { uploadContentImage, getContentImageUrl } from '@/src/lib/contentImageUpload';

// Upload pathway image
const result = await uploadContentImage(file, 'pathways');

// Upload airline logo
const result = await uploadContentImage(file, 'airlines');

// Display
const url = getContentImageUrl(publicId, 800);
```

## File Structure

```
src/lib/
├── cloudinaryConfig.ts      # Configuration for both accounts
├── profileImageUpload.ts    # Profile image upload functions
├── contentImageUpload.ts    # Content image upload functions
└── cloudinaryClient.ts      # Direct client (fallback)

supabase/functions/
└── cloudinary-upload/index.ts  # Edge function (handles both types)
```

## Edge Function

The same edge function handles both:

```typescript
// Profile upload
POST /functions/v1/cloudinary-upload
{ file: base64, userId: '123', type: 'profile' }

// Content upload
POST /functions/v1/cloudinary-upload
{ file: base64, userId: 'content_pathways', type: 'content' }
```

## Cost Benefits

**Separate Accounts**:
- Track costs per use case
- Profile uploads: Small, frequent (capped by user count)
- Content uploads: Larger, less frequent (controlled by admins)

**Security**:
- User uploads isolated from platform content
- Different upload presets per account
- Separate API keys = better access control

## Deployment

### Profile Images (Direct Upload - No Edge Function!)
Profile images use **client-side direct upload** to Cloudinary:
- ✅ No edge function invocations ($0 cost)
- ✅ No API secrets exposed to browser (uses unsigned preset)
- ✅ Only need to create upload preset in Cloudinary Dashboard

**Setup:**
1. Create unsigned upload preset `profile_avatars` in Cloudinary Dashboard
2. Done! No edge function deployment needed

### Content Images (Optional Edge Function)
Content images (pathways, logos) can use edge function for admin uploads:

```bash
# Only if you want edge function for content uploads
supabase functions deploy cloudinary-upload

# Add secrets for content account (if using edge function)
supabase secrets set CONTENT_CLOUDINARY_CLOUD_NAME=xxx
supabase secrets set CONTENT_CLOUDINARY_API_KEY=xxx
supabase secrets set CONTENT_CLOUDINARY_API_SECRET=xxx
```

### Database Migration
```bash
supabase db push
```

## URL Structure

**Profile Images**:
- Folder: `profiles/`
- Public ID: `profiles/profile_{userId}_{timestamp}`
- Transformations: `f_auto,q_auto,w_200` (small, avatar size)

**Content Images**:
- Folders: `content/pathways/`, `content/airlines/`, etc.
- Public ID: `content/content_{folder}_{timestamp}`
- Transformations: `f_auto,q_auto,w_800` (larger, content size)
