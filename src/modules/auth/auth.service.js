import { userModel } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SIGNATURE } from "../../config.js";
// import { generateToken } from "../../common/security/token.js";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../../common/utils/cloudinary.js";
import axios from "axios";

const client = new OAuth2Client();

async function verify(idToken) {
	const ticket = await client.verifyIdToken({
		idToken: idToken,
		audience: WEB_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	return payload;
}



export const signup = async (data, profilePic,next) => {
	try {
		const { email } = data;
		const existUser = await userModel.findOne({ email });
		if (existUser) {
			throw new Error("user already exist", { cause: 409 });
		}
		const user = await userModel.create(data)
		if(!profilePic){
			return user
		}
		//user_id
const {public_id,secure_url}=await  cloudinary.uploader.upload(profilePic.path,{
	folder:`/sarahapp/${user._id}/profilePics`
})
user.profilePic = {public_id,secure_url}
await user.save()



		return user;
	} catch (error) {
		next(error);
	}
};

// login endpoint

export const login = async (data) => {
	try {
		// console.log(data);
		const { email, password } = data;
		// check email exists or not ==== > not exist ====> signup ===> login
		const existUser = await userModel.findOne({ email }); // user.password
		if (!existUser) {
			throw new Error("email or password are incorrect", { cause: 401 });
		}
		// check password == db password
		if (password != existUser.password) {
			throw new Error("email or password are incorrect", { cause: 401 });
		}
		//token
		const accessToken = jwt.sign(
			{ id: existUser._id, isMoaz: true },
			TOKEN_SIGNATURE,
			{
				expiresIn: "1h",
			},
		);
		// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// 	expiresIn:"1h"
		// })
		return { message: "loggedIn successgully", accessToken };
	} catch (error) {
		throw new Error(error);
	}
};

export const google = async (data) => {
	try {
		// console.log(data);

		const { credential } = data;
		if (!credential) {
			throw new Error("credential is required", { cause: 400 });
		}
		const payload = await verify(credential);
		if (!payload) {
			throw new Error("Invalid credential", { cause: 400 });
		}
		const { email, given_name, family_name } = payload;
		const existUser = await userModel.findOne({ email });
		if (existUser) {
			if (existUser.provider !== "google") {
				throw new Error("User already exists with a different provider", {
					cause: 409,
				});
			}
			const accessToken = jwt.sign(
				{ id: existUser._id, isMoaz: true },
				TOKEN_SIGNATURE,
				{
					expiresIn: "1h",
				},
			);
			// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
			// 	expiresIn:"1h"
			// })
			return { message: "loggedIn successgully", accessToken, status: 200 };
		}
		const newUser = await userModel.create({
			firstName: given_name,
			lastName: family_name,
			email,
			provider: "google",
		});
		const accessToken = jwt.sign(
			{ id: newUser._id, isMoaz: true },
			TOKEN_SIGNATURE,
			{
				expiresIn: "1h",
			},
		);
		// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// 	expiresIn:"1h"
		// })
		return { message: "signed up successfully", accessToken, status: 201 };

		// // check email exists or not ==== > not exist ====> signup ===> login
		// const existUser = await userModel.findOne({ email }); // user.password
		// if (!existUser) {
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// // check password == db password
		// if (password != existUser.password ){
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// //token

		// const accessToken = jwt.sign({id:existUser._id ,isMoaz : true},TOKEN_SIGNATURE,{
		// 	expiresIn:'1h'
		// })
		// // const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// // 	expiresIn:"1h"
		// // })
		// return {message:'loggedIn successgully',accessToken}
	} catch (error) {
		throw new Error(error);
	}
};

export const facebook = async (inputs) => {
	try {
		// console.log(data);
		// console.log();

		const { accessToken } = inputs;
		if (!accessToken) {
			throw new Error("Access token is required", { cause: 400 });
		}
		console.log(accessToken);
		// axois.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`)
		const { data } = await axios.get(
			`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`,
		);
		console.log(data);
		const [firstName, lastName] = data.name.split(" ");

		const existUser = await userModel.findOne({ email: data.email });
		if (existUser) {
			if (existUser.provider !== "facebook") {
				throw new Error("User already exists with a different provider", {
					cause: 409,
				});
			}
			const access_Token = jwt.sign(
				{ id: existUser._id, isMoaz: true },
				TOKEN_SIGNATURE,
				{
					expiresIn: "1h",
				},
			);
			// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
			// 	expiresIn:"1h"
			// })
			return { message: "loggedIn successgully", access_Token, status: 200 };
		}
		const newUser = await userModel.create({
			firstName,
			lastName,
			email: data.email,
			provider: "facebook",
		});
		const access_Token = jwt.sign(
			{ id: newUser._id, isMoaz: true },
			TOKEN_SIGNATURE,
			{
				expiresIn: "1h",
			},
		);
		// const access_Token = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// 	expiresIn:"1h"
		// })
		return { message: "signed up successfully", access_Token, status: 201 };

		// // check email exists or not ==== > not exist ====> signup ===> login
		// const existUser = await userModel.findOne({ email }); // user.password
		// if (!existUser) {
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// // check password == db password
		// if (password != existUser.password ){
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// //token

		// const accessToken = jwt.sign({id:existUser._id ,isMoaz : true},TOKEN_SIGNATURE,{
		// 	expiresIn:'1h'
		// })
		// // const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// // 	expiresIn:"1h"
		// // })
		// return {message:'loggedIn successgully',accessToken}
	} catch (error) {
		throw new Error(error);
	}
};
