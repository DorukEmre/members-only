
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const message  = new Schema({
    title: { type: String },
    timestamp: { type: Date, default: Date.now },
    content: { type: String }
})
module.exports = mongoose.model('Message', message)