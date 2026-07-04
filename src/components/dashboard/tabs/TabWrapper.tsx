import { type ReactNode } from "react";

export interface TabColumn {
  label: string;
  className?: string;
}

export function TabWrapper({ children, columns }: { children: ReactNode; columns: TabColumn[] }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-bg-el overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-bdr text-fg-m text-[11px] font-body">
              {columns.map((col, i) => (
                <th key={i} scope="col" className={`text-left p-3 font-medium ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          {children}
        </table>
      </div>
    </div>
  );
}
