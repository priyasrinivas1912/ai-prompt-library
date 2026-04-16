import PromptLib "lib/prompts";
import PromptsApi "mixins/prompts-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  let prompts = List.empty<PromptLib.Prompt>();
  let viewCounts = Map.empty<Nat, Nat>();

  include PromptsApi(prompts, viewCounts);
};
