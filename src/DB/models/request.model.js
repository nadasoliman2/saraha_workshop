import mongoose from "mongoose";
const Requsetschema = new mongoose.Schema(
    {
        messageId:{
            type:mongoose.Schema.ObjectId,
            ref:"Message",
            required:true
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
        status:{
            type:String,
            enum:['pending',"accepted","rejected"],
            default:'pending',
required:true
        }
    },{
        timestamps:true
    }
)
export const requsetModel = mongoose.model('Requst',Requsetschema)