import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, ThumbsUp, Trash2, Send, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/authcontext';
import { api } from '../../contexts/authcontext';
import toast from 'react-hot-toast';

// --- Reusable Sub-components ---

const Header = ({ user }) => {
  const { logoutUser } = useAuth();
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
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-purple-500" />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  {user.isAdmin && <span className="text-xs text-purple-400">Admin</span>}
                </div>
              </div>
              <button onClick={logoutUser} className="p-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-gray-300 hover:text-red-400" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Post = ({ post }) => {
  if (!post) return null;
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
      {post.image && <img src={post.image} alt={post.title} className="w-full h-80 object-cover"/>}
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{post.title}</h1>
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
  const handleSubmit = () => { if (text.trim()) { onSubmit(text); setText(''); } };
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };
  return (
    <div className="flex gap-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyPress={handleKeyPress} placeholder={placeholder} autoFocus={autoFocus} className="flex-1 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none" rows="2" />
      <button onClick={handleSubmit} disabled={!text.trim()} className="self-end px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all flex items-center gap-2 font-medium">
        <Send className="w-4 h-4" /> Post
      </button>
    </div>
  );
};

const Comment = ({ comment, onReply, onUpvote, onDelete, currentUser, depth = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  
  const isOwner = currentUser?._id === comment?.user_id?._id;
  const canDelete = currentUser?.isAdmin || isOwner;

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

  const handleReplySubmit = (text) => {
    onReply(text, comment._id);
    setShowReplyInput(false);
  };
  
  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-700/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src={comment?.user_id?.avatar} alt={comment?.user_id?.name} className="w-10 h-10 rounded-full ring-2 ring-purple-500/50" />
            <div>
              <span className="font-semibold text-white">{comment?.user_id?.name || "User"}</span>
              <span className="text-xs text-gray-500 ml-2">{timeSince(comment.createdAt)}</span>
            </div>
          </div>
          {canDelete && <button onClick={() => onDelete(comment._id)} className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
        </div>
        <p className="text-gray-300 mb-4 ml-13 leading-relaxed">{comment.text}</p>
        <div className="flex items-center gap-4 ml-13">
          <button onClick={() => onUpvote(comment._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/30 text-gray-400 hover:text-purple-400"><ThumbsUp className="w-4 h-4" /> {comment.upvotes}</button>
          <button onClick={() => setShowReplyInput(!showReplyInput)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/30 text-gray-400 hover:text-blue-400"><MessageSquare className="w-4 h-4" /> Reply</button>
        </div>
        {showReplyInput && <div className="mt-4 ml-13"><CommentInput onSubmit={handleReplySubmit} placeholder="Write a reply..." autoFocus={true} /></div>}
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-purple-500/30 pl-2 ml-4">
          {comment.replies.map(reply => <Comment key={reply._id} comment={reply} onReply={onReply} onUpvote={onUpvote} onDelete={onDelete} currentUser={currentUser} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
};

const CommentThread = ({ comments, ...handlers }) => {
  const buildTree = (list) => {
    if (!list) return [];
    const map = {};
    list.forEach(c => { map[c._id] = { ...c, replies: [] }; });
    const roots = [];
    list.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });
    return roots;
  };

  const tree = buildTree(comments);
  return <div className="space-y-2">{tree.map(comment => <Comment key={comment._id} comment={comment} {...handlers} />)}</div>;
};

const SortingControls = ({ sortBy, onSortChange }) => {
  const sortOptions = ['newest', 'oldest', 'upvotes'];

  return (
    <div className="flex items-center gap-4 mb-6 bg-slate-800/30 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
      <span className="text-sm font-medium text-gray-300">Sort by:</span>
      <div className="flex gap-2 flex-wrap">
        {sortOptions.map((option) => (
          <button
            key={option}
            onClick={() => onSortChange(option)}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${
              sortBy === option
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white border border-slate-600/50'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main NestedComments Component ---
export default function NestedComments() {
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = async (currentSortBy) => {
    try {
      // No need to set loading to true here if we want a smoother sort change
      // setLoading(true); 
      const postResponse = await api.get('/posts');
      const firstPost = postResponse.data.data[0];
      if (firstPost) {
        setPost(firstPost);
        const commentsResponse = await api.get(`/comments?post_id=${firstPost._id}&sortBy=${currentSortBy}`);
        setComments(commentsResponse.data.data);
      }
    } catch (error) { toast.error("Failed to load data."); console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user) {
      fetchData(sortBy);
    }
  }, [user, sortBy]);

  const handleCommentAction = async (action, successMsg) => {
    try {
      const { data } = await action();
      if (data.success) {
        toast.success(successMsg);
        fetchData(sortBy);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };
  
  const handleAddComment = (text, parentId = null) => handleCommentAction(() => api.post('/comments', { text, post_id: post._id, parent_id: parentId }), "Comment posted!");
  const handleDeleteComment = (commentId) => { if (window.confirm("Delete this comment? This will also delete all replies.")) { handleCommentAction(() => api.delete(`/comments/${commentId}`), "Comment deleted!"); } };
  const handleUpvoteComment = (commentId) => handleCommentAction(() => api.post(`/comments/${commentId}/upvote`), "Comment upvoted!");
  
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header user={user} />
      <div className="relative z-10 max-w-5xl mx-auto p-6 py-8">
        <Post post={post} />
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mt-6 border border-slate-700/50">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            Comments <span className="text-purple-400">({comments.length})</span>
          </h2>
          <div className="mb-6"><CommentInput onSubmit={handleAddComment} /></div>
          <SortingControls sortBy={sortBy} onSortChange={handleSortChange} />
          <CommentThread comments={comments} onReply={handleAddComment} onUpvote={handleUpvoteComment} onDelete={handleDeleteComment} currentUser={user} />
        </div>
      </div>
    </div>
  );
};

