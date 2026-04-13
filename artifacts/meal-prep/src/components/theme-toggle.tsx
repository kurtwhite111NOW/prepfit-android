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
      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
    >
      <div className="w-8 h-8 rounded-xl bg-sidebar-accent/80 border border-sidebar-border/60 flex items-center justify-center shadow-sm">
        {isDark
          ? <Sun size={17} className="text-amber-300" strokeWidth={2} />
          : <Moon size={17} className="text-primary" strokeWidth={2} />}
      </div>
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
