import { createActor } from "@/backend";
import type { Result } from "@/backend.d";
import type { CreatePromptArgs, PromptWithViews } from "@/types/prompt";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetPrompts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PromptWithViews[]>({
    queryKey: ["prompts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrompts() as Promise<PromptWithViews[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPrompt(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Result>({
    queryKey: ["prompt", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getPrompt(id);
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: "always",
  });
}

export function useCreatePrompt() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Result, Error, CreatePromptArgs>({
    mutationFn: async ({ title, content, complexity }: CreatePromptArgs) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPrompt(title, content, BigInt(complexity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}
