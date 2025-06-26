import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Edit3, Trash2, Users, BarChart3,
  Moon, Sun, Home, User, Shield, Eye, LogOut, Menu, X
} from 'lucide-react';

// Toàn bộ CSS của ứng dụng được đặt trong một chuỗi.
const appCss = `
:root {
    --font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-family-mono: "Courier New", Courier, monospace;
    --bg-primary: #f9fafb; --bg-secondary: #ffffff; --bg-tertiary: #f3f4f6; --bg-hover: #f3f4f6;
    --text-primary: #111827; --text-secondary: #4b5563;
    --border-primary: #e5e7eb; --border-secondary: #f3f4f6;
    --blue-100: #dbeafe; --blue-600: #2563eb; --blue-700: #1d4ed8; --blue-800: #1e40af; --blue-900: #1e3a8a;
    --green-100: #dcfce7; --green-600: #16a34a; --green-800: #166534; --green-900: #14532d;
    --red-100: #fee2e2; --red-600: #dc2626; --red-800: #991b1b; --red-900: #7f1d1d;
    --yellow-100: #fef9c3; --yellow-800: #854d0e; --yellow-900: #713f12;
    --purple-100: #f3e8ff; --purple-600: #9333ea; --purple-900: #581c87;
    --orange-100: #ffedd5; --orange-600: #ea580c; --orange-900: #7c2d12;
}
.dark {
    --bg-primary: #111827; --bg-secondary: #1f2937; --bg-tertiary: #374151; --bg-hover: #374151;
    --text-primary: #f9fafb; --text-secondary: #9ca3af;
    --border-primary: #374151; --border-secondary: #4b5563;
}
body { margin: 0; font-family: var(--font-family-sans); background-color: var(--bg-primary); color: var(--text-primary); line-height: 1.5; }
* { box-sizing: border-box; }
button, input, textarea, select { font-family: inherit; }
.app-container { min-height: 100vh; }
.content-wrapper { flex-grow: 1; transition: margin-left 0.2s ease-in-out; }
.content { padding: 1.5rem; }
.header { background-color: var(--bg-secondary); border-bottom: 1px solid var(--border-primary); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 30; }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.sidebar { width: 16rem; background-color: var(--bg-secondary); border-right: 1px solid var(--border-primary); position: fixed; top: 0; bottom: 0; left: 0; z-index: 50; display: flex; flex-direction: column; transition: transform 0.2s ease-in-out; }
.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--border-primary); }
.sidebar-logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: bold; }
.sidebar-nav { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.sidebar-footer { margin-top: auto; padding: 1rem; }
.user-profile-widget { background-color: var(--bg-tertiary); border-radius: 0.5rem; padding: 0.75rem; }
.user-info { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.user-avatar-small { width: 2rem; height: 2rem; border-radius: 9999px; background-color: var(--blue-600); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; }
.user-details { min-width: 0; }
.user-name { font-size: 0.875rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role-small { font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mobile-overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 40; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid transparent; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; gap: 0.5rem; }
.btn-primary { background-color: var(--blue-600); color: white; }
.btn-primary:hover { background-color: var(--blue-700); }
.btn-secondary { background-color: transparent; border-color: var(--border-primary); }
.btn-secondary:hover { background-color: var(--bg-hover); }
.btn-danger { color: var(--red-600); }
.btn-danger:hover { background-color: rgba(220, 38, 38, 0.1); }
.btn-icon { padding: 0.5rem; background-color: transparent; }
.btn-icon:hover { background-color: var(--bg-hover); }
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
.form-input, .form-textarea, .form-select { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); transition: all 0.2s; }
.form-input:focus, .form-textarea:focus, .form-select:focus { outline: none; border-color: var(--blue-600); box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4); }
.card { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 0.75rem; padding: 1.5rem; transition: all 0.2s; display: flex; flex-direction: column; }
.card:hover { border-color: #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
.dark .card:hover { border-color: #4b5563; }
.badge { display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 0.25rem; line-height: 1.2; }
.badge-blue { background-color: var(--blue-100); color: var(--blue-800); } .dark .badge-blue { background-color: var(--blue-900); color: var(--blue-100); }
.badge-green { background-color: var(--green-100); color: var(--green-800); } .dark .badge-green { background-color: var(--green-900); color: var(--green-100); }
.badge-yellow { background-color: var(--yellow-100); color: var(--yellow-800); } .dark .badge-yellow { background-color: var(--yellow-900); color: var(--yellow-100); }
.badge-red { background-color: var(--red-100); color: var(--red-800); } .dark .badge-red { background-color: var(--red-900); color: var(--red-100); }
.modal-overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
.modal-content { background-color: var(--bg-secondary); border-radius: 0.75rem; max-width: 50rem; width: 100%; max-height: 90vh; overflow-y: auto; padding: 1.5rem; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.modal-title { font-size: 1.25rem; font-weight: bold; }
.modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
.table-wrapper { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border-secondary); }
.table th { font-weight: 500; }
.auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.auth-card { max-width: 28rem; width: 100%; padding: 2rem; border-radius: 0.75rem; background-color: var(--bg-secondary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
.auth-header { text-align: center; } .auth-header .lucide { margin: 0 auto; }
.auth-header h2 { margin-top: 1.5rem; font-size: 1.875rem; font-weight: bold; }
.auth-form { margin-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.auth-footer { text-align: center; font-size: 0.875rem; color: var(--text-secondary); }
.auth-footer button { background: none; border: none; color: var(--blue-600); cursor: pointer; padding: 0; margin-top: 0.5rem; }
.page-header { display: flex; flex-direction: column; gap: 1rem; justify-content: space-between; margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.5rem; font-weight: bold; margin: 0; }
.page-header p { color: var(--text-secondary); margin: 0.25rem 0 0 0; }
.filter-controls { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
.search-input-wrapper { position: relative; flex: 1; }
.search-input-wrapper .lucide-search { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
.search-input { width: 100%; padding-left: 2.5rem; }
.tag-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag-filter-btn { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; cursor: pointer; border: 1px solid var(--border-primary); background-color: var(--bg-tertiary); }
.tag-filter-btn.active { background-color: var(--blue-600); color: white; border-color: var(--blue-600); }
.grid-container { display: grid; gap: 1.5rem; }
.doc-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.doc-card-title { font-size: 1.125rem; font-weight: 600; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.doc-card-actions { display: flex; gap: 0.25rem; }
.doc-card-desc { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1; }
.doc-card-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.doc-card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary); margin-top: auto; }
.stats-grid { display: grid; gap: 1.5rem; }
.stat-card { display: flex; align-items: center; gap: 1rem; }
.stat-icon { padding: 0.5rem; border-radius: 0.5rem; }
.stat-info .value { font-size: 1.5rem; font-weight: bold; }
.stat-info .label { font-size: 0.875rem; color: var(--text-secondary); }
.profile-page { display: flex; flex-direction: column; gap: 1.5rem; }
.profile-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
.profile-avatar { width: 5rem; height: 5rem; border-radius: 9999px; background-color: var(--blue-600); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.profile-details h2 { margin: 0; font-size: 1.25rem; font-weight: 600; }
.profile-details p { margin: 0; color: var(--text-secondary); }
.profile-details .badge { margin-top: 0.25rem; }
.form-grid { display: grid; gap: 1.5rem; }
.preferences { border-top: 1px solid var(--border-primary); margin-top: 1.5rem; padding-top: 1.5rem; }
.preference-item { display: flex; justify-content: space-between; align-items: center; }
@media (min-width: 640px) { .page-header { flex-direction: row; align-items: center; } .filter-controls { flex-direction: row; } }
@media (min-width: 768px) {
    .sidebar { transform: translateX(0); }
    .sidebar.open { transform: translateX(0); }
    .content-wrapper { margin-left: 16rem; }
    .sidebar-toggle-mobile, .sidebar-close-mobile { display: none; }
    .grid-container { grid-template-columns: repeat(2, 1fr); }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .form-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
    .grid-container { grid-template-columns: repeat(3, 1fr); }
    .stats-grid { grid-template-columns: repeat(4, 1fr); }
}
`;

