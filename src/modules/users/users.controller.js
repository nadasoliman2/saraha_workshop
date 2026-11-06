import { Router } from "express";
import { findall, profile, uploadPic } from "./users.service.js";
import { authentication } from "../../middleware/auth.middleware.js";
import cloudinary from "../../common/utils/cloudinary.js";
import { multer_cloud } from "../../middleware/multer.middleware.js";
const router = Router();

// find one by id
router.get("/profile", authentication, async (req, res, next) => {
	try {
		const user = req.user;
		return res.status(200).json({ message: "user fetched successfully", user });
	} catch (error) {
		throw new Error(error);
	}
});

router.patch("/deletePic", authentication, async (req, res, next) => {
	try {
		// console.log(req.params,req.body);

		const result = await updateProfile(req);
		return res.status(200).json({ result });
	} catch (error) {
		throw new Error(error);
	}
});

router.patch(
	"/uploadProfilePic",
multer_cloud().single('profile'),
	authentication,
	
	async (req, res, next) => {
		try {
			const result = await uploadPic(req.user,req.file);
			return res.status(200).json({ result });
		} catch (error) {
			throw new Error(error);
		}
	},

);

router.get("/allusers", async (req, res, next) => {
	try {
		const result = await findall();
		return res.status(200).json({ result });
	} catch (error) {
		throw new Error(error);
	}
});

export default router;
