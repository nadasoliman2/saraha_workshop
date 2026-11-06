import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { sendMessage ,getmessages,create_requset,myrequsts,chagestatus} from "./message.service.js";
const messagerouter = Router()

messagerouter.get('/All',authentication,authentication,async(req,res,next)=>{

const reciverId = req.user._id
const result = await getmessages(reciverId)
res.status(200).json({message:result})
})
messagerouter.post('/send/:reciverId',authentication,async(req,res,next)=>{
const {content} = req.body;
const {reciverId} = req.params;
const senderId = req.user._id
const result = await sendMessage(reciverId,senderId,content)
res.status(200).json({message:result})
})
messagerouter.post('/request/:msgId',authentication,async(req,res,next)=>{

const reciverId = req.user._id
const result = await create_requset(reciverId,req.params.msgId)
res.status(200).json({message:result})
})
messagerouter.get('/requests',authentication,async(req,res,next)=>{

const senderId= req.user._id
const result = await myrequsts(senderId)
res.status(200).json({message:result})
})
messagerouter.patch('/requests/:id',authentication,async(req,res,next)=>{

const senderId= req.user._id
const result = await chagestatus(senderId,req.params.id,req.body.status)
res.status(200).json({message:result})
})


export default messagerouter