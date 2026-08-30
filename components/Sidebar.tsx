"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users, Home, Activity, Gavel, Calendar, Trophy, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/students", label: "Students", icon: <Users size={20} /> },
    { href: "/houses", label: "Houses", icon: <Home size={20} /> },
    { href: "/sports", label: "Sports", icon: <Activity size={20} /> },
    { href: "/auction", label: "Auction", icon: <Gavel size={20} /> },
    { href: "/matches", label: "Matches", icon: <Calendar size={20} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card text-foreground shadow-sm border border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-center h-20 border-b border-border bg-background/50 shrink-0">
          <span className="text-3xl font-display font-black tracking-widest text-primary uppercase">HPL<span className="text-foreground">Auction</span></span>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/dashboard');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 transition-all relative overflow-hidden group
                  ${isActive ? "text-foreground bg-muted/80 font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"}
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary glow-primary" />
                )}
                <div className={`transition-transform duration-200 ${isActive ? "scale-110 text-primary" : "group-hover:scale-110"}`}>
                  {link.icon}
                </div>
                <span className="tracking-wide">{link.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border shrink-0 bg-background/50 flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          {mounted && (
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
