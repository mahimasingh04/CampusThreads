import { sidebarCollapsedState, customFeedsState , joinedCommunitiesState, 
    recentCommunitiesState,} from '@/store/atom'
import React, {useState} from 'react'

import {Link} from 'react-router-dom'
import {useRecoilState} from 'recoil'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Home, MenuSquare, Plus, TrendingUp, User , ChevronDown, ChevronUp} from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {CustomFeed, Community} from '@/types'

const Sidebar : React.FC = () => {

    const [joinedCommunities] = useRecoilState<Community[]>(joinedCommunitiesState);
    const [recentCommunities] = useRecoilState<Community[]>(recentCommunitiesState);
    const [customFeeds] = useRecoilState<CustomFeed[]>(customFeedsState);
    
    const [sidebarCollapsed, setSidebarCollapsed] = useRecoilState(sidebarCollapsedState);
    const [customFeedOpen , setCustomFeedOpen] = useState(true);
    const [recentOpen, setRecentOpen] = useState(true);
    const [communitiesOpen, setCommunitiesOpen] = useState(true);
      return (
        <div className={`fixed top-14 left-0 bottom-0 bg-slate-800 transition-all duration-300 z-40 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
        } border-r border-slate-700`}
        >
            <div className="h-full flex flex-col">
                <div className="absolute -right-3 top-4">
                    <Button variant="outline"
                    size ="icon"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className ="h-6 w-6 rounded-full bg-slate-800 text-white  border-slate-700 hover:bg-slate-700">
                        {sidebarCollapsed ? <ChevronRight className="h-3 w-3"/> : <ChevronLeft className="h-3 w-3" />}
                    </Button>
                </div>
       <ScrollArea className="flex-1">
         <div className="p-3 space-y-3">

            {/* Main navigation */}
            <div className="space-y-1">
                <Link to ="/">
                <Button variant="ghost"
                className={`w-full justify-start text-white hover : bg-slate-700 $ {
                sidebarCollapsed ? 'justify-center p-2' : ''}`}>
                    <Home  className="h-5 w-5 mr-2" />
                    {!sidebarCollapsed && <span>Home</span>}
                    </Button></Link>

                    <Link to ="/popular">
                    <Button 
                    variant="ghost"
                    className={`w-full justify-start text-white hover :bg-slate-700 ${
                         sidebarCollapsed? 'justify-center p-2' : ''
                    } ` }
                    >
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {!sidebarCollapsed && <span>Popular</span>}
                        </Button>
                        </Link>

            </div>
            {/* Customm feeds*/}
            {!sidebarCollapsed ? (
                <Collapsible open={customFeedOpen}
                onOpenChange={setCustomFeedOpen}
               className="border-slate-700 rounded-md bg-slate-800"
               >
                <CollapsibleTrigger asChild >
                <Button
                variant ="ghost"
                className="w-full justify-between text-white hover: bg-slate-700 rounded-t-md rounded-b-none" >
                       <div className="flex items-center">
                        <MenuSquare className="h-5 w-5 mr-2" />
                        <span>CUSTOM FEEDS</span>
                       </div>
                </Button>
                
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 p-2">

                 {customFeeds.map((feed) => (
                    <Link key={feed.id} to={`/feed/${feed.id}`}>
                        <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-slate-700">
                            <MenuSquare className="h-4 w-4 mr-2"/>
                            <span className="truncate">{feed.name}</span>
                        </Button>
                    </Link>
                 ))}

<Link to="/create-custom-feed">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-primary hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Create Custom Feed</span>
                    </Button>
                  </Link>
                </CollapsibleContent>
               </Collapsible>
            ) : (
                <div className="text-center py-2">
                <Link to="/create-custom-feed">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-slate-700"
                  >
                    <MenuSquare className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
           
              {/* Recent Communities */}
              {!sidebarCollapsed ? (
              <Collapsible
                open={recentOpen}
                onOpenChange={setRecentOpen}
                className="border border-slate-700 rounded-md bg-slate-800"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-white hover:bg-slate-700 rounded-t-md rounded-b-none"
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      <span>RECENT</span>
                    </div>
                    {recentOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 p-2">
                  {recentCommunities.map((community) => (
                    <Link key={community.id} to={`/r/${community.name}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:bg-slate-700"
                      >
                        <div className="h-5 w-5 mr-2 rounded-full overflow-hidden">
                          <img 
                            src={community.avatarUrl} 
                            alt={community.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate">r/{community.name}</span>
                      </Button>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="text-center py-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-slate-700"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Communities */}
            {!sidebarCollapsed ? (
              <Collapsible
                open={communitiesOpen}
                onOpenChange={setCommunitiesOpen}
                className="border border-slate-700 rounded-md bg-slate-800"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-white hover:bg-slate-700 rounded-t-md rounded-b-none"
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      <span>COMMUNITIES</span>
                    </div>
                    {communitiesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 p-2">
                  <Link to="/create-community">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Create Community</span>
                    </Button>
                  </Link>
                  
                  {joinedCommunities.map((community) => (
                    <Link key={community.id} to={`/r/${community.name}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:bg-slate-700"
                      >
                        <div className="h-5 w-5 mr-2 rounded-full overflow-hidden">
                          <img 
                            src={community.avatarUrl} 
                            alt={community.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate">r/{community.name}</span>
                      </Button>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="text-center py-2">
                <Link to="/create-community">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-slate-700"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
         </div>
       </ScrollArea>
            </div>
        </div>
      )
}

export default Sidebar