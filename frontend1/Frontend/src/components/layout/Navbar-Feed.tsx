
import { Link } from "react-router-dom";
import { Search, Bell, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/mockData/index";
import CreatePostDialog from "@/components/posts/createPostDialog"


const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-900 text-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-500">campusTHREADS</div>
          </Link>
        </div>

        <div className="flex-1 mx-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search communities, posts, and more..."
              className="w-full max-w-xl rounded-full bg-slate-800 pl-8 pr-4 focus:ring-orange-500 border-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          
          <CreatePostDialog />
          
          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800">
            <User className="h-5 w-5" />
          </Button>

          <Avatar className="h-8 w-8 border border-slate-700">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;