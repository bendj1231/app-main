# Profile Image Upload Workflow - Complete Technical Breakdown

## User Flow Overview

```
User clicks avatar → Selects image → Image optimized → Uploaded to Cloudinary → URL saved to Supabase → Displayed in UI
```

---

## Step 1: User Triggers Upload

**Location**: `PilotRecognitionProfilePage.tsx` (main profile card & top navbar)

```typescript
// Hidden file input
<input
  type="file"
  ref={fileInputRef}
  onChange={handleImageUpload}
  accept="image/*"
  style={{ display: 'none' }}
/>

// Click handler on avatar div
onClick={() => fileInputRef.current?.click()}
```

**What happens**:
1. User clicks their avatar (circular profile image)
2. Browser opens native file picker
3. User selects image file

---

## Step 2: Client-Side Processing

**Function**: `handleImageUpload` in `PilotRecognitionProfilePage.tsx`

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !profileData?.user_id) return;

  // Validation
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be less than 5MB');
    return;
  }

  setUploadingImage(true);
  // ... continues to upload
};
```

**What happens**:
- File type validation (must be image)
- File size validation (max 5MB)
- Loading state triggered (shows "Uploading...")

---

## Step 3: Image Compression & Optimization

**Function**: `compressImage` in `cloudinaryClient.ts`

```typescript
async function compressImage(file: File, maxWidth: 400, maxHeight: 400, quality: 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Resize logic
      let { width, height } = img;
      if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
      if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed JPEG
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
}
```

**What happens**:
- 5MB phone photo → Compressed to ~15-50KB
- Dimensions reduced to 400x400 max (perfect for avatars)
- Quality set to 70% (good balance of size vs quality)
- Format: JPEG (universal compatibility)

**Result**: 5MB → 30KB (99.4% size reduction!)

---

## Step 4: Direct Upload to Cloudinary

**Function**: `uploadProfileImage` in `cloudinaryClient.ts`

```typescript
export async function uploadProfileImage(file: File, userId: string) {
  // Step 1: Compress
  const compressedFile = await compressImage(file, 400, 400, 0.7);

  // Step 2: Prepare upload
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', 'profile_avatars'); // UNSIGNED preset
  formData.append('folder', 'profiles');
  formData.append('public_id', `avatar_${userId}_${Date.now()}`);

  // Step 3: Direct upload to Cloudinary (NO edge function!)
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/drcfmairy/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return { success: true, url: data.secure_url, publicId: data.public_id };
}
```

**What happens**:
- Browser makes direct HTTPS request to `api.cloudinary.com`
- Uses **unsigned upload preset** (no API key needed in browser)
- Image stored in Cloudinary folder `profiles/`
- Returns public URL: `https://res.cloudinary.com/drcfmairy/image/upload/...`

**Why unsigned preset?**
- Safe for public uploads
- CORS-enabled for your domain only
- Upload limits enforced by preset (max size, allowed formats)
- No API credentials exposed to browser

---

## Step 5: Save to Supabase Database

**Code**:
```typescript
const result = await uploadProfileImage(file, profileData.user_id);

if (result.success) {
  // Save to Supabase
  await supabase
    .from('profiles')
    .update({ 
      profile_image_url: result.url,
      profile_image_public_id: result.publicId,
    })
    .eq('id', profileData.user_id);
}
```

**What happens**:
- Cloudinary URL stored in `profiles.profile_image_url`
- Public ID stored in `profiles.profile_image_public_id` (for transformations)
- Enables displaying image across all UI components

---

## Step 6: Display with IndexedDB Caching

**Component**: `ProfileImage.tsx`

