import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/mockData/index";


const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    college: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    twitterUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success toast using sonner
    toast.success("Profile created!", {
      description: "Welcome! Your profile has been set up successfully.",
    });
    
    navigate('/profile');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-orange-500">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                <AvatarFallback className="text-2xl bg-slate-700">
                  {currentUser.username.charAt(0).toUpperCase() }
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-white">
              Complete Your Profile
            </CardTitle>
            <p className="text-slate-400 mt-2">
              Tell us about yourself to get started with your developer community experience
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="college" className="text-white">College/University</Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Your institution"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Tell us about yourself, your interests, and what you're working on..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-white">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="City, Country"
                  />
                </div>

              <div className="space-y-4">
                <Label className="text-white text-lg font-semibold">Social Links</Label>
                <p className="text-slate-400 text-sm">
                  Connect your professional profiles (optional)
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github" className="text-slate-300">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-slate-300">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolio" className="text-slate-300">Portfolio/Website</Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter" className="text-slate-300">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.twitterUrl}
                      onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/community-selection')}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Complete Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;