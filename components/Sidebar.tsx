"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Users, Home, Activity, Gavel, Calendar, Trophy, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/students", label: "Students", icon: <Users size={20} /> },
    { href: "/houses", label: "Houses", icon: <Home size={20} /> },
    { href: "/sports", label: "Sports", icon: <Activity size={20} /> },
    { href: "/auction", label: "Auction", icon: <Gavel size={20} /> },
    { href: "/matches", label: "Matches", icon: <Calendar size={20} /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-sm border border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:block
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-border">
          <span className="text-xl font-bold text-primary">HPL Auction</span>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/dashboard');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors
                  ${isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
                `}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
