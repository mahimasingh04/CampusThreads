import { Request, Response } from "express";

import { PrismaClient, Role } from "@prisma/client"; // Import PrismaClient

const prisma = new PrismaClient(); 


export const createCommunities = async(req: Request , res : Response): Promise<void> => {
     
    //people who are authenticated can create community
    //people can create commuity with diff name only

    try{

        const {name, description, rules }  = req.body
         const ownerId = req.userId

         if (!ownerId) {
            res.status(401).json({ message: "Unauthorized: User ID is missing" });
            return;
          }
          if (!name || !description || !rules) {
            res.status(400).json({ message: "Name, description, and rules are required" });
            return;
          }

         const existCommunity = await prisma.community.findUnique({
            where: { name }
        })

        if(existCommunity) {
            res.status(400).json({message : "Community with this name already exists"});
            return
        }

        // Create the community first
        const newCommunity = await prisma.community.create({
            data: {
                name,
                description,
                
                ownerId,
                rules
            }
        });

        // If flair is provided, create it as a relation
      

        // Update user role to MODERATOR
        await prisma.user.update({
            where: {
                 id: ownerId 
                },
            data :{
                role : 'MODERATOR'
            }
          });

        res.status(201).json({
            status: 'success',
            message: 'Community created successfully',
            data: newCommunity,
          });
    }catch(error) {
        console.error('Error creating community:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


}

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

        const newMembership = await prisma.userCommunity.create({
            data: {
                userId,
                communityId,
              },
        })
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

export const addTags = async(req: Request, res: Response): Promise<void> => {
    try {
        const { communityId } = req.params;
        const { tagName } = req.body;

        if (!tagName) {
            res.status(400).json({
                success: false,
                message: "Tag name is required"
            });
            return;
        }

        // Check if tag already exists in the community
        const existingTag = await prisma.flair.findFirst({
            where: {
                name: tagName,
                communityId: communityId
            }
        });

        if (existingTag) {
            res.status(400).json({
                success: false,
                message: "Tag already exists in this community"
            });
            return;
        }

        // Create new tag
        const newTag = await prisma.flair.create({
            data: {
                name: tagName,
                communityId: communityId
            }
        });

        res.status(201).json({
            success: true,
            message: "Tag added successfully",
            data: newTag
        });

    } catch (error) {
        console.error("Error adding tag:", error);
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



