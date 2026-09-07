import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Briefcase, PlusCircle } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path === '/find-crew' && location.pathname === '/crew-dashboard') || (path === '/jobs' && location.pathname === '/events') || (path === '/hire-crew' && location.pathname === '/organizers');
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: Home,
      active: isCurrent('/'),
    },
    {
      id: 'find-crew',
      label: 'Become Crew',
      path: '/find-crew',
      icon: Users,
      active: isCurrent('/find-crew'),
    },
    {
      id: 'book-event',
      label: 'Book Event',
      path: '/book-event',
      icon: PlusCircle,
      isHighlight: true,
      active: isCurrent('/book-event'),
    },
    {
      id: 'jobs',
      label: 'Jobs',
      path: '/jobs',
      icon: Briefcase,
      active: isCurrent('/jobs'),
    },
    {
      id: 'hire-crew',
      label: 'Hire Crew',
      path: '/hire-crew',
      icon: Calendar,
      active: isCurrent('/hire-crew'),
    },
  ];

  return (
    <div 
      id="mobile-bottom-nav" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isHighlight) {
            return (
              <Link
                key={item.id}
                id={`mobile-nav-${item.id}`}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5 focus:outline-none transition-transform active:scale-95"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  item.active 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-blue-500/30' 
                    : 'bg-gradient-to-tr from-blue-500 to-blue-600 text-white shadow-blue-500/25'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[11px] font-semibold mt-1 ${item.active ? 'text-blue-600' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              id={`mobile-nav-${item.id}`}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 min-w-[56px] ${
                item.active 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${item.active ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'}`} />
                {item.active && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight truncate max-w-[64px] ${item.active ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
