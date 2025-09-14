"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Brain,
  Bell,
  Home,
  BookOpen,
  MessageCircle,
  BarChart3,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useIsMobile } from "../hooks/use-mobile";

export default function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/chat", label: "AI Companion", icon: MessageCircle },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-primary mr-3" />
                <span className="text-xl font-bold text-foreground">
                  MindSpace
                </span>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`${isActive(item.path)
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                        } transition-colors`}
                      data-testid={`nav-${item.label
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                {(user as any)?.profileImageUrl ? (
                  <img
                    src={(user as any).profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-profile-avatar"
                  />
                ) : (
                  <div
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    data-testid="div-profile-placeholder"
                  >
                    <span className="text-primary-foreground text-sm font-medium">
                      {(user as any)?.firstName?.[0] ||
                        (user as any)?.email?.[0] ||
                        "U"}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = "/api/logout")}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom) */}
      {isMobile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`flex flex-col items-center p-2 ${isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground"
                      }`}
                    data-testid={`mobile-nav-${item.label
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs mt-1">
                      {item.label.split(" ")[0]}
                    </span>
                  </button>
                </Link>
              );
            })}
            <Button
              onClick={() => (window.location.href = "/api/logout")}
              className="flex flex-col items-center p-2 text-muted-foreground"
              data-testid="mobile-nav-profile"
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Button>
          </div>
        </nav>
      )}
    </>
  );
}
