import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slot 5 & 6: NestJS & Next.js REST API with Prisma & PostgreSQL',
  description: 'Integration Demo: Slot 5 (NestJS + Prisma) and Slot 6 (Next.js REST API + Prisma + PostgreSQL)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
