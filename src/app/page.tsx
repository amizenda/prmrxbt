import Link from "next/link";

// Social icon SVGs (inline, no external deps)
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid z-0" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-[1280px] px-12 flex items-center justify-center">
        <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* LEFT: Content */}
          <div className="md:col-span-7 flex flex-col space-y-8">

            {/* Architectural Lead */}
            <header className="space-y-4">
              <span className="font-[Inter] text-xs tracking-[0.10em] text-primary uppercase font-medium font-label">
                Backend Developer
              </span>
              <h1 className="font-[Space_Grotesk] text-[4rem] font-bold leading-none tracking-tight text-primary font-headline">
                Zenda
              </h1>
              <p className="text-xl text-on-surface-variant max-w-md leading-[1.6] font-body">
                Ayez confiance en la suite, car vous en êtes l&apos;auteur.
              </p>
            </header>

            {/* Glassmorphism bio card */}
            <div className="relative group">
              <div className="glass rounded-lg p-8">
                <p className="text-body-lg text-on-surface leading-[1.6] font-body">
                  Backend Developer passionate about building scalable, clean systems.
                  <span className="block mt-4 font-label text-[0.65rem] tracking-[0.10em] text-primary/60 uppercase">
                    Vietnam, GMT+7
                  </span>
                </p>
              </div>
            </div>

            {/* Social actions */}
            <nav className="flex items-center gap-4 flex-wrap">

              {/* GitHub */}
              <a
                href="https://github.com/amizenda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-12 px-5 flex items-center justify-center rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-all duration-300 gap-2 group"
              >
                <GitHubIcon className="w-5 h-5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/amizenda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-12 px-5 flex items-center justify-center rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-all duration-300 gap-2 group"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>

              {/* Email */}
              <a
                href="mailto:nguyentrungnam01n@gmail.com"
                aria-label="Email"
                className="h-12 px-8 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-all duration-300 gap-2"
              >
                <MailIcon className="w-4 h-4" />
                <span className="font-label text-[0.75rem] tracking-[0.08em] uppercase font-semibold">
                  Email
                </span>
              </a>
            </nav>

            {/* Nav links */}
            <div className="flex items-center gap-6 pt-2">
              <a href="#projects" className="font-label text-sm tracking-wide text-on-surface-variant hover:text-primary transition-colors">
                Projects
              </a>
              <a href="#about" className="font-label text-sm tracking-wide text-on-surface-variant hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="font-label text-sm tracking-wide text-on-surface-variant hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* RIGHT: Decorative portrait area */}
          <div className="hidden md:col-span-5 md:flex justify-end items-center relative">
            <div className="relative w-80 h-[480px] rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center group">
              {/* Abstract geometric node pattern */}
              <svg className="absolute inset-0 w-full h-full text-primary/10" fill="none" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="40" strokeDasharray="2 4" />
                <path d="M10 50 L90 50 M50 10 L50 90" strokeDasharray="1 2" />
                <rect height="50" strokeDasharray="4 2" width="50" x="25" y="25" />
                <circle cx="50" cy="50" r="20" />
                <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
                <line x1="10" y1="10" x2="90" y2="90" strokeDasharray="2 3" />
                <line x1="90" y1="10" x2="10" y2="90" strokeDasharray="2 3" />
              </svg>
              {/* Subtle accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
        <span className="font-label text-[0.65rem] tracking-[0.20em] uppercase text-on-surface-variant">Explore</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>

    </main>
  );
}
