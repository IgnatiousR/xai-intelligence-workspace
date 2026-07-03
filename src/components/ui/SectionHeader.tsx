import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  label: string;
  heading: React.ReactNode;
  subtitle?: string;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ label, heading, subtitle, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("text-center", className)} {...props}>
        <p className="text-accent font-display text-sm font-semibold tracking-widest uppercase mb-4">
          {label}
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-fg mb-4">
          {heading}
        </h2>
        {subtitle && (
          <p className="text-fg-m font-body text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export { SectionHeader };
export type { SectionHeaderProps };
