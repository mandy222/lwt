const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [{
    image: { type: String },
    url: { type: String },
  }]
})

module.exports = mongoose.model('Ad', schema)