import express from "express";
import { login, logout, register } from "../controller/userController.js";
import { hasToken } from "../middleware/hasToken.js";
import { userValidateSchema, validateUser } from "../validators/userValidate.js";
// import { verify } from "../middleware/tokenVerification.js"

const userRoute = express.Router();

userRoute.post("/register", validateUser(userValidateSchema), register);
userRoute.post("/login", login);
userRoute.delete("/logout", hasToken, logout)

export default userRoute;
