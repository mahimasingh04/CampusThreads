import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; 
import { tagsByCommunityId } from "../repositories/TagRepository";


const prisma = new PrismaClient();

export const createTag = async(req: Request, res: Response): Promise<void> => {
   //create a tag for a specific community 

 
   try{
       const community = req.community;
    const { name, description, isPublic, accessCode } = req.body;
  const newTag = await prisma.tag.create({
    data: {
      name,
      description,
      isPublic,
      accessCode: isPublic ? null : accessCode,
      community: {
        connect: { id: community.id }
      },
      creator: {
        connect: { id: req.userId }
      }
    }
  })

  if (!isPublic && !accessCode) {
   res.status(400).json({ 
    error: 'accessCode is required for private tags' 
  });

  return;
}

if (isPublic && accessCode) {
   res.status(400).json({ 
    error: 'accessCode must be empty for public tags' 
  });
  return;
}
 
  res.status(201).json({
    message: 'Tag created successfully',
    success: true,
    data : newTag
  })
   }catch(Error) {
    console.error('Error creating tag:', Error);
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: Error
    });
   }
 }

export const getCommunityTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { communityId } = req.params;
    
    if (!communityId) {
     res.status(400).json({
        success: false,
        message: 'Community ID is required'
      });
      return;
    }

    const tags = await tagsByCommunityId(communityId);

    const responseData = tags.map(tag => ({
      id : tag.id,
      name: tag.name,
      description: tag.description,
      isPublic : tag.isPublic
    }))

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching community tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch community tags'
    });
  }
};


