import type { ReactNode } from 'react';

type BadgeVariant = 'subtle' | 'brand' | 'success';

export function Badge({ children, variant = 'subtle' }: { children: ReactNode; variant?: BadgeVariant }) {
  return <span className={`ui-badge ui-badge--${variant}`}>{children}</span>;
}
