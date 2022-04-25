const express = require('express')
const router = express.Router()
const pasteBin = require('../models/pasteBinModel') 

router.get('/', async (req, res) => {
    let pastes 
    try {
        pastes = await pasteBin.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        pastes =[]
    }
    res.render('index', {pastes: pastes})
})

module.exports = router