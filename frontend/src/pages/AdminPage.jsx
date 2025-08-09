import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", publicationDate: "", tags: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("library");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("file", file);

    try {
      if (editingBook) {
        await axios.put(`http://localhost:3000/admin/books/${editingBook._id}`, formData);
      } else {
        await axios.post("http://localhost:3000/admin/books", formData);
      }
      fetchBooks();
      resetForm();
    } catch (err) {
      alert(err.response?.data || "Error saving book");
    }
  };

  const fetchBooks = () => {
    setLoading(true);
    axios.get("http://localhost:3000/users")
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      });
  };

  const resetForm = () => {
    setForm({ title: "", author: "", publicationDate: "", tags: "" });
    setFile(null);
    setEditingBook(null);
    setShowModal(false);
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      publicationDate: book.publicationDate?.split("T")[0],
      tags: book.tags,
    });
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await axios.delete(`http://localhost:3000/admin/books/${id}`);
      fetchBooks();
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gradient-to-br from-zinc-900 via-black to-zinc-800 transition-all">
      <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-lg">📚 Admin Dashboard</h1>

      {/* Redirect Button to Users Page */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate("/users")} // Navigate to /users
          className="bg-green-600 px-6 py-3 rounded text-white text-lg hover:bg-green-700"
        >
          Go to Users
        </button>
      </div>

      {/* Cinematic Tabs */}
      <div className="flex justify-center mb-10 gap-4 relative">
        {["library", "upload", "stats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative z-10 px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab ? "text-white bg-blue-600 shadow-lg" : "text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {tab === "library" ? "Library" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-zinc-800 bg-opacity-80 border border-zinc-700 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4"
            >
              <h2 className="text-2xl font-semibold text-center">
                {editingBook ? "Edit Book" : "Add Book"}
              </h2>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 rounded bg-zinc-700 text-white"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Author"
                className="w-full p-2 rounded bg-zinc-700 text-white"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
              <input
                type="date"
                className="w-full p-2 rounded bg-zinc-700 text-white"
                value={form.publicationDate}
                onChange={(e) => setForm({ ...form, publicationDate: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-full p-2 rounded bg-zinc-700 text-white"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <input
                type="file"
                className="w-full p-2 rounded bg-zinc-700 text-white"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
                <button
                  type="button"
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Content Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "library" && (
            loading ? (
              <p className="text-center text-gray-400">Loading books...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div key={book._id} className="bg-zinc-800 p-4 rounded-xl shadow-lg space-y-2">
                    <h3 className="text-xl font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-300">Author: {book.author}</p>
                    <p className="text-sm text-gray-400">Published: {book.publicationDate?.split("T")[0]}</p>
                    <p className="text-sm text-gray-400">Tags: {book.tags}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(book)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === "upload" && (
            <div className="text-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 px-6 py-3 rounded text-white text-lg hover:bg-blue-700"
              >
                Add a New Book
              </button>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="text-center text-gray-400 text-xl">📊 Stats will be added here soon.</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
