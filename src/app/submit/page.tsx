"use client";

/**
 * Submit Project — /submit
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState, type FormEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  description: string;
  category: string;
  website: string;
  twitter: string;
  telegram: string;
  github: string;
  docs: string;
  logoUrl: string;
  tags: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  website?: string;
}

const CATEGORIES = [
  { value: "DeFi", label: "DeFi" },
  { value: "Social", label: "Social" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "NFT", label: "NFT" },
  { value: "Gaming", label: "Gaming" },
  { value: "Governance", label: "Governance" },
  { value: "Bridges", label: "Bridges" },
  { value: "Identity", label: "Identity" },
  { value: "Tooling", label: "Tooling" },
  { value: "Other", label: "Other" },
];

// ─── Form field ────────────────────────────────────────────────────────────────

function FormField({
  label,
  id,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-center gap-1.5">
        <span className="text-xs font-label font-semibold text-on-surface uppercase" style={{ letterSpacing: "0.07em" }}>
          {label}
        </span>
        {required && <span className="text-[10px] text-red-500 font-label">*</span>}
      </label>
      {children}
      {hint && !error && (
        <span className="text-[10px] font-label text-outline" style={{ letterSpacing: "0.03em" }}>
          {hint}
        </span>
      )}
      {error && (
        <span className="text-[10px] font-label text-red-500 flex items-center gap-1" role="alert">
          <span className="material-symbols-outlined text-xs leading-none">error</span>
          {error}
        </span>
      )}
    </div>
  );
}

function TextInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 bg-surface-container border rounded-[2px] text-sm font-body text-on-surface placeholder:text-outline focus:outline-none transition-colors ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-outline-variant focus:border-primary"
      }`}
    />
  );
}

function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2.5 bg-surface-container border rounded-[2px] text-sm font-body text-on-surface placeholder:text-outline focus:outline-none transition-colors resize-none ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-outline-variant focus:border-primary"
      }`}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SubmitState = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM: FormData = {
  name: "",
  description: "",
  category: "",
  website: "",
  twitter: "",
  telegram: "",
  github: "",
  docs: "",
  logoUrl: "",
  tags: "",
  notes: "",
};

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  function update(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Project name is required";
    if (form.name.length > 60) newErrors.name = "Name must be 60 characters or fewer";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.description.length < 20) newErrors.description = "Description must be at least 20 characters";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.website.trim()) {
      newErrors.website = "Website URL is required";
    } else {
      try {
        new URL(form.website.startsWith("http") ? form.website : `https://${form.website}`);
      } catch {
        newErrors.website = "Please enter a valid URL";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState("submitting");
    await new Promise<void>((r) => setTimeout(r, 1800));
    setSubmitState("success");
  }

  function handleLogoUrlChange(url: string) {
    update("logoUrl", url);
    setLogoError(false);
    if (url.trim()) {
      // SSRF defence: enforce https:// and image/* content-type before rendering
      if (!url.startsWith("https://")) {
        setLogoError(true);
        setLogoPreview(null);
        return;
      }
      const img = new window.Image();
      img.onerror = () => { setLogoError(true); setLogoPreview(null); };
      img.onload = () => { setLogoPreview(url); setLogoError(false); };
      img.src = url;
    } else {
      setLogoPreview(null);
    }
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (submitState === "success") {
    return (
      <main className="min-h-screen bg-surface pb-20 lg:pb-0">
        <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl leading-none">send</span>
            <span className="font-headline font-black text-base text-on-surface">Submit Project</span>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 text-3xl leading-none">check_circle</span>
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <h1 className="font-headline font-black text-2xl text-on-surface">Submission Received</h1>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              <strong className="font-semibold">{form.name}</strong> has been submitted for review. Our team will verify and publish it within 24–48 hours.
            </p>
          </div>
          <div className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-5 w-full max-w-sm flex flex-col gap-3 text-left">
            {[
              { label: "Project", value: form.name },
              { label: "Category", value: form.category },
              { label: "Review ETA", value: "24–48 hours" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>{label}</span>
                <span className="font-label font-semibold text-sm text-on-surface">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitState("idle"); setForm(INITIAL_FORM); setLogoPreview(null); }}
            className="px-5 py-2.5 bg-primary text-white text-xs font-label font-semibold rounded-[2px] hover:opacity-90 transition-opacity"
            style={{ letterSpacing: "0.07em" }}
          >
            Submit Another Project
          </button>
        </div>
      </main>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">send</span>
          <span className="font-headline font-black text-base text-on-surface">Submit Project</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">Submit Project</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            Add your Base ecosystem project to the directory
          </p>
        </div>

        {/* Requirements notice */}
        <div className="border border-[#0052FF]/20 bg-primary/5 rounded-[2px] p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base leading-none">info</span>
            <span className="font-label text-xs font-semibold text-on-surface uppercase" style={{ letterSpacing: "0.07em" }}>
              Requirements
            </span>
          </div>
          <ul className="flex flex-col gap-0.5 pl-8 text-xs font-body text-on-surface-variant">
            {[
              "Project must be live or in active development on Base",
              "Valid website and at least one social link required",
              "No meme coins or purely speculative projects",
              "Submissions reviewed within 24–48 hours",
            ].map((req) => (
              <li key={req} className="flex items-start gap-1.5">
                <span className="text-primary leading-none mt-0.5 flex-shrink-0">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Logo URL + preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Logo URL" id="logoUrl" hint="Direct image URL (PNG/SVG, 200×200px recommended)">
              <TextInput
                id="logoUrl"
                type="url"
                value={form.logoUrl}
                onChange={handleLogoUrlChange}
                placeholder="https://example.com/logo.png"
              />
            </FormField>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-label font-semibold text-on-surface uppercase" style={{ letterSpacing: "0.07em" }}>
                Preview
              </span>
              <div className="w-full h-14 bg-surface-container border border-outline-variant rounded-[2px] flex items-center justify-center overflow-hidden">
                {logoPreview && !logoError ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-10 max-w-full object-contain"
                    onError={() => { setLogoError(true); setLogoPreview(null); }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-base leading-none">image</span>
                    <span className="text-[10px] font-label" style={{ letterSpacing: "0.05em" }}>
                      {logoError ? "Invalid URL" : "No logo"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project name */}
          <FormField label="Project Name" id="name" required error={errors.name} hint="Max 60 characters">
            <TextInput
              id="name"
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="e.g. Uniswap V4"
              error={errors.name}
            />
          </FormField>

          {/* Category */}
          <FormField label="Category" id="category" required error={errors.category}>
            <div className="relative">
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={`w-full px-3 py-2.5 bg-surface-container border rounded-[2px] text-sm font-body text-on-surface appearance-none focus:outline-none transition-colors cursor-pointer ${
                  errors.category ? "border-red-500" : "border-outline-variant focus:border-primary"
                }`}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-base leading-none pointer-events-none">
                expand_more
              </span>
            </div>
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            id="description"
            required
            error={errors.description}
            hint={`${form.description.length}/500 characters (min 20)`}
          >
            <TextArea
              id="description"
              value={form.description}
              onChange={(v) => update("description", v)}
              placeholder="Describe what your project does, its key features, and what makes it unique on Base…"
              rows={4}
              error={errors.description}
            />
          </FormField>

          {/* Tags */}
          <FormField
            label="Tags"
            id="tags"
            hint="Comma-separated, e.g. DEX, Lending, Stablecoin"
          >
            <TextInput
              id="tags"
              value={form.tags}
              onChange={(v) => update("tags", v)}
              placeholder="AMM, Lending, Hooks"
            />
          </FormField>

          {/* Website */}
          <FormField label="Website" id="website" required error={errors.website}>
            <TextInput
              id="website"
              type="url"
              value={form.website}
              onChange={(v) => update("website", v)}
              placeholder="https://example.com"
              error={errors.website}
            />
          </FormField>

          {/* Social links */}
          <div className="flex flex-col gap-4">
            <div className="border-t border-outline-variant/40 pt-4">
              <h2 className="font-label text-xs font-semibold text-on-surface uppercase mb-4" style={{ letterSpacing: "0.08em" }}>
                Social Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Twitter / X */}
                <FormField label="Twitter / X" id="twitter" hint="@handle or full URL">
                  <TextInput
                    id="twitter"
                    value={form.twitter}
                    onChange={(v) => update("twitter", v)}
                    placeholder="@projectname"
                  />
                </FormField>
                {/* Telegram */}
                <FormField label="Telegram" id="telegram" hint="@group or t.me link">
                  <TextInput
                    id="telegram"
                    value={form.telegram}
                    onChange={(v) => update("telegram", v)}
                    placeholder="@projectname"
                  />
                </FormField>
                {/* GitHub */}
                <FormField label="GitHub" id="github" hint="github.com/organization">
                  <TextInput
                    id="github"
                    value={form.github}
                    onChange={(v) => update("github", v)}
                    placeholder="github.com/project"
                  />
                </FormField>
                {/* Docs */}
                <FormField label="Documentation" id="docs" hint="Docs or litepaper URL">
                  <TextInput
                    id="docs"
                    value={form.docs}
                    onChange={(v) => update("docs", v)}
                    placeholder="https://docs.example.com"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Notes */}
          <FormField
            label="Additional Notes"
            id="notes"
            hint="Anything else we should know? Funding, team, notable partnerships…"
          >
            <TextArea
              id="notes"
              value={form.notes}
              onChange={(v) => update("notes", v)}
              placeholder="Tell us more about your team, roadmap, or what makes your project unique…"
              rows={3}
            />
          </FormField>

          {/* Terms notice */}
          <div className="flex items-start gap-2 p-3 border border-outline-variant/50 bg-surface-container-low rounded-[2px]">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-0.5 w-4 h-4 rounded-[2px] accent-primary flex-shrink-0 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs font-body text-on-surface-variant leading-relaxed cursor-pointer">
              I confirm that this project is built on or actively integrating Base, the information provided is accurate, and I have the authority to submit on behalf of the project.
            </label>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#003ec7] to-[#0052FF] text-white text-xs font-label font-bold uppercase rounded-[2px] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ letterSpacing: "0.1em" }}
            >
              {submitState === "submitting" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base leading-none">send</span>
                  Submit Project
                </>
              )}
            </button>
            {submitState === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-label" role="alert">
                <span className="material-symbols-outlined text-base leading-none">error</span>
                Submission failed. Please try again.
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Submissions reviewed by the Base Everything team</span>
          <span>24–48h review</span>
        </footer>
      </div>
    </main>
  );
}
