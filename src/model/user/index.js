const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    avatar: {
        type: String,
        trim: true
    },
    
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null and unique values to coexist
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true, // Allows null and unique values to coexist
    },
    
    resetPasswordOTP: {
        type: Number,
        trim: true,
        default: null,
    },

    loginType: {
        type: String,
        default: 'normal',
        enum: ['normal', 'google', 'facebook']
    }
    // isFirstLogin: {
    //     type: Boolean,
    //     default: true,
    // },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User