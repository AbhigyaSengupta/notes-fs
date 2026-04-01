import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  createNote,
  updateNote,
} from "../features/notes/notesSlice";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";

const NotesPage = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    notes = [],
    loading,
    error,
    totalPages: totalPagesFromState = 1,
  } = useSelector((state) => state.notes);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const searchTimeoutRef = useRef(null);
  const limit = 8;

  const fetchWithParams = useCallback(() => {
    if (!token) return;

    dispatch(
      fetchNotes({
        page: currentPage,
        limit,
        search: searchQuery,
        sortBy,
        order,
      }),
    );
  }, [dispatch, token, currentPage, searchQuery, sortBy, order]);

  useEffect(() => {
    fetchWithParams();
  }, [fetchWithParams]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 400);
  };

  const handleSort = (field) => {
    setSortBy(field);
    setOrder((prevOrder) =>
      sortBy === field && prevOrder === "desc" ? "asc" : "desc",
    );
    setCurrentPage(1);
  };

  const nextPage = () =>
    currentPage < totalPagesFromState && setCurrentPage((p) => p + 1);

  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const openNewNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleCreateNote = (formData) => {
    dispatch(createNote(formData));
  };

  const handleUpdateNote = (id, formData) => {
    dispatch(updateNote({ id, formData }));
  };

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 bg-transparent text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <div className="text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load your blogs
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "Unknown error"}
          </p>
          <button
            onClick={fetchWithParams}
            className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 bg-transparent text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading your blogs...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-12 bg-transparent text-gray-900 dark:text-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-18 gap-5">
          <div>
            <h1 className="text-5xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 pb-2 leading-tight">
              Your Blogs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              {notes.length === 0
                ? "No Blogs yet. Create your first one!"
                : `Showing ${notes.length} Blogs (Page ${currentPage} of ${totalPagesFromState})`}
            </p>
          </div>
          <button
            onClick={openNewNote}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
          >
            + Create New Blog
          </button>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search Blogs by title or description..."
            value={searchInput}
            onChange={handleSearch}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 dark:text-gray-100"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("title")}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-medium text-sm transition-colors"
            >
              Title {sortBy === "title" ? (order === "asc" ? "↑" : "↓") : "↕"}
            </button>
            <button
              onClick={() => handleSort("createdAt")}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-medium text-sm transition-colors"
            >
              Date{" "}
              {sortBy === "createdAt" ? (order === "asc" ? "↑" : "↓") : "↕"}
            </button>
          </div>
        </div>

        {/* Content */}
        {notes.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-600">+</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Blogs yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Your Blogs will appear here once you create them.
            </p>
            <button
              onClick={openNewNote}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onEdit={openEditNote} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPagesFromState > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-xl">
              Page {currentPage} of {totalPagesFromState}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPagesFromState}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        <NoteModal
          isOpen={isModalOpen}
          note={editingNote}
          onClose={handleCloseModal}
          onCreate={handleCreateNote}
          onUpdate={handleUpdateNote}
        />
      </main>
    </div>
  );
};

export default NotesPage;
