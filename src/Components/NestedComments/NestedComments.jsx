import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, ThumbsUp, Trash2, Send, User, LogOut } from 'lucide-react';

// Mock data for demonstration
const mockPost = {
  id: 1,
  title: "Understanding React Hooks in Depth",
  content: "React Hooks have revolutionized how we write components. In this article, we'll explore useState, useEffect, and custom hooks...",
  author: "John Doe",
  date: "2025-10-15",
  image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
};

const mockUser = {
  id: "1",
  name: "Current User",
  avatar: "https://ui-avatars.com/api/?name=Current+User&background=8b5cf6&color=fff",
  isAdmin: true
};

const mockComments = [
  {
    id: "1",
    text: "Great article! The explanation of useEffect dependencies really helped clarify things for me.",
    upvotes: 24,
    created_at: "2025-10-15T10:30:00Z",
    user_id: "2",
    parent_id: null,
    user: {
      id: "2",
      name: "Alice Johnson",
      avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=10b981&color=fff"
    }
  },
  {
    id: "2",
    text: "Thanks! Glad it was helpful. Are there any specific hooks you'd like me to cover in the next article?",
    upvotes: 12,
    created_at: "2025-10-15T11:00:00Z",
    user_id: "1",
    parent_id: "1",
    user: {
      id: "1",
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=8b5cf6&color=fff"
    }
  },
  {
    id: "3",
    text: "Could you cover useCallback and useMemo? I'm still confused about when to use them.",
    upvotes: 45,
    created_at: "2025-10-15T11:30:00Z",
    user_id: "3",
    parent_id: "2",
    user: {
      id: "3",
      name: "Bob Smith",
      avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=f59e0b&color=fff"
    }
  },
  {
    id: "4",
    text: "I second this! Performance optimization hooks would be great.",
    upvotes: 18,
    created_at: "2025-10-15T12:00:00Z",
    user_id: "4",
    parent_id: "3",
    user: {
      id: "4",
      name: "Carol White",
      avatar: "https://ui-avatars.com/api/?name=Carol+White&background=ef4444&color=fff"
    }
  },
  {
    id: "5",
    text: "The custom hooks section was particularly interesting. Have you considered doing a follow-up on testing custom hooks?",
    upvotes: 31,
    created_at: "2025-10-15T13:00:00Z",
    user_id: "5",
    parent_id: null,
    user: {
      id: "5",
      name: "David Brown",
      avatar: "https://ui-avatars.com/api/?name=David+Brown&background=6366f1&color=fff"
    }
  },
  {
    id: "6",
    text: "One thing I noticed - you didn't mention useReducer. It's quite useful for complex state logic.",
    upvotes: 8,
    created_at: "2025-10-15T14:00:00Z",
    user_id: "6",
    parent_id: null,
    user: {
      id: "6",
      name: "Emma Davis",
      avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=ec4899&color=fff"
    }
  }
];

// Header Component
const Header = ({ user }) => {
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
                {user.isAdmin && (
                  <span className="text-xs text-purple-400">Admin</span>
                )}
              </div>
            </div>
            <button className="p-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-gray-300 hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Component
const Post = ({ post }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-80 object-cover"
        />
      )}
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-4">{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
      </div>
    </div>
  );
};

// Comment Input Component
const CommentInput = ({ onSubmit, placeholder = "Add a comment...", autoFocus = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
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
        disabled={!text.trim()}
        className="self-end px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
      >
        <Send className="w-4 h-4" />
        Post
      </button>
    </div>
  );
};

