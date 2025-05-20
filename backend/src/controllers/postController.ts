import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; // Import PrismaClient
import cloudinary from "../config/cloudinary"; // Import Cloudinary
import upload from "../middleware/multerConfig"; // Import Multer


const prisma = new PrismaClient(); 

export const createPosts = async (req: Request, res: Response) : Promise<void> => {
    try {
      
    }catch(Error) {

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
        tag: {
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
        tag: {
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

export const deletePost = async(req :Request, res: Response) : Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.userId; // Get the user ID from the auth middleware
    
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });
    
    // Check if post exists
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    
    // Check if the user is the owner of the post
    if (post.authorId !== userId) {
      res.status(403).json({ message: "You are not authorized to delete this post. Only the post owner can delete it." });
      return;
    }
    
    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId
      }
    });
    
    res.status(200).json({ message: "Post deleted successfully" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
}

export const updatePost = async(req : Request, res: Response) : Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const { title, content, tagName } = req.body;
    
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });
    
    // Check if post exists
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    
    // Check if the user is the owner of the post
    if (post.authorId !== userId) {
      res.status(403).json({ message: "You are not authorized to update this post. Only the post owner can update it." });
      return;
    }
    
    // If flair is being updated, find the flair
    let tagId = post.tagId;
    if (tagName) {
      const tag = await prisma.tag.findFirst({
        where: {
          name: tagName,
          communityId: post.communityId,
        },
      });

      if (!tag) {
        res.status(404).json({ message: "Tag not found in the community" });
        return;
      }

      tagId = tag.id;
    }
    
    // Update the post
    const updatedPost = await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        title: title || post.title,
        content: content || post.content,
        tagId: tagId
      }
    });
    
    res.status(200).json({ 
      message: "Post updated successfully",
      data: updatedPost
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update post" });
  }
}

export const sharePost = async (req: Request, res: Response) : Promise<void> => {
  try {
    const postId = req.params.postId;
    const { communityName } = req.params;
    
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        community: {
          select: {
            name: true
          }
        }
      }
    });
    
    // Check if post exists
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    
    // Generate shareable links
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const postUrl = `${baseUrl}/r/${post.community.name}/post/${postId}`;
    
    // Create shareable links for different platforms
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + postUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent('Check out this post: ' + postUrl)}`,
      directLink: postUrl
    };
    
    res.status(200).json({ 
      message: "Share links generated successfully",
      data: {
        post,
        shareLinks
      }
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate share links" });
  }
}

export const savePost = async (req : Request, res: Response) : Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    
    // Check if userId exists
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID is missing" });
      return;
    }
    
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });
    
    // Check if post exists
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    
    // Check if the post is already saved by the user
    const existingSavedPost = await prisma.savedPost.findFirst({
      where: {
        postId: postId,
        userId: userId
      }
    });
    
    if (existingSavedPost) {
      // If post is already saved, remove it (toggle functionality)
      await prisma.savedPost.delete({
        where: {
          id: existingSavedPost.id
        }
      });
      
      res.status(200).json({ 
        message: "Post removed from saved items",
        saved: false
      });
      return;
    }
    
    // Save the post for the user
    const savedPost = await prisma.savedPost.create({
      data: {
        postId: postId,
        userId: userId
      }
    });
    
    res.status(201).json({ 
      message: "Post saved successfully",
      saved: true,
      data: savedPost
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save post" });
  }
}

export const getSavedPosts = async (req : Request, res: Response) : Promise<void> => {
  try {
    const userId = req.userId;
    
    // Check if userId exists
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID is missing" });
      return;
    }
    
    // Get all saved posts for the user
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: userId
      },
      include: {
        post: {
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
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        savedAt: 'desc'
      }
    });
    
    res.status(200).json({ 
      message: "Saved posts retrieved successfully",
      count: savedPosts.length,
      data: savedPosts
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve saved posts" });
  }
}
