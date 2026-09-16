import { ElementType, ReactNode } from 'react';

type Props = {
  /** Content to wrap. */
  children: ReactNode;
  /** Extra Tailwind classes to merge onto the container (e.g. for text-center). */
  className?: string;
  /** HTML element to render. Defaults to 'div'. */
  as?: ElementType;
};

/**
 * Shared page container.
 *
 * - max-width: 1600px (--bp-2xl), centred with mx-auto
 * - Horizontal padding scales with viewport:
 *     xs: 16px  (px-4)
 *     md: 24px  (md:px-6)
 *     xl: 40px  (xl:px-10)
 *
 * Usage:
 *   <Container>…content…</Container>
 *   <Container as="section" className="py-16">…</Container>
 *
 * Full-bleed sections (hero image, announcement bar) must be siblings of
 * Container, never children — they manage their own width independently.
 */
export default function Container({ children, className = '', as: Tag = 'div' }: Props) {
  return (
    <Tag className={`max-w-[1600px] mx-auto px-4 md:px-6 xl:px-10 ${className}`.trim()}>
      {children}
    </Tag>
  );
}
