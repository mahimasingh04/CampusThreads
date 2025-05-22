import { Community, Rules, Tag, Post } from '@prisma/client';

export type TagDetail =  {
    id : string,
    name: string,
    description: string,
    isPublic: boolean

}