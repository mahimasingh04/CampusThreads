
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="sr-only">CAMPUSThreads</span>
              <div className="h-8 w-8 bg-indigo-600 rounded-full mr-2"></div>
              <span className="text-xl font-bold">
                <span className="text-slate-900">CAMPUS</span>
                <span className="text-indigo-600">Threads</span>
              </span>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              <Link to="#features" className="text-base font-medium text-slate-700 hover:text-indigo-600">
                Features
              </Link>
              <Link to="#how-it-works" className="text-base font-medium text-slate-700 hover:text-indigo-600">
                How It Works
              </Link>
              <Link to="#universities" className="text-base font-medium text-slate-700 hover:text-indigo-600">
                Universities
              </Link>
              <Link to="#" className="text-base font-medium text-slate-700 hover:text-indigo-600">
                Pricing
              </Link>
              {isAuthenticated && (
                <Link to="/feed" className="text-base font-medium text-indigo-600 hover:text-indigo-700">
                  Feed
                </Link>
              )}
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-700">Hi, {user?.name}</span>
                <Button variant="outline" className="text-indigo-600 border-indigo-600" onClick={logout}>
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" className="text-indigo-600 border-indigo-600" onClick={handleLoginClick}>
                  Log in
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSignupClick}>
                  Sign up
                </Button>
              </>
            )}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                to="#features"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Features
              </Link>
              <Link
                to="#how-it-works"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                How It Works
              </Link>
              <Link
                to="#universities"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Universities
              </Link>
              <Link
                to="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Pricing
              </Link>
              {isAuthenticated && (
                <Link
                  to="/feed"
                  className="block rounded-md px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Feed
                </Link>
              )}
            </div>
            <div className="border-t border-slate-200 pb-3 pt-4">
              <div className="flex items-center px-5">
                {isAuthenticated ? (
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={logout}>
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full text-indigo-600 border-indigo-600 mr-2"
                      onClick={handleLoginClick}
                    >
                      Log in
                    </Button>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleSignupClick}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingNavbar;