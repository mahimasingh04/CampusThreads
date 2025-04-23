
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import NavbarFeed from './Navbar-Feed';
import Sidebar from './Sidebar';
import { 
  currentUserState, 
  joinedCommunitiesState, 
  recentCommunitiesState, 
  customFeedsState, 
  mockDataLoadedState,
  sidebarCollapsedState,
} from '@/store/atom';
import { initializeMockData } from '@/mockData';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed] = useRecoilState(sidebarCollapsedState);
  const [mockDataLoaded, setMockDataLoaded] = useRecoilState(mockDataLoadedState);
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setJoinedCommunities = useSetRecoilState(joinedCommunitiesState);
  const setRecentCommunities = useSetRecoilState(recentCommunitiesState);
  const setCustomFeeds = useSetRecoilState(customFeedsState);

  // Initialize mock data
  useEffect(() => {
    if (!mockDataLoaded) {
      const { user, communities, recentCommunities, customFeeds } = initializeMockData();
      setCurrentUser(user);
      setJoinedCommunities(communities);
      setRecentCommunities(recentCommunities);
      setCustomFeeds(customFeeds);
      setMockDataLoaded(true);
    }
  }, [mockDataLoaded]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <NavbarFeed />
      <Sidebar />
      <main className={`pt-14 transition-all duration-300 ${
        sidebarCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;