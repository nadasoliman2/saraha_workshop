import multer from "multer";
import fs from 'node:fs'
export const multer_upload = ({destination="profilePic",type=["jpeg","jpg"]}={})=>{
    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
const path =`uploads/users/${destination}`
if(!fs.existsSync(path)){
    fs.mkdirSync(path,{recursive:true})
}
            cb(null,path)
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    })
    const fileFilter = (req,file,cb)=>{
const currentfile = file.mimetype.split("/")[1]
if(type.includes(currentfile)){
    cb(null,true)
}else
{
    cb(new Error("Invalid file type",false))
}

console.log(currentfile)
    }
    return multer({storage,
        fileFilter
    })
}
export const multer_cloud= ({destination="profilePic",type=["jpeg","jpg"]}={})=>{
    const storage = multer.diskStorage({})
    const fileFilter = (req,file,cb)=>{
const currentfile = file.mimetype.split("/")[1]
if(type.includes(currentfile)){
    cb(null,true)
}else
{
    cb(new Error("Invalid file type",false))
}

console.log(currentfile)
    }
    return multer({storage,
        fileFilter
    })
}