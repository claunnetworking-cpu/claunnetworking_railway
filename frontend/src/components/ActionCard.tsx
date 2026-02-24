import { LucideIcon } from 'lucide-react';
import { Link } from 'wouter';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export default function ActionCard({
  icon: Icon,
  title,
  description,
  href,
}: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border border-gray-100 hover:border-green-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 group-hover:bg-green-500 transition-colors">
                <Icon className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
