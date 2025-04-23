
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share, 
  Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const upvoteCount = post.upvoteCount - post.downvoteCount;
  
  return (
    <Card className="mb-4 bg-slate-800 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors">
      <div className="flex">
        {/* Vote sidebar */}
        <div className="flex flex-col items-center p-3 bg-slate-850 border-r border-slate-700">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-700 hover:text-white">
            <ThumbsUp className="h-5 w-5" />
          </Button>
          <span className="text-white font-medium py-1">{upvoteCount}</span>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-700 hover:text-white">
            <ThumbsDown className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Post content */}
        <div className="flex-1">
          <CardContent className="p-4">
            <div className="mb-2">
              <Link to={`/r/${post.communityName}`} className="text-sm text-slate-300 hover:underline">
                r/{post.communityName}
              </Link>
              <span className="mx-1 text-slate-500">•</span>
              <span className="text-sm text-slate-400">
                Posted by u/{post.authorName}
              </span>
            </div>
            
            <Link to={`/r/${post.communityName}/comments/${post.id}`}>
              <h3 className="text-xl font-bold text-white mb-2 hover:underline">
                {post.title}
              </h3>
            </Link>
            
            <p className="text-slate-300 mb-3">{post.summary}</p>
            
            {post.imageUrl && (
              <div className="mb-3 max-h-96 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full object-cover rounded-md"
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-slate-700 px-4 py-2">
            <div className="flex space-x-2 text-slate-300">
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-slate-700 hover:text-white">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{post.commentCount} Comments</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-slate-700 hover:text-white">
                <Share className="h-4 w-4 mr-1" />
                <span>Share</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-slate-700 hover:text-white">
                <Save className="h-4 w-4 mr-1" />
                <span>Save</span>
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
