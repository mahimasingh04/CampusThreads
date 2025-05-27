import { Request, Response } from "express";

import { PrismaClient, Role } from "@prisma/client"; // Import PrismaClient
import { getCommunitiesWithDetails } from "../repositories/CommunityRepository";
import { fetchCommunityRules } from "../repositories/RulesRepository";
const prisma = new PrismaClient(); 



export const createCommunities = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, rules } = req.body;
        const ownerId = req.userId;

        // Validation
        if (!ownerId) {
            res.status(401).json({ status: "error", message: "Unauthorized: User ID is missing" });
            return;
        }

        if (!name || !description || !rules) {
            res.status(400).json({ status: "error", message: "Name, description, and rules are required" });
            return;
        }

        if (!Array.isArray(rules)) {
            res.status(400).json({ status: "error", message: "Rules must be an array" });
            return;
        }

        // Validate each rule
        for (const rule of rules) {
            if (!rule.title || !rule.description) {
                res.status(400).json({ 
                    status: "error",
                    message: "Each rule must have a title and description" 
                });
                return;
            }
        }

        // Check for existing community
        const existCommunity = await prisma.community.findUnique({
            where: { name }
        });

        if (existCommunity) {
            res.status(400).json({ 
                status: "error",
                message: "Community with this name already exists" 
            });
            return;
        }

        // Create transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create the community
            const newCommunity = await prisma.community.create({
                data: {
                    name,
                    description,
                    ownerId,
                    rules: {
                        create: rules.map((rule, index) => ({
                            order: index + 1,
                            title: rule.title,
                            description: rule.description,
                        })),
                    }
                },
                include: {
                    rules: true,
                }
            });

            // Update user role
            await prisma.user.update({
                where: { id: ownerId },
                data: { role: 'MODERATOR' }
            });

            // Create moderator relationship
            await prisma.communityModerator.create({
                data: {
                    communityId: newCommunity.id,
                    userId: ownerId
                }
            });

            return newCommunity;
        });

        res.status(201).json({
            status: "success",
            message: "Community created successfully",
            data: result
        });

    } catch (error) {
        console.error('Error creating community:', error);
        res.status(500).json({ 
            status: "error",
            message: 'Internal server error' 
        });
    }
};
export const joinCommunities = async(req: Request , res : Response): Promise<void> => {
 try {
    const { communityId } = req.body;
    const userId = req.userId;
    if(!communityId || !userId) {
        res.status(400).json({message : "communityId and userId are required"})
        return;
    }

      // Check if community exists
    const communityExists = await prisma.community.findUnique({
      where: { id: communityId }
    }); 

    if (!communityExists) {
      res.status(404).json({ message: "Community not found" });
      return;
    }
     // check if the user is already a member of the community
     const existingMembership = await prisma.userCommunity.findUnique({
      where: {
        userId_communityId: {
            userId: userId as string,
          communityId
        }
      }
    });


    if (existingMembership) {
        res.status(400).json({ message: "User is already a member of this community" });
        return;
    }


 const result = await prisma.$transaction([
      prisma.userCommunity.create({
        data: {
          userId : userId as string, // Ensure userId is a string
          communityId
        }
      }),
      prisma.community.update({
        where: { id: communityId },
        data: { membersCount: { increment: 1 } }
      })
    ]);

    res.status(201).json({
      message: 'Successfully joined community',
      community: result[1]
    });

    }catch(error){
    console.error('Error joining community:', error);  
    res.status(500).json({ 
        status: "error",
        message: 'Internal server error' 
    });
}
}








export const getCommunityDetailsById =  async(req: Request, res: Response): Promise<void> => {
    try{
         const { identifier } = req.params;
         if(! identifier) {
          res.status(400).json({message : "identifier is important"})
          return;
         }
            const community = await prisma.community.findFirst({
                where : {
                   OR: [
                    {id: identifier},
                    {name: identifier}
                   ]
                },
                include: {
                    rules: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            order: true
                        }

                    },
                    tags: {
                         select: {
                            name: true,
                         }
                    },
                    post: {
                        select: {
                            title: true,
                            content: true,
                            contentType: true,
                            tag: {
                                select: {
                                    name: true,
                                    
                                }
                            },
                            author:{
                                select: {
                                    id: true,
                                    name: true,
                                }

                            },
                            createdAt: true,
                            updatedAt: true,
                            upvotes: true,
                            downvotes: true,
                            comments: {
                                select: {
                                    id: true,
                                    content: true,

                                }
                            },
                            commentCount: true,
                        }
                    },
                    moderators: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }

                }

                

            })
            if(!community) {
                res.status(404).json({message : "community not found"})
                return;
            }
            const response = {
                  id: community.id,
                name: community.name,
                description: community.description,
                rules: community.rules,
                tags: community.tags,
                post: community.post,
                moderators: community.moderators.map(m => m.user),
                membersCount: community.membersCount,
                createdAt: community.createdAt,
                updatedAt: community.updatedAt,
              
            }
            res.status(200).json({
                status:" success",
                message: "community details retreived successfully",
                data: response
            })
    }catch(error){
        console.error("Error retreiving community details:", error);
        res.status(500).json({message : "Internal server error"}) 
    }
}

// Type for the complete community responseget 
export const getAllCommunities = async (req: Request, res: Response) : Promise<void> => {
  try {
    const communities = await getCommunitiesWithDetails();
    
    // Transform data for client
    const responseData = communities.map(community => ({
      id: community.id,
      name: community.name,
      description: community.description,
      memberCount: community.membersCount,
      rules: community.rules,
      tags: community.tags,
      createdAt: community.createdAt
    }));

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch communities'
    });
  }}

  export const fetchingRulesById = async(req: Request, res: Response) : Promise<void> => {
     try {
        const { communityId } = req.params;
    
    if (!communityId) {
      res.status(400).json({
        success: false,
        message: 'Community ID is required'
      });
      return;
    }

    const rules = await fetchCommunityRules(communityId)

    const responseData = rules.map(rule => ({
        order: rule.order,
        title: rule.title,
        description : rule.description
    }))
       res.status(200).json({
        success: true,
        data: responseData
       })
     
     }catch(error) {
      console.error('error fetching rules:', error)
       res.status(500).json({
      success: false,
      message: 'Failed to fetch rules'
    });
     }
  }


