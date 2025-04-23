import React from 'react'
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from "@/components/ui/sonner";


import MainLayout from "./components/layout/Mainlayout";
import Feed from "./pages/Feed";


const queryClient = new QueryClient();

const App : React.FC = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
        <Sonner />
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Feed />} />
              
            </Route>
            
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </RecoilRoot>
);


export default App
