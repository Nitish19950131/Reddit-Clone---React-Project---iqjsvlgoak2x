const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
require('./models/User')
require('./models/commentModel')
const path= require('path')


require('dotenv').config()


const express = require('express')







//express app
const app=express()

//static files

app.use(express.static(path.join(__dirname, './client/build')))
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

//connect to db
mongoose.connect(process.env.MONG_URI)
.then(()=>{
    //listen for request
    app.listen(process.env.PORT,()=>{
        console.log('listening on port  and connected to db',process.env.PORT )
})

})
.catch((error)=>{
    console.log(error)
})

//middleWare

app.use(express.json())


app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()

})
//routes
app.use(require('./routes/Auth'))
app.use(require('./routes/comments'))
app.use(express.static('public'))

