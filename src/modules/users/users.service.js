// import { override } from "joi";
import cloudinary from "../../common/utils/cloudinary.js";
import { userModel } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
// import { TOKEN_SIGNATURE } from "../../config.js";

export const profile = async (inputs) => {
	return user;
};

export const findall = async () => {
	const users = await userModel
		.find({
			$and: [
				{
					salary: { $gt: 20000 },
				},
				{
					age: { $gt: 20 },
				},
			],
		})
		.toArray();

	return users;
};

// user id=12354 set age ==> 3
// export const updateProfile = async (req) => {
// 	// const user = await userModel.deleteOne(
// 	// 	{
// 	// 		_id: new ObjectId(id),
// 	// 
// 	const user = await userModel.findById(req.user._id)

// 	await user.save()
// 	return user;
// };

export const uploadPic = async (user,file) => {
	try {
console.log(!user.profilePic?.public_id)
			if(!user.profilePic?.public_id ){

				const {public_id,secure_url} = await cloudinary.uploader.upload(
file.path,{
	folder:`/sarahapp/${user._id}/profilePics`
}
				)
				console.log({public_id,secure_url})
				user.profilePic = {public_id,secure_url}
				await user.save()
				return{
					message:"profilepic uploaded success"
				}
			}

			await cloudinary.uploader.destroy(user.profilePic.public_id)
		
			user.profilePic = null
			console.log(user)
			await user.save()
const {public_id,secure_url} = await cloudinary.uploader.upload(
file.path,{
	folder:`/sarahapp/${user._id}/profilePics`
}
				)
				console.log({public_id,secure_url})
				user.profilePic = {public_id,secure_url}
				await user.save()

			return user
		
	} catch (error) {
	console.log(error)
	}
};
