const express = require('express')
const router = express.Router()
const Author = require('../models/author') // Replace with Paste

// All authors routes - All pastebin routes
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') { // Replace with Paste
        searchOptions.name = new RegExp(req.query.name, 'i') // Replace with Paste
    }
    try {
        const authors = await Author.find(searchOptions) // Replace with Paste
        res.render('authors/index', { // Replace with Paste
            authors: authors,    // Replace with Paste
            searchOptions: req.query
        }) // Replace with Paste
    } catch {
        res.redirect('/')
    } 
})

// New Autors / Paste Route
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author() })  // Replace with paste
})

// Create Author / Paste Route
router.post('/', async (req, res) => {
    const author = new Author({ // replace with paste
        name: req.body.name,
        description: req.body.description
    })
    try {
        const newAuthor = await author.save() // replace with paste
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')     // replace with paste
    } catch {
        res.render('authors/new', { // replace with paste
            author: author,         // replace with paste
            errorMessage: 'Error creating Author'
        })
    }
   // res.send(req.body.name) // req.body.name   req.body.description
})

module.exports = router