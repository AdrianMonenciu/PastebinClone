const express = require('express')
const router = express.Router()
const pasteBin = require('../models/pasteBinModel')

//All pastebin routes
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') { 
        searchOptions.title = new RegExp(req.query.title, 'i') 
    }
    try {
        const pastes = await pasteBin.find(searchOptions) 
        res.render('pastebin/index', { 
            pastes: pastes,   
            searchOptions: req.query
        }) 
    } catch {
        res.redirect('/')
    } 
})

// New Paste Route
router.get('/new', (req, res) => {
    res.render('pastebin/new', {paste: new pasteBin() })  
})

// Create Paste Route
router.post('/', async (req, res) => {
    const paste = new pasteBin({ 
        title: req.body.title,
        description: req.body.description
    })
    try {
        const newPaste = await paste.save() 
        res.redirect(`pastebin/${newPaste.id}`) 
    } catch {
        res.render('pastebin/new', { 
            paste: paste,        
            errorMessage: 'Error creating Paste'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const paste = await pasteBin.findById(req.params.id)
        res.render('pastebin/show', { paste: paste })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const paste = await pasteBin.findById(req.params.id) 
        res.render('pastebin/edit', { paste: paste}) 
    } catch { 
        res.redirect('/pastebin')  
    }
})

router.put('/:id', async (req, res) => {
    let paste
    try {
        paste = await pasteBin.findById(req.params.id) 
        paste.title = req.body.title   
        paste.description = req.body.description 
        await paste.save()
        res.redirect(`/pastebin/${paste.id}`)   
    } catch {
        if (paste == null) {
            res.redirect('/')
        } else {
            res.render('pastebin/edit', { 
                paste: paste,         
                errorMessage: 'Error updating Paste'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let paste
    try {
        paste = await pasteBin.findById(req.params.id) 
        await paste.remove() 
        res.redirect('/pastebin')   
    } catch {
        if (paste == null) {
            res.redirect('/')
        } else {
            res.redirect(`/pastebin/${paste.id}`) 
        }
    }
})

module.exports = router