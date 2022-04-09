const express = require("express")



const User = require("../Models/users")
const {Validate,isAuth} = require('../utils/Auth')

const router = express.Router()



router.post('/login',async(req,res)=>{
    const {loginid,password} = req.body
    try{
        const data = await User.login({loginid,password});
        req.session.isAuth = true;
        req.session.user = {
            email:data.email,
            username:data.username,
            name:data.name,
            _id:data._id
        }
        return res.send({
            status:200,
            message:"login successfull",
            data:req.session.user
        })
    }
    catch(err){
        console.log(err)
        return res.send({
            status:400,
            message:"login failed",
            error:err
        })
    }
})

router.post('/register',async(req,res)=>{
    const {username,name,email,password,phone} =req.body

    Validate({username,name,email,password,phone}).then(async()=>{
        try{
            await User.Verification({email,username})
    
        }
        catch(err){
            console.log(err)
            return res.send({
                status:400,
                message:"database error",
                error:err
            })
        }

        const user = new User({email,username,password,phone,name})

        try{
            const dbdata = await user.register();
            return res.send({
                status:200,
                message:"data stored successfully",
                data:dbdata
            })
        }
        catch(err){
            return res.send({
                status:400,
                message:"internal error",
                error:err
            })
        }

    }).catch(err=>{
        return res.send({
            status:400,
            error:err
        })
    })

})

router.post('/logout',isAuth,(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err
        return res.send({
            status:"200",
            message:"logout successfully completed"
        })
    })
})

module.exports = router