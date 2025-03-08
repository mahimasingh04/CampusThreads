import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client"; // Import PrismaClient
const prisma = new PrismaClient(); 


export const createCommunities = async(req: Request , res : Response): Promise<void> => {
     
    
}

export const joinCommunities = async(req: Request , res : Response): Promise<void> => {
     

}

export const fetchPosts = async(req: Request , res : Response): Promise<void> => {
     

}

export const leaveCommunity = async(req: Request , res : Response): Promise<void> => {
     

}

export const addTags =  async(req: Request , res : Response): Promise<void> => {
     

}

export const addToCustomFeeds =  async(req: Request , res : Response): Promise<void> => {
     

}

export const addToFavourites=  async(req: Request , res : Response): Promise<void> => {
     

}




