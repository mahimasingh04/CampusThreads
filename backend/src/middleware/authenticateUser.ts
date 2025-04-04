import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }

const prisma = new PrismaClient();

export const authMiddleware = async(req: Request , res : Response , next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.tokenInfo;
        console.log("Token from cookies:", token); 

        if (!token) {
            res.status(200).json({
             success: false,
             message: "You are not authorized to access this route",
           });
           return;
         }
   
         const decoded = verifyToken(token) as JwtPayload;
         console.log("Decoded token:", decoded);

         
         if(!decoded) {
           res.status(200).json({
               success: false,
               message: "Invalid token!!",
             });
             return;

    }

    req.userId = decoded.userId 
    next();
    }
    catch(error) {
         
            console.error('Error verifying token:', error);
            res.status(401).json({ message: 'Invalid or expired token.' });
    }
    
      
}

export const isCommunityModerator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        const communityId = req.params.communityId;

        if (!userId || !communityId) {
            res.status(400).json({
                success: false,
                message: "User ID and Community ID are required"
            });
            return;
        }

        // First check if the user is a member of the community
        const userCommunity = await prisma.userCommunity.findUnique({
            where: {
                userId_communityId: {
                    userId,
                    communityId
                }
            }
        });

        if (!userCommunity) {
            res.status(403).json({
                success: false,
                message: "You must be a member of this community to perform this action"
            });
            return;
        }

        // Then check if the user has the MODERATOR role
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        if (user.role !== 'MODERATOR') {
            res.status(403).json({
                success: false,
                message: "Only moderators can perform this action"
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking moderator status:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};