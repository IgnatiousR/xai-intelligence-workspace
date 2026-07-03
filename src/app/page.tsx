import HeroSection from "@/components/hero/HeroSection";
import InsightFlowSection from "@/components/insight-flow/InsightFlowSection";
import DashboardSection from "@/components/dashboard/DashboardSection";
import WowSection from "@/components/wow-moment/WowSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <InsightFlowSection />
      <DashboardSection />
      <WowSection />
    </>
  );
}
