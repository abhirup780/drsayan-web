import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

import { Callout } from "./callout";

/**
 * Renders an article body. Authors get GitHub-flavoured Markdown plus a
 * small, deliberate set of components — anything beyond this belongs in a
 * component file, not in prose.
 */
const components = {
  Callout,

  a: ({ href = "", children, ...rest }: React.ComponentPropsWithoutRef<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },

  img: ({ src, alt = "" }: React.ComponentPropsWithoutRef<"img">) =>
    typeof src === "string" ? (
      <span className="my-8 block">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full rounded-xl"
          sizes="(max-width: 768px) 100vw, 44rem"
        />
        {alt && <span className="label mt-3 block">{alt}</span>}
      </span>
    ) : null,

  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          // smartypants gives authors real curly quotes and ellipses from
          // the straight ones they type. `dashes: false` is deliberate: the
          // house style avoids em dashes, so hyphens are left exactly as
          // written rather than being silently promoted into them.
          remarkPlugins: [remarkGfm, [remarkSmartypants, { dashes: false }]],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: { className: "heading-anchor", ariaHidden: true, tabIndex: -1 },
                content: { type: "text", value: "#" },
              },
            ],
          ],
        },
      }}
    />
  );
}
