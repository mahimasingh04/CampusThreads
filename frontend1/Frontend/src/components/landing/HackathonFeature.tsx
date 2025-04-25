
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HackathonFeature = () => {
  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
              Special Feature
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Find Your Perfect Hackathon Team
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              CAMPUSThreads makes it easy to assemble the ideal team for your next hackathon with specialized posts and real-time team building features.
            </p>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 rounded-full bg-indigo-100 p-1 text-indigo-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-3 text-base text-slate-600">
                  <strong className="font-medium text-slate-900">Real-time team formation</strong> - See available spots update as members join
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 rounded-full bg-indigo-100 p-1 text-indigo-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-3 text-base text-slate-600">
                  <strong className="font-medium text-slate-900">Skill matching</strong> - Specify required tech stacks and specializations
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 rounded-full bg-indigo-100 p-1 text-indigo-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-3 text-base text-slate-600">
                  <strong className="font-medium text-slate-900">Direct requests</strong> - Apply to join teams with one click
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 rounded-full bg-indigo-100 p-1 text-indigo-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-3 text-base text-slate-600">
                  <strong className="font-medium text-slate-900">Team composition control</strong> - Specify the number and roles of team members you need
                </span>
              </li>
            </ul>
            
            <div className="mt-8">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Find a Hackathon Team
              </Button>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-indigo-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">TechConnect Hackathon 2025</h3>
                    <Badge className="bg-white text-indigo-600">
                      Looking for members
                    </Badge>
                  </div>
                  <p className="text-indigo-100 mt-1">April 15-17, 2025 • BITS Pilani Campus</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-medium text-slate-900 mb-2">Team Information</h4>
                    <p className="text-slate-600">
                      Building an AI-powered campus navigation system that helps new students find their way around campus.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-slate-900 mb-2">Looking for:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-50">React Developer</Badge>
                      <Badge variant="outline" className="bg-green-50">UI/UX Designer</Badge>
                      <Badge variant="outline" className="bg-purple-50">ML Engineer</Badge>
                      <Badge variant="outline" className="bg-amber-50">Backend Developer</Badge>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-slate-900 mb-2">Team Composition:</h4>
                    <div className="flex gap-3">
                      <div className="text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 ring-4 ring-white">
                          <span className="text-lg font-medium text-indigo-600">3</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Spots left</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 ring-4 ring-white">
                          <span className="text-lg font-medium text-green-600">2</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Filled</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Apply to Join Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonFeature;