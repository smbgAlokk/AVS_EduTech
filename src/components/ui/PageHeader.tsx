import type { ReactNode } from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  /** Module title — rendered uppercase, bold, italic */
  title: string;
  /** Optional subtitle — rendered uppercase, small, tracked-wide */
  subtitle?: string;
  /** Optional right-side content (date pills, action buttons, etc.) */
  rightContent?: ReactNode;
}

/**
 * Shared module header following the BharatForce design language.
 *
 * Renders a gradient background with ambient glow circles,
 * premium italic/uppercase title, and an optional right-side slot.
 *
 * Usage:
 * ```tsx
 * <PageHeader
 *   title="Attendance — Network"
 *   subtitle="Live oversight across 12 schools"
 *   rightContent={<DatePill />}
 * />
 * ```
 */
export default function PageHeader({ title, subtitle, rightContent }: PageHeaderProps) {
  return (
    <div className="ph">
      <div className="ph-inner">
        <div className="ph-left">
          <h1 className="ph-title">{title}</h1>
          {subtitle && <p className="ph-subtitle">{subtitle}</p>}
        </div>
        {rightContent && <div className="ph-right">{rightContent}</div>}
      </div>
    </div>
  );
}
