import React, { useState } from 'react';
import { Search, MessageSquare, Menu, BellPlus, CirclePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <nav className="bg-[#28264D] px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-white text-xl font-bold">MEMHACK</Link>
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
        <NavIcon icon={<MessageSquare className="h-5 w-5" />} />
        <Link to="/create-community">
          <NavIcon icon={<CirclePlus className="h-5 w-5" />} />
        </Link>
        <Link to="/create-post">
          <NavIcon icon={<BellPlus className="h-5 w-5" />} />
        </Link>
        <NavIcon icon={<Menu className="h-5 w-5" />} />
      </div>
    </nav>
  );
};

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

export default Navbar;
   