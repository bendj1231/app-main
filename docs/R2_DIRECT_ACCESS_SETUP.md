# Cloudflare R2 Direct Access Setup (Zero Edge Function Invocations)

## Option A: Public Bucket with CORS (Simplest, Less Private)

### R2 Bucket Configuration
1. In Cloudflare Dashboard, set bucket to "Public"
2. Configure CORS to allow only your domains:
```json
[
  {
    "AllowedOrigins": ["https://pilotrecognition.com", "https://*.pilotrecognition.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### Client-Side Upload (Direct to R2)
```typescript
// Upload directly to R2 public bucket
const uploadToR2Direct = async (
  file: File,
  userId: string,
  auth0Sub: string,
  accessToken: string
) => {
  // Encrypt first
  const vaultKey = await getVaultKey(auth0Sub, accessToken);
  const encryptedData = await encryptImageFile(file, vaultKey);
  const encryptedBlob = new Blob([JSON.stringify(encryptedData)]);
  
  // Upload directly to R2 (NO edge function!)
  const r2Key = `profiles/${userId}/avatar.enc`;
  const r2Url = `https://pub-${ACCOUNT_ID}.r2.dev/${r2Key}`;
  
  const response = await fetch(r2Url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: encryptedBlob,
  });
  
  if (!response.ok) throw new Error('Upload failed');
  
  // Store metadata in Supabase
  await supabase.from('pilot_credentials').insert({
    profile_id: userId,
    credential_type: 'ProfileImageEncrypted',
    storage_backend: 'r2_public_encrypted',
    metadata: { r2_key: r2Key, r2_url: r2Url },
  });
  
  return { success: true };
};

// Download directly from R2 (NO edge function!)
const downloadFromR2Direct = async (
  userId: string,
  auth0Sub: string,
  accessToken: string
) => {
  // Check local cache first
  const localData = await getEncryptedImageFromLocalDB(userId);
  if (localData) {
    const vaultKey = await getVaultKey(auth0Sub, accessToken);
    const blob = await decryptImageData(localData, vaultKey);
    return { success: true, url: URL.createObjectURL(blob) };
  }
  
  // Get R2 URL from Supabase (just metadata, not signed URL)
  const { data } = await supabase
    .from('pilot_credentials')
    .select('metadata')
    .eq('profile_id', userId)
    .eq('credential_type', 'ProfileImageEncrypted')
    .maybeSingle();
  
  if (!data?.metadata?.r2_url) {
    return { success: false, error: 'No image found' };
  }
  
  // Download directly from R2 public URL
  const response = await fetch(data.metadata.r2_url);
  const encryptedData = await response.json();
  
  // Decrypt and cache
  const vaultKey = await getVaultKey(auth0Sub, accessToken);
  const blob = await decryptImageData(encryptedData, vaultKey);
  await storeEncryptedImageInLocalDB(userId, encryptedData);
  
  return { success: true, url: URL.createObjectURL(blob) };
};
```

**COST**: $0 invocations (direct R2 access)
**SECURITY**: Data is encrypted, but R2 URL is predictable (path-based). With encryption, this is still secure.

---

## Option B: Cloudflare Workers (Cheaper than Supabase Functions)

If you want signed URLs but cheaper than Supabase:

```typescript
// Cloudflare Worker (deployed to your own CF account)
// File: worker.ts
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    // Validate JWT from Supabase
    const authHeader = request.headers.get('authorization');
    const user = await validateSupabaseJWT(authHeader, env.SUPABASE_JWT_SECRET);
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    if (action === 'upload') {
      // Generate signed URL for upload
      const key = `profiles/${user.sub}/avatar.enc`;
      const signedUrl = await getSignedUrl(env.R2_BUCKET, key, 'PUT', 300);
      return Response.json({ uploadUrl: signedUrl, key });
    }
    
    if (action === 'download') {
      // Generate signed URL for download
      const key = `profiles/${user.sub}/avatar.enc`;
      const signedUrl = await getSignedUrl(env.R2_BUCKET, key, 'GET', 3600);
      return Response.json({ downloadUrl: signedUrl, key });
    }
    
    return new Response('Invalid action', { status: 400 });
  }
};
```

**COST**: Cloudflare Workers free tier = 100,000 requests/day = effectively free
**SECURITY**: Same as Supabase functions but cheaper

---

## Option C: Client-Side Presigned URLs (Most Cost Effective)

Generate presigned URLs client-side using a short-lived R2 token:

```typescript
// Store a limited-scope R2 token in Supabase (encrypted)
// Token has permission only for user's own folder: profiles/{userId}/*

const getPresignedUrlClientSide = async (
  userId: string,
  action: 'upload' | 'download'
) => {
  // Get user's R2 token from Supabase (encrypted)
  const { data: tokenData } = await supabase
    .from('user_storage_tokens')
    .select('encrypted_token')
    .eq('user_id', userId)
    .single();
  
  // Decrypt token using vault key
  const token = await decryptToken(tokenData.encrypted_token);
  
  // Generate presigned URL client-side using AWS SDK
  const url = await generatePresignedUrlWithToken({
    token,
    bucket: 'pilotrecognition-profile-images',
    key: `profiles/${userId}/avatar.enc`,
    action,
    expiresIn: action === 'upload' ? 300 : 3600,
  });
  
  return url;
};
```

**COST**: $0 (client-side computation only)
**SECURITY**: Token is scoped to user's own folder, rotated periodically

---

## Recommendation

**For cost savings**: Use **Option A** (Public R2 with encryption)
- Zero edge function invocations
- Data is still secure via AES-256-GCM encryption
- Only the encrypted blob is public; without the vault key, it's useless
- This is the same security model as the current implementation, just without the signed URL step

**Trade-off**: R2 URL is predictable (profiles/{userId}/avatar.enc), but:
1. The data is encrypted
2. You need the vault key to decrypt
3. Vault key is only available when user is authenticated
4. IndexedDB caching means minimal R2 requests

Would you like me to implement Option A (direct R2 public access with encryption)? This eliminates all edge function invocations for profile images.
