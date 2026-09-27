import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">S</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">SYNERGIA</span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-4">
              Build Better Teams. Work Better Together. AI-powered matching and coaching for college group projects.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/login" className="hover:text-blue-600 transition-colors">Teacher Demo</Link></li>
              <li><Link href="/login" className="hover:text-blue-600 transition-colors">Student Demo</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal Center</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} SYNERGIA. A Hackathon Prototype.</p>
          <p className="text-xs text-gray-400 mt-4 md:mt-0 flex items-center">
            <Sparkles className="w-3 h-3 mr-1" /> Not for commercial use without legal review.
          </p>
        </div>
      </div>
    </footer>
  );
}
