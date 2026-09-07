import React from 'react';
import { Calendar, Clock, MapPin, IndianRupee, Users, Sparkles, ChevronRight } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem & { distanceKm?: number };
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const isFull = event.approvedCrewCount >= event.totalCrewNeeded || event.status === 'crew_full';
  const slotsLeft = event.totalCrewNeeded - event.approvedCrewCount;

  return (
    <div
      onClick={() => onSelect(event)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Banner Graphic & Badges */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          {/* Category Chip */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-xs">
            {event.category}
          </span>

          {/* Distance Badge */}
          {event.distanceKm !== undefined && (
            <span className="absolute top-3 right-3 bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.distanceKm} km away
            </span>
          )}

          {/* Highlights & Slots Left Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                {event.handlerCompany || event.handlerName}
              </span>
              <h3 className="text-base font-extrabold line-clamp-1 leading-tight drop-shadow-xs">
                {event.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-3">
          
          {/* Pay & Crew Count Highlights */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Payout / Person</span>
              <div className="text-lg font-black text-blue-600 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {event.payPerPerson.toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Crew Needed</span>
              <div className="text-sm font-extrabold text-slate-800 flex items-center justify-end gap-1">
                <Users className="w-4 h-4 text-blue-600" />
                {event.approvedCrewCount} / {event.totalCrewNeeded}
              </div>
            </div>
          </div>

          {/* Date & Area */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{event.eventDate} • {event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.area}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {!isFull ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              {slotsLeft} {slotsLeft === 1 ? 'Slot' : 'Slots'} Remaining
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Crew Selected
            </span>
          )}

          <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
            Apply Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
