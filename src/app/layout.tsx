import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenda — Backend Developer",
  description:
    "Backend Developer passionate about building scalable, clean systems. Vietnam, GMT+7.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zenda — Backend Developer",
    description: "Ayez confiance en la suite, car vous en êtes l'auteur.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
