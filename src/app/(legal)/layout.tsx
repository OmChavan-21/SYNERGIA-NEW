"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, Cookie, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4 mr-2" /> },
    { href: "/terms", label: "Terms & Conditions", icon: <FileText className="w-4 h-4 mr-2" /> },
    { href: "/cookies", label: "Cookie Policy", icon: <Cookie className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">SYNERGIA Legal Center</h1>
        <p className="text-lg text-gray-500">Information about our policies, terms, and data practices.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <Card className="sticky top-24 shadow-sm border-gray-200">
            <CardContent className="p-4 flex flex-col space-y-1">
              {links.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
          {children}
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-start bg-amber-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> This document is a product draft designed for a hackathon prototype. 
              It must be reviewed by qualified legal counsel before public or commercial deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
