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
        const pasteExist = await pasteBin.findOne({title: req.body.title})
        if (pasteExist == null) {
            //console.log("Title doesn't Exist")
            const newPaste = await paste.save() 
            res.redirect(`pastebin/${newPaste.id}`)
        } else {
            //console.log("Title exist")
            throw "Error creating paste. Title already exists"
        }
        //const newPaste = await paste.save() 
        //res.redirect(`pastebin/${newPaste.id}`) 
    } catch(err) {
        if (err != "Error creating paste. Title already exists") {
            err = "Error creating paste"
        }
        res.render('pastebin/new', { 
            paste: paste,        
            errorMessage: err 
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
        const pasteExist = await pasteBin.findOne({title: req.body.title})
        if (pasteExist == null || req.params.id == pasteExist.id) { 
            await paste.save()
            res.redirect(`/pastebin/${paste.id}`)
        } else {
            throw "Error updating paste. Title already exists"
        }   
    } catch(err) {
        if (paste == null) {
            res.redirect('/')
        } else {
            if (err != "Error updating paste. Title already exists") {
                err = "Error updating paste"
            }
            res.render('pastebin/edit', { 
                paste: paste,         
                errorMessage: err
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