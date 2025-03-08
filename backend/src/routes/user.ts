import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import { registerController, signinController } from "../controllers/userController";

const prisma = new PrismaClient(); 




const userRouter = express.Router();

userRouter.post("/signup", registerController )

userRouter.post("/signin", signinController) ;

export default userRouter