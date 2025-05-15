import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createCommunities, joinCommunities, addToCustomFeeds, getCustomFeedPosts, getUserCustomFeeds, getCommunityDetailsById } from "../controllers/communityController";
import { authMiddleware, isCommunityModerator } from "../middleware/authenticateUser";


const prisma = new PrismaClient(); 


const communityRouter = express.Router()

communityRouter.post('/createComm', authMiddleware, createCommunities);
communityRouter.post('/joinComm/:communityId', authMiddleware, joinCommunities);

communityRouter.get('/getComm/:identifier', authMiddleware, getCommunityDetailsById);
// Custom feed routes
communityRouter.post('/custom-feed', authMiddleware, addToCustomFeeds);
communityRouter.get('/custom-feed/:customFeedId', authMiddleware, getCustomFeedPosts);
communityRouter.get('/custom-feeds', authMiddleware, getUserCustomFeeds);

export default communityRouter;