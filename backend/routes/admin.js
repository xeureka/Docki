const express = require("express");
const multer = require("multer");
const Books = require("../models/books.model");
const Users = require("../models/users.model");
const { verifyToken } = require("../utils/generateToken");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

const isAdmin = (req, res, next) => {
  const token = req.cookies.Authorization;
  const payload = verifyToken(token);

  if (payload && payload.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied." });
};

router.get("/", isAdmin, (req, res) => {
  res.send("Admin Dashboard !!");
});

// Route to add new books
router.post("/books", isAdmin, upload.single("file"), async (req, res) => {
  try {
    let book = await Books.findOne({ title: req.body.title });

    if (book) {
      return res.status(401).json("Book Already Added !!");
    }

    book = new Books({
      title: req.body.title,
      author: req.body.author,
      publicationDate: req.body.publicationDate,
      bookFile: req.file.path,
      tags: req.body.tags,
    });

    await book.save();

    res.json(book);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Route to delete a book
router.delete("/books/:id", isAdmin, async (req, res) => {
  try {
    let book = await Books.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
});

// Route to update a book
router.put("/books/:id", isAdmin, async (req, res) => {
  try {
    const book = await Books.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author,
        publicationDate: req.body.publicationDate,
        bookFile: req.file ? req.file.path : undefined,
        tags: req.body.tags,
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
