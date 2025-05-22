
 
import { PrismaClient } from '@prisma/client';
import { CommunityWithDetails } from '../types/Community';

const prisma = new PrismaClient();

export const getCommunitiesWithDetails = async (): Promise<CommunityWithDetails[]> => {
   return  await prisma.community.findMany({
    include: {
      rules: {
        select : {
            id: true,
            order : true,
            title : true,
            description : true,
            communityId: true,
        }
      },
      tags: {
        select : {
           id: true,
           name : true,
           description: true,
           communityId: true,
           isPublic :  true,
           accessCode : true,
           createdBy: true,
        }
      },

    }
}) 
 
}

// Add other community-related queries as needed


