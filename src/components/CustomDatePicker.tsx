import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Clock } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // "YYYY-MM-DD" format
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  required?: boolean;
  className?: string;
  helperText?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select Date',
  minYear = 1950,
  maxYear = 2035,
  required = false,
  className = '',
  helperText
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to today
  const parseDate = (val: string) => {
    if (!val) return null;
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d);
      }
    }
    return null;
  };

  const initialDate = parseDate(value) || new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  useEffect(() => {
    const d = parseDate(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Generate years list
  const yearsList: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearsList.push(y);
  }

  // Days calculation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const formatted = `${viewYear}-${mStr}-${dStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleQuickYearShift = (delta: number) => {
    const newY = Math.min(maxYear, Math.max(minYear, viewYear + delta));
    setViewYear(newY);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      if (viewYear > minYear) {
        setViewYear(viewYear - 1);
        setViewMonth(11);
      }
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setViewYear(viewYear + 1);
        setViewMonth(0);
      }
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectedDateObj = parseDate(value);
  const formattedDisplay = selectedDateObj
    ? `${selectedDateObj.getDate()} ${shortMonths[selectedDateObj.getMonth()]} ${selectedDateObj.getFullYear()}`
    : '';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {value && (
            <span className="text-[10px] text-blue-600 font-semibold">{value}</span>
          )}
        </label>
      )}

      {/* Input trigger button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white flex items-center justify-between cursor-pointer hover:border-blue-500 focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
          <span className={formattedDisplay ? 'font-bold text-slate-800' : 'text-slate-400'}>
            {formattedDisplay || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              title="Clear date"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            {viewYear}
          </span>
        </div>
      </div>

      {helperText && <p className="text-[10px] text-slate-500 mt-1">{helperText}</p>}

      {/* Calendar Dropdown Modal */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 left-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-100">
          
          {/* Top Year & Month Bar */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            
            {/* Year Fast Switcher Controls */}
            <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickYearShift(-10)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 text-[10px] font-bold"
                  title="Previous 10 Years"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickYearShift(-1)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  title="Previous Year"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Year Dropdown */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Year:</span>
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="bg-white border border-blue-300 font-extrabold text-blue-700 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickYearShift(1)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  title="Next Year"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickYearShift(10)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  title="Next 10 Years"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Month Switcher Bar */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="font-bold text-xs text-slate-800 bg-transparent border-0 focus:ring-0 cursor-pointer py-1 px-2"
              >
                {months.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m} {viewYear}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Days Grid */}
          <div className="mt-3">
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {weekDays.map((d) => (
                <span key={d} className="text-[10px] font-bold text-slate-400">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  selectedDateObj &&
                  selectedDateObj.getFullYear() === viewYear &&
                  selectedDateObj.getMonth() === viewMonth &&
                  selectedDateObj.getDate() === day;

                const isToday =
                  new Date().getFullYear() === viewYear &&
                  new Date().getMonth() === viewMonth &&
                  new Date().getDate() === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`h-7 w-7 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/30'
                        : isToday
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-300'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const mStr = String(today.getMonth() + 1).padStart(2, '0');
                const dStr = String(today.getDate()).padStart(2, '0');
                onChange(`${today.getFullYear()}-${mStr}-${dStr}`);
                setIsOpen(false);
              }}
              className="text-blue-600 hover:underline font-bold"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tmr = new Date();
                tmr.setDate(tmr.getDate() + 1);
                const mStr = String(tmr.getMonth() + 1).padStart(2, '0');
                const dStr = String(tmr.getDate()).padStart(2, '0');
                onChange(`${tmr.getFullYear()}-${mStr}-${dStr}`);
                setIsOpen(false);
              }}
              className="text-slate-600 hover:underline font-semibold"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-[10px]"
            >
              Done
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
