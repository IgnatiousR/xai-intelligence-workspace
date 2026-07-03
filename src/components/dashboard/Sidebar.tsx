"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { sidebarItems } from "@/data/dashboard";

const icons: Record<string, ReactNode> = {
  overview: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  sources: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  ),
  analysis: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  insights: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  auto: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  security: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

interface SidebarProps {
  active: string;
  onActiveChange: (id: string) => void;
}

export default function Sidebar({ active, onActiveChange }: SidebarProps) {
  return (
    <div className="w-52 border-r border-bdr bg-bg-el/20 flex-shrink-0 hidden md:flex flex-col">
      <div className="p-3.5 border-b border-bdr">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-accent/15 flex items-center justify-center">
            <span className="text-accent text-[10px] font-bold">X</span>
          </div>
          <span className="font-display font-semibold text-xs">Workspace</span>
        </div>
      </div>
      <div className="flex-1 py-2.5 px-2 space-y-0.5 text-[13px] font-body">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onActiveChange(item.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              active === item.id
                ? "bg-accent/[.07] text-accent"
                : "text-fg-m hover:bg-accent/[.07] hover:text-accent"
            )}
          >
            {icons[item.id]}
            {item.label}
          </button>
        ))}
      </div>
      <div className="p-2.5 border-t border-bdr">
        <div className="flex items-center gap-2 px-1.5 py-1">
          <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
            <span className="text-accent text-[9px] font-bold">JD</span>
          </div>
          <div>
            <div className="text-[11px] font-medium leading-tight">
              Jane Doe
            </div>
            <div className="text-[9px] text-fg-m">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
