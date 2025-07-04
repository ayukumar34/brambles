"use client";

// React
import { useEffect } from "react";

// Next.js
import { redirect } from "next/navigation";

// Custom Hooks
import { useUserSession } from "@/lib/hooks/useUserSession";

// `ModeToggle` Component
import { ModeToggle } from "@/components/mode-toggle";

// Lucide Icons
import { LoaderCircleIcon } from 'lucide-react';

export default function Home() {
  const { user, loading } = useUserSession();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/sign-in');
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircleIcon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ModeToggle />
    </div>
  );
}
