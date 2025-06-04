import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm border border-neutral-200 p-6 transition-all duration-200 hover:shadow-2xl hover:bg-white/95 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`text-neutral-700 ${className}`}>{children}</div>;
}
