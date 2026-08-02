import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** `wide` for full-bleed editorial sections, `text` for reading columns. */
  width?: "default" | "wide" | "text";
  as?: "div" | "section" | "header" | "footer" | "article" | "nav";
};

const widths = {
  default: "max-w-6xl",
  wide: "max-w-[92rem]",
  text: "max-w-[44rem]",
};

export function Container({ children, className, width = "default", as: Tag = "div" }: Props) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8", widths[width], className)}>{children}</Tag>
  );
}
