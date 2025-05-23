import express from "express"
import { Request, Response } from "express";
import { tagAccessCodeLimiter } from '../middleware/rateLimit';
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authenticateUser";
import { verifyAccessTag } from "../controllers/tagController";
const prisma = new PrismaClient(); 


const tagRouter = express.Router()

tagRouter.post('/private-tag/isValid ', authMiddleware, verifyAccessTag )

export default tagRouter