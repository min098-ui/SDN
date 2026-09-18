'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  posts: any[];
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number;
  author?: { id: number; name: string | null; email: string };
  category?: { id: number; name: string } | null;
  createdAt: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for User
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER');
  const [submittingUser, setSubmittingUser] = useState(false);

  // Form states for Post
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthorId, setPostAuthorId] = useState<string>('');
  const [postCategory, setPostCategory] = useState('');
  const [postPublished, setPostPublished] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Fetch all data from Slot 6 Next.js REST API
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [resUsers, resPosts] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/posts'),
      ]);

      if (!resUsers.ok || !resPosts.ok) {
        throw new Error('Unable to connect to database or API error. Please check PostgreSQL.');
      }

      const usersData = await resUsers.json();
      const postsData = await resPosts.json();

      setUsers(Array.isArray(usersData) ? usersData : []);
      setPosts(Array.isArray(postsData) ? postsData : []);
      if (usersData.length > 0 && !postAuthorId) {
        setPostAuthorId(String(usersData[0].id));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Submit new User via POST /api/users
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    try {
      setSubmittingUser(true);
      setErrorMsg(null);

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userName || undefined,
          role: userRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      showSuccess(`✅ Successfully created user ${data.email} via Next.js REST API!`);
      setUserEmail('');
      setUserName('');
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmittingUser(false);
    }
  };

  // Submit new Post via POST /api/posts
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postAuthorId) {
      setErrorMsg('Please enter a post title and select an author');
      return;
    }

    try {
      setSubmittingPost(true);
      setErrorMsg(null);

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          content: postContent || undefined,
          authorId: Number(postAuthorId),
          categoryName: postCategory || undefined,
          published: postPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      showSuccess(`✅ Successfully published post "${data.title}" via Next.js REST API!`);
      setPostTitle('');
      setPostContent('');
      setPostCategory('');
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmittingPost(false);
    }
  };

  // Toggle publish state via PATCH /api/posts/[id]
  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error('Failed to update post status');
      showSuccess(`Post #${post.id} updated to ${!post.published ? 'Published' : 'Draft'}`);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Delete post via DELETE /api/posts/[id]
  const handleDeletePost = async (id: number) => {
    if (!confirm(`Are you sure you want to delete post #${id}?`)) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      showSuccess(`Post #${id} deleted successfully!`);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-title">
          <h1>Slot 5 & 6 Fullstack Demo</h1>
          <p>Next.js REST API + NestJS Backend sharing PostgreSQL via Prisma ORM</p>
        </div>

        <div className="badge-row">
          <a
            href="http://localhost:3001/api"
            target="_blank"
            rel="noreferrer"
            className="badge badge-nestjs"
            title="Open Slot 5 Swagger Documentation"
          >
            <span>🔴</span> Slot 5: NestJS Swagger (:3001/api)
          </a>
          <div className="badge badge-nextjs">
            <span>⚡</span> Slot 6: Next.js REST API (:3000)
          </div>
          <div className="badge badge-prisma">
            <span>💎</span> Prisma ORM + PostgreSQL
          </div>
        </div>
      </header>

      {/* Messages */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          color: '#6ee7b7',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          {successMsg}
        </div>
      )}

      {/* Stats row */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{posts.length}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-info">
            <h3>{posts.filter(p => p.published).length}</h3>
            <p>Published Posts</p>
          </div>
        </div>
      </div>

      {/* API Endpoints bar */}
      <div className="api-bar">
        <div className="api-bar-title">🔗 Test Next.js REST Endpoints (Slot 6) directly in browser:</div>
        <div className="api-links">
          <a href="/api/users" target="_blank" className="api-link">GET /api/users</a>
          <a href="/api/posts" target="_blank" className="api-link">GET /api/posts</a>
          <a href="/api/posts?published=true" target="_blank" className="api-link">GET /api/posts?published=true</a>
          <a href="http://localhost:3001/api" target="_blank" className="api-link" style={{ borderColor: '#ff5277', color: '#ff5277' }}>
            NestJS Swagger UI (Slot 5)
          </a>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="main-layout">
        {/* Column 1: Users */}
        <div className="glass-card">
          <div className="card-title">
            <h2>👥 User Management</h2>
            <span className="tag">Prisma Model: User</span>
          </div>

          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Email (*):</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. student@fpt.edu.vn"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role:</label>
                <select
                  className="form-select"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="AUTHOR">AUTHOR</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submittingUser}>
              {submittingUser ? 'Submitting...' : '➕ Create User (POST /api/users)'}
            </button>
          </form>

          <div className="items-list">
            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading users...</p>
            ) : users.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No users found. Create one above!</p>
            ) : (
              users.map((u) => (
                <div key={u.id} className="item-card">
                  <div className="item-header">
                    <div className="item-title">{u.name || '(No name)'}</div>
                    <span className="tag">{u.role}</span>
                  </div>
                  <div className="item-meta">
                    <span>📧 {u.email}</span>
                    <span>• ID #{u.id}</span>
                    <span>• {u.posts ? `${u.posts.length} posts` : ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Posts */}
        <div className="glass-card">
          <div className="card-title">
            <h2>📝 Post Management</h2>
            <span className="tag">Prisma Model: Post</span>
          </div>

          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label className="form-label">Post Title (*):</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Getting Started with Prisma and PostgreSQL"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Author (*):</label>
                <select
                  className="form-select"
                  value={postAuthorId}
                  onChange={(e) => setPostAuthorId(e.target.value)}
                  required
                >
                  {users.length === 0 && <option value="">(Create a user first)</option>}
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name ? `${u.name} (${u.email})` : u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Technology, Education"
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Content Summary:</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Write post content here..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="publishedCheckbox"
                checked={postPublished}
                onChange={(e) => setPostPublished(e.target.checked)}
              />
              <label htmlFor="publishedCheckbox" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                Publish immediately (Published = true)
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submittingPost || users.length === 0}>
              {submittingPost ? 'Publishing...' : '➕ Create Post (POST /api/posts)'}
            </button>
          </form>

          <div className="items-list">
            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No posts found.</p>
            ) : (
              posts.map((p) => (
                <div key={p.id} className="item-card">
                  <div className="item-header">
                    <div className="item-title">{p.title}</div>
                    <span className={`status-badge ${p.published ? 'status-published' : 'status-draft'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {p.content && (
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.4rem' }}>
                      {p.content}
                    </p>
                  )}

                  <div className="item-meta">
                    {p.author && <span>✍️ {p.author.name || p.author.email}</span>}
                    {p.category && <span className="tag">🏷️ {p.category.name}</span>}
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-toggle"
                      onClick={() => handleTogglePublish(p)}
                    >
                      {p.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePost(p.id)}
                    >
                      Delete (DELETE /api/posts)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
