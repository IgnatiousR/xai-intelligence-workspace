import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/nav";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-bg/60 border-b border-bdr/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <span className="text-bg font-display font-bold text-xs">X</span>
          </div>
          <span className="font-display font-semibold text-fg tracking-tight">
            Xai
          </span>
          <span className="text-fg-m text-[11px] font-body ml-0.5 hidden sm:inline border border-bdr rounded px-1.5 py-0.5">
            Intelligence Workspace
          </span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-[13px] font-body text-fg-m">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-fg transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button
          variant="primary"
          className="px-4 py-1.5 text-[13px] rounded-lg"
          aria-label="Get started with Xai"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
}
