import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, ThumbsUp, Trash2, Send, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

import { api } from '../../contexts/authcontext';
import { useAuth } from '../../contexts/authcontext';

// --- Reusable Components ---

const Header = ({ user, onLogout }) => {
  if (!user) return null;
  return (
    <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-blue-900 border-b border-purple-700/30 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-500/50">
              <MessageSquare className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Inter IIT Tech 14.0</h1>
              <p className="text-xs text-purple-300">Commenting System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-purple-500" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                {user.isAdmin && <span className="text-xs text-purple-400">Admin</span>}
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-gray-300 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Post = ({ post }) => {
  if (!post) return null;
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
      {post.image && <img src={post.image} alt={post.title} className="w-full h-80 object-cover" />}
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-4">{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
      </div>
    </div>
  );
};

const CommentInput = ({ onSubmit, placeholder = "Add a comment...", autoFocus = false }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (text.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(text);
        setText('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
        rows="3"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isSubmitting}
        className="self-end px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
      >
        {isSubmitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post</>}
      </button>
    </div>
  );
};

const Comment = ({ comment, onReply, onUpvote, onDelete, currentUser, depth = 0 }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
  
    // --- CORRECTED FUNCTION ---
    const handleReply = (text) => {
      // The arguments are now in the correct order: (text, parentId)
      onReply(text, comment._id);
      setShowReplyInput(false);
    };

    const handleUpvote = () => {
      onUpvote(comment._id, !isUpvoted);
      setIsUpvoted(!isUpvoted);
    }
  
    const isOwner = currentUser._id === comment.user_id._id;
    const canDelete = currentUser.isAdmin || isOwner;
  
    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    };
  
    return (
      <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-700/50 hover:border-purple-500/30 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                <img 
                    src={comment.user_id.avatar} 
                    alt={comment.user_id.name}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-500/50"
                />
                <div>
                    <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{comment.user_id.name}</span>
                    {comment.user_id.isAdmin && (
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">Admin</span>
                    )}
                    </div>
                    <span className="text-xs text-gray-500">{timeSince(comment.createdAt)}</span>
                </div>
                </div>
                
                {canDelete && (
                <button
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    title="Delete comment"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                )}
            </div>
            <p className="text-gray-300 mb-4 ml-13 leading-relaxed">{comment.text}</p>
            <div className="flex items-center gap-4 ml-13">
                <button
                onClick={handleUpvote}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isUpvoted 
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' 
                    : 'bg-slate-700/30 text-gray-400 hover:text-purple-400 hover:bg-slate-700/50 border border-slate-600/50'
                }`}
                >
                <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{comment.upvotes}</span>
                </button>
                <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/30 text-gray-400 hover:text-blue-400 hover:bg-slate-700/50 transition-all border border-slate-600/50"
                >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Reply</span>
                </button>
            </div>
            {showReplyInput && (
              <div className="mt-4 ml-13">
                <CommentInput
                  onSubmit={handleReply}
                  placeholder="Write a reply..."
                  autoFocus={true}
                />
              </div>
            )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-purple-500/30 pl-2 ml-4">
            {comment.replies.map(reply => (
              <Comment
                key={reply._id}
                comment={reply}
                onReply={onReply}
                onUpvote={onUpvote}
                onDelete={onDelete}
                currentUser={currentUser}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
};

const CommentThread = ({ comments, ...props }) => {
    const buildTree = (commentsList) => {
        const map = {};
        const roots = [];
        if (!commentsList) return [];

        commentsList.forEach(comment => {
            map[comment._id] = { ...comment, replies: [] };
        });

        commentsList.forEach(comment => {
            if (comment.parent_id) {
                if (map[comment.parent_id]) {
                    map[comment.parent_id].replies.push(map[comment._id]);
                }
            } else {
                roots.push(map[comment._id]);
            }
        });
        return roots;
    };
    
    const tree = buildTree(comments);

    return (
        <div className="space-y-2">
            {tree.map(comment => <Comment key={comment._id} comment={comment} {...props} />)}
        </div>
    );
};

const NestedCommentsPage = () => {
    const { user, logoutUser } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const postResponse = await api.get('/posts');
                const firstPost = postResponse.data.data[0];
                
                if (firstPost) {
                    setPost(firstPost);
                    const commentsResponse = await api.get(`/comments?post_id=${firstPost._id}`);
                    setComments(commentsResponse.data.data);
                } else {
                    toast.error("No posts found to comment on.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddComment = async (text, parentId = null) => {
        if (!post) return;
        try {
            const payload = { text, post_id: post._id, parent_id: parentId };
            const { data } = await api.post('/comments', payload);
            if (data.success) {
                setComments(prev => [...prev, data.data]);
                toast.success("Comment posted!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not post comment.");
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment and all its replies?')) {
            try {
                const { data } = await api.delete(`/comments/${commentId}`);
                if (data.success) {
                    // This logic is simplified, a proper implementation would recursively remove children
                    setComments(prev => prev.filter(c => c._id !== commentId && c.parent_id !== commentId));
                    toast.success("Comment deleted.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete comment.");
            }
        }
    };

    const handleUpvote = async (commentId, isUpvoting) => {
        try {
            // --- CORRECTED LOGIC ---
            // Your backend has two separate endpoints for upvote and remove upvote.
            const endpoint = `/comments/${commentId}/upvote`;
            const method = isUpvoting ? 'post' : 'delete';

            const { data } = await api[method](endpoint);
            
            if (data.success) {
                setComments(prev => prev.map(c => 
                    c._id === commentId ? { ...c, upvotes: data.upvotes } : c
                ));
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed.");
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading comments...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header user={user} onLogout={logoutUser} />
            <div className="relative z-10 max-w-5xl mx-auto p-6 py-8">
                <Post post={post} />
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mt-6 border border-slate-700/50">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-purple-400" />
                        Comments <span className="text-purple-400">({comments.length})</span>
                    </h2>
                    <div className="mb-6">
                        <CommentInput onSubmit={(text) => handleAddComment(text)} />
                    </div>
                    <CommentThread
                        comments={comments}
                        onReply={handleAddComment}
                        onUpvote={handleUpvote}
                        onDelete={handleDelete}
                        currentUser={user}
                    />
                </div>
            </div>
        </div>
    );
};

export default NestedCommentsPage;

