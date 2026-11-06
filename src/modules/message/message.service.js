import { messageModel } from "../../DB/models/message.model.js"
import { requsetModel } from "../../DB/models/request.model.js"

import { userModel } from "../../DB/models/user.model.js"
import { NotfoundException ,ConflictException, BadException} from "../../common/exception/error.exception.js"
export const sendMessage = async(reciverId,senderId,content)=>{
const reciever = await userModel.findById(reciverId)
if(!reciever){
NotfoundException("reciver not found")
}
if(senderId.toString() === reciverId.toString()){
    ConflictException("u canot send message to yourself")
}
if(!content){
    BadException("content is required")

}
const msg = await messageModel.create({
    senderId,
    reciverId,
    content
})
return{
    message: "message sent successfully"
}
}
export const getmessages= async(reciverId)=>{
    const messages = await messageModel.find({reciverId}).populate("senderId","firstName lastName")
    if(messages.length === 0){
        BadException("u donot have any messages")
    }
    return messages.map((data)=>{
        const result ={
            msg:data.content,
            time:data.createdAt,
            msgId:data._id
        }
        if(data.anonymous === false){
            result.sender = data.senderId
        }
        return result
    } )

}
export const create_requset = async(reciverId,msgId)=>{
    const Message = await messageModel.findOne({
        reciverId,
        _id:msgId
    })

    if(!Message){
        NotfoundException("message not found")
    }
    const ReqExist = await requsetModel.findOne( {   messageId:msgId,
        senderId:Message.senderId
    })
    if(ReqExist && ReqExist.status === "pending"){
        return {
            message:"requset still pending"
        }
    }
    if(!ReqExist && Message.anonymous){
        const request = await requsetModel.create({
            messageId:msgId,
            reciverId,
            senderId:Message.senderId,
            status:"pending"
        })
        return request
    }
}
export const myrequsts= async(senderId)=>{
    const myrequsts= await  requsetModel.find({senderId}).populate("messageId","content").populate("reciverId","firstName lastName")
    console.log(myrequsts)
    if(myrequsts.length == 0){
        NotfoundException("you donot have any requests")
    }
    return myrequsts
}
export const chagestatus = async(senderId,reqId,status)=>{
    const req = await requsetModel.findById(reqId)
    if(!req){
        NotfoundException("req not found")
    }
    if(status == "accepted"){
        await messageModel.findByIdAndUpdate(req.messageId,{anonymous:false})
        await requsetModel.findByIdAndDelete({_id:reqId})
        return{
            message:"request is accepted"
        }
    }
        await requsetModel.findByIdAndDelete({_id:reqId})
        return{
            message:"request  rejected"
        }
}

//anoymes > true 
//requset >