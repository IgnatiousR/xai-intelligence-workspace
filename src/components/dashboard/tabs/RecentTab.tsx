import DataTable from "../DataTable";
import { recentEvents } from "@/data/dashboard";

export default function RecentTab() {
  return <DataTable rows={recentEvents} />;
}
