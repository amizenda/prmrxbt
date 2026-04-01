import Link from "next/link";

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

export default function ContactPage() {
  return (
    <section id="contact" className="min-h-screen w-full py-24 px-8 md:px-16 flex items-center">
      <div className="max-w-[1280px] mx-auto w-full">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* LEFT: Info */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <span className="font-label text-xs tracking-[0.10em] text-primary uppercase font-medium">
                Get in Touch
              </span>
              <h2 className="font-[Space_Grotesk] text-[3rem] font-bold text-on-surface mt-3 font-headline leading-tight">
                Let&apos;s<br/>Connect
              </h2>
              <div className="mt-4 w-16 h-1 bg-primary/20 rounded-full" />
            </div>

            <p className="font-body text-on-surface-variant leading-[1.7]">
              Open to backend roles, infrastructure projects, and interesting engineering problems. Whether you have a role in mind or just want to connect — my inbox is open.
            </p>

            {/* Contact links */}
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:nguyentrungnam01n@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wide">Email</p>
                  <p className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">
                    nguyentrungnam01n@gmail.com
                  </p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/amizenda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <GitHubIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wide">GitHub</p>
                  <p className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">
                    @amizenda
                  </p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/amizenda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <LinkedInIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wide">LinkedIn</p>
                  <p className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">
                    @amizenda
                  </p>
                </div>
              </a>
            </div>

            {/* Closing line */}
            <blockquote className="border-l-4 border-primary/30 pl-6 py-2">
              <p className="font-[Space_Grotesk] text-sm font-medium text-on-surface-variant italic font-headline leading-relaxed">
                &ldquo;Ayez confiance en la suite, car vous en êtes l&apos;auteur.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* RIGHT: Contact card */}
          <div className="md:col-span-7 flex items-center">
            <div className="glass rounded-lg p-10 w-full">
              <h3 className="font-[Space_Grotesk] text-2xl font-bold text-on-surface mb-2 font-headline">
                Send a message
              </h3>
              <p className="font-body text-sm text-on-surface-variant mb-8">
                The fastest way to reach me is directly by email.
              </p>

              <a
                href="mailto:nguyentrungnam01n@gmail.com"
                className="w-full h-14 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-all duration-300 font-label text-sm tracking-widest uppercase font-semibold gap-3"
              >
                <MailIcon className="w-5 h-5" />
                nguyentrungnam01n@gmail.com
              </a>

              <div className="mt-8 pt-8 border-t border-outline/20 flex items-center justify-center gap-6">
                <a
                  href="https://github.com/amizenda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="GitHub"
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/amizenda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
