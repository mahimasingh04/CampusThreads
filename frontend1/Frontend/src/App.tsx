

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage"
import Login from "./pages/SignIn1";
import SignUp from "./pages/SignUp1";
import CreateCommunity  from "./pages/CreateCommunity";
import { RecoilRoot } from "recoil";
import Feed from "./pages/Feed";
import MainLayout from "./components/layout/Mainlayout";
import ErrorBoundary from "./components/ErrorBoundary";
import Community from "./pages/Community";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Login/>} />
            <Route path="/signup" element={<SignUp />} />
           
  
            <Route
              element={
                <RecoilRoot>
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                
                </RecoilRoot>
              }
            >

              <Route
                path="/feed"
                element={
                  <ErrorBoundary>
                    <Feed />
                  </ErrorBoundary>
                }
              />
              <Route path="/create-community" element={<CreateCommunity />} />

              <Route
                path="/community/:identifier"
                element={
                  <ErrorBoundary>
                    <Community />
                  </ErrorBoundary>
                }
              />
      
              </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;