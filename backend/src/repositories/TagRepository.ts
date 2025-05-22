import { PrismaClient } from '@prisma/client';
import { TagDetail } from '../types/TagTypes';


const prisma = new PrismaClient();

export const tagsByCommunityId = async (communityId: string) : Promise<TagDetail[]> => {
    return await prisma.tag.findMany({
         where: {
      communityId: communityId
    },
    select: {
      id: true,
      name: true,
      description: true,
      isPublic: true,
     // Exclude accessCode for security unless needed
    },

    orderBy : {
        name: 'asc'
    }
    })
}