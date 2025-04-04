import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createPosts, viewPost, getPostByCommuityName } from "../controllers/postController";
import upload from "../middleware/multerConfig";
import { authMiddleware } from "../middleware/authenticateUser";

const prisma = new PrismaClient(); 

const postRouter = express.Router()

// Create a post with specific content type (TEXT, IMAGES, VIDEOS, POLLS)
// The :type parameter specifies the content type
// For IMAGES and VIDEOS, the file is uploaded using multer
postRouter.post("/createPost/:communityName/:type", authMiddleware, upload.single("file"), createPosts);

// View a post by title and community name
postRouter.get("/viewPost/:communityName/:postTitle", authMiddleware, viewPost);

// Get all posts by community name
postRouter.get("/community/:communityName", authMiddleware, getPostByCommuityName);

// Legacy route for backward compatibility


export default postRouter;