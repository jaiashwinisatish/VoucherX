# Community Features Integration Guide

This document provides a comprehensive guide for integrating the new community and engagement features into VoucherX.

## Overview

The following features have been added:
1. **Public User Profiles** - Accessible via `/profile/:username`
2. **Follow/Unfollow System** - Users can follow other users
3. **Trade Sharing** - Social share buttons for trades
4. **Review System** - Enhanced reviews with trade validation
5. **Community Discussions** - Threads and replies for community engagement

## File Structure

### New Files Created

```
src/
├── pages/
│   ├── PublicProfile.tsx      # Public profile page with avatar upload
│   └── Community.tsx          # Community discussion threads
├── components/
│   ├── SocialShare.tsx        # Social share buttons component
│   └── ReviewForm.tsx         # Review submission form
├── utils/
│   ├── profile.ts             # Profile utilities (fetch, update, avatar)
│   ├── follows.ts             # Follow/unfollow utilities
│   ├── reviews.ts             # Review creation and validation
│   └── socialShare.ts         # Social sharing utilities
└── types.ts                   # Updated with new interfaces

supabase/
└── migrations/
    └── 20260210000000_add_community_features.sql  # Database migration

SUPABASE_SETUP.md              # Supabase configuration guide
INTEGRATION_GUIDE.md           # This file
```

## Step-by-Step Integration

### Step 1: Database Setup

1. **Run the Migration**
   - Open Supabase Dashboard → SQL Editor
   - Copy contents of `supabase/migrations/20260210000000_add_community_features.sql`
   - Run the SQL query
   - Verify all tables and functions are created

2. **Set Up Storage Bucket**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Create `avatars` bucket
   - Set up storage policies

### Step 2: Update Existing Components

#### Update Profile Page to Link to Public Profile

In `src/pages/Profile.tsx`, you can add a link to the public profile:

```typescript
// Add this import
import { useNavigate } from 'react-router-dom'; // If using React Router
// Or use the onNavigate prop if using state-based routing

// Add button to view public profile
<button
  onClick={() => window.location.href = `/profile/${profile?.username}`}
  className="px-4 py-2 bg-teal-500 text-white rounded-lg"
>
  View Public Profile
</button>
```

#### Add Social Share to Trade Listings

In any component that displays trades, add the SocialShare component:

```typescript
import SocialShare from '../components/SocialShare';

// In your trade display component
<SocialShare 
  trade={trade} 
  vouchers={{
    initiator: trade.initiator_voucher,
    recipient: trade.recipient_voucher
  }}
/>
```

#### Add Review Form to Trade Details

In your trade details page:

```typescript
import ReviewForm from '../components/ReviewForm';

// After trade completion
{trade.status === 'completed' && (
  <ReviewForm 
    tradeId={trade.id}
    onReviewSubmitted={() => {
      // Refresh trade data or show success message
    }}
  />
)}
```

### Step 3: Routing Updates

The routing has been updated in `App.tsx` to handle:
- Public profiles: `/profile/:username`
- Community page: `/community`

The app uses state-based routing. To navigate to a public profile:

```typescript
// In any component
onNavigate(`public-profile`);
// Then set the username via state or URL parsing
```

For URL-based routing (if you add React Router later):

```typescript
<Route path="/profile/:username" element={<PublicProfile />} />
<Route path="/community" element={<Community />} />
```

### Step 4: Update Navigation

The Community page has been added to the navigation in `Layout.tsx`. No additional changes needed.

### Step 5: Add Public Profile Links

Wherever you display user information, add links to public profiles:

```typescript
// Example: In marketplace or trade listings
<button
  onClick={() => window.location.href = `/profile/${voucher.seller?.username}`}
  className="text-teal-600 hover:underline"
>
  {voucher.seller?.full_name}
</button>
```

## Usage Examples

### 1. Fetching a Public Profile

```typescript
import { fetchPublicProfile } from '../utils/profile';

const profile = await fetchPublicProfile('johndoe');
if (profile) {
  console.log(profile.full_name, profile.bio);
}
```

### 2. Following a User

