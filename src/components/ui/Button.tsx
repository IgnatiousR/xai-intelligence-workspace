import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-display font-semibold rounded-xl px-6 py-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          variant === "primary" &&
            "bg-accent text-bg hover:brightness-110 shadow-accent-glow",
          variant === "secondary" &&
            "border border-bdr text-fg font-medium hover:border-fg-m",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
// fallow-ignore-next-line unused-type
export type { ButtonProps };
