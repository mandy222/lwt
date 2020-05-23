const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  content: {
    text: {
      type: String
    },
    images: {
      type: Array
    }
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }],
  comments: [{
    commentsTime: {
      type: Date
    },
    content: { type: String },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Trend', schema)