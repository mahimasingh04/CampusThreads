
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Tag, ThumbsUp } from "lucide-react";

const steps = [
  {
    title: "Join University childThreads",
    description: "Connect with your university's community or explore other campuses.",
    icon: Users,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Engage with Tagged Discussions",
    description: "Find conversations about specific clubs, events, or topics through tags.",
    icon: Tag,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Post & Comment",
    description: "Share ideas, ask questions, and discuss with fellow students and professors.",
    icon: MessageSquare,
    color: "bg-amber-100 text-amber-600"
  },
  {
    title: "Vote & Build Karma",
    description: "Upvote valuable content and build reputation within communities.",
    icon: ThumbsUp,
    color: "bg-emerald-100 text-emerald-600"
  }
];

const HowItWorks = () => {
  return (
    <div className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How CAMPUSThreads Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-slate-500 sm:mt-4">
            Building campus communities has never been easier
          </p>
        </div>

        <div className="mt-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;