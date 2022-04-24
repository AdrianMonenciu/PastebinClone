const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({ // replace with pasteSchema
    name: {  // Replace with Title for pastebin
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author', authorSchema)  // Replace with Paste and pasteSchema