import express from "express"
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; 
import { createCommunities, joinCommunities, getCommunityDetailsById, getAllCommunities, fetchingRulesById } from "../controllers/communityController";
import { authMiddleware } from "../middleware/authenticateUser";
import { isCommunityModerator } from "../middleware/AuthoriseMods";
import { createTag, getCommunityTags } from "../controllers/tagController";


const prisma = new PrismaClient(); 


const communityRouter = express.Router()
communityRouter.use(express.json());



communityRouter.post('/createComm', authMiddleware, createCommunities);
communityRouter.get('/getComm/:identifier', authMiddleware, getCommunityDetailsById);

communityRouter.post('/:identifier/create-tag', authMiddleware, isCommunityModerator, createTag);
communityRouter.post('/joinComm/:communityId', authMiddleware, joinCommunities);

communityRouter.get('/getCommunities',authMiddleware , getAllCommunities )
communityRouter.get('/:communityId/tags', authMiddleware, getCommunityTags )
communityRouter.get('/:communityId/rules', authMiddleware, fetchingRulesById)


export default communityRouter;