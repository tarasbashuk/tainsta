const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userName'
    },
    photo: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    avatar: {
        type: String, 
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userName'
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userName'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],

    date: {
        type: Date,
        default: Date.now
    }
})