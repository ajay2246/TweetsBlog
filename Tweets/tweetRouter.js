const express = require("express")

const tweets = require('../Models/Tweets')
const {isAuth} = require('../utils/Auth')

const app = express.Router()

app.post('/create',isAuth,async(req,res)=>{
    const {title,tweetText} = req.body;
    const creationTime = new Date();
    const {userId} = req.body //req.session.user._id

    if(!title || !tweetText){
        return res.send({
            status:401,
            message:"required fields are missing"
        })
    }
    if(!userId) {
        return res.send({
            status: 401,
            message: "Invalid UserId"
        })
    }

    if(typeof(title) !== 'string' || typeof(tweetText) !== 'string') {
        return res.send({
            status: 400,
            message: "Title and BodyText should be only text"
        })
    }

    if(title.length>100 || tweetText.length>1000){
        return res.send({
            status:401,
            message:"title or tweetText  is too lengthy"
        })
    }

    const data = new tweets({title,tweetText,userId,creationTime})

    try{
        const tweetdata = await data.tweets();

        return res.send({
            status:200,
            message:"tweet created successfully",
            data:tweetdata
        })
    }
    catch(err){
        console.log(err);
        return res.send({
            status:400,
            message:"cration error",
            error:err
        })
    }
})


app.get('/gettweets',async(req,res)=>{
    const limit = 5
    const offset = req.query.skip;

    try{
        const data = await tweets.getTweets({limit,offset})
 
        return res.send({
            status:200,
            message:"tweest fetch successfully",
            data:data
        })
    }
    catch(err){
        console.log(err)
        return res.send({
            status:400,
            message:"database error",
            error:err
        })
    }
})

app.get('/getMyTweets',isAuth,async(req,res)=>{
    const limit = 5
    const offset = req.query.skip;
    const userId = req.session.user._Id;

    try{
        const data = await tweets.getTweets({limit,offset,userId})
 
        return res.send({
            status:200,
            message:"tweest fetch successfully",
            data:data
        })
    }
    catch(err){
        console.log(err)
        return res.send({
            status:400,
            message:"database error",
            error:err
        })
    }
})

app.post('/edit',isAuth,async(req,res)=>{
    const {title,tweetText} = req.body.data
    const tweetId = req.body
    const userId = req.session.user._Id

    if(!title && !bodyText) {
        return res.send({
            status: 400,
            message: "Invalid data",
            error: "Missing title and bodytext"
        })
    }

    if(typeof(title) !== 'string' || typeof(tweetText) !== 'string') {
        return res.send({
            status: 400,
            message: "Title and BodyText should be only text"
        })
    }

    if(title.length > 200 || tweetText.length > 1000) {
        return res.send({
            status: 401,
            message: "Title and bodytext too long. Allowed chars for title is 200 and bodytext is 1000."
        })
    }

    try{

        //checking the userid and tweetid are sme or not
        const tweet = new tweets({title, bodyText, tweetId});
        const tweetdata = await tweet.gettweetdatafromtweetid()

        if(userId != tweetId){
            return res.send({
                status:400,
                message:"Edit not allowed. tweet is owned by some other user"
            })
        }

         //checking whether edit is possible or not

        const currentTime = Date.now();
        const creationTime = tweetdata.creationTime

        const diff = (currentTime - creationTime.getTime()) /(1000*60)

        if(diff>30){
            return res.send({
                status: 400,
                message: "Edit not allowed after 30 minutes of tweeting"
            })
        }
        const tweetDb = await tweets.edit();

        return res.send({
            status:200,
            message:"Edit successfull",
            data:tweetDb
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


app.post('/delete',isAuth,async(req,res)=>{
    const {tweetId} = req.body
    const {userId} = req.session.user

    try{
        const tweet = await tweets({tweetId})

        const tweetdata = tweet.gettweetdatafromtweetid()
        if(tweetId !== tweetdata.userId){
            return res.send({
                status:400,
                message:"cannot delete other users tweets"
            })
        }

        const deleteddata = await tweets.delete();
        return res.send({
            status:200,
            message:"tweet deleted successfully",
            data:deleteddata
        })
    }
    catch(err){
        return res.send({
            status:400,
            message:"database error",
            error:err
        })
    }
})


module.exports = app