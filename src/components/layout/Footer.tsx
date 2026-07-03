const footerLinks = [
  { label: "Documentation", href: "#" },
  { label: "API Reference", href: "#" },
  { label: "Status", href: "#" },
  { label: "Privacy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-bdr py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <span className="text-bg font-display font-bold text-[10px]">
              X
            </span>
          </div>
          <span className="font-display font-semibold text-sm">
            Xai Intelligence Workspace
          </span>
        </div>
        <div className="flex items-center gap-5 text-fg-m text-[13px] font-body">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-fg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="text-fg-m text-[11px] font-body">
          Built with intention. Delivered with craft.
        </div>
      </div>
    </footer>
  );
}
