import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePrompt } from "@/hooks/usePrompts";
import { getComplexityLevel, getPromptErrorMessage } from "@/types/prompt";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormValues {
  title: string;
  content: string;
  complexity: number;
}

interface BackendFieldErrors {
  title?: string;
  content?: string;
  complexity?: string;
}

export default function AddPromptPage() {
  const navigate = useNavigate();
  const { mutateAsync: createPrompt, isPending } = useCreatePrompt();
  const [backendErrors, setBackendErrors] = useState<BackendFieldErrors>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<FormValues>({
    defaultValues: { title: "", content: "", complexity: 5 },
    mode: "onTouched",
  });

  const complexityVal = watch("complexity");
  const level = getComplexityLevel(Number(complexityVal));

  const complexityBadgeClass =
    level === "low"
      ? "badge-success"
      : level === "medium"
        ? "badge-warning"
        : "badge-destructive";

  const complexityTrackStyle = {
    "--track-pct": `${((Number(complexityVal) - 1) / 9) * 100}%`,
  } as React.CSSProperties;

  const onSubmit = async (values: FormValues) => {
    setBackendErrors({});
    try {
      const result = await createPrompt({
        title: values.title,
        content: values.content,
        complexity: Number(values.complexity),
      });

      if (result.__kind__ === "ok") {
        toast.success("Prompt saved to your library!");
        navigate({ to: "/prompts" });
      } else {
        const err = result.err;
        if (err.__kind__ === "InvalidTitle") {
          setBackendErrors({ title: err.InvalidTitle });
        } else if (err.__kind__ === "InvalidContent") {
          setBackendErrors({ content: err.InvalidContent });
        } else if (err.__kind__ === "InvalidComplexity") {
          setBackendErrors({ complexity: err.InvalidComplexity });
        } else {
          toast.error(getPromptErrorMessage(err));
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const titleError = errors.title?.message ?? backendErrors.title;
  const contentError = errors.content?.message ?? backendErrors.content;
  const complexityError =
    errors.complexity?.message ?? backendErrors.complexity;

  // Disable while submitting. Also disable after any field touched + form invalid,
  // so users get clear feedback without blocking first submission attempt.
  const hasInteracted = Object.keys(touchedFields).length > 0;
  const isSubmitDisabled = isPending || (hasInteracted && !isValid);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground -ml-2 gap-1.5"
            data-ocid="add-prompt.back_button"
          >
            <Link to="/prompts">
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </Link>
          </Button>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground tracking-tight">
            New Prompt
          </h1>
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
            Save a reusable AI generation prompt to your library. All fields are
            required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          data-ocid="add-prompt.form"
          noValidate
        >
          <div className="card-elevated rounded-xl p-6 space-y-6">
            {/* Title field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-foreground"
              >
                Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. Product Launch Strategist"
                autoComplete="off"
                data-ocid="add-prompt.title_input"
                {...register("title", {
                  required: "Title is required.",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters.",
                  },
                  onChange: () =>
                    setBackendErrors((p) => ({ ...p, title: undefined })),
                })}
                aria-invalid={!!titleError}
                aria-describedby={titleError ? "title-error" : undefined}
                className={
                  titleError
                    ? "border-destructive/70 focus-visible:ring-destructive/40 bg-destructive/5"
                    : ""
                }
              />
              {titleError && (
                <p
                  id="title-error"
                  role="alert"
                  className="text-xs text-destructive flex items-center gap-1 mt-0.5"
                  data-ocid="add-prompt.title_field_error"
                >
                  {titleError}
                </p>
              )}
            </div>

            {/* Content field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="content"
                  className="text-sm font-medium text-foreground"
                >
                  Prompt Content
                </Label>
                <span className="text-xs text-muted-foreground">
                  {watch("content").length} chars
                </span>
              </div>
              <Textarea
                id="content"
                placeholder="Describe the AI persona, task, tone, and context in detail..."
                rows={6}
                data-ocid="add-prompt.content_textarea"
                {...register("content", {
                  required: "Content is required.",
                  minLength: {
                    value: 20,
                    message: "Content must be at least 20 characters.",
                  },
                  onChange: () =>
                    setBackendErrors((p) => ({ ...p, content: undefined })),
                })}
                aria-invalid={!!contentError}
                aria-describedby={contentError ? "content-error" : undefined}
                className={`resize-none leading-relaxed ${
                  contentError
                    ? "border-destructive/70 focus-visible:ring-destructive/40 bg-destructive/5"
                    : ""
                }`}
              />
              {contentError && (
                <p
                  id="content-error"
                  role="alert"
                  className="text-xs text-destructive flex items-center gap-1 mt-0.5"
                  data-ocid="add-prompt.content_field_error"
                >
                  {contentError}
                </p>
              )}
            </div>

            {/* Complexity field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="complexity"
                  className="text-sm font-medium text-foreground"
                >
                  Complexity
                </Label>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${complexityBadgeClass}`}
                  data-ocid="add-prompt.complexity_badge"
                >
                  {complexityVal} / 10
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  id="complexity"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  data-ocid="add-prompt.complexity_input"
                  {...register("complexity", {
                    required: "Complexity is required.",
                    min: {
                      value: 1,
                      message: "Complexity must be between 1 and 10.",
                    },
                    max: {
                      value: 10,
                      message: "Complexity must be between 1 and 10.",
                    },
                    valueAsNumber: true,
                    onChange: () =>
                      setBackendErrors((p) => ({
                        ...p,
                        complexity: undefined,
                      })),
                  })}
                  style={complexityTrackStyle}
                  className="
                    w-full h-2 rounded-full appearance-none cursor-pointer
                    bg-muted accent-primary
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
                  "
                />
              </div>

              <div className="flex justify-between text-xs font-medium">
                <span className="text-green-400">1–3 · Simple</span>
                <span className="text-orange-400">4–7 · Moderate</span>
                <span className="text-red-400">8–10 · Complex</span>
              </div>

              {complexityError && (
                <p
                  id="complexity-error"
                  role="alert"
                  className="text-xs text-destructive"
                  data-ocid="add-prompt.complexity_field_error"
                >
                  {complexityError}
                </p>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              asChild
              data-ocid="add-prompt.cancel_button"
            >
              <Link to="/prompts">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="min-w-[120px]"
              data-ocid="add-prompt.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Prompt"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
