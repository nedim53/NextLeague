// Layout for success page - prevents static generation
// This must be a server component (no 'use client' directive)
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function SuccessLayout({ children }) {
  return <>{children}</>;
}
