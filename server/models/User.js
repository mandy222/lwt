const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    avatar: {
        type: String
    },
    telephone: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Role',
        required: true
    },
    follower: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    fans: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
})



module.exports = mongoose.model('User', schema)