const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        
    },
    authorities: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Authority',
        required: true
    }],
}, {
    timestamps: true
})

module.exports = mongoose.model('Role', schema)