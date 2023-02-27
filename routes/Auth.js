const express = require('express')
const router = express.Router()
const mongoose= require('mongoose')
//const { findOne } = require('../models/commentModel')
const User= mongoose.model('User')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin= require('../middleware/requireLogin')

//router.get('/use',(req,res)=>{
 //   res.send("hello")
//})

router.get('/protected',requireLogin,(req,res)=>{
    res.send("your profile ")
})

router.post('/signup',(req,res)=>{
    const {name, email,password}=req.body
    if(!email || !password || !name)
    {
        return res.status(422).json({error : "please add all the fields"})
    }
    User.findOne({email})
    .then((savedUser)=>{
        if(savedUser)
        {
            return res.status(422).json({error:"User already exists with that email"})
        }
        bcrypt.hash(password,12)
            .then((hasedPassword)=>{
                const user= new User({
                    name,
                    email,
                    password : hasedPassword
                })
                user.save()
                .then((user)=>{
                    res.json({message:"Saved successfully"})
                })
                .catch(error=>{
                    console.log(error)
                })
            })

            })
       
    .catch(error=>{
        console.log(error)
    })



})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password)
    {
        return res.status(422).json({error: "please provide add email or password"})
    }
    User.findOne({email})
    .then((userExists)=>{
        if(!userExists){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,userExists.password)
        .then(domatch=>{
            if(domatch){
              
               // res.json({message:"successfully signed in"})
                const token =jwt.sign({_id:userExists._id},process.env.JWT_SECRET)
                const{_id,name,email}=userExists
                res.json({token,user:{_id,name,email}})
            }

            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(error=>{
            console.log(error)
        })

    })

})
module.exports= router