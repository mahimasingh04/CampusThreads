import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; // Import PrismaClient
import cloudinary from "../config/cloudinary"; // Import Cloudinary
import upload from "../middleware/multerConfig"; // Import Multer


const prisma = new PrismaClient(); 

export const createPosts = async (req: Request, res: Response) : Promise<void> => {
    try {
       const communityName= req.body
       const postType = req.params.type as ContentType
       const {title, content, flairName, author }= req.body
         const authorId = req.userId

         if (!title || !content || !communityName || !authorId) {
            res.status(400).json({ message: "Title, content, community name, and author ID are required" });
            return;
          }

          const community = await prisma.community.findUnique({
            where: { name: communityName },
            
          });
      
          if (!community) {
            res.status(404).json({ message: "Community not found" });
            return;
          }

          const flair = await prisma.flair.findFirst({
            where: {
              name: flairName,
              communityId: community.id,
            },
          });
      
          if (!flair) {
            res.status(404).json({ message: "Flair not found in the community" });
            return;
          }

          let mediaUrl = null;

          // Handle file upload for IMAGES and VIDEOS
          if (postType === "IMAGES" || postType === "VIDEOS") {
            if (!req.file) {
              res.status(400).json({ message: "File is required for image/video posts" });
              return;
            }
      
            // Upload file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
              resource_type: postType === "IMAGES" ? "image" : "video",
            });
      
            mediaUrl = result.secure_url; // Save the Cloudinary URL
          }

          const newPost = await prisma.post.create({
                 data: {
                  title,
                  content,
                  contentType : postType,
                  authorId,
                  communityId: community.id,
                  flairId: flair.id,
                  ...(mediaUrl && { content: mediaUrl }), // Override content with Cloudinary URL for images/videos


                 }
          })
          res.status(201).json({ message: "Post created successfully", newPost});

          
        }catch(error) {
          console.error(error);
          res.status(500).json({ message: "Failed to create post" });
    }
    
}