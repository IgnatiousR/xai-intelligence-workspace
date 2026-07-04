"use client";

import { useState } from "react";
import { DashboardTitleBar } from "./DashboardTitleBar";
import { DashboardContent } from "./DashboardContent";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import MetricCard from "./MetricCard";
import { metrics } from "@/data/dashboard";



export default function DashboardWindow() {
  const [sidebar, setSidebar] = useState("overview");
  const [tab, setTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showTabs = sidebar === "overview";

  return (
    <div className="rounded-2xl border border-bdr bg-card overflow-hidden shadow-2xl shadow-black/50">
      <DashboardTitleBar onMobileMenuOpen={() => setMobileMenuOpen(true)} />

      <div className="flex sm:h-170 md:h-150 relative overflow-hidden">
        <Sidebar
          active={sidebar}
          onActiveChange={setSidebar}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Metric cards - only on overview */}
          {sidebar === "overview" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {metrics.map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
          )}

          {/* Tabs - only on overview */}
          {showTabs && <TabBar active={tab} onChange={setTab} />}

          <DashboardContent sidebar={sidebar} tab={tab} />
        </div>
      </div>
    </div>
  );
}
