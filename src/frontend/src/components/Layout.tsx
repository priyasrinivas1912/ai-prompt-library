import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, PlusCircle, Sparkles } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/prompts"
              className="flex items-center gap-2.5 group"
              data-ocid="nav.logo_link"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-lg font-semibold text-foreground tracking-tight">
                PromptVault
              </span>
            </Link>

            <nav
              className="flex items-center gap-1"
              aria-label="Main navigation"
            >
              <NavLink
                to="/prompts"
                active={
                  pathname === "/prompts" || pathname.startsWith("/prompts/")
                }
                icon={<BookOpen className="w-4 h-4" />}
                label="Library"
                ocid="nav.library_link"
              />
              <NavLink
                to="/add-prompt"
                active={pathname === "/add-prompt"}
                icon={<PlusCircle className="w-4 h-4" />}
                label="New Prompt"
                ocid="nav.add_prompt_link"
              />
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">{children}</main>

      <footer className="bg-card border-t border-border py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  ocid: string;
}

function NavLink({ to, active, icon, label, ocid }: NavLinkProps) {
  return (
    <Link
      to={to}
      data-ocid={ocid}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