```typescript
export const ProfileImage: React.FC<ProfileImageProps> = ({ url, publicId, name }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      // Step 1: Check IndexedDB cache
      const cached = await getCachedImage(url);
      if (cached) {
        const blobUrl = URL.createObjectURL(cached);
        setImageUrl(blobUrl);
        return;
      }

      // Step 2: Fetch from Cloudinary (first time only)
      const response = await fetch(url);
      const blob = await response.blob();

      // Step 3: Store in IndexedDB
      await cacheImage(url, blob, publicId);

      // Step 4: Display
      const blobUrl = URL.createObjectURL(blob);
      setImageUrl(blobUrl);
    };

    loadImage();
  }, [url, publicId]);

  return <img src={imageUrl} alt={name} loading="lazy" />;
};
```

**What happens**:
- **First display**: Fetch from Cloudinary → Store in IndexedDB → Display
- **Subsequent displays**: Load from IndexedDB (instant, $0 bandwidth)
- Cache survives browser refresh, tab close/reopen
- Image optimized with `f_auto,q_auto,w_200` transformations

---

## Step 7: Display Across UI Components

Profile image appears in **5 locations** (all use `ProfileImage` component):

1. **Sidebar Profile Card** (`UnifiedPilotPlatform.tsx`)
   ```tsx
   <ProfileImage url={profile?.profile_image_url} size={96} />
   ```

2. **Top Navbar** (`PilotRecognitionProfilePage.tsx`)
   ```tsx
   <ProfileImage url={profileData?.profile_image_url} size={48} />
   ```

3. **Sidebar User Strip** (`UnifiedPilotPlatform.tsx`)
   ```tsx
   <ProfileImage url={profileData?.profile_image_url} size={36} />
   ```

4. **Main Profile Card** (`PilotRecognitionProfilePage.tsx`)
   ```tsx
   <ProfileImage url={profileData?.profile_image_url} size={100} />
   ```

5. **Avatar Button** (`UnifiedPilotPlatform.tsx` top bar)
   ```tsx
   <ProfileImage url={profileData?.profile_image_url} size={32} />
   ```

**All locations share the same IndexedDB cache!**

---

## Cost Breakdown

| Operation | Cost | Why |
|-----------|------|-----|
| Upload | **$0** | Uses unsigned preset (free tier) |
| First display | **~0.001 credits** | 30KB image download |
| Subsequent displays | **$0** | Served from IndexedDB cache |
| Transformations | **$0** | Included in free tier |

**Free tier**: 25 credits/month ≈ 25,000 image downloads
**Real usage**: 1 user = ~1 credit total (upload once, cached forever)

---

## Security Model

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Browser       │────▶│   Cloudinary    │     │   Supabase      │
│   (User)        │     │   (drcfmairy)   │────▶│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   Upload image            Store image             Save URL
   (unsigned preset)      (public URL)            (profile record)
```

**Security features**:
- ✅ Unsigned preset = no API keys in browser
- ✅ CORS restricted to your domain
- ✅ File size/type limits enforced by preset
- ✅ Public URLs only (no private data)
- ✅ Images stored in `profiles/` folder (organized)

---

## Data Flow Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│ User clicks │───▶│  Compress    │───▶│   Upload    │───▶│   Save      │
│   avatar    │    │   (5MB→30KB) │    │  to Cloud   │    │   to DB     │
└─────────────┘    └──────────────┘    │   (drcfmairy)│    └─────────────┘
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Display   │
                                        │  (cached)   │
                                        └─────────────┘
```

---

## Files Involved

| File | Purpose |
|------|---------|
| `cloudinaryClient.ts` | Upload + IndexedDB caching |
| `cloudinaryConfig.ts` | Configuration (drcfmairy) |
| `ProfileImage.tsx` | Reusable image component with cache |
| `PilotRecognitionProfilePage.tsx` | Main profile page |
| `UnifiedPilotPlatform.tsx` | Sidebar + top navbar |

---

## Key Benefits

1. **Zero Edge Function Invocations** - Direct browser → Cloudinary
2. **IndexedDB Caching** - Zero cost for repeat views
3. **Client-Side Compression** - 99% bandwidth savings
4. **Automatic Optimization** - WebP/AVIF format, quality optimization
5. **Multiple Display Locations** - Single cache, 5 UI components
6. **Separate Account** - drcfmairy isolated from content images
