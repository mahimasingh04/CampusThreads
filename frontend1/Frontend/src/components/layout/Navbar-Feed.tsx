
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  PlusCircle, 
  Bell, 
  User,
  Search
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currentUserState } from '@/store/atom';

const NavbarFeed : React.FC = () => {
  const [currentUser] = useRecoilState(currentUserState);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg 
              className="w-8 h-8 mr-2 text-white" 
              viewBox="0 0 100 100"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" />
              <circle cx="50" cy="35" r="15" fill="currentColor" />
              <path d="M25 65C25 57.268 35.67 50 50 50C64.33 50 75 57.268 75 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-xl text-[#F97316]">CampusThreads</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search CampusThreads" 
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-slate-600"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <Link to="/chat">
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/create-post">
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-slate-800 text-white border-slate-700">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <div className="py-2 px-3 text-sm text-slate-300">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="overflow-hidden hover:bg-slate-700">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 text-white border-slate-700">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="hover:bg-slate-700">
                <Link to="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700">
                <Link to="/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="hover:bg-slate-700">
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavbarFeed;