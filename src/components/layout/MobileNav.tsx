"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { navLinks } from "@/data/nav";
import { motion, AnimatePresence } from "motion/react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="text-fg-m hover:text-accent p-1 transition-colors"
        aria-label="Open mobile menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[100]"
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-bdr shadow-2xl z-[100] flex flex-col"
              >
                <div className="h-14 px-6 flex items-center border-b border-bdr justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                      <span className="text-bg font-display font-bold text-xs">X</span>
                    </div>
                    <span className="font-display font-semibold text-fg tracking-tight">
                      Xai
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-fg-m hover:text-accent p-1"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-fg-m hover:text-accent hover:bg-accent/[.07] font-body text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
