import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createPosts } from "../controllers/postController";
import upload from "../middleware/multerConfig";
import { authMiddleware } from "../middleware/authenticateUser";

const prisma = new PrismaClient(); 

const postRouter = express.Router()

postRouter.post("/posts/:type", authMiddleware, upload.single("file"), createPosts);
postRouter.post("/createPost", authMiddleware, createPosts);

export default postRouter;