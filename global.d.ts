export type AvailableTokens = "home" | "category" | "title";
export type Tokens = Array<AvailableTokens>;
export type Formats = Array<{ layout: string; tokens: Tokens }>;
export type Link = { url: string; title: string };
export type LinksByToken = Record<AvailableTokens, Link | Link[]>;

export interface Breadcrumb {
  homepage: {
    title: string;
  };
  formats: Formats;
}
