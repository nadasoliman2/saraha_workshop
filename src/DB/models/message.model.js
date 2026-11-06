import mongoose from "mongoose";
const messageschema = new mongoose.Schema(
    {
        content:{
            type:String,
            required:true,
            trim:true,
            minlength:1,
            maxlength:500
        },
        senderId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
         reciverId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        anonymous:{
            type:Boolean,
            default:true
        }
    },{
        timestamps:true
    }
)
export const messageModel = mongoose.model('Message',messageschema)