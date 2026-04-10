import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
  variant?: "sidebar" | "header";
}

export function ThemeToggle({ isDark, toggle, variant = "sidebar" }: ThemeToggleProps) {
  if (variant === "header") {
    return (
      <button
        onClick={toggle}
        aria-label="Toggle dark mode"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all"
      >
        {isDark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[11px] font-medium text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/40 transition-all"
    >
      <div className="w-6 h-6 rounded-lg bg-sidebar-accent/60 flex items-center justify-center">
        {isDark ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-sidebar-foreground/60" />}
      </div>
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
