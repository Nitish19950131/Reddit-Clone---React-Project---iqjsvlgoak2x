
const express= require('express')


const mongoose =require('mongoose')
//require(mongoose.model('comment'))
const comment=mongoose.model("comment")
const router= express.Router()
const requireLogin= require('../middleware/requireLogin')



//view all comments
router.get('/allcomments',requireLogin,(req,res)=>{
    comment.find().sort({createdAt : -1})
    .populate("postedBy","_id name")
    .then(comments=>{
        res.json({comments})
    })
    .catch(error=>{
        console.log(error)
    })
})

//list of comments by a single user
router.get('/mycomments',requireLogin,(req,res)=>{
    comment.find({postedBy : req.user._id}).sort({createdAt : -1})
    .populate("postedBy","_id name")
    .then(mycomment=>{
        res.json({mycomment})
    })
    .catch(error=>{
        console.log(error)
    })
})


//create post route
router.post('/createcomment',requireLogin,(req,res)=>
{
    const{post}=req.body
    console.log(post)
    if(!post)
    {
       return res.status(422).json({error:"please add all the fields"})
    }
   // res.send("ok")
   // console.log(req.user)
    const Comment= new comment({
        post,
        postedBy: req.user
    })
    
    Comment.save()
    
    .then(saved=>{
        res.json({comment:saved})
    })
    .catch(error=>{
        console.log(error)
    })

})

router.put('/like',requireLogin,(req,res)=>{
    comment.findById(req.body.CommentId).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            if(result.likes.includes(req.user._id)) {
                comment.findByIdAndUpdate(req.body.CommentId,{
                    $pull:{likes:req.user._id}},
                   
                    {
                        new:true
                    }).exec((err, result) => {
                        if(err) {
                            return res.status(422).json({error:err});
                        } else {
                            res.json(result);
                            return;
                        }
                    })
            } else {
                comment.findByIdAndUpdate(req.body.CommentId,{
                    $push:{likes: req.user._id}, $pull:{dislikes:req.user._id}},
                   
                    {
                        new:true
                    }).exec((err, result) => {
                        if(err) {
                            return res.status(422).json({error:err});
                        } else {
                            res.json(result);
                        }
                    })

            }
        }
    })
})

router.put('/dislike',requireLogin,(req,res)=>{
    comment.findById(req.body.CommentId).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            if(result.dislikes.includes(req.user._id)) {
                comment.findByIdAndUpdate(req.body.CommentId,{
                    $pull:{dislikes:req.user._id}},
                   
                    {
                        new:true
                    }).exec((err, result) => {
                        if(err) {
                            return res.status(422).json({error:err});
                        } else {
                            res.json(result);
                            return;
                        }
                    })
            } else {
                comment.findByIdAndUpdate(req.body.CommentId,{
                    $push:{dislikes: req.user._id}, $pull:{likes:req.user._id}},
                   
                    {
                        new:true
                    }).exec((err, result) => {
                        if(err) {
                            return res.status(422).json({error:err});
                        } else {
                            res.json(result);
                        }
                    })

            }
        }
    })
})





module.exports = router