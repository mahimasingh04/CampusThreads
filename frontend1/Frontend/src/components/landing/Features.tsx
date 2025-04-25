
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "University-specific communities",
    description: "Join childThreads dedicated to your university or explore others. Connect with communities from BITS Pilani, KIIT, Manipal, Thapar, and more."
  },
  {
    title: "Club & Organization Tags",
    description: "Engage in discussions under specific tags representing clubs, departments, and organizations within your university."
  },
  {
    title: "Karma-based Participation",
    description: "Build reputation with valuable contributions. Higher karma provides more privileges within communities."
  },
  {
    title: "Community Moderation",
    description: "Become a moderator selected by community founders or seniors, and help maintain quality discussions."
  },
  {
    title: "Private & Public Content",
    description: "Create posts and tags accessible only to selected members with access codes, perfect for college-specific discussions."
  },
  {
    title: "Hackathon Team Building",
    description: "Find team members for hackathons with specialized posts showing real-time member requirements and tech stack needs."
  }
];

const Features = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Designed for Campus Life
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-slate-500 sm:mt-4">
            Everything you need to build meaningful university communities
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-slate-500">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;