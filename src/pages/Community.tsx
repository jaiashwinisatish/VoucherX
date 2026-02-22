import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { CommunityThread, ThreadReply } from '../types';
import { supabase } from '../lib/supabase';
import { MessageSquare, Plus, Reply, Trash2, Edit2, Lock, Pin } from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function Community() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState<CommunityThread | null>(null);
  const [replies, setReplies] = useState<ThreadReply[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadThreads();
  }, [currentPage]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('community_threads')
        .select(`
          *,
          author:profiles!community_threads_author_id_fkey(*)
        `, { count: 'exact' })
        .order('is_pinned', { ascending: false })
        .order('last_reply_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setThreads((data || []) as CommunityThread[]);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReplies = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('thread_replies')
        .select(`
          *,
          author:profiles!thread_replies_author_id_fkey(*)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies((data || []) as ThreadReply[]);
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newThreadTitle.trim() || !newThreadContent.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_threads')
        .insert({
          author_id: user.id,
          title: newThreadTitle.trim(),
          content: newThreadContent.trim(),
        });

      if (error) throw error;

      setNewThreadTitle('');
      setNewThreadContent('');
      setShowCreateThread(false);
      await loadThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Error creating thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedThread || !newReplyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('thread_replies')
        .insert({
          thread_id: selectedThread.id,
          author_id: user.id,
          content: newReplyContent.trim(),
        });

      if (error) throw error;

      setNewReplyContent('');
      await loadReplies(selectedThread.id);
      await loadThreads(); // Refresh to update reply count
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Error creating reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Are you sure you want to delete this thread?')) return;

    try {
      const { error } = await supabase
        .from('community_threads')
        .delete()
        .eq('id', threadId);

      if (error) throw error;
      await loadThreads();
      if (selectedThread?.id === threadId) {
        setSelectedThread(null);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Error deleting thread. Please try again.');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      const { error } = await supabase
        .from('thread_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;
      if (selectedThread) {
        await loadReplies(selectedThread.id);
        await loadThreads();
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Error deleting reply. Please try again.');
    }
  };

  const openThread = (thread: CommunityThread) => {
    setSelectedThread(thread);
    loadReplies(thread.id);
    
    // Increment view count
    supabase
      .from('community_threads')
      .update({ view_count: (thread.view_count || 0) + 1 })
      .eq('id', thread.id)
      .then(() => loadThreads());
  };

  if (selectedThread) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button
          onClick={() => setSelectedThread(null)}
          className="text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-2"
        >
          <span>← Back to Threads</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {selectedThread.is_pinned && (
                  <Pin className="h-5 w-5 text-amber-500 fill-amber-500" />
                )}
                {selectedThread.is_locked && (
                  <Lock className="h-5 w-5 text-slate-400" />
                )}
                <h2 className="text-2xl font-bold text-slate-800">{selectedThread.title}</h2>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                <span>By {selectedThread.author?.full_name || 'Unknown'}</span>
                <span>•</span>
                <span>{new Date(selectedThread.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{selectedThread.reply_count} replies</span>
                <span>•</span>
                <span>{selectedThread.view_count} views</span>
              </div>
            </div>
            {user?.id === selectedThread.author_id && (
              <button
                onClick={() => handleDeleteThread(selectedThread.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete thread"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="prose max-w-none mb-6">
            <p className="text-slate-700 whitespace-pre-wrap">{selectedThread.content}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800">Replies ({replies.length})</h3>
          {replies.map((reply) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold text-slate-800">
                    {reply.author?.full_name || 'Unknown'}
                  </span>
                  <span className="text-sm text-slate-500 ml-2">
                    {new Date(reply.created_at).toLocaleDateString()}
                  </span>
                </div>
                {user?.id === reply.author_id && (
                  <button
                    onClick={() => handleDeleteReply(reply.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete reply"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>
            </motion.div>
          ))}

          {selectedThread.is_locked ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-600">
              <Lock className="h-6 w-6 mx-auto mb-2" />
              <p>This thread is locked and no longer accepts replies.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateReply} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
              <textarea
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none mb-3"
                rows={4}
                required
              />
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newReplyContent.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Reply className="h-5 w-5" />
                  <span>{isSubmitting ? 'Posting...' : 'Post Reply'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Community Discussions</h1>
          <p className="text-slate-600">Share ideas, ask questions, and connect with other traders</p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateThread(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Thread</span>
          </button>
        )}
      </div>

      {showCreateThread && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Thread</h2>
          <form onSubmit={handleCreateThread} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="Thread title..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
              <textarea
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={6}
                required
                maxLength={5000}
              />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateThread(false);
                  setNewThreadTitle('');
                  setNewThreadContent('');
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newThreadTitle.trim() || !newThreadContent.trim()}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Thread'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/80 rounded-xl border border-slate-200 p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200">
          <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No threads yet</h3>
          <p className="text-slate-600 mb-4">Be the first to start a discussion!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => openThread(thread)}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {thread.is_pinned && (
                        <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                      {thread.is_locked && (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                      <h3 className="text-lg font-semibold text-slate-800">{thread.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{thread.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>By {thread.author?.full_name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{thread.reply_count} replies</span>
                      </span>
                      <span>•</span>
                      <span>{thread.view_count} views</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
