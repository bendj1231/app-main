import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { uploadProfileImage, type CloudinaryUploadResult } from '@/src/lib/cloudinaryClient';

const SIDEBAR_WIDTH = 260;

const sidebarNav = [
  { label: 'Dashboard', path: '/admin', icon: '◆' },
  { label: 'Employee Objectives', path: '/admin/objectives', icon: '◈' },
  { label: 'Email & Contacts', path: '/admin/emails', icon: '◉' },
  { label: 'Messages', path: '/admin/messages', icon: '◈' },
  { label: 'Support Inbox', path: '/admin/support', icon: '◉' },
  { label: 'Blogs & Articles', path: '/admin/blogs', icon: '◉' },
  { label: 'Future Prospects', path: '/admin/prospects', icon: '◉' },
  { label: 'Meetings', path: '/admin/meetings', icon: '▶', badge: 3 },
  { label: 'Planning Board', path: '/admin/planning', icon: '◐' },
  { label: 'AI Bot', path: '/admin/bot', icon: '◉' },
  { label: 'Verification Queue', path: '/admin/verification', icon: '◈' },
  { label: 'Pilot Management', path: '/admin/pilots', icon: '◉' },
  { label: 'Enterprise Accounts', path: '/admin/enterprises', icon: '◆' },
  { label: 'Event Management', path: '/admin/events', icon: '◈' },
  { label: 'System Settings', path: '/admin/settings', icon: '◉' },
];

interface BlogPost {
  id: string;
  title: string;
  author: 'Benjamin' | 'Karl';
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'review';
  category: string;
  created_at: string;
  comments: { id: string; author: string; text: string; created_at: string }[];
  reviewNotes?: string;
  reviewScreenshots?: string[];
}

