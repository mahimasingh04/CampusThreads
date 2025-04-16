import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createPosts, viewPost, getPostByCommuityName, deletePost, updatePost, sharePost, savePost, getSavedPosts } from "../controllers/postController";
import upload from "../middleware/multerConfig";
import { authMiddleware } from "../middleware/authenticateUser";

const prisma = new PrismaClient(); 

const postRouter = express.Router()

// Create a post with specific content type (TEXT, IMAGES, VIDEOS, POLLS)
// The :type parameter specifies the content type
// For IMAGES and VIDEOS, the file is uploaded using multer
postRouter.post("/createPost/:communityName/:type", authMiddleware, upload.single("file"), createPosts);

// View a specific post
postRouter.get("/viewPost/:communityName/:postTitle", viewPost);

// Get all posts in a community
postRouter.get("/getPosts/:communityName", getPostByCommuityName);

// Delete a post (only by the owner)
postRouter.delete("/deletePost/:postId", authMiddleware, deletePost);

// Update a post (only by the owner)
postRouter.put("/updatePost/:postId", authMiddleware, updatePost);

// Share a post
postRouter.get("/sharePost/:postId", sharePost);

// Save a post
postRouter.post("/savePost/:postId", authMiddleware, savePost);

// Get all saved posts for the current user
postRouter.get("/savedPosts", authMiddleware, getSavedPosts);

// Legacy route for backward compatibility



export default postRouter;