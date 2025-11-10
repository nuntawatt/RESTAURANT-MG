const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Support separate first/last name from the frontend signup form
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    // Keep a combined name field for compatibility with existing code
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);