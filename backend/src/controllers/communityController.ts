import { Request, Response } from "express";

import { PrismaClient, Role } from "@prisma/client"; // Import PrismaClient

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
      
   // does this community exists/
   // if it exists join the user in that community 
   // 

   try{
        const {communityId } = req.params
        const userId = req.userId; 

        if(! userId || !communityId) {
            res.status(400).json("user Id and community Id are important")
            return;
        }

        const existingMembership = await prisma.userCommunity.findUnique({
            where : {
                userId_communityId: {
                    userId,
                    communityId,
                  },
            }
        })

        if( existingMembership ) {
            res.status(400).json({  message: "User is already a member of this community"})
        }

        const newMembership = await prisma.$transaction([
            prisma.userCommunity.create({
                data: {
                    userId,
                    communityId,
                },
            }),
            prisma.community.update({
                where: { id: communityId },
                data: {
                    membersCount : {
                        increment: 1,
                    },
                },
            }),
        ])
          
        res.status(201).json({
            status: "success",
            message: "User joined the community successfully",
            data: newMembership,
          });

   }catch(error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error" });
   }
 


}


export const leaveCommunity = async(req: Request , res : Response): Promise<void> => {
     try{
      const {communityId}  = req.params;
      const userId = req.userId;

      
      if(! userId || !communityId) {
        res.status(400).json("user Id and community Id are important")
        return;

    }

    const existingMembership = await prisma.userCommunity.findUnique({
        where : {
            userId_communityId: {
                userId,
                communityId,
              },
        }
    })

    if(!existingMembership) {
        res.status(400).json({message:"user is not a member of this community"})}

        const deletedMembership = await prisma.userCommunity.delete({
            where : {
                userId_communityId: {
                    userId,
                    communityId
                }
            }
        })
        res.status(200).json({
            status: "success",
            message: "User Left The community succesfully",
            data: deletedMembership
        })
     }catch(error){
 console.error("error in leaving community", error);
 res.status(500).json({message: "Internal server error"});
     }

}

