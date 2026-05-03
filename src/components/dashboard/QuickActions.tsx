import Link from 'next/link';
import { QuickAction } from '@/mocks/dashboard';

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'search':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'package':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v10l-8 4m16-14l-8 4" />
          </svg>
        );
      case 'help':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#171717] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E5E5E5] hover:border-[#1886FF] hover:bg-[#E4F9FF] transition-all group text-center"
          >
            <div className="text-[#737373] group-hover:text-[#1886FF] mb-2 transition-colors">
              {getIcon(action.icon)}
            </div>
            <span className="text-xs font-semibold text-[#171717] group-hover:text-[#1886FF] transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
