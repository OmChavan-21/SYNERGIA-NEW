"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: loginEmail || email,
      password: loginPassword || password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Please check your email and password.");
      setIsLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role === "TEACHER") {
        router.push("/dashboard/teacher");
      } else if (session?.user?.role === "STUDENT") {
        router.push("/dashboard/student");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-gray-200 bg-white">
        <CardHeader className="space-y-3 text-center pb-8 pt-8">
          <div className="mx-auto w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
            <span className="text-white font-extrabold text-3xl">S</span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900">Sign in to SYNERGIA</CardTitle>
          <CardDescription className="text-base text-gray-600 font-bold">
            Build Better Teams. Work Better Together.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              type="button" 
              className="w-full h-14 text-base bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all hover:scale-[1.02] shadow-md"
              onClick={() => handleLogin("teacher@college.edu", "password123")}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5" />}
              Try Teacher Demo
            </Button>
            <Button 
              type="button" 
              className="w-full h-14 text-base bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all hover:scale-[1.02] shadow-md"
              onClick={() => handleLogin("alice@college.edu", "password123")}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GraduationCap className="mr-2 h-5 w-5" />}
              Try Student Demo
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-600 font-bold tracking-widest">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-bold text-sm">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@college.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-900 font-bold text-sm">Password</Label>
                <a href="#" className="text-xs text-blue-700 hover:text-blue-800 hover:underline font-bold">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all h-11"
              />
            </div>
            {error && <p className="text-sm text-red-700 font-bold bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
            
            <Button type="submit" className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-black text-white shadow-md" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
            </Button>
            <div className="text-sm text-center text-gray-600 font-medium mt-4 pt-2 border-t border-gray-100">
              Don&apos;t have an account? <Link href="/signup" className="text-blue-700 font-bold hover:text-blue-800 hover:underline">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
