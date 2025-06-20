import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import { profileSetup, registerController, signinController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authenticateUser";

const prisma = new PrismaClient(); 




const userRouter = express.Router();

userRouter.post("/signup", registerController )

userRouter.post("/signin", signinController) ;
userRouter.post("/profile-setup", authMiddleware, profileSetup)

export default userRouter