const express = require('express')
const router = express.Router()
const Author = require('../models/author') // Replace with Paste

router.get('/', async (req, res) => {
    let authors 
    try {
        authors = await Author.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        authors =[]
    }
    res.render('index', {authors: authors})
})

module.exports = router