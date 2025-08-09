const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  bookFile: { type: String, required: true }, // we will pass the absolute path of the books in the local server
  tags: { type: [String], required: true },
});

const Books = mongoose.model("Book", bookSchema);

module.exports = Books;
