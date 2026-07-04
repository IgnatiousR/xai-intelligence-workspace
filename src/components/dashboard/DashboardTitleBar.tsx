export function DashboardTitleBar({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
  return (
    <div className="h-10 border-b border-bdr flex items-center px-4 gap-2">
      <div className="flex gap-1.5 w-10">
        <div className="w-2.5 h-2.5 rounded-full bg-critical" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-success" />
      </div>
      <div className="flex-1 text-center">
        <span className="text-fg-m text-[11px] font-body">
          app.xai.ai/workspace
        </span>
      </div>
      <div className="w-10 flex justify-end md:hidden">
        <button
          onClick={onMobileMenuOpen}
          className="text-fg-m hover:text-accent transition-colors"
          aria-label="Open menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
