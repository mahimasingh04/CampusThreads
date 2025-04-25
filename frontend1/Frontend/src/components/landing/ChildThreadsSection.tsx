
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const universities = [
  {
    name: "BITS Pilani",
    tagline: "Where innovation meets excellence",
    members: "5.2k",
    tags: ["Department of CS", "Quark", "GDG", "Conquest", "APOGEE"],
    color: "bg-blue-50 border-blue-200"
  },
  {
    name: "Manipal University",
    tagline: "Learning today, leading tomorrow",
    members: "4.8k",
    tags: ["TechTatva", "Revels", "IECSE", "IAESTE", "IEEE"],
    color: "bg-purple-50 border-purple-200"
  },
  {
    name: "KIIT University",
    tagline: "Knowledge, Innovation, Excellence",
    members: "3.9k",
    tags: ["KIIT Fest", "Robotics Society", "KSAC", "E-Cell"],
    color: "bg-amber-50 border-amber-200"
  },
  {
    name: "Thapar University",
    tagline: "In pursuit of excellence",
    members: "3.4k",
    tags: ["Saturnalia", "Exodia", "ACM", "Thapar MUN"],
    color: "bg-emerald-50 border-emerald-200"
  }
];

const ChildThreadsSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Discover childThreads
            </h2>
            <p className="mt-3 max-w-2xl text-xl text-slate-500">
              University-specific communities where students and faculty connect
            </p>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <Button>
              Explore All Universities
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {universities.map((uni, index) => (
            <Card key={index} className={`overflow-hidden ${uni.color} border`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{uni.name}</CardTitle>
                <CardDescription>{uni.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="mb-3 flex items-center text-sm text-slate-500">
                  <span className="font-medium text-slate-700">{uni.members}</span>
                  <span className="ml-1">members</span>
                </div>
                <ScrollArea className="h-20">
                  <div className="flex flex-wrap gap-2">
                    {uni.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="bg-white/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildThreadsSection;