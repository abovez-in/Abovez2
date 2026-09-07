import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Calendar, Users, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold">404</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Page Not Found
        </h1>
        
        <p className="text-slate-600 text-sm md:text-base mb-8">
          The page you are looking for doesn't exist, has been removed, or has moved to a new address.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>

          <Link
            to="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              to="/hire-crew"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Hire Organizers
            </Link>
            <Link
              to="/find-crew"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Become Crew
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
