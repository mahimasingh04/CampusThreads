import express from "express"
import { authMiddleware } from "../middleware/authenticateUser";
import { PrismaClient } from "@prisma/client"; 
import { handleRequest, joinRequest } from "../controllers/collaborationPost";



const prisma = new PrismaClient(); 

const collaborateRouter = express.Router()

collaborateRouter.post('/:postId/join-request', authMiddleware, joinRequest)
collaborateRouter.patch('/request/:requestId', authMiddleware, handleRequest)

export default collaborateRouter