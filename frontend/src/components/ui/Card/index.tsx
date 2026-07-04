import type { ReactNode } from 'react';

interface Props { children: ReactNode; className?: string; onClick?: () => void; }

export default function Card({ children, className = '', onClick }: Props) {
  return (
    <div
      className={`rounded-lg border bg-white shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
