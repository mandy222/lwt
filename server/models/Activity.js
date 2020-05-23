const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cover: {
    // 封面
    type: String,
    required: true
  },
  keyWords: {
    type: Array
  },
  categories: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true
  }],
  content: {
    type: String,
    required: true
  },
  leader: {
    type: String,
    required: true
  },
  participants: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }],
  collectedUsers: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }],
  status: { 
    type: Boolean,
    default: true
  },
  time: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})



module.exports = mongoose.model('Activity', schema)