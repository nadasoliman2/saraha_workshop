import jwt from "jsonwebtoken"
import { userModel } from "../DB/models/user.model.js";
import { TOKEN_SIGNATURE } from "../config.js";

export const authentication = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("Authorization header is required");
    }

    const [bearer, accessToken] = authorization.split(" ");

    if (bearer !== "Bearer" || !accessToken) {
        throw new Error("Invalid authorization format");
    }

    const decoded = jwt.verify(accessToken, TOKEN_SIGNATURE);

    if (!decoded) {
        throw new Error("Invalid credentials");
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
        throw new Error("User not found");
    }

    req.user = user;

    next();
};