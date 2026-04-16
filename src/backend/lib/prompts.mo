import Types "../types/prompts";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type Prompt = Types.Prompt;
  public type PromptWithViews = Types.PromptWithViews;
  public type PromptError = Types.PromptError;
  public type Result = Types.Result;

  public func validate(title : Text, content : Text, complexity : Int) : ?PromptError {
    if (title.size() < 3) {
      return ?#InvalidTitle("Title must be at least 3 characters.");
    };
    if (content.size() < 20) {
      return ?#InvalidContent("Content must be at least 20 characters.");
    };
    if (complexity < 1 or complexity > 10) {
      return ?#InvalidComplexity("Complexity must be between 1 and 10.");
    };
    null;
  };

  public func create(
    prompts : List.List<Prompt>,
    nextId : Nat,
    title : Text,
    content : Text,
    complexity : Int,
  ) : (Prompt, Nat) {
    let prompt : Prompt = {
      id = nextId;
      title = title;
      content = content;
      complexity = complexity;
      created_at = Time.now();
    };
    prompts.add(prompt);
    (prompt, nextId + 1);
  };

  public func getAll(
    prompts : List.List<Prompt>,
    viewCounts : Map.Map<Nat, Nat>,
  ) : [PromptWithViews] {
    prompts.map<Prompt, PromptWithViews>(func(p) { withViewCount(p, viewCounts) }).toArray();
  };

  public func getById(
    prompts : List.List<Prompt>,
    viewCounts : Map.Map<Nat, Nat>,
    id : Nat,
  ) : Result {
    switch (prompts.find(func(p : Prompt) : Bool { p.id == id })) {
      case (?p) { #ok(withViewCount(p, viewCounts)) };
      case null { #err(#NotFound) };
    };
  };

  public func incrementViewCount(viewCounts : Map.Map<Nat, Nat>, id : Nat) : Nat {
    let current = switch (viewCounts.get(id)) {
      case (?v) { v };
      case null { 0 };
    };
    let next = current + 1;
    viewCounts.add(id, next);
    next;
  };

  public func withViewCount(prompt : Prompt, viewCounts : Map.Map<Nat, Nat>) : PromptWithViews {
    let view_count = switch (viewCounts.get(prompt.id)) {
      case (?v) { v };
      case null { 0 };
    };
    { prompt with view_count = view_count };
  };
};
