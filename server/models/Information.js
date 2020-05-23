const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  recipient: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true
  },
  content: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Trend'
  },
  comment: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Information', schema)