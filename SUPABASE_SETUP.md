# Supabase Setup Guide for Community Features

This guide covers the additional Supabase configuration needed for the new community and engagement features.

## 1. Storage Bucket Setup (for Avatar Uploads)

### Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enable (so avatars can be accessed publicly)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

### Storage Policies

After creating the bucket, set up Row Level Security policies:

#### Policy 1: Allow authenticated users to upload avatars
```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Allow authenticated users to update own avatars
```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Allow public read access to avatars
```sql
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

#### Policy 4: Allow authenticated users to delete own avatars
```sql
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Alternative: Use Supabase Dashboard

You can also set up these policies through the Supabase Dashboard:

1. Go to **Storage** → **Policies**
2. Select the `avatars` bucket
3. Click **New Policy**
4. Use the policy templates above

## 2. Database Migration

Run the migration file to create all necessary tables and functions:

1. Go to **SQL Editor** in Supabase Dashboard
2. Open the file: `supabase/migrations/20260210000000_add_community_features.sql`
3. Copy the entire contents
4. Paste into a new SQL query
5. Click **Run**

This migration will:
- Add `bio`, `follower_count`, `following_count` to profiles
- Create `follows` table with triggers
- Enhance `ratings` table with review constraints
- Create `trade_shares` table
- Create `community_threads` table
- Create `thread_replies` table
- Set up all RLS policies
- Create helper functions

## 3. Enable Realtime (Optional)

For real-time updates in the community discussion:

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `community_threads`
   - `thread_replies`
   - `follows`

This allows real-time updates when new threads/replies are posted or when users follow/unfollow.

## 4. Verify Setup

### Test Avatar Upload
1. Log in to your app
2. Navigate to a public profile (or your own profile)
3. Click "Edit Profile"
4. Try uploading an avatar image
5. Verify the image appears correctly

### Test Follow System
1. Create two test accounts
2. Log in as one user
3. Navigate to the other user's public profile
4. Click "Follow"
5. Verify follower count increases
6. Check that you can unfollow

### Test Reviews
1. Complete a trade (or mark a trade as completed in the database)
2. Navigate to the trade details
3. Try leaving a review
4. Verify the review appears on the user's profile

### Test Community
1. Navigate to Community page
2. Create a new thread
3. Add replies to the thread
4. Verify pagination works
5. Test deleting your own content

## 5. Environment Variables

No additional environment variables are needed. The existing Supabase configuration is sufficient:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 6. Performance Optimization

### Indexes
The migration includes indexes for optimal query performance:
- Username lookups for public profiles
- Follow relationships
- Thread sorting and pagination
- Reply threading

### Functions
Helper functions are created to:
- Calculate user ratings dynamically
- Update follower/following counts automatically
- Get active listings count

## Troubleshooting

### Avatar Upload Fails
- Check that the `avatars` bucket exists
- Verify storage policies are set correctly
- Check file size (must be < 5MB)
- Verify file type is allowed

### Follow System Not Working
- Ensure the migration ran successfully
- Check that triggers are created
- Verify RLS policies allow INSERT/DELETE on `follows` table

### Reviews Not Appearing
- Verify trade status is 'completed'
- Check that user is part of the trade
- Ensure RLS policies allow SELECT on `ratings` table

### Community Threads Not Loading
- Check RLS policies on `community_threads` and `thread_replies`
- Verify indexes are created
- Check browser console for errors

## Security Notes

1. **RLS Policies**: All tables have Row Level Security enabled
2. **Avatar Storage**: Users can only upload/update/delete their own avatars
3. **Follow System**: Users cannot follow themselves (enforced by CHECK constraint)
4. **Reviews**: Users can only review trades they participated in
5. **Community**: Users can only delete their own threads/replies

## Next Steps

After setup:
1. Test all features thoroughly
2. Monitor database performance
3. Consider adding moderation features for community threads
4. Set up email notifications for follows/replies (optional)
