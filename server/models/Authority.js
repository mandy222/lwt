const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Authority'
    },
}, {
    timestamps: true
})

schema.virtual('children', {
    localField: '_id',
    foreignField: 'parent',
    justOne: false,
    ref: 'Authority'
})

module.exports = mongoose.model('Authority', schema)