const express = require('express');

const app = express.Router();
const {validate,followUser,followingUserList} = require('../Models/Follow')
const User = require('../Models/users')



app.post('/follow-user',async(req,res)=>{
    const {followerUserId} = req.session.user
    const {followingUserId} = req.body
    const {creationTime} = new Date();

    if(!validate({followingUserId})){
        return res.send({
            status:400,
            message:"userid is invalid"
        })
    }
    if(followerUserId==followingUserId){
        return res.send({
            status:400,
            message:"you cannot follow yourself"
        })
    }

    try{
        const data = await  User.verifyUserIdExists(followingUserId)

        if(!data){
            return res.send({
                status:400,
                message:"No user found"
            })
        }

        const dbdata = await followUser({followerUserId,followingUserId,creationTime})
        return res.send({
            status:200,
            message:"user followed succesfully",
            data:dbdata
        })
    }
    catch(err){
        return res.send({
            status:400,
            message:"Internal error",
            error:err
        })
    }
})

app.get('/following-list/:userid/:offset',async(req,res)=>{

    const {followerUserId} = req.params || req.session.user
    const {offset}  =req.params
    const {limit} = 10
    try{
    const userDb = await User.verifyUserIdExists(followerUserId);

    if(!userDb) {
        return res.send({
            status: 401,
            message: 'No User found'
        })
    }

    const followingUserDetails = await followingUserList({followerUserId, offset, limit});
    return res.send({
        status: 200,
        message: "Read Successful",
        data: followingUserDetails
    })
}
catch(err) {
    return res.send({
        status: 401,
        message: "Internal error",
        error: err
    })
}


})

module.exports = app