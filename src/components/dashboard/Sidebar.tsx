"use client";

// import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { sidebarItems } from "@/data/dashboard";
// import { SidebarIcons } from "./SidebarIcons";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  active: string;
  onActiveChange: (id: string) => void;
  collapsed: boolean;
  onCollapse: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ active, onActiveChange, collapsed, onCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <div className={cn(
        "border-r border-bdr flex-shrink-0 flex-col transition-all duration-200 z-50",
        "hidden md:flex bg-bg-el/20",
        collapsed ? "md:w-14" : "md:w-52",
        mobileOpen ? "flex absolute inset-y-0 left-0 w-64 bg-card shadow-2xl" : "hidden"
      )}>
        <div className="p-1.5 border-b border-bdr">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent/15 flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-[10px] font-bold">X</span>
            </div>
            {(!collapsed || mobileOpen) && <span className="font-display font-semibold text-xs">Workspace</span>}
            <button
              onClick={() => {
                if (mobileOpen && onMobileClose) onMobileClose();
                else onCollapse();
              }}
              className={cn(
                "p-1 rounded hover:bg-accent/[.07] text-fg-m hover:text-accent transition-colors flex-shrink-0",
                collapsed && !mobileOpen ? "mx-auto" : "ml-auto"
              )}
              title={collapsed && !mobileOpen ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed && !mobileOpen ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" className="md:hidden" />
                  <line x1="6" y1="6" x2="18" y2="18" className="md:hidden" />
                  <polyline points="15 18 9 12 15 6" className="hidden md:block" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 py-2.5 px-2 space-y-0.5 text-[13px] font-body">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              label={item.label}
              active={active === item.id}
              collapsed={collapsed}
              mobileOpen={mobileOpen}
              onClick={() => {
                onActiveChange(item.id);
                if (mobileOpen && onMobileClose) onMobileClose();
              }}
            />
          ))}
        </div>
        <SidebarProfile collapsed={collapsed} mobileOpen={mobileOpen} />
      </div>
    </>
  );
}
