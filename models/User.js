
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user  = new Schema({
    username: { 
        type: String, 
        unique: true,
        required: true 
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    membershipStatus: { type: Boolean, default: false }
})
module.exports = mongoose.model('User', user)