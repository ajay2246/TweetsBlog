const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const followdata = new Schema({
    followingUserId:{
        type:String,
        required:true
    },
    followerUserId:{
        type:String,
        required:true
    },
    creationTime:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('followingdata',followdata);