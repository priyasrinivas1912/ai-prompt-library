import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPrompt } from "@/hooks/usePrompts";
import {
  type PromptResult,
  getComplexityLevel,
  getPromptErrorMessage,
} from "@/types/prompt";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Copy, Eye, Zap } from "lucide-react";
import { toast } from "sonner";

export default function PromptDetailPage() {
  const { id } = useParams({ from: "/prompts/$id" });
  const promptId = BigInt(id);
  const { data: result, isLoading, isError } = useGetPrompt(promptId);

  const typedResult = result as PromptResult | undefined;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back nav */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground -ml-2 gap-1.5"
            data-ocid="prompt-detail.back_button"
          >
            <Link to="/prompts">
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </Link>
          </Button>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-6" data-ocid="prompt-detail.loading_state">
            <div className="space-y-3">
              <Skeleton className="h-9 w-3/4 rounded-lg" />
              <div className="flex gap-3">
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-7 w-28 rounded-md" />
                <Skeleton className="h-7 w-24 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        )}

        {/* Network/fetch error */}
        {isError && (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-10 text-center space-y-2"
            data-ocid="prompt-detail.error_state"
          >
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-destructive font-semibold text-lg">
              Something went wrong
            </p>
            <p className="text-muted-foreground text-sm">
              There was a network issue loading this prompt. Please try again.
            </p>
            <Button variant="outline" asChild className="mt-4">
              <Link to="/prompts">Return to Library</Link>
            </Button>
          </div>
        )}

        {/* Backend error (e.g. NotFound) */}
        {!isLoading &&
          !isError &&
          typedResult &&
          typedResult.__kind__ === "err" && (
            <div
              className="rounded-xl border border-destructive/30 bg-destructive/10 p-10 text-center space-y-2"
              data-ocid="prompt-detail.error_state"
            >
              <p className="text-6xl font-display font-bold text-destructive/30 mb-2">
                404
              </p>
              <p className="text-destructive font-semibold text-lg">
                {getPromptErrorMessage(typedResult.err)}
              </p>
              <p className="text-muted-foreground text-sm">
                The prompt you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="outline" asChild className="mt-4">
                <Link to="/prompts">Browse All Prompts</Link>
              </Button>
            </div>
          )}

        {/* Success — prompt detail */}
        {!isLoading &&
          !isError &&
          typedResult &&
          typedResult.__kind__ === "ok" && (
            <article data-ocid="prompt-detail.card">
              {/* Header: title + complexity badge */}
              <div className="flex items-start gap-4 mb-6">
                <h1 className="text-3xl font-display font-bold text-foreground leading-tight flex-1 min-w-0">
                  {typedResult.ok.title}
                </h1>
                <ComplexityBadge
                  complexity={Number(typedResult.ok.complexity)}
                />
              </div>

              {/* Stat strip */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {/* Views — prominent */}
                <div className="card-elevated rounded-xl p-4 flex flex-col items-center gap-1 col-span-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-semibold">
                      Views
                    </span>
                  </div>
                  <span
                    className="text-2xl font-display font-bold text-foreground tabular-nums"
                    data-ocid="prompt-detail.view_count"
                  >
                    {Number(typedResult.ok.view_count).toLocaleString()}
                  </span>
                </div>

                {/* Complexity */}
                <div className="card-elevated rounded-xl p-4 flex flex-col items-center gap-1 col-span-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-semibold">
                      Complexity
                    </span>
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground tabular-nums">
                    {Number(typedResult.ok.complexity)}
                    <span className="text-base text-muted-foreground">/10</span>
                  </span>
                </div>

                {/* Created at */}
                <div className="card-elevated rounded-xl p-4 flex flex-col items-center gap-1 col-span-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-semibold">
                      Created
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center leading-snug">
                    {new Date(
                      Number(typedResult.ok.created_at) / 1_000_000,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Prompt content block */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                    Prompt Content
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(typedResult.ok.content);
                      toast.success("Prompt copied to clipboard");
                    }}
                    data-ocid="prompt-detail.copy_button"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap font-body text-[0.9375rem]">
                  {typedResult.ok.content}
                </p>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  asChild
                  className="text-muted-foreground hover:text-foreground gap-1.5"
                  data-ocid="prompt-detail.back_link"
                >
                  <Link to="/prompts">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Library
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(typedResult.ok.content);
                    toast.success("Prompt copied to clipboard");
                  }}
                  data-ocid="prompt-detail.copy_full_button"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
              </div>
            </article>
          )}
      </div>
    </Layout>
  );
}

function ComplexityBadge({ complexity }: { complexity: number }) {
  const level = getComplexityLevel(complexity);
  const badgeClass =
    level === "low"
      ? "badge-success"
      : level === "medium"
        ? "badge-warning"
        : "badge-destructive";
  const arrow = level === "high" ? "▼" : "▲";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold shrink-0 ${badgeClass}`}
      data-ocid="prompt-detail.complexity_badge"
    >
      {arrow} {complexity}
    </span>
  );
}
