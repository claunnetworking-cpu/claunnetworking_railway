import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  onClick,
  className = ''
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left border-2 border-dashed border-primary/20 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-primary font-semibold text-sm md:text-base mb-2">{title}</p>
          <p className="text-4xl md:text-5xl font-bold text-primary">{value}</p>
          {subtitle && <p className="text-gray-600 text-xs md:text-sm mt-2">{subtitle}</p>}
        </div>
        <div className="text-secondary text-3xl md:text-4xl">{icon}</div>
      </div>
    </button>
  );
}
