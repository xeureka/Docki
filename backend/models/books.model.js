

const mongoose = require('mongoose')


const bookSchema = new mongoose.Schema({
    
    title: {type: String, required: true},
    author: {type:String, required: true},
    publicationDate: {type:Date, required: true},
    bookFile: {type: String, required: true},
    coverPage: {type: String, required: true},

    tags: {type: [String], required: true}
})



const Books = mongoose.model('Book', bookSchema)


module.exports = Books



// title,author,publication date, book file,coverpage, tags


