"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import MetricCard from "./MetricCard";
import OverviewTab from "./tabs/OverviewTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import RecentTab from "./tabs/RecentTab";
import DataSourcesTab from "./tabs/DataSourcesTab";
import AnalysisTab from "./tabs/AnalysisTab";
import InsightsTab from "./tabs/InsightsTab";
import AutomationsTab from "./tabs/AutomationsTab";
import SecurityTab from "./tabs/SecurityTab";
import { metrics } from "@/data/dashboard";

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.3 },
};

export default function DashboardWindow() {
  const [sidebar, setSidebar] = useState("overview");
  const [tab, setTab] = useState("overview");

  const showTabs = sidebar === "overview";

  return (
    <div className="rounded-2xl border border-bdr bg-card overflow-hidden shadow-2xl shadow-black/50">
      {/* Title bar */}
      <div className="h-10 border-b border-bdr flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-critical" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-success" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-fg-m text-[11px] font-body">
            app.xai.ai/workspace
          </span>
        </div>
      </div>

      <div className="flex h-150">
        <Sidebar active={sidebar} onActiveChange={setSidebar} />
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

          {/* Content */}
          <AnimatePresence mode="wait">
            {sidebar === "overview" && tab === "overview" && (
              <motion.div key="overview" {...fade}>
                <OverviewTab />
              </motion.div>
            )}
            {sidebar === "overview" && tab === "analytics" && (
              <motion.div key="analytics" {...fade}>
                <AnalyticsTab />
              </motion.div>
            )}
            {sidebar === "overview" && tab === "recent" && (
              <motion.div key="recent" {...fade}>
                <RecentTab />
              </motion.div>
            )}
            {sidebar === "sources" && (
              <motion.div key="sources" {...fade}>
                <DataSourcesTab />
              </motion.div>
            )}
            {sidebar === "analysis" && (
              <motion.div key="analysis" {...fade}>
                <AnalysisTab />
              </motion.div>
            )}
            {sidebar === "insights" && (
              <motion.div key="insights" {...fade}>
                <InsightsTab />
              </motion.div>
            )}
            {sidebar === "auto" && (
              <motion.div key="auto" {...fade}>
                <AutomationsTab />
              </motion.div>
            )}
            {sidebar === "security" && (
              <motion.div key="security" {...fade}>
                <SecurityTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
