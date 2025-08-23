import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createPosts } from "../controllers/postController";

import { upload } from '../utils/upload';
import { authMiddleware } from "../middleware/authenticateUser";
import { createCollabPost } from "../controllers/collaborationPost";

const prisma = new PrismaClient(); 

const postRouter = express.Router()

// Create a post with specific content type (TEXT, IMAGES, VIDEOS, POLLS)
// The :type parameter specifies the content type
// For IMAGES and VIDEOS, the file is uploaded using multer

postRouter.post("/createPost/collabPost", authMiddleware, createCollabPost);

postRouter.post("/createPost/blog" , authMiddleware,upload.single('media') ,createPosts)
// View a specific post
export default postRouter;