// Individual Comment Component
const Comment = ({ comment, onReply, onUpvote, onDelete, currentUser, depth = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    onUpvote(comment.id, !isUpvoted);
  };

  const handleReply = (text) => {
    onReply(comment.id, text);
    setShowReplyInput(false);
  };

  const isOwner = currentUser.id === comment.user_id;
  const canDelete = currentUser.isAdmin || isOwner;

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-700/50 hover:border-purple-500/30 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img 
              src={comment.user.avatar} 
              alt={comment.user.name}
              className="w-10 h-10 rounded-full ring-2 ring-purple-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{comment.user.name}</span>
                {currentUser.isAdmin && isOwner && (
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">Admin</span>
                )}
              </div>
              <span className="text-xs text-gray-500">{timeSince(comment.created_at)}</span>
            </div>
          </div>
          
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
              title="Delete comment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {!isCollapsed && (
          <>
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
                <span className="text-sm font-medium">
                  {comment.upvotes + (isUpvoted ? 1 : 0)}
                </span>
              </button>

              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/30 text-gray-400 hover:text-blue-400 hover:bg-slate-700/50 transition-all border border-slate-600/50"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Reply</span>
              </button>

              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/30 text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all ml-auto border border-slate-600/50"
                >
                  {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isCollapsed ? 'Expand' : 'Collapse'} ({comment.replies.length})
                  </span>
                </button>
              )}
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
          </>
        )}

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-purple-500/10 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
            Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {!isCollapsed && comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-purple-500/30 pl-2 ml-4">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
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

// Sorting Controls Component
const SortingControls = ({ sortBy, onSortChange }) => {
  return (
    <div className="flex items-center gap-4 mb-6 bg-slate-800/30 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
      <span className="text-sm font-medium text-gray-300">Sort by:</span>
      <div className="flex gap-2 flex-wrap">
        {['newest', 'oldest', 'upvotes', 'replies'].map((option) => (
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

// Main Comment Thread Component
const CommentThread = ({ comments, onReply, onUpvote, onDelete, currentUser, sortBy }) => {
  const buildTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach(comment => {
      map[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parent_id) {
        if (map[comment.parent_id]) {
          map[comment.parent_id].replies.push(map[comment.id]);
        }
      } else {
        roots.push(map[comment.id]);
      }
    });

    return roots;
  };

  const sortComments = (comments, sortBy) => {
    const sorted = [...comments];
    
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'upvotes':
        sorted.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'replies':
        sorted.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
        break;
      default:
        break;
    }

    sorted.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = sortComments(comment.replies, sortBy);
      }
    });

    return sorted;
  };

  const tree = buildTree(comments);
  const sortedTree = sortComments(tree, sortBy);

  return (
    <div className="space-y-2">
      {sortedTree.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onUpvote={onUpvote}
          onDelete={onDelete}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

// Main App Component
const App = () => {
  const [comments, setComments] = useState(mockComments);
  const [sortBy, setSortBy] = useState('newest');

  const handleAddComment = (text) => {
    const newComment = {
      id: String(Date.now()),
      text,
      upvotes: 0,
      created_at: new Date().toISOString(),
      user_id: mockUser.id,
      parent_id: null,
      user: mockUser
    };
    setComments([...comments, newComment]);
  };

  const handleReply = (parentId, text) => {
    const newComment = {
      id: String(Date.now()),
      text,
      upvotes: 0,
      created_at: new Date().toISOString(),
      user_id: mockUser.id,
      parent_id: parentId,
      user: mockUser
    };
    setComments([...comments, newComment]);
  };

  const handleUpvote = (commentId, isUpvoted) => {
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, upvotes: c.upvotes + (isUpvoted ? 1 : -1) }
        : c
    ));
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter(c => c.id !== commentId && c.parent_id !== commentId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <Header user={mockUser} />

      <div className="relative z-10 max-w-5xl mx-auto p-6 py-8">
        <Post post={mockPost} />

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mt-6 border border-slate-700/50">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            Comments <span className="text-purple-400">({comments.length})</span>
          </h2>

          <div className="mb-6">
            <CommentInput onSubmit={handleAddComment} />
          </div>

          <SortingControls sortBy={sortBy} onSortChange={setSortBy} />

          <CommentThread
            comments={comments}
            onReply={handleReply}
            onUpvote={handleUpvote}
            onDelete={handleDelete}
            currentUser={mockUser}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  );
};

export default App;