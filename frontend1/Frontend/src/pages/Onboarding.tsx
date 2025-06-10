
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/profile-setup');
  };

  const handleSkipAndJoinCommunities = () => {
    navigate('/community-selection');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            Complete Your Profile
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-2">
            Boost your experience by adding your details. You can skip for now and join communities, or complete your profile for personalized features.
          </p>
          <p className="text-orange-400 text-lg font-medium">
            Choose your next step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Complete Profile Option */}
          <Card className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-all duration-200 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                Complete Profile
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Add your details for a tailored experience.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <Button 
                onClick={handleCompleteProfile}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg w-full"
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          {/* Skip and Join Communities Option */}
          <Card className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-all duration-200 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                Skip and Join
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Jump right in and join communities now.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <Button 
                onClick={handleSkipAndJoinCommunities}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg w-full"
              >
                Skip and Join Communities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;