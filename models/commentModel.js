const mongoose= require('mongoose')

const Schema = mongoose.Schema

const{ObjectId}=mongoose.Schema.Types

const commentSchema = new Schema({
    post: {
        type: String,
        required: true
    },
    likes:[{type: ObjectId,
        ref:'User'}],

    dislikes:[{type: ObjectId,
            ref:'User'}],
   
    postedBy:{
        type: ObjectId,
        ref:'User'

    }
},{ timestamps: true})

module.exports= mongoose.model('comment',commentSchema)

