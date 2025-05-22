import { Community, Rules, Tag, Post } from '@prisma/client';

export type CommunityWithDetails = Community & {
  
  rules: Rules[];
  tags: Tag[];
 
};

