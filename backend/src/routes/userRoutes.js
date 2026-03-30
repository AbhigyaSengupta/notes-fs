import express from "express";
import { login, logout, register, uploadProfileImage } from "../controller/userController.js";
import { hasToken} from "../middleware/hasToken.js";
import {userValidateSchema, validateUser} from "../validators/userValidate.js";
import upload from "../middleware/upload.js";
// import { verify } from "../middleware/tokenVerification.js"

const userRoute = express.Router();

userRoute.post("/register", validateUser(userValidateSchema), register);
userRoute.post("/login", login);
userRoute.delete("/logout", hasToken, logout);
userRoute.put("/upload-profile", hasToken, upload.single("profileImage"), uploadProfileImage);
export default userRoute;
