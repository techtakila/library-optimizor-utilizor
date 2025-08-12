import React, { useState } from 'react';
import { mockBooks } from '../data/mockData';
import { Book } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  BookOpen,
  Users,
  Database,
  Settings,
  Download,
  Upload
} from 'lucide-react';

// Move BooksTab outside the main component to prevent recreation
const BooksTab: React.FC<{
  books: Book[];
  newBook: Partial<Book>;
  setNewBook: React.Dispatch<React.SetStateAction<Partial<Book>>>;
  isAddingBook: boolean;
  setIsAddingBook: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddBook: () => void;
  handleDeleteBook: (id: string) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  books,
  newBook,
  setNewBook,
  isAddingBook,
  setIsAddingBook,
  handleAddBook,
  handleDeleteBook,
  searchTerm,
  setSearchTerm,
}) => {
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={() => setIsAddingBook(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </button>
      </div>

      {/* Add Book Form */}
      {isAddingBook && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Add New Book</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Title *</label>
              <input
                type="text"
                value={newBook.title || ''}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Book title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Author *</label>
              <input
                type="text"
                value={newBook.author || ''}
                onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">ISBN</label>
              <input
                type="text"
                value={newBook.isbn || ''}
                onChange={(e) => setNewBook(prev => ({ ...prev, isbn: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ISBN number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Section</label>
              <select
                value={newBook.section || 'Fiction'}
                onChange={(e) => setNewBook(prev => ({ ...prev, section: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Total Copies</label>
              <input
                type="number"
                min="1"
                value={newBook.totalCopies || 1}
                onChange={(e) => setNewBook(prev => ({ ...prev, totalCopies: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Available Copies</label>
              <input
                type="number"
                min="0"
                value={newBook.availableCopies || 0}
                onChange={(e) => setNewBook(prev => ({ ...prev, availableCopies: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsAddingBook(false)}
              className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBook}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Add Book
            </button>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Copies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.isbn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {book.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.availableCopies} / {book.totalCopies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.borrowCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-900"
                      >
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
};

const UsersTab = () => (
  <div className="space-y-6">
    <div className="text-center py-12">
      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
      <p className="text-gray-600">User management features would be implemented here.</p>
    </div>
  </div>
);

const SystemTab = () => (
  <div className="space-y-6">
    <div className="text-center py-12">
      <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
      <p className="text-gray-600">System configuration options would be available here.</p>
    </div>
  </div>
);

const DataTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Upload className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-blue-900">Import Data</h3>
        </div>
        <p className="text-sm text-blue-700 mb-4">
          Import books and user data from CSV or JSON files.
        </p>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Download className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-green-900">Export Data</h3>
        </div>
        <p className="text-sm text-green-700 mb-4">
          Export current library data for backup or analysis.
        </p>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>
    </div>
  </div>
);

export const Admin: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    section: 'Fiction',
    totalCopies: 1,
    availableCopies: 1,
    borrowCount: 0,
  });

  const handleAddBook = () => {
    if (newBook.title && newBook.author) {
      const book: Book = {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        isbn: newBook.isbn || '',
        section: newBook.section || 'Fiction',
        totalCopies: newBook.totalCopies || 1,
        availableCopies: newBook.availableCopies || 1,
        borrowCount: 0,
        addedDate: new Date(),
      };
      setBooks([...books, book]);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        section: 'Fiction',
        totalCopies: 1,
        availableCopies: 1,
        borrowCount: 0,
      });
      setIsAddingBook(false);
    }
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const tabs = [
    { id: 'books', label: 'Manage Books', icon: BookOpen },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'data', label: 'Data Import/Export', icon: Database },
  ];

  const TabButton: React.FC<{
    tab: typeof tabs[0];
    isActive: boolean;
    onClick: () => void;
  }> = ({ tab, isActive, onClick }) => {
    const IconComponent = tab.icon;
    return (
      <button
        onClick={onClick}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-50 text-blue-600 border border-blue-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <IconComponent className="h-4 w-4 mr-3" />
        {tab.label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">
          Manage books, users, and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'books' && (
            <BooksTab
              books={books}
              newBook={newBook}
              setNewBook={setNewBook}
              isAddingBook={isAddingBook}
              setIsAddingBook={setIsAddingBook}
              handleAddBook={handleAddBook}
              handleDeleteBook={handleDeleteBook}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'system' && <SystemTab />}
          {activeTab === 'data' && <DataTab />}
        </div>
      </div>
    </div>
  );
};

export default Admin;