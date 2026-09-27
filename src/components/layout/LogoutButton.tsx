"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  redirectTo?: string;
}

export function LogoutButton({
  className = "bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer",
  redirectTo = "/",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear session without triggering an external or absolute redirect from the server
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Signout error:", error);
    }
    // Safely redirect using a production-safe relative URL
    window.location.href = redirectTo;
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : null}
      Logout
    </Button>
  );
}
