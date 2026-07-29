"use client";

import { getProject } from "@/src/data/projects";

export function CaseStudyContent({ projectId }: { projectId: string }) {
  const project = getProject(projectId);

  if (!project) {
    return <p className="text-sm text-[#6b6b6b]">Project not found.</p>;
  }

  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <div
          className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
          style={{ background: project.color }}
        >
          {project.role}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
          {project.title}
        </h2>
        <p className="text-sm text-[#6b6b6b]">{project.subtitle}</p>
      </header>

      <p className="text-[15px] leading-relaxed text-[#2a2a2a]">{project.summary}</p>

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8a8a]">
          Highlights
        </h3>
        <ul className="space-y-2">
          {project.highlights.map((item) => (
            <li
              key={item}
              className="rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-[#2a2a2a]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8a8a]">
          Tools
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs text-[#3a3a3a]"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
