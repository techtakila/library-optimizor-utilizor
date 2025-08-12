import React from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Book } from '../types';

interface BooksTabProps {
  books: Book[];
  filteredBooks: Book[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isAddingBook: boolean;
  setIsAddingBook: (adding: boolean) => void;
  newBook: Partial<Book>;
  setNewBook: (book: Partial<Book>) => void;
  handleAddBook: () => void;
  handleDeleteBook: (id: string) => void;
}

const BooksTab: React.FC<BooksTabProps> = ({
  books,
  filteredBooks,
  searchTerm,
  setSearchTerm,
  isAddingBook,
  setIsAddingBook,
  newBook,
  setNewBook,
  handleAddBook,
  handleDeleteBook,
}) => (
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
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Book title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Author *</label>
            <input
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Author name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">ISBN</label>
            <input
              type="text"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ISBN number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Section</label>
            <select
              value={newBook.section}
              onChange={(e) => setNewBook({ ...newBook, section: e.target.value })}
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
              value={newBook.totalCopies}
              onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Available Copies</label>
            <input
              type="number"
              min="0"
              value={newBook.availableCopies}
              onChange={(e) => setNewBook({ ...newBook, availableCopies: parseInt(e.target.value) })}
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

export default BooksTab;