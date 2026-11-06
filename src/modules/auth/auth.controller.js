import { Router } from "express";
import { signup, login, google, facebook } from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { signupSchema } from "./auth.validation.js";
import {multer_upload,multer_cloud} from '../../middleware/multer.middleware.js'
import { authentication } from "../../middleware/auth.middleware.js";
import cloudnairy from '../../common/utils/cloudinary.js'
const router = Router();

// /auth/signup
router.post(
	"/signup",
	multer_cloud().single('profile'),
	validation(signupSchema),
	async (req, res, next) => {
		try {
			// const data = { ...req.body };
			// console.log(req.body);
			const data = {...req.body}
			console.log(data);
			
			const result = await signup(data, req.file, next);
			return res.status(201).json(result);
		} catch (error) {
			throw new Error(error);
		}
	},
);

router.post("/login", async (req, res, next) => {
	try {
		const result = await login(req.body);
		const { message, accessToken } = result;
		return res.status(200).json({
    message: "Login successful",
    accessToken
});
	} catch (error) {
		next(error);
	}
});

// /auth/google ===> true

router.post("/google", async (req, res, next) => {
	try {
		const result = await google(req.body);
		const { message, accessToken, status } = result;
		return res
			.status(status)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
			})
			.json(message);
	} catch (error) {
		next(error);
	}
});

router.post("/facebook", async (req, res, next) => {
	try {
		// console.log(req.body);

		const result = await facebook(req.body);
		const { message, access_Token, status } = result;
		return res
			.status(status)
			.cookie("accessToken", access_Token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
			})
			.json(message);
	} catch (error) {
		next(error);
	}
});


router.post('/test',multer_upload().single('img'),(req,res,next)=>{
console.log(req.host)
console.log(req.protocol) 
console.log(req.file.mimetype)
const baseurl = `${req.protocol}://${req.host}/`
const fullPath = baseurl +req.file.path
req.file.fullPath = fullPath
	return res.json({message:"done",file:req.file})
})


router.post('/array',multer_upload().array('imgaes',2),(req,res,next)=>{
const baseurl = `${req.protocol}://${req.host}/`
const result = req.files.map((file)=>{
	const fullPath = baseurl +file.path

	return{
		fullPath,
		...file 
	}
})
	return res.json({message:"done",file:result})
})

router.post('/fields',multer_upload().fields([{name:'imgaes',maxCount:2},
	{name:'img',maxCount:1},
	{name:'attach',maxCount:3}
]),(req,res,next)=>{
// const baseurl = `${req.protocol}://${req.host}/`
// const result = req.files.map((file)=>{
// 	const fullPath = baseurl +file.path

// 	return{
// 		fullPath,
// 		...file 
// 	}
// })
	return res.json({message:"done",file:req.files})
})
router.post('/cloud',multer_cloud().single("img"),async(req,res,next)=>{
	console.log(req.file)

const result = await cloudnairy.uploader.upload(req.file.path,{
	folder:"/sarahapp"
})
	return res.json({message:"done",file:result})


})



export default router;
