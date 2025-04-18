import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import CommunityPage from './pages/CreateCommForm';
import ErrorBoundary from './components/ErrorBoundary';


const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      
    
    <AuthProvider>
    <TooltipProvider>
      <Router>
        <div className="min-h-screen bg-[#28264D]">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              < Route path="/create-community" element={
                <ErrorBoundary>
                  <CommunityPage/>
                </ErrorBoundary> }/>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

                   
            </Routes>
          </main>
        </div>
        <Sonner/>
      </Router>
      </TooltipProvider>
    </AuthProvider>
    
    </QueryClientProvider>
  )
}

export default App
