import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; 


const prisma = new PrismaClient();

export const createTag = async(req: Request, res: Response): Promise<void> => {
   
}

