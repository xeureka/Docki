

require('dotenv').config()
const express = require('express')
const router = express.Router()
const Books = require('../models/books.model')


// Getting or seeing of the books
router.get('/', async (req,res) => {

    try {

        let books = await Books.find()

        res.json(books)
        
    } catch (error) {
        console.error('Error getting books: ', error.message)
    }

})

// uploading books
router.post('/', async (req,res) => {

    try {

        let book = await book.findOne({title: req.params.title})

        if (book){
            return res.status('The book is already there!!')
            
        }
        
        book = new Books({
            title: req.body.title,
            author: req.body.author,
            publicationDate: req.body.publicationDate,
            bookFile: req.body.bookFile,
            coverPage: req.body.coverPage
        })

        await book.save()
        res.json(book)
        
    } catch (error) {
        console.log('Error uploading a book: ', error.message)
    }
})

// updating existing books


router.put('/:id', async (req,res) =>{

    try {

        let book = await Books.fineOneAndUpdate(
            {_id: req.params.id},
            {title: req.params.author, author: req.params.author, publicationDate: req.params.publicationDate, coverPage: req.body.coverPage},
            {new: true}
        )

        res.json(book)

            
    } catch (error) {
        console.error('Erroor Updating the book: ',error.message)
    }

})

module.exports = router