```typescript
import { followUser, unfollowUser, isFollowing } from '../utils/follows';

// Check if following
const following = await isFollowing(currentUserId, targetUserId);

// Follow
await followUser(currentUserId, targetUserId);

// Unfollow
await unfollowUser(currentUserId, targetUserId);
```

### 3. Creating a Review

```typescript
import { canReviewTrade, createReview } from '../utils/reviews';

// Check eligibility
const { canReview, trade } = await canReviewTrade(tradeId, userId);

if (canReview && trade) {
  const ratedUserId = trade.initiator_id === userId 
    ? trade.recipient_id 
    : trade.initiator_id;
  
  await createReview(tradeId, userId, ratedUserId, 5, 'Great trade!');
}
```

### 4. Sharing a Trade

```typescript
import { shareToTwitter, shareToLinkedIn, copyTradeLink } from '../utils/socialShare';

// Share to Twitter
shareToTwitter(trade, { initiator: voucher1, recipient: voucher2 });

// Share to LinkedIn
shareToLinkedIn(trade, { initiator: voucher1, recipient: voucher2 });

// Copy link
await copyTradeLink(trade.id);
```

### 5. Community Threads

The Community page (`src/pages/Community.tsx`) handles:
- Creating threads
- Viewing threads with pagination
- Replying to threads
- Deleting own content

All functionality is built-in. Just navigate to the Community page.

## Database Schema Summary

### New Tables

1. **follows** - User follow relationships
   - `follower_id`, `following_id`
   - Prevents self-follow
   - Auto-updates follower/following counts

2. **trade_shares** - Tracks trade shares
   - `trade_id`, `shared_by_id`, `share_platform`

3. **community_threads** - Discussion threads
   - `author_id`, `title`, `content`
   - `reply_count`, `view_count`
   - `is_pinned`, `is_locked`

4. **thread_replies** - Thread replies
   - `thread_id`, `author_id`, `content`
   - `parent_reply_id` (for nested replies)

### Updated Tables

1. **profiles** - Added:
   - `bio` (text)
   - `follower_count` (integer)
   - `following_count` (integer)

2. **ratings** - Enhanced:
   - Unique constraint on `(trade_id, rater_id)`
   - Auto-updates user rating

## Security Considerations

1. **RLS Policies**: All tables have Row Level Security enabled
2. **Avatar Upload**: Users can only upload/update their own avatars
3. **Follow System**: Users cannot follow themselves
4. **Reviews**: Users can only review trades they participated in
5. **Community**: Users can only delete their own content

## Performance Optimizations

1. **Indexes**: Created on frequently queried columns
2. **Triggers**: Auto-update counts and ratings
3. **Pagination**: Community threads support pagination
4. **Caching**: Consider adding React Query or SWR for data caching

## Testing Checklist

- [ ] Run database migration successfully
- [ ] Create storage bucket and policies
- [ ] Test avatar upload
- [ ] Test follow/unfollow functionality
- [ ] Test review creation
- [ ] Test social sharing
- [ ] Test community thread creation
- [ ] Test thread replies
- [ ] Test pagination
- [ ] Test content deletion
- [ ] Verify RLS policies work correctly
- [ ] Test public profile access
- [ ] Verify follower counts update correctly
- [ ] Verify rating calculations

## Troubleshooting

### Avatar Upload Not Working
- Check storage bucket exists
- Verify storage policies
- Check file size limits
- Verify MIME types

### Follow System Not Updating Counts
- Check triggers are created
- Verify RLS policies allow updates
- Check database logs for errors

### Reviews Not Appearing
- Verify trade status is 'completed'
- Check user is part of the trade
- Verify RLS policies allow SELECT

### Community Threads Not Loading
- Check RLS policies
- Verify indexes are created
- Check browser console for errors

## Future Enhancements

Potential improvements:
1. Real-time updates using Supabase Realtime
2. Email notifications for follows/replies
3. Thread moderation (admin features)
4. Thread search functionality
5. User mentions in threads
6. Thread reactions/likes
7. Rich text editor for threads
8. Image uploads in threads
9. Thread categories/tags
10. User badges and achievements

## Support

For issues or questions:
1. Check `SUPABASE_SETUP.md` for configuration
2. Review database migration file
3. Check browser console for errors
4. Verify Supabase dashboard for RLS policies
5. Review component code for usage examples
