import { Request, Response } from "express";

import { PrismaClient, MediaType } from "@prisma/client"; // Import PrismaClient
import cloudinary from "../config/cloudinary"; // Import Cloudinary
import {upload} from '../utils/upload' // Import Multer
import { uploadBuffer } from '../utils/helper';

const prisma = new PrismaClient(); 

export const createPosts = async (req: Request, res: Response) : Promise<void> => {
    try {
      const{title,
        content  ,
         communityId,
         tagNames,
         accessCodes,
         
      } = req.body;
      const authorId = req.userId;

      if(!authorId){
        res.status(400).json({"error" : "you are not authenticated"});
        return;
      }

      if(!title || !communityId ||!tagNames ){
        res.status(400).json({"error" : "missing fields detected"});
        return;
      }

      const communityExists = await prisma.community.findUnique({
        where : {
          id: communityId
        }
      })
      if(!communityExists){
        res.status(404).json({"error"  :"community does not exists"});
        return;
      }

      const tagArr: string[] = Array.isArray(tagNames) ? tagNames : [tagNames];
      const codeArr: (string)[] = accessCodes
        ? (Array.isArray(accessCodes) ? accessCodes : [accessCodes])
        : [];

      if (codeArr.length && codeArr.length !== tagArr.length) {
        res.status(400).json({ error: 'accessCodes must align with tagNames' });
        return;
      }
    

      const validTags: { id: string, name: string }[] = [];
      const validCodes: string[] = [];

    for (let i = 0; i < tagArr.length; i++) {
        const name = tagArr[i];
        const code = codeArr[i];
        const tag = await prisma.tag.findFirst({
          where: { name, communityId}
        });
        if (!tag) {
           res.status(404).json({ error: `Tag "${name}" not found` });
           return;
        }

        if (tag.isPublic) {
          validTags.push({ id: tag.id, name });
          validCodes.push('');
        } else {
          if (!code || code !== tag.accessCode) {
             res.status(401).json({ error: `Invalid access code for private tag "${name}"` });
             return;
          }
          validTags.push({ id: tag.id, name });
          validCodes.push(code);
        }
      }

 const uploadedMedia = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const resourceType: 'image' | 'video' =
          file.mimetype.startsWith('video') ? 'video' : 'image';

        const uploadResult = await uploadBuffer(file.buffer, resourceType);
        uploadedMedia.push({
          url: uploadResult.secure_url,
          type: resourceType.toUpperCase() as MediaType,
        });
      }
    }


     const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        communityId,
     tags: {
    create: validTags.map(tagObj => ({
      tag: {
        connect: { id: tagObj.id },
      },
    })),
  },
     isCollaboration : false,
        media: {
          create: uploadedMedia,
        },
      },
      include: {
        media: true,
        tags: true,
      },
    });

    res.status(201).json({ success: true, post: newPost });
     

    }catch(error: any) {
        res.status(500).json({ error: 'Server error', detail: error.message });
    }
}

export const feedPosts = async(req: Request, res:Response): Promise<void> =>{
  try {
    const userId = req.userId;
    if(!userId){
      res.status(400).json({"error" : "you are not authenticated"})
    }

    const communityIds = req.body;
    if (!Array.isArray(communityIds) || communityIds.length === 0) {
      res.status(400).json({ error: 'Invalid community IDs' });
      
    }

    const posts = await prisma.post.findMany({
      where: {
        communityId: {
          in: communityIds
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: true,
        community: true,
        tags: true,
        media: true
      }
    })


    res.status(200).json({ success: true, posts });
  }catch(error: any){
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
}