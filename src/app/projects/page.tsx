import Link from "next/link";

const projects = [
  {
    id: "duoc-linh-cac",
    name: "Dược Linh Các",
    tagline: "Traditional Vietnamese Medicine Knowledge Platform",
    description:
      "A comprehensive Vietnamese-language health education platform for Phòng khám Dược Linh Các. Built with Next.js (App Router) + TypeScript + Tailwind CSS, featuring SEO-optimized content pages, JSON-LD structured data, an admin CMS, and a NestJS backend with Prisma ORM. Supports full content management, lead capture, and multi-section information architecture covering diseases, services, herbal medicine, and blog posts.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "NestJS", "Prisma", "PostgreSQL"],
    github: "https://github.com/amizenda/Duoc_linh_cac",
    backend: "https://github.com/amizenda/duoclinhcac_be",
    color: "#2d7a3a",
    accent: "#d4edda",
  },
  {
    id: "uapblockchain",
    name: "UAP Blockchain",
    tagline: "Web3 Decentralized Application",
    description:
      "A blockchain-powered decentralized application deployed at uapblockchain.vercel.app. Built with a focus on transparency, decentralized identity, and on-chain governance. Demonstrates expertise in smart contract integration, Web3.js/Ethers.js, and modern frontend frameworks for the decentralized web.",
    tech: ["TypeScript", "Solidity", "Web3.js", "Next.js", "Vercel"],
    url: "https://uapblockchain.vercel.app",
    github: "https://github.com/amizenda/uapblockchain",
    color: "#2196F3",
    accent: "#e3f2fd",
  },
  {
    id: "prmrxbt",
    name: "PrmrXBT",
    tagline: "Real-time Analytics & Intelligence Terminal",
    description:
      "A real-time analytics dashboard and intelligence terminal for the Base ecosystem. Features live project tracking, narrative analysis, trending content, leaderboards, and ecosystem mapping. Built collaboratively by the GigaChad fleet. Includes a Stitch-powered design system, Tailwind CSS, and a modular component architecture.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Google Stitch", "MCP"],
    github: "https://github.com/amizenda/prmrxbt",
    color: "#0052FF",
    accent: "#dfe1ff",
  },
];

export default function ProjectsPage() {
  return (
    <section id="projects" className="min-h-screen w-full py-24 px-8 md:px-16">
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <span className="font-label text-xs tracking-[0.10em] text-primary uppercase font-medium">
            Selected Work
          </span>
          <h2 className="font-[Space_Grotesk] text-[3rem] font-bold text-on-surface mt-3 font-headline">
            Projects
          </h2>
          <div className="mt-4 w-16 h-1 bg-primary/20 rounded-full" />
        </div>

        {/* Project cards */}
        <div className="space-y-8">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="group relative bg-surface-container-lowest rounded-lg p-8 md:p-12 transition-all duration-300"
              style={{
                borderLeft: `4px solid ${project.color}`,
              }}
            >
              {/* Background accent */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 blur-3xl"
                style={{ backgroundColor: project.color }}
              />

              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Project info */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-[Space_Grotesk] text-2xl font-bold text-on-surface font-headline">
                      {project.name}
                    </h3>
                    <p className="font-label text-xs tracking-[0.08em] uppercase mt-1" style={{ color: project.color }}>
                      {project.tagline}
                    </p>
                  </div>
                  <p className="font-body text-on-surface-variant leading-[1.7] text-base">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-label text-[0.7rem] tracking-wide px-3 py-1 rounded-full uppercase"
                        style={{
                          backgroundColor: project.accent,
                          color: project.color,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-3 md:items-end justify-center">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-6 flex items-center justify-center rounded-full border border-outline/30 text-on-surface hover:border-primary hover:text-primary transition-all duration-200 font-label text-sm tracking-wide gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.backend && (
                    <a
                      href={project.backend}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-6 flex items-center justify-center rounded-full border border-outline/30 text-on-surface hover:border-primary hover:text-primary transition-all duration-200 font-label text-sm tracking-wide gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      Backend
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-6 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-all duration-200 font-label text-sm tracking-wide gap-2"
                    >
                      Live Site →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
