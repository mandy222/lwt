const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  categories: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true
  }],
  title: {
    type: String,
    required: true
  },
  content: {
    type: String, 
    required: true
  },
  cover: {
    type: Array
  },
  publisher: {
    type: String,
    required: true
  },
  collectedUsers: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
})



module.exports = mongoose.model('News', schema)