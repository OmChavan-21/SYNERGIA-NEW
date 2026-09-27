"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      alert("Signup successful. Please login.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-gray-200">
        <CardHeader className="space-y-3 text-center pb-6 pt-8">
          <div className="mx-auto w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
            <span className="text-white font-extrabold text-3xl">S</span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900">Create an account</CardTitle>
          <CardDescription className="text-base text-gray-600 font-bold">
            Join SYNERGIA to form better project teams
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900 font-bold text-sm">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="text-gray-900 font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-bold text-sm">College Email</Label>
              <Input id="email" type="email" placeholder="student@college.edu" value={email} onChange={e => setEmail(e.target.value)} required className="text-gray-900 font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-bold text-sm">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="text-gray-900 font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-900 font-bold text-sm">Role</Label>
              <select 
                id="role" 
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-700 font-bold bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <Button type="submit" className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-[1.02]">Sign Up</Button>
            <div className="text-sm text-center text-gray-600 font-medium mt-4">
              Already have an account? <Link href="/login" className="text-blue-700 font-bold hover:text-blue-800 hover:underline">Log in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