const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Four-Floor Tower: Understanding the Pilot Pipeline Crisis',
    author: 'Karl',
    excerpt: 'Why pilots are stuck at every stage of their career and how PilotRecognition bridges the gap.',
    content: 'The aviation industry faces a critical pipeline crisis. Floor 0: Graduates with 200 hours promised airline jobs that never materialize. Floor 1: Flight Instructors with 5,000+ hours stuck because nobody is leaving Floor 2. Floor 2: The Recognition Gap where everyone fights for recognition without clear pathways. Floor 3: Airline Pilots trapped by seniority sacrifice. PilotRecognition provides the framework to unclog this pipeline.',
    status: 'published',
    category: 'Industry Analysis',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    comments: [
      { id: 'c1', author: 'Benjamin', text: 'Great framing of the problem. The seniority trap is especially compelling.', created_at: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
  {
    id: '2',
    title: 'Recognition Score as Currency: How Your Capabilities Travel',
    author: 'Benjamin',
    excerpt: 'Why static CVs are dead and live real-time profiles with portable recognition scores are the future.',
    content: 'Your recognition score is what you spend on pathway access. Unlike airline seniority, your capabilities travel with you. A Captain with high recognition can move to private aviation without starting from zero. This is the future of pilot career mobility.',
    status: 'review',
    category: 'Product Vision',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    comments: [],
  },
  {
    id: '3',
    title: 'Pulling System vs Push Applications: Why Airlines Win',
    author: 'Karl',
    excerpt: 'How the pull model transforms recruitment from a flood of unqualified applications to targeted talent discovery.',
    content: 'Traditional job boards are push applications — pilots spam applications to airlines. PilotRecognition is a pulling system — pilots submit interest, airlines pull from a database of live real-time profiles. This saves airlines time and money while giving pilots visibility.',
    status: 'published',
    category: 'Product Strategy',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    comments: [
      { id: 'c2', author: 'Karl', text: 'Need to emphasize the live profile aspect more.', created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
    ],
  },
  {
    id: '4',
    title: 'Pathway Cards: Not Job Listings',
    author: 'Benjamin',
    excerpt: 'The difference between job postings and pathway cards that show requirements and gaps.',
    content: 'Pathway Cards are not job listings. They show you exactly what you need for a specific pathway — hours, ratings, training, certifications. They highlight your gaps so you know what to work on. This is the bridge between where you are and where you want to be.',
    status: 'draft',
    category: 'Product Vision',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    comments: [],
  },
];

export default function BlogsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [authorFilter, setAuthorFilter] = useState<'all' | 'Benjamin' | 'Karl'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'review' | 'published'>('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const filteredBlogs = blogs.filter((blog) => {
    if (authorFilter !== 'all' && blog.author !== authorFilter) return false;
    if (statusFilter !== 'all' && blog.status !== statusFilter) return false;
    return true;
  });

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedBlog) return;
    const comment = {
      id: `c${Date.now()}`,
      author: userProfile?.display_name || currentUser?.email || 'Admin',
      text: newComment,
      created_at: new Date().toISOString(),
    };
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === selectedBlog.id ? { ...b, comments: [...b.comments, comment] } : b
      )
    );
    setSelectedBlog((prev) => (prev ? { ...prev, comments: [...prev.comments, comment] } : null));
    setNewComment('');
  };

  const handleUpdateStatus = (id: string, status: BlogPost['status']) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status, reviewNotes: reviewNotes || undefined }
          : b
      )
    );
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedBlog || !currentUser) return;

    const file = e.target.files[0];
    setUploadingScreenshot(true);

    const result: CloudinaryUploadResult = await uploadProfileImage(
      file,
      currentUser.id
    );

    setUploadingScreenshot(false);

    if (result.success && result.url) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === selectedBlog.id
            ? { ...b, reviewScreenshots: [...(b.reviewScreenshots || []), result.url!] }
            : b
        )
      );
      setSelectedBlog((prev) =>
        prev
          ? { ...prev, reviewScreenshots: [...(prev.reviewScreenshots || []), result.url!] }
          : null
      );
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  };

  const handleSaveReviewNotes = () => {
    if (!selectedBlog) return;
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === selectedBlog.id
          ? { ...b, reviewNotes: reviewNotes || undefined }
          : b
      )
    );
    setSelectedBlog((prev) => (prev ? { ...prev, reviewNotes: reviewNotes || undefined } : null));
  };

  if (!currentUser || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#1a1a1a' }}>Access Denied</h2>
          <p style={{ color: '#6b7280' }}>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: SIDEBAR_WIDTH, background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#ef4444', fontSize: 22 }}>◆</span>
            <span>Admin<span style={{ color: '#ef4444' }}>OS</span></span>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.05em' }}>PILOTRECOGNITION MANAGEMENT</div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sidebarNav.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent', border: 'none', color: isActive ? '#ef4444' : '#6b7280', fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', position: 'relative' }}>
                {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#ef4444', borderRadius: '0 4px 4px 0' }} />}
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' }}>{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 16px 20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {((userProfile?.display_name || userProfile?.email || currentUser?.email || '?') as string).charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile?.display_name || userProfile?.email || currentUser?.email}</div>
              <div style={{ fontSize: 10, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>● {userProfile?.role || 'admin'}</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '8px 0', background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>←</span> Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, padding: '32px', minHeight: '100vh' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#1a1a1a' }}>Blogs & Articles</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Review and comment on content by Benjamin and Karl</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'Benjamin', 'Karl'].map((author) => (
              <button
                key={author}
                onClick={() => setAuthorFilter(author as typeof authorFilter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: authorFilter === author ? '#ef4444' : '#e5e7eb',
                  background: authorFilter === author ? 'rgba(239,68,68,0.08)' : '#fff',
                  color: authorFilter === author ? '#ef4444' : '#6b7280',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {author === 'all' ? 'All Authors' : author}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'draft', 'review', 'published'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as typeof statusFilter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: statusFilter === status ? '#ef4444' : '#e5e7eb',
                  background: statusFilter === status ? 'rgba(239,68,68,0.08)' : '#fff',
                  color: statusFilter === status ? '#ef4444' : '#6b7280',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Blog List */}
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => { setSelectedBlog(blog); setReviewNotes(blog.reviewNotes || ''); }}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: blog.author === 'Benjamin' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', color: blog.author === 'Benjamin' ? '#3b82f6' : '#8b5cf6' }}>
                      {blog.author}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: blog.status === 'published' ? 'rgba(16,185,129,0.1)' : blog.status === 'review' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)', color: blog.status === 'published' ? '#10b981' : blog.status === 'review' ? '#f59e0b' : '#6b7280' }}>
                      {blog.status}
                    </span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{blog.category}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{blog.title}</h3>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(blog.created_at).toLocaleDateString()}</div>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{blog.excerpt}</p>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{blog.comments.length} comments</span>
              </div>
            </div>
          ))}
          {filteredBlogs.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No blogs match this filter</div>
          )}
        </div>
      </main>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedBlog(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 700, maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: selectedBlog.author === 'Benjamin' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', color: selectedBlog.author === 'Benjamin' ? '#3b82f6' : '#8b5cf6' }}>
                    {selectedBlog.author}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: selectedBlog.status === 'published' ? 'rgba(16,185,129,0.1)' : selectedBlog.status === 'review' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)', color: selectedBlog.status === 'published' ? '#10b981' : selectedBlog.status === 'review' ? '#f59e0b' : '#6b7280' }}>
                    {selectedBlog.status}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{selectedBlog.title}</h2>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(selectedBlog.created_at).toLocaleDateString()}</div>
            </div>

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
              {selectedBlog.content}
            </div>

            {/* Status Actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {selectedBlog.status !== 'draft' && (
                <button onClick={() => handleUpdateStatus(selectedBlog.id, 'draft')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Set Draft</button>
              )}
              {selectedBlog.status !== 'review' && (
                <button onClick={() => handleUpdateStatus(selectedBlog.id, 'review')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Set Review</button>
              )}
              {selectedBlog.status !== 'published' && (
                <button onClick={() => handleUpdateStatus(selectedBlog.id, 'published')} style={{ padding: '6px 12px', background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Publish</button>
              )}
            </div>

            {/* Review Notes & Screenshots */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Review Notes</h3>
              <textarea
                value={reviewNotes || selectedBlog.reviewNotes || ''}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add review notation..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a', resize: 'vertical', marginBottom: 12 }}
              />
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button onClick={handleSaveReviewNotes} style={{ padding: '6px 12px', background: '#3b82f6', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save Notes</button>
                <label style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    disabled={uploadingScreenshot}
                    style={{ display: 'none' }}
                  />
                  {uploadingScreenshot ? 'Uploading...' : 'Upload Screenshot'}
                </label>
              </div>
              {selectedBlog.reviewScreenshots && selectedBlog.reviewScreenshots.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  {selectedBlog.reviewScreenshots.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={url} alt={`Screenshot ${idx + 1}`} style={{ width: '100%', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: '#1a1a1a' }}>Comments ({selectedBlog.comments.length})</h3>
              {selectedBlog.comments.length === 0 ? (
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>No comments yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {selectedBlog.comments.map((comment) => (
                    <div key={comment.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{comment.author}</span>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                  style={{ flex: 1, padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
                />
                <button onClick={handleAddComment} disabled={!newComment.trim()} style={{ padding: '10px 16px', background: newComment.trim() ? '#3b82f6' : '#e5e7eb', border: 'none', borderRadius: 8, color: newComment.trim() ? '#fff' : '#9ca3af', fontSize: 13, fontWeight: 600, cursor: newComment.trim() ? 'pointer' : 'not-allowed' }}>
                  Post
                </button>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedBlog(null)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
