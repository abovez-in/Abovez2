import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AboveZLogo } from './AboveZLogo';

export const Footer: React.FC = () => {
  const { openAuthModal, activeCity } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800 text-xs">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center">
              <AboveZLogo size={62} />
            </Link>
            <p className="text-slate-400 leading-relaxed">
              India's premier event crew hiring platform connecting Event Handlers with trusted local Crew Members.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Identity Verified Community
            </div>
            {/* Social & Chat Links */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Connect & Chat</span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://wa.me/919265993727"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-all border border-emerald-700/60 font-semibold text-[11px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://www.instagram.com/abovez.in?igsi=MW52bDljejVwYnFhaQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 font-semibold text-[11px]"
                >
                  <Instagram className="w-4 h-4 text-pink-400 group-hover:text-white" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/abovez-the-best-crew-platform-85a324281?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-blue-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 font-semibold text-[11px]"
                >
                  <Linkedin className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: For Crew */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">For Crew Members</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">
                  Browse Events in {activeCity.name}
                </Link>
              </li>
              <li>
                <button onClick={() => openAuthModal('crew-signup')} className="hover:text-blue-400 transition-colors">
                  Register as Crew
                </button>
              </li>
              <li>
                <Link to="/find-crew" className="hover:text-blue-400 transition-colors">
                  My Applications & Status Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Organizers */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">For Event Organizers</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/hire-crew" className="hover:text-blue-400 transition-colors">
                  Organizers Portal
                </Link>
              </li>
              <li>
                <button onClick={() => openAuthModal('handler-signup')} className="hover:text-blue-400 transition-colors">
                  Publish an Event
                </button>
              </li>
              <li>
                <Link to="/hire-crew" className="hover:text-blue-400 transition-colors">
                  Hire Verified Event Staff
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Contact & Support</h4>
            <div className="text-slate-400 space-y-1">
              <p className="font-bold text-blue-400">Selected City: {activeCity.name}, {activeCity.state}</p>
              <p className="text-[11px] text-slate-500">Pan-India Network Across All States</p>
            </div>
            <div className="pt-2 text-slate-400 space-y-1.5">
              <a
                href="https://wa.me/919265993727"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> WhatsApp: +91 92659 93727
              </a>
              <a href="mailto:abovez.in@gmail.com" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" /> abovez.in@gmail.com
              </a>
              <a href="tel:+919265993727" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" /> +91 92659 93727
              </a>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>© {new Date().getFullYear()} AboveZ Technologies. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://wa.me/919265993727"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href="https://www.instagram.com/abovez.in?igsi=MW52bDljejVwYnFhaQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-400 flex items-center gap-1 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/abovez-the-best-crew-platform-85a324281?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
