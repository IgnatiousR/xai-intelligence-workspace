import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "px-2.5 py-1 rounded-md bg-bg-el border border-bdr text-[11px] text-fg-m font-body",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Tag.displayName = "Tag";

export { Tag };
// fallow-ignore-next-line unused-type
export type { TagProps };
