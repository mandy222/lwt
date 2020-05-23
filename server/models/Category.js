const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
}, {
  timestamps: true
})

module.exports = mongoose.model('Category', schema)