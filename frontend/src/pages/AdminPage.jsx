// pages/AdminPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", publicationDate: "", tags: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch books
  const fetchBooks = () => {
    axios.get("http://localhost:4000/users") // using the users route to fetch books
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add new book
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("file", file);

    try {
      await axios.post("http://localhost:3000/admin/books", formData);
      fetchBooks();
      setForm({ title: "", author: "", publicationDate: "", tags: "" });
      setFile(null);
    } catch (err) {
      alert(err.response?.data || "Error adding book");
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await axios.delete(`http://localhost:4000/admin/books/${id}`);
      fetchBooks();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📚 Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-10 grid gap-4 max-w-md">
        <h2 className="text-xl font-semibold">Add a New Book</h2>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          className="border p-2 rounded"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={form.publicationDate}
          onChange={(e) => setForm({ ...form, publicationDate: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="border p-2 rounded"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <input
          type="file"
          className="border p-2 rounded"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Book
        </button>
      </form>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm">Author: {book.author}</p>
              <p className="text-sm">Published: {book.publicationDate?.split("T")[0]}</p>
              <p className="text-sm">Tags: {book.tags}</p>
              <button
                onClick={() => handleDelete(book._id)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
