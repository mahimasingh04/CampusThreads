import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  CirclePlus, 
  BellPlus, 
  User, 
  LogOut,
  Search 
} from 'lucide-react';

interface NavIconProps {
  icon: React.ReactNode;
}

const NavIcon: React.FC<NavIconProps> = ({ icon }) => {
  return (
    <div className="bg-[#383B6E] p-2 rounded-lg text-white cursor-pointer transition-colors hover:bg-[#3635DF]">
      {icon}
    </div>
  );
};

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-[#383B6E] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">Reddit Clone</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full py-2 px-4 bg-[#383B6E] text-white placeholder-gray-300 rounded-full focus:outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <NavIcon icon={<MessageSquare className="h-5 w-5" />} />
                <Link to="/create-community">
                  <NavIcon icon={<CirclePlus className="h-5 w-5" />} />
                </Link>
                <Link to="/create-post">
                  <NavIcon icon={<BellPlus className="h-5 w-5" />} />
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="bg-[#383B6E] p-2 rounded-lg text-white cursor-pointer transition-colors hover:bg-[#3635DF] flex items-center"
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span className="text-sm">{user?.name || 'User'}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#383B6E] rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-white hover:bg-[#3635DF]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/saved-posts" 
                        className="block px-4 py-2 text-sm text-white hover:bg-[#3635DF]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Saved Posts
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3635DF]"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className="bg-[#3635DF] text-white px-4 py-2 rounded-md hover:bg-[#4F4DFF] transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-white text-[#3635DF] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
   