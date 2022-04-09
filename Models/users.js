const USER_MODEL = require('../Schemas/userdata')
const bcrypt = require('bcrypt')
const validator = require('validator')

class User{
    name;
    username;
    password;
    email;
    phone;

    constructor({username,name,email,password,phone}){
        this.email = email;
        this.username = username;
        this.password = password;
        this.name = name;
        this.phone = phone;
    }

    static Verification({email,username}){
        return new Promise(async(resolve,reject)=>{
            try {
                const user1 = await USER_MODEL.findOne({email})
                const user2 = await USER_MODEL.findOne({username})
                //rather than writing the two database call we can write two database calls at a time
                //

                if(user1){
                    return reject("email is alresdy exits")
                }
                if(user2){
                    return reject("username already exits")
                }
    
                return resolve();
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    static verifyUserIdExists(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const userDb = await UserSchema.findOne({_id: userId});
                resolve(userDb);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    register(){
        return new Promise(async(resolve,reject)=>{
            const hashedpassword = await bcrypt.hash(this.password,10)
            const data = new USER_MODEL({
                    username:this.username,
                    name:this.name,
                    password:hashedpassword,
                    email:this.email,
                    phone:this.phone
            })
            try{
                const sdata = await data.save()
                return resolve(sdata)
            }
            catch(err){
                return reject(err)
            }
        })
    }
    static login({password,loginid}){
        return new Promise(async(resolve,reject)=>{
            let users
                if(validator.isEmail(loginid)){
                    users = await USER_MODEL.findOne({email:loginid})
                }
                else{
                    users = await USER_MODEL.findOne({username:loginid})
                }
                const isMatch = await bcrypt.compare(password,users.password)
                if(!isMatch){
                    return reject("user is invalid")
                    
                }
                return resolve(users)
            
        })
    }
}

module.exports = User