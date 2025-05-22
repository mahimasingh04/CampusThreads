import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CommunityRule {
    order: number;
  title: string;
  description: string | null;
}

export const fetchCommunityRules = async(communityId: string) : Promise<CommunityRule[]> => {
  return await prisma.rules.findMany({
    where: {
      communityId: communityId
    },
    select: {
     order: true,
      title: true,
      description: true
    },
    orderBy: {
      title: 'asc'
    }
  });
}