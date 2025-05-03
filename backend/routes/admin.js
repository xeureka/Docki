

const express = require('express')
const multer = require('multer')
const Books = require('../models/books.model')
const upload = multer({ dest: 'uploads/' })

const router = express.Router()


router.get('/', (req,res) => {
    res.send('Admin Dashboard !!')
})

// route to add new books
router.post('/books',upload.single('file'), async (req,res) => {

    try {

        let book = await Books.findOne({title: req.body.title})

        if (book){
            return res.status(401).json('Book Already Added !!')
        }


        book = new Books({
            title: req.body.title,
            author:req.body.author,
            publicationDate: req.body.publicationDate,
            bookFile: req.file.path,
            tags:req.body.tags
        })

        await book.save()

        res.json(book)

        
    } catch (error) {

        console.log(error)

        return res.status(500).json({ error: error.message });    }
})


module.exports = router;