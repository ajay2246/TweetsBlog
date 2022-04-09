const mongoose = require('mongoose')

const Schema = mongoose.Schema

const data = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model('users',data)