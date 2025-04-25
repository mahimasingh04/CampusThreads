
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-2xl font-bold">
              <span className="text-white">CAMPUS</span>
              <span className="text-indigo-400">Threads</span>
            </h2>
            <p className="text-slate-300 max-w-xs">
              Building stronger university communities through meaningful online interactions.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-white">Platform</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Universities
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-base font-medium text-white">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-white">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-base font-medium text-white">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-slate-300 hover:text-white">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-base text-slate-400 xl:text-center">
            &copy; {new Date().getFullYear()} CAMPUSThreads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;