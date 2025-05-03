// pages/UsersPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/users") // Make sure this URL is correct
      .then(res => {
        setBooks(res.data);
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
    link.download = url.split('/').pop(); // use the file name from path
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading books...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Books List</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {books.map((book, index) => (
          <div 
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "250px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <div style={{ marginTop: "10px", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => openDocument(book.bookFile)}
                style={{ padding: "5px 10px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "4px" }}
              >
                Open Document
              </button>
              <button
                onClick={() => downloadDocument(book.bookFile)}
                style={{ padding: "5px 10px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "4px" }}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
