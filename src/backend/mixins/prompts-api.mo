import Types "../types/prompts";
import PromptLib "../lib/prompts";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  prompts : List.List<PromptLib.Prompt>,
  viewCounts : Map.Map<Nat, Nat>,
) {
  public query func getPrompts() : async [Types.PromptWithViews] {
    PromptLib.getAll(prompts, viewCounts);
  };

  public func createPrompt(title : Text, content : Text, complexity : Int) : async Types.Result {
    switch (PromptLib.validate(title, content, complexity)) {
      case (?err) { #err(err) };
      case null {
        let nextId = prompts.size();
        let (prompt, _) = PromptLib.create(prompts, nextId, title, content, complexity);
        #ok(PromptLib.withViewCount(prompt, viewCounts));
      };
    };
  };

  public func getPrompt(id : Nat) : async Types.Result {
    switch (PromptLib.getById(prompts, viewCounts, id)) {
      case (#err(e)) { #err(e) };
      case (#ok(p)) {
        let view_count = PromptLib.incrementViewCount(viewCounts, id);
        #ok({ p with view_count = view_count });
      };
    };
  };
};
