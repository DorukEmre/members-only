
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const format = require('date-fns')

const Message  = new Schema({
    title: { type: String },
    author: { type: String },
    timestamp: { type: Date, default: Date.now() },
    content: { type: String }
})
// 2022-06-14T00:00:00.000+00:00
// 2022-06-22T12:19:40.666+00:00
Message
  .virtual('timestamp_formatted')
  .get(function () {
    return this.timestamp ? format(this.timestamp, 'MM/dd/yyyy') : '';
  });


module.exports = mongoose.model('Message', Message)