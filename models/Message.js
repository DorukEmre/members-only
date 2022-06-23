
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message  = new Schema({
    title: { type: String },
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    timestamp: { type: Date, default: Date.now() },
    content: { type: String }
})

module.exports = mongoose.model('Message', Message)