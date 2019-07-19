const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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
    subscriptions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    subscribers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)