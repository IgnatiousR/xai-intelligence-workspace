import { motion, AnimatePresence } from "motion/react";
import OverviewTab from "./tabs/OverviewTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import RecentTab from "./tabs/RecentTab";
import DataSourcesTab from "./tabs/DataSourcesTab";
import AnalysisTab from "./tabs/AnalysisTab";
import InsightsTab from "./tabs/InsightsTab";
import AutomationsTab from "./tabs/AutomationsTab";
import SecurityTab from "./tabs/SecurityTab";

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.3 },
};

interface DashboardContentProps {
  sidebar: string;
  tab: string;
}

const components: Record<string, Record<string, React.ComponentType> | React.ComponentType> = {
  overview: {
    overview: OverviewTab,
    analytics: AnalyticsTab,
    recent: RecentTab,
  },
  sources: DataSourcesTab,
  analysis: AnalysisTab,
  insights: InsightsTab,
  auto: AutomationsTab,
  security: SecurityTab,
};

export function DashboardContent({ sidebar, tab }: DashboardContentProps) {

  let TabComponent: React.ComponentType | null = null;
  const section = components[sidebar];
  if (section) {
    if (sidebar === "overview" && typeof section === "object") {
      TabComponent = (section as Record<string, React.ComponentType>)[tab] || null;
    } else {
      TabComponent = section as React.ComponentType;
    }
  }

  if (!TabComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`${sidebar}-${tab}`} {...fade}>
        <TabComponent />
      </motion.div>
    </AnimatePresence>
  );
}
