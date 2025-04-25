
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-16 sm:py-24">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 sm:block lg:w-2/5">
        <div className="relative h-full">
          <svg
            className="absolute right-0 h-full w-48 translate-x-1/2 text-white fill-current"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <polygon points="0,0 100,0 50,100 0,100" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-[url('/images/campus-pattern.svg')] opacity-10" />
        </div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-xl">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold text-indigo-600">
              Beta Access
            </div>
            <div className="text-sm text-slate-600">Join the waitlist today</div>
          </div>
          
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block">CAMPUS</span>
            <span className="block text-indigo-600">Threads</span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-700">
            The Reddit-inspired community forum exclusively for universities. Connect with students, professors, and clubs from your campus and beyond.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              Learn More <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-10">
            <p className="text-sm text-slate-500">
              Already used by students from 50+ universities
            </p>
            <div className="mt-4 flex -space-x-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  style={{
                    backgroundColor: `hsl(${i * 60}, 70%, 80%)`,
                  }}
                />
              ))}
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 ring-2 ring-white">
                <span className="text-xs font-medium text-indigo-600">+40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;