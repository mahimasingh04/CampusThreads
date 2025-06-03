import { Request, Response } from "express";
import { PrismaClient, ContentType } from "@prisma/client"; 
import { sendToUser, broadcastToPostRoom  } from "../utils/ws";

const prisma = new PrismaClient();

export const createCollabPost = async(req: Request, res: Response): Promise<void> => {
    try {
        // 1. Extract data from request body
        const { 
            eventName, 
            eventDate, 
            location, 
            communityId, 
            description,  // Fixed typo (was 'desription')
            rolesNeeded, 
            eventLink,
            totalSpots, 
            tags, 
            accessCode   // For private tags
        } = req.body;

        // 2. Authentication check
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // 3. Community validation
        const communityExists = await prisma.community.findUnique({
            where: { id: communityId }
        });
        if (!communityExists) {
            res.status(404).json({ error: 'Community not found' });
            return;
        }

        // 4. Tag validation
        if (!tags || tags.length === 0) {
            res.status(400).json({ error: "At least one tag is required" });
            return;
        }

        const tagName = tags;
        const tag = await prisma.tag.findUnique({
            where: { 
                name_communityId: { 
                    name: tagName, 
                    communityId 
                } 
            }
        });

        // 5. Handle tag not found
        if (!tag) {
            res.status(404).json({ error: `Tag '${tagName}' not found in this community` });
            return;
        }

        // 6. Private tag validation
        if (!tag.isPublic) {
            if (!accessCode) {
                res.status(403).json({ 
                    error: `Access code required for private tag '${tagName}'` 
                });
                return;
            }
            if (accessCode !== tag.accessCode) {
                res.status(403).json({ 
                    error: `Invalid access code for tag '${tagName}'` 
                });
                return;
            }
        }

        // 7. Create post and collaboration in transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create parent post
            const post = await prisma.post.create({
                data: {
                    title: eventName,
                    content: description,
                    contentType: ContentType.TEXT,
                    authorId: userId,
                    communityId,
                    tagId: tag.id,
                    isCollaboration: true,
                }
            });

            // Create collaboration post
            const collabPost = await prisma.collaborationPost.create({
                data: {
                    postId: post.id,
                    eventName,
                    eventDate: new Date(eventDate), // Convert to Date object
                    location: location || null,
                    eventLink: eventLink || null,
                    description,
                    totalSpots: parseInt(totalSpots),
                    spotsLeft: parseInt(totalSpots), // Initialize all spots available
                }
            });

            // Create required roles
            if (rolesNeeded && rolesNeeded.length > 0) {
                await prisma.rolesNeed.createMany({
                    data: rolesNeeded.map((role: string) => ({
                        name: role,
                        collabPostId: collabPost.id
                    }))
                });
            }

            return {
                postId: post.id,
                collabPostId: collabPost.id,
                message: "Collaboration post created successfully"
            };
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error("Error creating collaboration post:", error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
};


export const joinRequest = async(req: Request, res: Response) : Promise<void> => {
      const { postId } = req.params;
   const  userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      //check if spotsLeft > 0 or not 
      const post =  await prisma.collaborationPost.findUnique({
        where : {id: postId},
        include : {post: true}
      })
      if(!post) {
        res.status(404).json({error: 'Post not found'});
        return;
      }

      if(post.spotsLeft <=0 ) {
        res.status(400).json({error: "No spots left"});
        return;
      }
      
      //create request 
      const request  = await prisma.collaborationApplicant.create({
        data:{
            collaborationPostId : postId,
            userId: userId,
            status: 'PENDING'
        }
      })

      //create notification

      const notification = await prisma.notification.create({
        data: {
            userId: post.post.authorId, // Notify post owner
        type: 'JOIN_REQUEST',
        content: `New join request for ${post.post.title} from ${userId}`,
        relatedId: request.id
        }
      });

    sendToUser(post.post.authorId, {
    type: 'NEW_REQUEST',
    data: notification
    });
    res.status(201).json(request);

    }catch(error) {
        res.status(500).json({ error: 'Failed to create request' });
    }
}