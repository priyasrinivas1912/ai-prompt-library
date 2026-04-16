import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type Prompt = {
    id : Nat;
    title : Text;
    content : Text;
    complexity : Int;
    created_at : Timestamp;
  };

  public type PromptWithViews = {
    id : Nat;
    title : Text;
    content : Text;
    complexity : Int;
    created_at : Timestamp;
    view_count : Nat;
  };

  public type CreatePromptArgs = {
    title : Text;
    content : Text;
    complexity : Int;
  };

  public type PromptError = {
    #NotFound;
    #InvalidTitle : Text;
    #InvalidContent : Text;
    #InvalidComplexity : Text;
  };

  public type Result = {
    #ok : PromptWithViews;
    #err : PromptError;
  };
};
