
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      community?: any;
    }
  }
}

const prisma = new PrismaClient();

export const isCommunityModerator = async (req :Request , res: Response, next: NextFunction): Promise<void> => {
    try {
     const userId = req.userId;
     const identifier = req.params.identifier;

     
     
     
        if(!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        if(!identifier) {
            res.status(400).json({ message: 'Community identifier is required' });
            return;
        }
     const community = await prisma.community.findFirst({
        where : {
            OR :[
                { id : identifier},
                { name : identifier}
            ]
        },
     include : {
        moderators:{
            where : {
                userId  : userId
            },
            select : {
                userId : true,
            }
        }
     }
     });

 if(!community) {
  res.status(404).json({ message: 'Community not found' });
  return;
 }

        if(community.moderators.length === 0) {
            res.status(403).json({ message: 'User is not a moderator of this community' });
            return;
        }
    
     req.community = community;
       next();
    }catch(Error) {
        console.error('Error in isCommunityModerator middleware:', Error);
        res.status(500).json({ message: 'Internal server error' });
    }
}