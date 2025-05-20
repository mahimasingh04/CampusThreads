import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createCommunities, joinCommunities, addToCustomFeeds, getCustomFeedPosts, getUserCustomFeeds, getCommunityDetailsById } from "../controllers/communityController";
import { authMiddleware } from "../middleware/authenticateUser";
import { isCommunityModerator } from "../middleware/AuthoriseMods";
import { createTag } from "../controllers/tagController";


const prisma = new PrismaClient(); 


const communityRouter = express.Router()
communityRouter.use(express.json());



communityRouter.post('/createComm', authMiddleware, createCommunities);
communityRouter.get('/getComm/:identifier', authMiddleware, getCommunityDetailsById);

communityRouter.post('/:identifier/create-tag', authMiddleware, isCommunityModerator, createTag);
communityRouter.post('/joinComm/:communityId', authMiddleware, joinCommunities);

// Custom feed routes
communityRouter.post('/custom-feed', authMiddleware, addToCustomFeeds);
communityRouter.get('/custom-feed/:customFeedId', authMiddleware, getCustomFeedPosts);
communityRouter.get('/custom-feeds', authMiddleware, getUserCustomFeeds);

export default communityRouter;