const { string } = require('joi');
const mongoose = require('mongoose');


const hospitalSchema = new mongoose.Schema({
    name: String,
    phoneNo: Number,
    email: String,
    address: String,
    beds: Number,
    about: String,
    username: String,
    images: [{
        _id: false,
        url: String,
        filename: String,
    }],
    request: [{
        identity: String,
        disease: String,
        phone: Number,
    }]


})
module.exports = mongoose.model('Hospital', hospitalSchema)
