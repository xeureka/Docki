import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(res => {
        setBooks(res.data);
        setFilteredBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  const openDocument = (filePath) => {
    const url = `http://localhost:3000/${filePath.replace(/\\/g, '/')}`;
    window.open(url, "_blank");
  };

  const downloadDocument = (filePath) => {
    const url = `http://localhost:3000/${filePath.replace(/\\/g, '/')}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value)
    );
    setFilteredBooks(filtered);
  };

  if (loading) return <div className="text-white text-center mt-10">Loading books...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
      
      {/* Navbar */}
      <div className="w-full px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">  Digital Library</h1>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-80 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Book Grid */}
      <div className="px-10 py-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Available Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book, index) => (
            <div
              key={index}
              className="bg-zinc-800 rounded-2xl p-5 shadow-lg border border-zinc-700 hover:shadow-indigo-500/20 transition"
            >
              <img
                src={`http://localhost:3000/${book.coverImage?.replace(/\\/g, '/')}`}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
              <p className="text-sm text-zinc-400"><strong>Subject:</strong> {book.genre}</p>
              <p className="text-sm text-zinc-400"><strong>Author:</strong> {book.author}</p>
              <p className="text-sm text-zinc-400 mb-4"><strong>Year:</strong> {book.year}</p>

              <div className="flex justify-between">
                <button
                  onClick={() => openDocument(book.bookFile)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
                >
                  📖 Open Book
                </button>
                <button
                  onClick={() => downloadDocument(book.bookFile)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
