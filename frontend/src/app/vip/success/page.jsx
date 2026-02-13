// Server component wrapper - exports route segment config
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import SuccessPageClient from './success-client';

export default function SuccessPage() {
  return <SuccessPageClient />;
}
