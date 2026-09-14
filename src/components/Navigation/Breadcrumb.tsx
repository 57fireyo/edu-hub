import React from 'react';
import { ChevronRight, Home, GraduationCap, Compass, Cog } from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export interface BreadcrumbItem {
  label: string;
  tab?: NavigationTab;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  category?: 'Academic Portal' | 'Community & Career' | 'System';
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  category = 'Academic Portal',
  items = [],
  className = '',
}) => {
  const { setActiveTab } = useApp();

  const getCategoryIcon = () => {
    switch (category) {
      case 'Academic Portal':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'Community & Career':
        return <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'System':
        return <Cog className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
      default:
        return <Home className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 py-1 px-1 overflow-x-auto select-none no-scrollbar ${className}`}
    >
      <button
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
        title="JDCOEM Connect Home"
      >
        <Home className="w-3 h-3 text-slate-400" />
        <span className="hidden sm:inline font-semibold">JDCOEM</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />

      <div className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 shrink-0">
        {getCategoryIcon()}
        <span>{category}</span>
      </div>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {item.onClick || item.tab ? (
              <button
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.tab) setActiveTab(item.tab);
                }}
                className={`truncate max-w-[150px] transition-colors cursor-pointer ${
                  isLast || item.active
                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                    : 'font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
                title={item.label}
              >
                {item.label}
              </button>
            ) : (
              <span
                className={`truncate max-w-[150px] ${
                  isLast || item.active
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'font-medium'
                }`}
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
