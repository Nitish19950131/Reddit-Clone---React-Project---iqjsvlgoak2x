const mongoose= require('mongoose')
const User= mongoose.model("User")


const jwt= require('jsonwebtoken')



module.exports=(req,res,next)=>{
    const{authorization}=req.headers
    //authorization=== Bearer erfajawirofnvfonraoinawbotPdrgin --->token hai yeh
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
   const token= authorization.replace("Bearer ","")
   jwt.verify(token,process.env.JWT_SECRET,(error,payload)=>{
    if(error){
       return  res.status(401).json({error:"you must be logged in"})
    }

    const{_id}=payload
    User.findById(_id)
    .then(userData=>{
        req.user=userData
        next()
    })
   
   })
   
}

