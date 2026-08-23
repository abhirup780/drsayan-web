import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { getAllPosts } from "@/lib/blog";

export function BlogPreview({ index = "06" }: { index?: string }) {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line py-16 sm:py-24 lg:py-32">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            index={index}
            eyebrow="The Blog"
            title="Written between clinics."
            lede="Long-form notes for parents on the questions that come up most often. Written carefully, dated honestly, and revised when the evidence moves."
            className="max-w-2xl"
          />
          <Cta href="/blog" variant="outline" className="mb-2">
            All articles
          </Cta>
        </div>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {posts.map((post, i) => (
            <RevealItem key={post.slug} className="bg-paper p-7 sm:p-8">
              <PostCard post={post} priorityIndex={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
