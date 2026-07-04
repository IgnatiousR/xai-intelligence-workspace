import { cn } from "@/lib/cn";

interface WowStageIndicatorProps {
  label: string;
  index: number;
  activeIndex: number;
  isLast: boolean;
}

export function WowStageIndicator({ label, index, activeIndex, isLast }: WowStageIndicatorProps) {
  const isCompleted = index < activeIndex;
  const isCurrent = index === activeIndex;

  return (
    <div className="flex items-center">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors duration-300",
          isCompleted
            ? "border-accent bg-accent text-bg"
            : isCurrent
              ? "border-accent text-accent"
              : "border-fg-m/30 text-fg-m/40"
        )}
      >
        {isCompleted ? "✓" : index + 1}
      </span>
      <span
        className={cn(
          "ml-2 whitespace-nowrap font-display text-[11px] font-medium transition-colors duration-300 sm:text-xs",
          isCompleted ? "text-fg-m" : isCurrent ? "text-fg" : "text-fg-m/40"
        )}
      >
        {label}
      </span>
      {!isLast && (
        <span
          className={cn(
            "mx-2 h-px w-5 shrink-0 transition-colors duration-300 sm:w-8",
            isCompleted ? "bg-accent/60" : "bg-fg-m/20"
          )}
        />
      )}
    </div>
  );
}
