
const tweetSchema = require('../Schemas/Tweets')

class tweets{
    title;
    tweetText;
    creationTime;
    userId;
    tweetId

    constructor({title,tweetText,userId,creationTime,tweetId}){
        this.title = title,
        this.tweetText = tweetText,
        this.creationTime = creationTime,
        this.userId = userId,
        this.tweetId = tweetId
    }

    tweets(){
        return new Promise(async(resolve,reject)=>{

            this.title.trim();
            this.tweetText.trim();
            const data = await tweetSchema({
                title:this.title,
                tweetText:this.tweetText,
                creationTime:this.creationTime,
                userId:this.userId,
                tweetId:this.tweetId
            })
            try{
                const tweetdata = await data.save();
                return resolve(tweetdata)
            }
            catch(err){
                return reject(err);
            }
        })
    }
    edit(){
        return new  Promise(async(resolve,reject)=>{

            const newTweetData = {};
            if(this.title) {
                newTweetData.title = this.title;
            }
            if(this.bodyText) {
                newTweetData.tweetText = this.tweetText;
            }
            try{
                const olddata = await tweetSchema.findOneAndUpdate({_id:this.tweetId},newTweetData)
                return resolve(olddata)
            }
            catch(err){
                return reject(err)
            }
        })
    }
    gettweetdatafromtweetid(){
        return new Promise(async(resolve,reject)=>{
            try{
                const tweetdata = await tweetSchema.findOne({_id:this.tweetId});
                return resolve(tweetdata)
            }
            catch(err){
                return reject(err)
            }
        })
    }

    delete(){
        return new Promise(async(resolve,reject)=>{
            try{
                const data = await tweetSchema.findOneAndDelete({_id:this.tweetId})
                return resolve(data)
            }
            catch(err){
                return reject(err)
            }
        })
    }

    static getTweets({offset,limit}){
        return new Promise(async(resolve,reject)=>{
            try{
                const tweets = await tweetSchema.aggregate([
                    { $sort: {"creationTime": -1} },
                    { $facet: {
                        data: [
                            {"$skip": parseInt(offset)}, 
                            {"$limit": limit}
                        ]}
                    }
                ])

                return resolve(tweets[0].data)
            }
            catch(err){
                return reject(err)
            }
        })
    }

    //in this it only gets the tweets of a the user who had login...!
    static getTweets({offset,limit,userId}){
        return new Promise(async(resolve,reject)=>{
            try{
                const tweets = await tweetSchema.aggregate([
                    { $match: {_id:userId}},
                    { $sort: {"creationTime": -1} },
                    { $facet: {
                        data: [
                            {"$skip": parseInt(offset)}, 
                            {"$limit": limit}
                        ]}
                    }
                ])

                return resolve(tweets[0].data)
            }
            catch(err){
                return reject(err)
            }
        })
    }
}

module.exports = tweets