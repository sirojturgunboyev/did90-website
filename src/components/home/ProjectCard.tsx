import Link from "next/link";
import { SanityImg } from "../ui/SanityImg";
import type { ProjectCard as P } from "@/lib/queries";

export function ProjectCard({ project, href, size = "sm", invert = false }: { project: P; href: string; size?: "sm" | "lg"; invert?: boolean }) {
  return (
    <Link href={href} className="group flex flex-col gap-2">
      <div className={`relative overflow-hidden rounded-[8px] ${size === "lg" ? "aspect-[558/560]" : "aspect-[4/5]"}`}>
        <SanityImg
          image={project.cover}
          alt={project.title}
          width={size === "lg" ? 1200 : 700}
          sizes={size === "lg" ? "(min-width:1200px) 560px, 100vw" : "(min-width:1200px) 190px, 50vw"}
          className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(.44,0,.56,1)] group-hover:scale-[1.04]"
        />
      </div>
      <div className={`flex items-center justify-between text-small ${invert ? "text-white" : "text-black"}`}>
        <span>{project.title}</span>
        {size === "lg" && project.category && <span className="text-grey-01">{project.category}</span>}
      </div>
    </Link>
  );
}
