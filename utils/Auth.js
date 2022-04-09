
const validator = require("validator")

const Validate = ({username,name,email,password,phone})=>{
    return new Promise((resolve,reject)=>{
        if(!username || !name ||!password || !email){
            reject("All fields are mandatory to fill")
        }
        if(username.length<4){
            reject("username is too short")
        }
        if(username.length>15){
            reject("username is too big")
        }
        if(password.length<5){
            reject('password is too short')
        }
        if(password.length>15){
            reject("password is too long")
        }
        if(!validator.isEmail(email)){
            reject("email is not valid")
        }
        if(phone && phone.length!==10){
            reject("phone number is not valid")
        }
        resolve()
    })
}

const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next();
    }
    else{
        return res.send({
            status:500,
            message:"login to do any actions"
        })
    }
}

module.exports = {Validate,isAuth};