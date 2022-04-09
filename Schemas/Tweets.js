const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const tweetData = new Schema({
    title:{
        type:String,
        required:true
    },
    tweetText:{
        type:String,
        required:true
    },
    creationTime:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
},{strict:false})

module.exports = mongoose.model("tweetsData",tweetData);