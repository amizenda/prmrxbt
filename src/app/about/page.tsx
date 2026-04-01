export default function AboutPage() {
  return (
    <section id="about" className="min-h-screen w-full py-24 px-8 md:px-16">
      <div className="max-w-[1280px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">

          {/* LEFT: Sticky label + tag */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <span className="font-label text-xs tracking-[0.10em] text-primary uppercase font-medium">
                About
              </span>
              <h2 className="font-[Space_Grotesk] text-[3rem] font-bold text-on-surface mt-3 font-headline leading-tight">
                Who<br/>I Am
              </h2>
              <div className="mt-4 w-16 h-1 bg-primary/20 rounded-full" />
            </div>

            {/* Location badge */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label text-xs text-on-surface-variant tracking-wide">
                Vietnam, GMT+7
              </span>
            </div>

            {/* Core values */}
            <div className="space-y-4 pt-4">
              {[
                { title: "Clean Architecture", desc: "Systems should be built to last, not just to ship." },
                { title: "Type Safety", desc: "TypeScript-first. Every type is a contract." },
                { title: "Backend Craft", desc: "APIs, databases, queues — the invisible layer that makes things work." },
              ].map((v) => (
                <div key={v.title} className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-[Space_Grotesk] text-sm font-semibold text-on-surface font-headline">
                    {v.title}
                  </h4>
                  <p className="font-body text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Bio */}
          <div className="md:col-span-8 space-y-8">
            <div className="glass rounded-lg p-8">
              <p className="font-body text-lg text-on-surface leading-[1.8]">
                <span className="font-[Space_Grotesk] font-bold text-primary text-xl">
                  Backend Developer
                </span>
                {" "}with a focus on building reliable, scalable systems. I work across the full stack but my core strength is the server side — API design, database architecture, and the infrastructure that keeps applications running under real-world load.
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-body text-on-surface-variant leading-[1.7]">
                I build tools and platforms that solve real problems. Whether it&apos;s a traditional medicine knowledge platform connecting patients with authoritative health information, or a blockchain-powered decentralized application exploring new web3 paradigms — I approach each project with the same discipline: understand the domain deeply, design for maintainability, and ship code I&apos;d be proud to maintain years later.
              </p>
              <p className="font-body text-on-surface-variant leading-[1.7]">
                The tagline of this portfolio — <em>&ldquo;Ayez confiance en la suite, car vous en êtes l&apos;auteur.&rdquo;</em> — captures my philosophy. Have confidence in what comes next, because you are the author of it. Good software is written by people who take ownership of the entire lifecycle, not just the happy path.
              </p>
            </div>

            {/* Stack */}
            <div>
              <h3 className="font-[Space_Grotesk] text-lg font-bold text-on-surface mb-5 font-headline">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Node.js", "TypeScript", "Next.js", "NestJS",
                  "Prisma", "PostgreSQL", "Tailwind CSS",
                  "Solidity", "Web3.js", "REST APIs", "Git",
                ].map((s) => (
                  <span
                    key={s}
                    className="font-label text-xs tracking-wide px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant uppercase hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="glass rounded-lg p-6 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-label text-sm font-semibold text-on-surface uppercase tracking-wide">
                  Open to opportunities
                </p>
                <p className="font-body text-sm text-on-surface-variant mt-1">
                  Interested in backend roles, infrastructure projects, and interesting problems.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