// Dữ liệu giả
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: '👨‍💻' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatar: '👩‍💼' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', avatar: '👨‍🔬' }
];
const mockDocuments = [
  { id: 1, title: 'API Documentation', description: 'Complete REST API documentation for the platform', content: '# API Documentation...', tags: ['API', 'Backend', 'Documentation'], author: 'John Doe', createdAt: '2024-01-15', updatedAt: '2024-01-20', status: 'Published' },
  { id: 2, title: 'Frontend Architecture', description: 'Technical architecture overview for React frontend', content: '# Frontend Architecture...', tags: ['Frontend', 'React', 'Architecture'], author: 'Jane Smith', createdAt: '2024-01-10', updatedAt: '2024-01-18', status: 'Draft' },
  { id: 3, title: 'Database Schema', description: 'Complete database schema and relationships', content: '# Database Schema...', tags: ['Database', 'Schema', 'Backend'], author: 'Mike Johnson', createdAt: '2024-01-08', updatedAt: '2024-01-16', status: 'Published' },
];


const TechDocManager = () => {
  // Hook để chèn CSS vào <head>
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = appCss;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // State
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [documents, setDocuments] = useState(mockDocuments);
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Effect cho Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // --- HÀM ---
  const login = (email) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setCurrentPage(user.role === 'Admin' ? 'admin-dashboard' : 'dashboard');
      return true;
    }
    return false;
  };
  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };
  const createDocument = (docData) => {
    const newDoc = { id: Date.now(), ...docData, author: currentUser.name, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], status: 'Draft' };
    setDocuments([newDoc, ...documents]);
  };
  const updateDocument = (id, updates) => {
    setDocuments(documents.map(doc => doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : doc));
  };
  const deleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  // Dữ liệu đã lọc
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => doc.tags.includes(tag));
    return matchesSearch && matchesTags;
  });
  const allTags = [...new Set(documents.flatMap(doc => doc.tags))];

  // --- COMPONENT CON ---
  const Sidebar = () => (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo"><FileText color="var(--blue-600)" /><span>DocuManager</span></div>
        <button className="btn btn-icon sidebar-close-mobile" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
      </div>
      <nav className="sidebar-nav">
        {currentUser?.role === 'Admin' && (
          <>
            <button className="btn" onClick={() => setCurrentPage('admin-dashboard')}><BarChart3 size={20} /><span>Admin Dashboard</span></button>
            <button className="btn" onClick={() => setCurrentPage('users')}><Users size={20} /><span>Users</span></button>
          </>
        )}
        <button className="btn" onClick={() => setCurrentPage('dashboard')}><Home size={20} /><span>Dashboard</span></button>
        <button className="btn" onClick={() => setCurrentPage('profile')}><User size={20} /><span>Profile</span></button>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-info">
            <div className="user-avatar-small">{currentUser?.avatar}</div>
            <div className="user-details"><p className="user-name">{currentUser?.name}</p><p className="user-role-small">{currentUser?.role}</p></div>
          </div>
          <button className="btn btn-danger" onClick={logout} style={{ width: '100%' }}><LogOut size={16} /><span>Sign Out</span></button>
        </div>
      </div>
    </div>
  );
  
  const DocumentModal = () => {
    const [formData, setFormData] = useState({});
    useEffect(() => {
        setFormData({
            title: selectedDocument?.title || '', description: selectedDocument?.description || '',
            content: selectedDocument?.content || '', tags: selectedDocument?.tags?.join(', ') || '',
            status: selectedDocument?.status || 'Draft'
        });
    }, [selectedDocument, modalType]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const docData = { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) };
      if (modalType === 'create') createDocument(docData);
      else if (modalType === 'edit') updateDocument(selectedDocument.id, docData);
      setShowModal(false); setSelectedDocument(null);
    };
    
    if (!showModal) return null;
    return (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {modalType === 'create' ? 'Tạo Tài Liệu Mới' : modalType === 'edit' ? 'Chỉnh Sửa Tài Liệu' : 'Xem Tài Liệu'}
                    </h2>
                    <button className="btn btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
                </div>
                {modalType === 'view' ? (
                    <div>
                        <h3 style={{marginTop: 0}}>{selectedDocument?.title}</h3>
                        <p>{selectedDocument?.description}</p>
                         <div className="doc-card-tags">
                            {selectedDocument?.tags.map(tag => <span key={tag} className="badge badge-blue">{tag}</span>)}
                        </div>
                        <pre style={{backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'var(--font-family-mono)'}}>{selectedDocument?.content}</pre>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Tiêu đề</label>
                            <input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mô tả</label>
                            <textarea className="form-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nội dung (Markdown)</label>
                            <textarea className="form-textarea" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={10} required/>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
                                <input className="form-input" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Trạng thái</label>
                                <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="Draft">Bản nháp</option>
                                    <option value="Published">Đã xuất bản</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                            <button type="submit" className="btn btn-primary">{modalType === 'create' ? 'Tạo' : 'Lưu thay đổi'}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
  };
  
  const PageRenderer = () => {
      switch (currentPage) {
          case 'dashboard': return <Dashboard />;
          case 'admin-dashboard': return <AdminDashboard />;
          case 'users': return <UsersPage />;
          case 'profile': return <ProfilePage />;
          default: return <HomePage />;
      }
  };
  
  const Dashboard = () => (
      <div>
          <div className="page-header">
              <div><h1>Tài liệu của tôi</h1><p>Quản lý và sắp xếp tài liệu kỹ thuật của bạn</p></div>
              <button className="btn btn-primary" onClick={() => { setModalType('create'); setSelectedDocument(null); setShowModal(true); }}><Plus size={16}/><span>Tài liệu mới</span></button>
          </div>
          <div className="filter-controls">
              <div className="search-input-wrapper"><Search size={16} className="lucide-search"/><input className="form-input search-input" placeholder="Tìm kiếm tài liệu..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
              <div className="tag-filters">{allTags.map(tag => (<button key={tag} className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`} onClick={() => setSelectedTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}>{tag}</button>))}</div>
          </div>
          <div className="grid-container">
              {filteredDocuments.map(doc => (
                  <div key={doc.id} className="card">
                      <div className="doc-card-header">
                          <h3 className="doc-card-title">{doc.title}</h3>
                          <div className="doc-card-actions">
                              <button className="btn btn-icon" onClick={() => { setModalType('view'); setSelectedDocument(doc); setShowModal(true); }}><Eye size={16}/></button>
                              <button className="btn btn-icon" onClick={() => { setModalType('edit'); setSelectedDocument(doc); setShowModal(true); }}><Edit3 size={16}/></button>
                              <button className="btn btn-icon btn-danger" onClick={() => deleteDocument(doc.id)}><Trash2 size={16}/></button>
                          </div>
                      </div>
                      <p className="doc-card-desc">{doc.description}</p>
                      <div className="doc-card-tags">{doc.tags.map(tag => <span key={tag} className="badge badge-blue">{tag}</span>)}</div>
                      <div className="doc-card-footer">
                          <span>Cập nhật: {doc.updatedAt}</span>
                          <span className={`badge ${doc.status === 'Published' ? 'badge-green' : 'badge-yellow'}`}>{doc.status}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
  
  // Các trang khác (HomePage, LoginPage, AdminDashboard, UsersPage, ProfilePage) được định nghĩa tương tự...
  const HomePage = () => (<div>...Nội dung trang chủ...</div>); // Rút gọn để dễ đọc
  const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [error, setError] = useState('');
      const handleLogin = (e) => { e.preventDefault(); if (!login(email)) setError('Email không hợp lệ.'); };
      return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <FileText size={48} color="var(--blue-600)" className="lucide"/>
                    <h2>Đăng nhập vào DocuManager</h2>
                </div>
                <form className="auth-form" onSubmit={handleLogin}>
                    {error && <p style={{color: 'var(--red-600)'}}>{error}</p>}
                    <div className="form-group">
                        <label className="form-label">Địa chỉ Email</label>
                        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" required/>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Đăng nhập</button>
                </form>
                 <div className="auth-footer">
                    <p>Tài khoản demo: john@example.com (Admin), jane@example.com (User)</p>
                </div>
            </div>
        </div>
      );
  }
  const AdminDashboard = () => (<div>...Nội dung trang Admin...</div>); // Rút gọn
  const UsersPage = () => (<div>...Nội dung trang Users...</div>); // Rút gọn
  const ProfilePage = () => (<div>...Nội dung trang Profile...</div>); // Rút gọn

  // --- RENDER CHÍNH ---
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
        <Sidebar />
        <div className="content-wrapper">
             <header className="header">
                 <button className="btn btn-icon sidebar-toggle-mobile" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button>
                 <div style={{flexGrow: 1}}></div>
                 <div className="header-actions">
                     <button className="btn btn-icon" onClick={() => setDarkMode(!darkMode)}>
                         {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                     </button>
                 </div>
            </header>
            <main className="content">
                <PageRenderer />
            </main>
        </div>
        <DocumentModal />
    </div>
  );
};

export default TechDocManager;
