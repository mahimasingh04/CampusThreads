import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; // Import PrismaClient
import cloudinary from "../config/cloudinary"; // Import Cloudinary
import upload from "../middleware/multerConfig"; // Import Multer


const prisma = new PrismaClient(); 

export const createPosts = async (req: Request, res: Response) : Promise<void> => {
    try {
       // Get post type from URL parameter
       const communityName = req.params.communityName;
       const postType = req.params.type as ContentType;
       
       // Validate post type
       if (!Object.values(ContentType).includes(postType)) {
         res.status(400).json({ message: "Invalid post type. Must be one of: TEXT, IMAGES, VIDEOS, POLLS" });
         return;
       }
       
       // Get data from request body
       const { title, content, flairName } = req.body;
       
       // Get author ID from auth middleware
       const authorId = req.userId;

       // Validate required fields
       if (!title || !content || !communityName || !authorId) {
          res.status(400).json({ message: "Title, content, community name, and author ID are required" });
          return;
       }

       // Find the community by name
       const community = await prisma.community.findUnique({
         where: { name: communityName },
       });
   
       if (!community) {
         res.status(404).json({ message: "Community not found" });
         return;
       }

       // Find the flair by name and community ID
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

       // Create the post
       const newPost = await prisma.post.create({
         data: {
           title,
           content: mediaUrl || content, // Use media URL for images/videos, otherwise use content
           contentType: postType,
           authorId,
           communityId: community.id,
           flairId: flair.id,
         }
       });
       
       res.status(201).json({ message: "Post created successfully", newPost });
    } catch(error) {
       console.error(error);
       res.status(500).json({ message: "Failed to create post" });
    }
}

export const viewPost = async (req: Request, res : Response) : Promise<void> => {
  try {
    const communityName = req.params.communityName;
    const postTitle = req.params.postTitle;
    
    // First find the community
    const community = await prisma.community.findUnique({
      where: { name: communityName }
    });

    if (!community) {
      res.status(404).json({ message: "Community not found" });
      return;
    }

    // Then find the post in that community
    const post = await prisma.post.findFirst({
      where: {
        title: postTitle,
        communityId: community.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        flair: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({ message: "Post not found in this community" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve post" });
  }
}

export const getPostByCommuityName = async(req : Request, res : Response) : Promise<void> => {
  try {
    const communityName = req.params.communityName;
    
    // First find the community
    const community = await prisma.community.findUnique({
      where: {
        name: communityName
      }
    });

    if (!community) {
      res.status(404).json({ message: "Community not found" });
      return;
    }

    // Then find all posts in that community
    const posts = await prisma.post.findMany({
      where: {
        communityId: community.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        flair: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: {
        community,
        posts
      }
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
}