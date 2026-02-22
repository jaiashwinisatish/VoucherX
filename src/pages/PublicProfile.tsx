import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { User, Review, Voucher } from '../types';
import { fetchPublicProfile, getUserActiveListings, uploadAvatar, updateProfile } from '../utils/profile';
import { isFollowing, followUser, unfollowUser } from '../utils/follows';
import { getUserReviews } from '../utils/reviews';
import { Star, Calendar, TrendingUp, Package, UserPlus, UserMinus, Edit2, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface PublicProfileProps {
  username: string;
  onNavigate?: (page: string) => void;
}

export default function PublicProfile({ username, onNavigate }: PublicProfileProps) {
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeListings, setActiveListings] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', username: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isOwnProfile = user?.id === profile?.id;

  useEffect(() => {
    loadProfile();
  }, [username]);

  useEffect(() => {
    if (profile && user) {
      checkFollowStatus();
    }
  }, [profile, user]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const userProfile = await fetchPublicProfile(username);
      if (!userProfile) {
        // Profile not found
        setProfile(null);
        return;
      }
      setProfile(userProfile);
      setEditForm({
        full_name: userProfile.full_name,
        username: userProfile.username,
        bio: userProfile.bio || '',
      });

      // Load additional data
      const [listings, userReviews] = await Promise.all([
        getUserActiveListings(userProfile.id),
        getUserReviews(userProfile.id),
      ]);
      setActiveListings(listings);
      setReviews(userReviews);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !profile || isOwnProfile) return;
    try {
      const following = await isFollowing(user.id, profile.id);
      setIsFollowingUser(following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!user || !profile || isOwnProfile) return;
    setIsFollowLoading(true);
    try {
      if (isFollowingUser) {
        await unfollowUser(user.id, profile.id);
        setIsFollowingUser(false);
        if (profile) {
          setProfile({ ...profile, follower_count: (profile.follower_count || 0) - 1 });
        }
      } else {
        await followUser(user.id, profile.id);
        setIsFollowingUser(true);
        if (profile) {
          setProfile({ ...profile, follower_count: (profile.follower_count || 0) + 1 });
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setIsUploading(true);
    try {
      let avatarUrl = profile.avatar_url;

      // Upload avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Update profile
      const success = await updateProfile(user.id, {
        full_name: editForm.full_name,
        username: editForm.username,
        bio: editForm.bio,
        avatar_url: avatarUrl || undefined,
      });

      if (success) {
        await loadProfile(); // Reload to get updated data
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Profile not found</h3>
        <p className="text-slate-600 mb-4">The user profile you're looking for doesn't exist.</p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              {isEditing && avatarPreview ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30">
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : profile.avatar_url ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30">
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white text-teal-600 p-2 rounded-full cursor-pointer hover:bg-teal-50 transition-colors">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-slate-800 font-semibold"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-slate-800"
                    placeholder="Username"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <p className="text-white/90 mb-2">@{profile.username}</p>
                </>
              )}
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(profile.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/90">{profile.rating?.toFixed(1) || '0.0'} rating</span>
              </div>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-slate-800 min-h-[80px]"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
              ) : (
                <>
                  {profile.bio && (
                    <p className="text-white/90 mb-3">{profile.bio}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-white/80" />
                    <span className="text-white/80 text-sm">
                      Member since {new Date(profile.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    setEditForm({
                      full_name: profile.full_name,
                      username: profile.username,
                      bio: profile.bio || '',
                    });
                  }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
                  disabled={isUploading}
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center space-x-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-5 w-5" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
                  >
                    <Edit2 className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                      isFollowingUser
                        ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                        : 'bg-white text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    {isFollowLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : isFollowingUser ? (
                      <>
                        <UserMinus className="h-5 w-5" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid md:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {[
          { label: 'Total Trades', value: profile.total_trades || 0, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
          { label: 'VoucherCoins', value: profile.voucher_coins || 0, icon: Star, color: 'from-amber-500 to-amber-600' },
          { label: 'Active Listings', value: activeListings, icon: Package, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Followers', value: profile.follower_count || 0, icon: UserPlus, color: 'from-purple-500 to-purple-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-600">{stat.label}</span>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stat.value.toLocaleString()}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Reviews & Ratings</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="p-4 bg-slate-50 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-amber-300 hover:scale-[1.02] hover:shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800">
                    {review.rater?.full_name || 'Anonymous'}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {review.review && (
                  <p className="text-sm text-slate-600 mb-2">{review.review}</p>
                )}
                <p className="text-xs text-slate-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
