import { Request, Response } from "express";

import { PrismaClient, ContentType } from "@prisma/client"; 


const prisma = new PrismaClient();

export const createHackathonPost = async(req : Request, res: Response) :Promise<void> => {
    try{
        const communityName = req.params.communityName;
        const authorId = req.userId;

        if(!communityName || !authorId) {
            res.status(400).json({message: "Community and authorId are required"});
            return;
        }
        const {title, description, flairName, location,techStack, slotsTotal, genderReq, isActive, } = req.body;
        if(!title || !description || !location || !techStack || !slotsTotal || !genderReq ) {
            res.status(400).json({message: "All fields are required"});
            return;
        }
       const community = await prisma.community.findUnique({
        where: {name:communityName}
       })
       if(!community) {
        res.status(404).json({message: "community not found"});
        return;
       }
       const hPost =  await prisma.hackathonPost.create({
        data: {
            title,
            description,
            location,
            techStack, slotsTotal, genderReq, isActive,
            author: {connect: {id: authorId}},
          

        }
       })
       res.status(201).json({message: "HackathonPost created successfully", hackathonPost: hPost})
    }catch(error){
     console.error("Error creating hackathon post", error);
     res.status(500).json({message: "Internal server error"});
    }
}



     
