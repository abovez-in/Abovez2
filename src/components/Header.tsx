import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Bell, User, LogOut, ChevronDown, Menu, X, ShieldCheck, Briefcase, Calendar, Check, AlertCircle, Sparkles, Camera, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AboveZLogo } from './AboveZLogo';

export const Header: React.FC = () => {
  const {
    user,
    logout,
    activeCity,
    openCityModal,
    setActiveTab,
    unreadNotifCount,
    notifications,
    openAuthModal,
    openIdUploadModal,
    openEditProfileModal
  } = useAuth();

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const showAdminNav = user?.role === 'admin';

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path === '/find-crew' && location.pathname === '/crew-dashboard') || (path === '/jobs' && location.pathname === '/events') || (path === '/hire-crew' && location.pathname === '/organizers');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-20">
          
          {/* Brand Logo & City Picker */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center group text-left cursor-pointer focus:outline-none"
              title="AboveZ - Home"
            >
              <div className="flex items-center justify-center transition-transform group-hover:scale-105 drop-shadow-sm">
                <AboveZLogo size={66} className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
            </Link>

            {/* City Picker Button (BookMyShow Style) */}
            <button
              onClick={openCityModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-full text-xs font-bold transition-all border border-slate-200"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-[100px]">{activeCity.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isCurrent('/')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/book-event"
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isCurrent('/book-event')
                  ? 'text-blue-700 bg-blue-100/80 font-black shadow-2xs'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100 font-bold'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Book Event</span>
            </Link>

            <Link
              to="/find-crew"
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isCurrent('/find-crew')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Become Crew
            </Link>

            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isCurrent('/jobs')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Jobs
            </Link>

            <Link
              to="/hire-crew"
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isCurrent('/hire-crew')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Hire Crew
            </Link>

            {showAdminNav && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCurrent('/admin')
                    ? 'text-indigo-600 bg-indigo-50 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications Feed Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full relative transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      <span className="text-xs text-slate-400">{(notifications || []).length} total</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {(!notifications || notifications.length === 0) ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        (notifications || []).slice(0, 5).map(n => (
                          <div key={n.id} className={`p-3 text-xs ${!n.read ? 'bg-blue-50/50' : ''}`}>
                            <div className="font-semibold text-slate-800 mb-0.5">{n.title}</div>
                            <div className="text-slate-600 leading-tight">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 pl-1.5 pr-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden border border-slate-300 shadow-2xs">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-black text-xs text-slate-900 truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {user.role === 'crew' ? 'Crew Member' : user.role === 'handler' ? 'Event Organizer' : 'Admin'}
                        </div>
                      </div>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openEditProfileModal();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-blue-600" /> Edit Profile & Photo
                      </button>

                      {user.role === 'crew' && (
                        <Link
                          to="/find-crew"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-slate-400" /> My Profile & Applications
                        </Link>
                      )}

                      {user.role === 'handler' && (
                        <Link
                          to="/hire-crew"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" /> Organizer Dashboard
                        </Link>
                      )}

                      {user.role === 'crew' && (
                        <div className="px-3 py-1.5">
                          {user.idVerificationStatus === 'verified' ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> ID Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                openIdUploadModal();
                              }}
                              className="w-full text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between border border-amber-200"
                            >
                              <span>Upload ID Card</span>
                              <span>Verify →</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('crew-login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </button>

                <button
                  onClick={() => openAuthModal('crew-signup')}
                  className="px-3.5 py-1.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
                >
                  Join as Crew
                </button>
              </div>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block py-2.5 px-3 rounded-lg text-left text-sm font-semibold ${
              isCurrent('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
            }`}
          >
            Home
          </Link>
          <Link
            to="/book-event"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block py-2.5 px-3 rounded-lg text-left text-sm font-bold flex items-center gap-2 ${
              isCurrent('/book-event') ? 'bg-blue-100/80 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            Book Event
          </Link>
          <Link
            to="/find-crew"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block py-2.5 px-3 rounded-lg text-left text-sm font-semibold ${
              isCurrent('/find-crew') ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
            }`}
          >
            Become Crew
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block py-2.5 px-3 rounded-lg text-left text-sm font-semibold ${
              isCurrent('/jobs') ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
            }`}
          >
            Jobs
          </Link>
          <Link
            to="/hire-crew"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block py-2.5 px-3 rounded-lg text-left text-sm font-semibold ${
              isCurrent('/hire-crew') ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
            }`}
          >
            Hire Crew
          </Link>

          {showAdminNav && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full block py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                isCurrent('/admin') ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

