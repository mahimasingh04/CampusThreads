import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; 


const prisma = new PrismaClient();   // not tested

export const viewMyProfile =  async(req: Request, res: Response) : Promise<void> => {
    try {
        const userId = req.userId;
        if(!userId) {
            res.status(401).json({
                success: false,
                message: "You are not authenticated"
                
            });
            return;

        }

        const profileInfo = await prisma.user.findUnique({
              where : { id: userId},
              select : {
                id: true,
                name : true,
                bio : true,
                 developerProfileLinks: true,
                 skills : true,


              }
        })
        res.json(profileInfo);
    }   catch(error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
   

export  const viewOthers =  async(req: Request, res: Response) : Promise<void> => {  // not tested
    try {
      const requestingUserId = req.userId;
      if(!requestingUserId) {
        res.status(401).json({
          success: false,
          message: "You are not authenticated"
        });
        return;
      }

      const otherUserId = req.params.userId;
      
      if (!otherUserId) {
        res.status(400).json({
          success: false,
          message: "User ID is required"
        });
        return;
      }

      const profileInfo = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: {
          id: true,
          name: true,
          bio: true,
          developerProfileLinks: true,
          skills: true,
        }
      });

      if (!profileInfo) {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
        return;
      }

      res.json({
        success: true,
        data: profileInfo
      });
    } catch(error) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch user profile' 
      });
    }
}