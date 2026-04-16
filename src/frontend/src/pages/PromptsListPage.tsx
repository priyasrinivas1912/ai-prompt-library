import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPrompts } from "@/hooks/usePrompts";
import { type PromptWithViews, getComplexityLevel } from "@/types/prompt";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Layers, PlusCircle } from "lucide-react";

export default function PromptsListPage() {
  const { data: prompts, isLoading, isError } = useGetPrompts();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
              AI Prompt Library
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm">
              Browse, manage, and reuse your AI image generation prompts.
            </p>
          </div>
          <Button asChild className="shrink-0" data-ocid="prompts.add_button">
            <Link to="/add-prompt">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Prompt
            </Link>
          </Button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="prompts.loading_state"
          >
            {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
              <div key={key} className="card-elevated rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
                <div className="flex items-center justify-between pt-3 mt-2">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-10 text-center"
            data-ocid="prompts.error_state"
          >
            <div className="w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-xl">!</span>
            </div>
            <p className="text-destructive font-semibold text-base mb-1">
              Failed to load prompts
            </p>
            <p className="text-muted-foreground text-sm">
              Please try refreshing the page.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && prompts?.length === 0 && (
          <div
            className="rounded-xl border border-border bg-card p-16 text-center"
            data-ocid="prompts.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Layers className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              No prompts yet
            </h2>
            <p className="text-muted-foreground text-sm mb-7 max-w-xs mx-auto">
              Start building your library by creating your first AI image
              generation prompt.
            </p>
            <Button asChild data-ocid="prompts.empty_add_button">
              <Link to="/add-prompt">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add your first prompt
              </Link>
            </Button>
          </div>
        )}

        {/* Prompt grid */}
        {!isLoading && !isError && prompts && prompts.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="prompts.list"
          >
            {prompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id.toString()}
                prompt={prompt}
                index={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

interface PromptCardProps {
  prompt: PromptWithViews;
  index: number;
}

function complexityLabel(level: string, value: number): string {
  const label =
    level === "low" ? "Low" : level === "medium" ? "Medium" : "High";
  return `${label} • ${value}`;
}

function PromptCard({ prompt, index }: PromptCardProps) {
  const level = getComplexityLevel(prompt.complexity);
  const complexityVal = Number(prompt.complexity);

  const badgeClass =
    level === "low"
      ? "badge-success"
      : level === "medium"
        ? "badge-warning"
        : "badge-destructive";

  const formattedDate = new Date(
    Number(prompt.created_at) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className="card-elevated rounded-xl overflow-hidden flex flex-col group transition-smooth"
      data-ocid={`prompts.item.${index}`}
    >
      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 flex-1 min-w-0">
            {prompt.title}
          </h2>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold shrink-0 ${badgeClass}`}
          >
            {complexityLabel(level, complexityVal)}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {prompt.content}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
          <time dateTime={formattedDate}>{formattedDate}</time>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {Number(prompt.view_count)} views
          </span>
        </div>
      </div>

      {/* View Details footer */}
      <Link
        to="/prompts/$id"
        params={{ id: prompt.id.toString() }}
        className="flex items-center justify-between px-5 py-3 bg-muted/30 border-t border-border/40 text-xs font-medium text-primary hover:bg-muted/60 transition-colors duration-200"
        data-ocid={`prompts.view_link.${index}`}
      >
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </article>
  );
}
