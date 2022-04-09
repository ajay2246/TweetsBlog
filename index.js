const express = require('express')
const mongoose = require('mongoose')
const authrouter = require('./Auth/authrouter')
const tweetRouter = require('./Tweets/tweetRouter');
const followrouter = require('./Follow/follow');
//const constants = require('./privateconsants')
const MONGOURI = `mongodb+srv://jay:jay12345@cluster0.of7cb.mongodb.net/blog_project?retryWrites=true&w=majority`
const session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(session)

const store = new MongoDbSession({
    uri:MONGOURI,
    collection:"sessionstorage"
})


const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:"secretkey",
    resave:false,
    saveUninitialized:false,
    store:store
}))
app.use('/auth',authrouter)
app.use('/tweets',tweetRouter)
app.use('/follow',followrouter)



mongoose.connect(MONGOURI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then((res)=>{
    console.log("connected to database")
})


app.get('/',(req,res)=>{
    res.send({
        status:200,
        message:"welcome to the app"
    })
})



const port = 4000
app.listen(port,()=>{
    console.log(`connected to port ${port}`)
})


