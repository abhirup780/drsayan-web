import GithubSlugger from "github-slugger";

import type { TocEntry } from "@/components/blog/table-of-contents";

/**
 * Extracts h2/h3 headings from raw MDX. Uses the same slugger as
 * `rehype-slug`, so the ids here always match the ids in the rendered HTML.
 */
export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();

  return markdown
    // Drop fenced code blocks so a commented "## " inside one is not picked up.
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .map((line) => /^(#{2,3})\s+(.+?)\s*$/.exec(line))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => {
      const text = match[2].replace(/[*_`]/g, "").trim();
      return {
        depth: match[1].length as 2 | 3,
        text,
        id: slugger.slug(text),
      };
    });
}
