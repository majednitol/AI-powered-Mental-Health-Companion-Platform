"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "./src/hooks/useAuth";
import { useRouter } from "next/navigation";
import Dashboard from "./dashboard/page";
import Journal from "./journal/page";
import Chat from "./chat/page";
import Analytics from "./analytics/page";
import Landing from "./landing/page";

interface AuthRenderProps {
  pageProps: any;
}

export default function AuthRender({ pageProps }: AuthRenderProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      console.log("Auth check:", { isLoading, isAuthenticated, user });

      if (!isAuthenticated) {
        router.replace("/");
      } else {
        if (router.pathname === "/") {
          router.replace("/dashboard"); // redirect authenticated users to /dashboard
        }
      }

      setRedirecting(false); // allow rendering after redirect decision
    }
  }, [isLoading, isAuthenticated, user, router]);
// useEffect(() => {
//     if (!isLoading) {
//       if (isAuthenticated && router.pathname === "/") {
//         router.replace("/dashboard"); // Authenticated users go to dashboard
//       } else if (!isAuthenticated && router.pathname !== "/") {
//         router.replace("/"); // Unauthenticated users go to landing
//       }
//     }
//   }, [isLoading, isAuthenticated, router]);
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // After redirecting, render pages based on path
  switch (router.pathname) {
    case "/dashboard":
      return <Dashboard {...pageProps} />;
    case "/journal":
      return <Journal {...pageProps} />;
    case "/chat":
      return <Chat {...pageProps} />;
    case "/analytics":
      return <Analytics {...pageProps} />;
    default:
      return <Landing {...pageProps} />;
  }
}
