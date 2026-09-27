import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border-b bg-white border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg leading-none">S</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">SYNERGIA</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-gray-800 font-bold hidden sm:block">
                  Hello, {session.user.name} <span className="px-2 py-0.5 ml-2 bg-gray-200 rounded-full text-xs text-gray-700 uppercase tracking-widest">{session.user.role}</span>
                </span>
                <Link href={session.user.role === 'TEACHER' ? '/dashboard/teacher' : '/dashboard/student'}>
                  <Button variant="ghost" className="font-bold text-gray-800 hover:text-black hover:bg-gray-100 transition-colors">Dashboard</Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button 
                    className="bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Logout
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-bold text-gray-800 hover:text-black hover:bg-gray-100 transition-colors">Log in</Button>
                </Link>
                <Link href="/login">
                  <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-105 active:scale-95">Try Demo</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
