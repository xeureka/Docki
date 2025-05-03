
const express = require('express')
const router = express.Router()
const Books = require('../models/books.model')



router.get('/', async (req,res) => {

    try {

        const books = await Books.find().sort()

        res.json(books)
        
    } catch (error) {
        
    }
})

module.exports = router
