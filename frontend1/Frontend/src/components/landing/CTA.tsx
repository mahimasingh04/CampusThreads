
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div className="bg-indigo-600">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to join your campus community?</span>
          <span className="block text-indigo-200">Start connecting with CAMPUSThreads today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
              Get Started
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button variant="outline" size="lg" className="border-white bg-transparent text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;