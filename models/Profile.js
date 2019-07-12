const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    userName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userName"
    },
    location: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    subscription: [{
        userName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userName"
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    subscribers: [{
        userName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userName"
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)