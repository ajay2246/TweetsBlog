const followSchema = require('../Schemas/Follow');
const userSchema = require('../Schemas/userdata')
const ObjectId = require('mongodb').ObjectId

const validate = ({followingUserId})=>{
    if(!followingUserId){
        return false;
    }
    if(!ObjectId.isValid(followingUserId)){
        return false;
    }
    return true;
}

const followUser = ({followerUserId,followingUserId,creationTime})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const followobj = await followSchema.findOne({followerUserId,followingUserId})
            if(followobj){
                return reject("user already found")
            }
            
            const followdata = new followSchema({
                followingUserId,
                followerUserId,
                creationTime
            })

            const data = await followdata.save();
            return resolve(data)
        }
        catch(err){
            reject(err)
        }
    })
}

const followingUserList = ({followerUserId,offset,limit})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const usersList = await followSchema.aggregate([
                {$match:{followerUserId:ObjectId(followerUserId)}},
                {$sort:{creationTime:-1}},
                {$project:{followingUserId:1}},
                {$facet:{data:[{"$skip":parseInt(offset)},{"$limit":limit}]}}
            ])
            const followingUserIds = []
            usersList[0].data.forEach((item)=>{
                followingUserIds.push(item.followingUserId)
            })

            const followingUserDetails = await userSchema.aggregate([
                { $match: { _id: {$in: followingUserIds} }},
                { $project: {
                    username: 1,
                    name: 1,
                    _id: 1
                } }
            ])
            resolve(followingUserDetails)
        }
        catch(err){
            return reject(err)
        }
    })
}

module.exports = {validate,followUser,followingUserList}