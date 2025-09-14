// "use client";
// import { useEffect, ReactNode } from "react";
// import { useRouter } from 'next/navigation';
// import { AppProps } from "next/app";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import React from 'react';

// import "../globals.css"; 
// import { useAuth } from "./hooks/useAuth";

// import { TooltipProvider } from "@radix-ui/react-tooltip";
// import { Toaster } from "./components/ui/toaster";
// import Landing from "../landing/page";
// import Dashboard from "../dashboard/page";
// import Journal from "../journal/page";
// import Chat from "../chat/page";
// import Analytics from "../analytics/page";
// import NotFound from "../not-found/page";




// const queryClient = new QueryClient();

// function MyApp({ Component, pageProps }: AppProps) {
//   const router = useRouter();

//   return (
//     <>
//       <TooltipProvider>
//         <Toaster />
//         <AuthRender router={router} pageProps={pageProps} />
//       </TooltipProvider>
//     </>
//   );
// }

// function AuthRender({ router, pageProps }: { router: any; pageProps: any }) {
//   const { isAuthenticated, isLoading } = useAuth(); 

//   // Redirect based on auth state
//   useEffect(() => {
//     if (!isLoading) {
// console.log("router",router.pathname)
//       if (!isAuthenticated && router.pathname !== "/") {
//         router.replace("/"); // landing for unauthenticated users
//       } else if (isAuthenticated && router.pathname === "/") {
//         router.replace("/dashboard"); 
//       }
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center space-y-4">
//           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }


//   const renderRoute = (): React.ReactNode => {
//     if (!isAuthenticated) return <Landing {...pageProps} />;

//     switch (router.pathname) {
//       case "/dashboard":
//         return <Dashboard {...pageProps} />;
//       case "/journal":
//         return <Journal {...pageProps} />;
//       case "/chat":
//         return <Chat {...pageProps} />;
//       case "/analytics":
//         return <Analytics {...pageProps} />;
//       default:
//         return <NotFound {...pageProps} />;
//     }
//   };

//   return <>{renderRoute()}</>;
// }


// export default MyApp;
