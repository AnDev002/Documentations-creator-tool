import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Users,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Home,
  User,
  Shield,
  Calendar,
  Tag,
  Upload,
  Eye,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: '👨‍💻' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatar: '👩‍💼' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', avatar: '👨‍🔬' }
];

const mockDocuments = [
  {
    id: 1,
    title: 'API Documentation',
    description: 'Complete REST API documentation for the platform',
    content: '# API Documentation\n\nThis document contains all API endpoints...',
    tags: ['API', 'Backend', 'Documentation'],
    author: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Frontend Architecture',
    description: 'Technical architecture overview for React frontend',
    content: '# Frontend Architecture\n\nOur frontend is built with React...',
    tags: ['Frontend', 'React', 'Architecture'],
    author: 'Jane Smith',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    status: 'Draft'
  },
  {
    id: 3,
    title: 'Database Schema',
    description: 'Complete database schema and relationships',
    content: '# Database Schema\n\nTable relationships and structure...',
    tags: ['Database', 'Schema', 'Backend'],
    author: 'Mike Johnson',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16',
    status: 'Published'
  }
];

const TechDocManager = () => {
  // State management
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [documents, setDocuments] = useState(mockDocuments);
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'view'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply dark mode to the body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);


  // --- FUNCTIONS ---

  // Authentication simulation
  const login = (email, password) => {
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

  // Document operations
  const createDocument = (docData) => {
    const newDoc = {
      id: documents.length + 1,
      ...docData,
      author: currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    setDocuments([...documents, newDoc]);
  };

  const updateDocument = (id, updates) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : doc
    ));
  };

  const deleteDocument = (id) => {
    // Replaced window.confirm with a simple true for now.
    // In a real app, you'd use a custom modal for confirmation.
    if (true) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  // Filter and derived data
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = [...new Set(documents.flatMap(doc => doc.tags))];


  // --- SUB-COMPONENTS ---
  
  const HomePage = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <nav className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">DocuManager</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Manage Your Technical
            <span className="text-blue-600"> Documents</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Streamline your technical documentation workflow with our modern, collaborative platform.
            Create, edit, and organize your docs with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('login')} // Changed from 'register' to 'login' as there's no register page
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Get Started Free
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Edit3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rich Editor</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Markdown support with WYSIWYG editing for seamless document creation
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Work together with role-based access and real-time collaboration
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track document usage and team productivity with detailed insights
            </p>
          </div>
        </div>
      </main>
    </div>
  );

  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      setError('');
      if (!login(email, password)) {
        setError('Invalid credentials. Please try again.');
      }
    };

    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full space-y-8 p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className={`mt-6 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sign in to DocuManager
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Password"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Demo accounts: john@example.com (Admin), jane@example.com (User)
            </p>
            <button
              onClick={() => setCurrentPage('home')}
              className="mt-2 text-blue-600 hover:text-blue-500 text-sm"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-transform duration-200 ease-in-out md:transition-none`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">DocuManager</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {currentUser?.role === 'Admin' ? (
          <>
            <button
              onClick={() => setCurrentPage('admin-dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'admin-dashboard' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Admin Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('users')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'users' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>
          </>
        ) : null}
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            currentPage === 'dashboard' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setCurrentPage('profile')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            currentPage === 'profile' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
              {currentUser?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your technical documentation
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedDocument(null);
            setModalType('create');
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Document</span>
        </button>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTags(prevTags => 
                  prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(doc => (
          <div
            key={doc.id}
            className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
              darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold line-clamp-2">{doc.title}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setSelectedDocument(doc);
                    setModalType('view');
                    setShowModal(true);
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedDocument(doc);
                    setModalType('edit');
                    setShowModal(true);
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {doc.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
              {doc.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Updated {doc.updatedAt}</span>
              <span className={`px-2 py-1 rounded ${
                doc.status === 'Published'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }`}>
                {doc.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold">{documents.length}</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Published Docs</p>
              <p className="text-2xl font-bold">{documents.filter(d => d.status === 'Published').length}</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'Admin').length}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Documents */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
        <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Author</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Updated</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 5).map(doc => (
                <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3">{doc.title}</td>
                  <td className="py-3">{doc.author}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      doc.status === 'Published'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3">{doc.updatedAt}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const ProfilePage = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
            {currentUser?.avatar}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
              currentUser?.role === 'Admin'
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            }`}>
              {currentUser?.role}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={currentUser?.name}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue={currentUser?.email}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark/light theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const UsersPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Role</th>
                <th className="text-left py-3">Documents</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                        {user.avatar}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'Admin'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    {documents.filter(doc => doc.author === user.name).length}
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const DocumentModal = () => {
    const [formData, setFormData] = useState({
      title: selectedDocument?.title || '',
      description: selectedDocument?.description || '',
      content: selectedDocument?.content || '',
      tags: selectedDocument?.tags?.join(', ') || '',
      status: selectedDocument?.status || 'Draft'
    });

    useEffect(() => {
        // Reset form data when the selected document or modal type changes
        setFormData({
            title: selectedDocument?.title || '',
            description: selectedDocument?.description || '',
            content: selectedDocument?.content || '',
            tags: selectedDocument?.tags?.join(', ') || '',
            status: selectedDocument?.status || 'Draft'
        });
    }, [selectedDocument, modalType]);


    const handleSubmit = (e) => {
      e.preventDefault();
      const docData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      if (modalType === 'create') {
        createDocument(docData);
      } else if (modalType === 'edit') {
        updateDocument(selectedDocument.id, docData);
      }
      setShowModal(false);
      setSelectedDocument(null);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedDocument(null);
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {modalType === 'create' ? 'Create Document' :
                  modalType === 'edit' ? 'Edit Document' : 'View Document'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {modalType === 'view' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedDocument?.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedDocument?.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDocument?.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    Created: {selectedDocument?.createdAt} | Updated: {selectedDocument?.updatedAt} | Author: {selectedDocument?.author}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <pre className="whitespace-pre-wrap font-mono text-sm">{selectedDocument?.content}</pre>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="# Your document title&#10;&#10;Write your markdown content here..."
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                      placeholder="API, Documentation, Backend"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalType === 'create' ? 'Create Document' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER LOGIC ---

  // Render login/home page if not authenticated
  if (!currentUser) {
    return currentPage === 'login' ? <LoginPage /> : <HomePage />;
  }

  // Render the main application dashboard if authenticated
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="md:ml-64">
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 sticky top-0 z-30`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex-1"></div> {/* Spacer */}

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'admin-dashboard' && <AdminDashboard />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'users' && <UsersPage />}
        </main>
      </div>

      {/* Modal */}
      {showModal && <DocumentModal />}
    </div>
  );
};

export default TechDocManager;
