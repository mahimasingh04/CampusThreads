import { Request, Response } from "express";
import { PrismaClient, ContentType } from "@prisma/client"; 
import { sendToUser, broadcastToPostRoom  } from "../utils/ws";
import { useRouteId } from "react-router/dist/lib/hooks";

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

export const handleRequest =  async(req: Request,res: Response) : Promise<void> => {
   const {requestId} = req.params
   const {status} = req.body
   const userId = req.userId

   try {
    const request= await prisma.collaborationApplicant.findUnique({
        where: {id: requestId},
        include: {
            collaborationPost:{
                include: {post: true}
            }
        }
    })

    if(!request) {
        res.status(404).json({error: 'Request not found'})
        return;
    }

    //verify your 
     if ( request?.collaborationPost.post.authorId === userId) {
     res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedRequest = await prisma.collaborationApplicant.update({
        where: {id: requestId},
        data : {status}
    });

    let updatedPost;
    if(status === 'ACCEPTED') {
        updatedPost = await prisma.collaborationPost.update({
            where: { id : request?.collaborationPostId},
            data: {
                filledSpots: {
                    increment: 1
                },
                spotsLeft:{decrement: 1}
            }
        });

        broadcastToPostRoom(request.collaborationPostId,{
            type: 'SPOTS_UPDATE',
            data: {
                filledSpots: updatedPost.filledSpots,
                spotsLeft: updatedPost.spotsLeft
            }
        });
    }

    //create Notifications for applicants 

    const notification = await prisma.notification.create({
        data : {
            userId: request.userId,
            type: status === 'ACCEPTED' ? 'REQUEST_ACCEPTED': 'REQUEST_REJECTED',
            content: `Your request was ${status.toLowerCase()}`,
            relatedId : request.id
        }
    });
    // Send notification to applicant
    sendToUser(request.userId, {
      type: 'REQUEST_UPDATE',
      data: notification
    });
    
    res.json({ request: updatedRequest, post: updatedPost });

   }catch(error) {
      res.status(500).json({error:'Failed to process'});
   }
};