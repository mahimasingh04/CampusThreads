import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; 


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