export const addFlairs = async(req: Request, res: Response): Promise<void> => {
    try {
        const { communityId } = req.params;
        const { flairName } = req.body;

        if (!flairName) {
            res.status(400).json({
                success: false,
                message: "Flair name is required"
            });
            return;
        }

        // Check if tag already exists in the community
        const existingTag = await prisma.flair.findFirst({
            where: {
                name: flairName,
                communityId: communityId
            }
        });

        if (existingTag) {
            res.status(400).json({
                success: false,
                message: "flair already exists in this community"
            });
            return;
        }

        // Create new tag
        const newFlair = await prisma.flair.create({
            data: {
                name: flairName,
                communityId: communityId
            }
        });

        res.status(201).json({
            success: true,
            message: "flair added successfully",
            data: newFlair
        });

    } catch (error) {
        console.error("Error adding flair:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const addToFavourites=  async(req: Request , res : Response): Promise<void> => {
     

}

export const addToCustomFeeds = async(req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { name, description, communityIds } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User ID is missing"
            });
            return;
        }

        if (!name) {
            res.status(400).json({
                success: false,
                message: "Custom feed name is required"
            });
            return;
        }

        if (!communityIds || !Array.isArray(communityIds) || communityIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "At least one community ID is required"
            });
            return;
        }

        // Check if all communities exist
        const communities = await prisma.community.findMany({
            where: {
                id: {
                    in: communityIds
                }
            }
        });

        if (communities.length !== communityIds.length) {
            res.status(400).json({
                success: false,
                message: "One or more communities do not exist"
            });
            return;
        }

        // Create the custom feed
        const customFeed = await prisma.customFeed.create({
            data: {
                name,
                description,
                userId,
                communities: {
                    create: communityIds.map(communityId => ({
                        communityId
                    }))
                }
            },
            include: {
                communities: {
                    include: {
                        community: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: "Custom feed created successfully",
            data: customFeed
        });

    } catch (error) {
        console.error("Error creating custom feed:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getCustomFeedPosts = async(req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { customFeedId } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User ID is missing"
            });
            return;
        }

        if (!customFeedId) {
            res.status(400).json({
                success: false,
                message: "Custom feed ID is required"
            });
            return;
        }

        // Check if the custom feed exists and belongs to the user
        const customFeed = await prisma.customFeed.findUnique({
            where: {
                id: customFeedId,
                userId
            },
            include: {
                communities: {
                    include: {
                        community: true
                    }
                }
            }
        });

        if (!customFeed) {
            res.status(404).json({
                success: false,
                message: "Custom feed not found or you don't have access to it"
            });
            return;
        }

        // Get all community IDs from the custom feed
        const communityIds = customFeed.communities.map(cfc => cfc.communityId);

        // Get posts from all communities in the custom feed
        const posts = await prisma.post.findMany({
            where: {
                communityId: {
                    in: communityIds
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                community: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                flair: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
           
        });

        res.status(200).json({
            success: true,
            message: "Custom feed posts retrieved successfully",
            data: {
                customFeed,
                posts
            }
        });

    } catch (error) {
        console.error("Error retrieving custom feed posts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getUserCustomFeeds = async(req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User ID is missing"
            });
            return;
        }

        // Get all custom feeds for the user
        const customFeeds = await prisma.customFeed.findMany({
            where: {
                userId
            },
            include: {
                communities: {
                    include: {
                        community: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Custom feeds retrieved successfully",
            data: customFeeds
        });

    } catch (error) {
        console.error("Error retrieving custom feeds:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const recentlyViewedCommunities = async(req: Request, res: Response): Promise<void> => {
    try {
          
        const userId = req.userId 

        const {communityId} = req.params
        if( !userId || !communityId) {
            res.status(400).json({message : "user Id and communityId are important"})
            return;
        }

        //check if the communityExists
        const community = await prisma.community.findUnique({
            where : {
                id : communityId
            }
        })
        if(!community) {
            res.status(400).json({message: "community doesnt exists"})
            return;
        }
        const visit = await prisma.communityVisit.upsert({
            where: {
                userId_communityId: {
                  userId,
                  communityId
                }
              },
              update: {
                visitedAt: new Date()
              },
              create: {
                userId,
                communityId,
                visitedAt: new Date()
            },
            include: {
              community: {
                select: {
                  id: true,
                  name: true,
                 
                }
              }
            }
        })
        res.status(200).json({
            status : "success",
            message : "community vosited successfully",
            data: visit
        })
    }catch (error) {
      res.status(500).json({message : error})

    }
}


export const getRecentlyVisitedCommunities = async(req: Request, res :Response) : Promise<void> => {
    try {
       
        const userId = req.userId;
        if(!userId) {
            res.status(401).json({message : "Unauthorised : User ID is missing"})
            return;
        }
        const limit : number = parseInt(req.query.limit as string) || 5;

        const visits = await prisma.communityVisit.findMany({
            where : {userId},
            orderBy : {visitedAt : 'desc'},
            take : limit,
            select : {
                visitedAt : true,
                community : {
                   select : {
                    id: true,
                    name : true 
                   }
                }
            }
        });
        if (!visits || visits.length === 0) {
            res.status(404).json({message : "No recently visited communities yet" })
            return;
        }
         
        const recentCommunities = visits.map(visit => ({
            ...visit.community,
            lastVisited: visit.visitedAt
          }));

          res.status(200).json(recentCommunities);
    }catch(error){
        console.error("Error retreiving communities:", error);
        res.status(500).json({message : "Internal server error"})


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
                            title: true,
                            description: true,
                            order: true
                        }

                    },
                    flair: {
                         select: {
                            name: true,
                         }
                    },
                    post: {
                        select: {
                            title: true,
                            content: true,
                            contentType: true,
                            flair: {
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
                flair: community.flair,
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

// Type for the complete community response
