import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PromptWithViews {
    id: bigint;
    complexity: bigint;
    title: string;
    content: string;
    view_count: bigint;
    created_at: Timestamp;
}
export type Timestamp = bigint;
export type Result = {
    __kind__: "ok";
    ok: PromptWithViews;
} | {
    __kind__: "err";
    err: PromptError;
};
export type PromptError = {
    __kind__: "InvalidComplexity";
    InvalidComplexity: string;
} | {
    __kind__: "NotFound";
    NotFound: null;
} | {
    __kind__: "InvalidTitle";
    InvalidTitle: string;
} | {
    __kind__: "InvalidContent";
    InvalidContent: string;
};
export interface backendInterface {
    createPrompt(title: string, content: string, complexity: bigint): Promise<Result>;
    getPrompt(id: bigint): Promise<Result>;
    getPrompts(): Promise<Array<PromptWithViews>>;
}
