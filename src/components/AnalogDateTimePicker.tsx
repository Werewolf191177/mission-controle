import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, X, Sparkles, Sliders } from 'lucide-react';

interface AnalogDateTimePickerProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  accentColor?: string; // 'accent' | 'accent-blue' | 'accent-purple' | 'accent-pink' | 'accent-yellow'
  label?: string;
  minimal?: boolean;
}

export default function AnalogDateTimePicker({
  value,
  onChange,
  className = "",
  accentColor = "accent",
  label,
  minimal = false
}: AnalogDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse standard "YYYY-MM-DDTHH:mm" datetime string
  const parseDateTime = (val: string) => {
    let d = new Date();
    if (val) {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        d = parsed;
      }
    }
    return {
      year: d.getFullYear(),
      month: d.getMonth(), // 0-indexed
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes()
    };
  };

  const initialDateTime = parseDateTime(value);

  // Selected date-time parts inside the modal
  const [tempYear, setTempYear] = useState(initialDateTime.year);
  const [tempMonth, setTempMonth] = useState(initialDateTime.month);
  const [tempDay, setTempDay] = useState(initialDateTime.day);
  const [tempHour, setTempHour] = useState(initialDateTime.hour);
  const [tempMinute, setTempMinute] = useState(initialDateTime.minute);

  // Sync state with incoming value updates when modal is closed
  useEffect(() => {
    if (!isOpen) {
      const dt = parseDateTime(value);
      setTempYear(dt.year);
      setTempMonth(dt.month);
      setTempDay(dt.day);
      setTempHour(dt.hour);
      setTempMinute(dt.minute);
    }
  }, [value, isOpen]);

  // Format date-time for display and output
  const formatOutput = (y: number, m: number, d: number, hr: number, min: number) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${y}-${pad(m + 1)}-${pad(d)}T${pad(hr)}:${pad(min)}`;
  };

  const formatDisplay = () => {
    if (!value) return "Sélectionner date & heure";
    try {
      const dObj = new Date(value);
      if (isNaN(dObj.getTime())) return value;
      const pad = (n: number) => String(n).padStart(2, '0');
      const monthsFr = ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
      return `${pad(dObj.getDate())} ${monthsFr[dObj.getMonth()]} ${dObj.getFullYear()} à ${pad(dObj.getHours())}:${pad(dObj.getMinutes())}`;
    } catch (e) {
      return value;
    }
  };

  const handleConfirm = () => {
    const formatted = formatOutput(tempYear, tempMonth, tempDay, tempHour, tempMinute);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    setTempYear(now.getFullYear());
    setTempMonth(now.getMonth());
    setTempDay(now.getDate());
    setTempHour(now.getHours());
    setTempMinute(now.getMinutes());
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const getAccentHex = (color: string) => {
    return '#FFFFFF';
  };

  const getAccentTextClass = (color: string) => {
    return 'text-white';
  };

  const getAccentBgClass = (color: string) => {
    return 'bg-white';
  };

  const getAccentBorderClass = (color: string) => {
    return 'focus:border-white/50 border-white/20';
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <span className="text-[8px] font-black uppercase tracking-wider text-text-dim block mb-1">
          {label}
        </span>
      )}
      
      {/* Trigger Button */}
      {minimal ? (
        <div
          onClick={() => setIsOpen(true)}
          className={`cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity text-[9px] font-mono font-bold ${getAccentTextClass(accentColor)}`}
        >
          <span className="truncate max-w-[120px]">{formatDisplay()}</span>
          <Clock size={10} className="opacity-60 shrink-0" />
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          className={`w-full bg-black/40 border border-white/10 rounded p-2 text-[10px] font-bold outline-none cursor-pointer flex items-center justify-between hover:bg-white/5 hover:border-white/20 transition-all ${getAccentTextClass(accentColor)}`}
        >
          <span className="truncate pr-1">{formatDisplay()}</span>
          <Clock size={11} className="opacity-60 shrink-0" />
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#121216] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-[580px] w-full relative z-10"
            >
              {/* Top Accent Bar */}
              <div className="h-0.5 w-full bg-white/20" />

              {/* Header: Displays selected Date & Time values */}
              <div className="bg-black/40 border-b border-white/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${getAccentTextClass(accentColor)}`}>
                    <CalendarIcon size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-text-dim tracking-widest block">Date Sélectionnée</span>
                    <span className="text-sm font-bold text-white">
                      {new Date(tempYear, tempMonth, tempDay).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-black/50 border border-white/10 rounded-xl p-1 px-3 flex items-center gap-1">
                    <Clock size={13} className={`opacity-60 ${getAccentTextClass(accentColor)}`} />
                    <span className="text-lg font-mono font-black text-white tracking-tight tabular-nums">
                      {String(tempHour).padStart(2, '0')}:{String(tempMinute).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Panel: Calendar left, Watch face right */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* COLUMN 1: Visual Calendar Picker */}
                <CalendarGrid
                  year={tempYear}
                  month={tempMonth}
                  day={tempDay}
                  onChange={(d, m, y) => {
                    setTempDay(d);
                    setTempMonth(m);
                    setTempYear(y);
                  }}
                  accentColor={accentColor}
                />

                {/* COLUMN 2: Analog Watch Picker with hands */}
                <div className="flex flex-col items-center">
                  <AnalogWatchFace
                    hour={tempHour}
                    minute={tempMinute}
                    onHourChange={(h) => setTempHour(h)}
                    onMinuteChange={(m) => setTempMinute(m)}
                    accentColor={accentColor}
                    accentHex={getAccentHex(accentColor)}
                  />
                </div>

              </div>

              {/* Footer Panel with Preset actions */}
              <div className="bg-black/30 border-t border-white/5 p-4 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Effacer
                  </button>
                  <button
                    onClick={handleNow}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Maintenant
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-text-dim hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-black transition-all hover:brightness-110 cursor-pointer shadow-lg ${getAccentBgClass(accentColor)}`}
                  >
                    Valider
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: CalendarGrid
   ========================================== */
interface CalendarGridProps {
  year: number;
  month: number;
  day: number;
  onChange: (day: number, month: number, year: number) => void;
  accentColor: string;
}

function CalendarGrid({ year, month, day, onChange, accentColor }: CalendarGridProps) {
  const [viewMonth, setViewMonth] = useState(month);
  const [viewYear, setViewYear] = useState(year);

  // Sync viewing month with outer state changes
  useEffect(() => {
    setViewMonth(month);
    setViewYear(year);
  }, [month, year]);

  const monthsFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Build weeks layout for French Monday-first calendar
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    let idx = new Date(y, m, 1).getDay();
    // Re-map Sunday (0) to index 6, Monday (1) to index 0, etc.
    return idx === 0 ? 6 : idx - 1;
  };

  const daysInCurrent = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayIndex(viewYear, viewMonth);

  const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevYearIdx = viewMonth === 0 ? viewYear - 1 : viewYear;
  const daysInPrev = getDaysInMonth(prevYearIdx, prevMonthIdx);

  const cells = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrev - i,
      month: prevMonthIdx,
      year: prevYearIdx,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInCurrent; i++) {
    cells.push({
      day: i,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true
    });
  }

  // Next month padding to fill grid
  const totalCellsNeeded = 42; // 6 rows of 7 days
  let nextDayNum = 1;
  const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYearIdx = viewMonth === 11 ? viewYear + 1 : viewYear;
  
  while (cells.length < totalCellsNeeded) {
    cells.push({
      day: nextDayNum++,
      month: nextMonthIdx,
      year: nextYearIdx,
      isCurrentMonth: false
    });
  }

  const getAccentTextClass = (color: string) => {
    switch (color) {
      case 'accent-blue': return 'text-accent-blue';
      case 'accent-purple': return 'text-accent-purple';
      case 'accent-pink': return 'text-accent-pink';
      case 'accent-yellow': return 'text-accent-yellow';
      default: return 'text-accent';
    }
  };

  const getAccentBgClass = (color: string) => {
    switch (color) {
      case 'accent-blue': return 'bg-accent-blue';
      case 'accent-purple': return 'bg-accent-purple';
      case 'accent-pink': return 'bg-accent-pink';
      case 'accent-yellow': return 'bg-accent-yellow';
      default: return 'bg-accent';
    }
  };

  return (
    <div className="w-full">
      {/* Month selection header */}
      <div className="flex items-center justify-between mb-4 bg-white/[0.02] border border-white/5 p-1 px-2 rounded-xl">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-white/5 text-text-dim hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-[11px] font-black uppercase tracking-wider text-white">
          {monthsFr[viewMonth]} {viewYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-white/5 text-text-dim hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Weekday abbreviation header */}
      <div className="grid grid-cols-7 text-center mb-1 text-[9px] font-black text-text-dim uppercase tracking-wider">
        {['lu', 'ma', 'me', 'je', 've', 'sa', 'di'].map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          const isSelected = cell.day === day && cell.month === month && cell.year === year;
          const isToday = () => {
            const today = new Date();
            return cell.day === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear();
          };

          return (
            <button
              key={idx}
              onClick={() => onChange(cell.day, cell.month, cell.year)}
              className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${
                isSelected
                  ? `${getAccentBgClass(accentColor)} text-black font-extrabold shadow-md`
                  : isToday()
                  ? `border border-white/20 text-white bg-white/5 hover:bg-white/10`
                  : cell.isCurrentMonth
                  ? 'text-white/80 hover:bg-white/5'
                  : 'text-white/20 hover:bg-white/5 hover:text-white/40'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: AnalogWatchFace
   ========================================== */
interface AnalogWatchFaceProps {
  hour: number;
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  accentColor: string;
  accentHex: string;
}

function AnalogWatchFace({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  accentColor,
  accentHex
}: AnalogWatchFaceProps) {
  const [clockMode, setClockMode] = useState<'hours' | 'minutes'>('hours');
  const clockRef = useRef<SVGSVGElement | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Switch clock faces or fine-tune
  const incrementValue = () => {
    if (clockMode === 'hours') {
      onHourChange((hour + 1) % 24);
    } else {
      onMinuteChange((minute + 1) % 60);
    }
  };

  const decrementValue = () => {
    if (clockMode === 'hours') {
      onHourChange((hour - 1 + 24) % 24);
    } else {
      onMinuteChange((minute - 1 + 60) % 60);
    }
  };

  // Convert click or touch point to a value based on angle/distance from watch center (110, 110)
  const handlePointerEvent = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const dx = clientX - cx;
    const dy = clientY - cy;
    
    // Angle from 12 o'clock in degrees [0, 360]
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // Radius from center
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (clockMode === 'hours') {
      // 24-hour Material Clock Setup:
      // Inner circle is hours 13 to 24/00 (r ~ 54)
      // Outer circle is hours 1 to 12 (r ~ 82)
      const outerRad = rect.width * (82 / 220);
      const innerRad = rect.width * (54 / 220);
      const boundary = (outerRad + innerRad) / 2;

      let h = Math.round(angle / 30) % 12;
      if (h === 0) h = 12;

      if (dist < boundary) {
        // Inner Ring: hours 13..24/00
        h = h === 12 ? 0 : h + 12;
      }
      onHourChange(h);
    } else {
      // Minute mode: [0, 59]
      const m = Math.round(angle / 6) % 60;
      onMinuteChange(m);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only left click
    setIsPointerDown(true);
    handlePointerEvent(e);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPointerDown) return;
    handlePointerEvent(e);
  };

  const handleMouseUp = () => {
    setIsPointerDown(false);
    // Auto shift to minutes mode on click completion for hour
    if (clockMode === 'hours') {
      setTimeout(() => setClockMode('minutes'), 300);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    setIsPointerDown(true);
    handlePointerEvent(e);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    handlePointerEvent(e);
  };

  const handleTouchEnd = () => {
    setIsPointerDown(false);
    if (clockMode === 'hours') {
      setTimeout(() => setClockMode('minutes'), 300);
    }
  };

  // Helper arrays for positions
  const outerHours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const innerHours = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const minsStep5 = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Calculate coordinates for watch face numbers
  const getCoords = (val: number, isHourInner = false, maxVal = 12) => {
    const radius = clockMode === 'hours' ? (isHourInner ? 54 : 82) : 82;
    // Offset by -90 deg to make 12 (or 0) stand at top-center
    const theta = ((val * (360 / maxVal)) - 90) * (Math.PI / 180);
    return {
      x: 110 + radius * Math.cos(theta),
      y: 110 + radius * Math.sin(theta)
    };
  };

  // Coordinates of active selection hand endpoint
  const getActiveHandCoords = () => {
    if (clockMode === 'hours') {
      const isInner = hour === 0 || hour >= 13;
      return getCoords(hour % 12 || 12, isInner, 12);
    } else {
      return getCoords(minute, false, 60);
    }
  };

  const endPos = getActiveHandCoords();

  const getAccentTextClass = (color: string) => {
    switch (color) {
      case 'accent-blue': return 'text-accent-blue';
      case 'accent-purple': return 'text-accent-purple';
      case 'accent-pink': return 'text-accent-pink';
      case 'accent-yellow': return 'text-accent-yellow';
      default: return 'text-accent';
    }
  };

  const getAccentBgClass = (color: string) => {
    switch (color) {
      case 'accent-blue': return 'bg-accent-blue';
      case 'accent-purple': return 'bg-accent-purple';
      case 'accent-pink': return 'bg-accent-pink';
      case 'accent-yellow': return 'bg-accent-yellow';
      default: return 'bg-accent';
    }
  };

  const getAccentBorderClass = (color: string) => {
    switch (color) {
      case 'accent-blue': return 'border-accent-blue/30';
      case 'accent-purple': return 'border-accent-purple/30';
      case 'accent-pink': return 'border-accent-pink/30';
      case 'accent-yellow': return 'border-accent-yellow/30';
      default: return 'border-accent/30';
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Selection Mode tabs */}
      <div className="flex items-center gap-1.5 mb-5 bg-black/40 border border-white/5 p-1 rounded-xl">
        <button
          onClick={() => setClockMode('hours')}
          className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all ${
            clockMode === 'hours'
              ? `${getAccentBgClass(accentColor)} text-black font-extrabold shadow-[0_0_12px_rgba(255,255,255,0.15)]`
              : 'text-text-dim hover:text-white'
          }`}
        >
          Heures
        </button>
        <button
          onClick={() => setClockMode('minutes')}
          className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all ${
            clockMode === 'minutes'
              ? `${getAccentBgClass(accentColor)} text-black font-extrabold shadow-[0_0_12px_rgba(255,255,255,0.15)]`
              : 'text-text-dim hover:text-white'
          }`}
        >
          Minutes
        </button>
      </div>

      {/* Interactive Clock SVG */}
      <div className="relative w-[220px] h-[220px]">
        {/* Subtle Watch bezel shadow circle */}
        <div className="absolute inset-2 bg-black/30 rounded-full border border-white/[0.03] pointer-events-none" />

        <svg
          ref={clockRef}
          viewBox="0 0 220 220"
          className="w-full h-full select-none cursor-crosshair touch-none relative z-10"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Outer Watch Dial background */}
          <circle cx="110" cy="110" r="102" fill="#0C0C10" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <circle cx="110" cy="110" r="10" fill="#131318" />

          {/* Glowing ticks inside dial */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((tick) => {
            const rad = (tick * 30 - 90) * (Math.PI / 180);
            const x1 = 110 + 96 * Math.cos(rad);
            const y1 = 110 + 96 * Math.sin(rad);
            const x2 = 110 + (tick % 3 === 0 ? 90 : 93) * Math.cos(rad);
            const y2 = 110 + (tick % 3 === 0 ? 90 : 93) * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={tick % 3 === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}
                strokeWidth={tick % 3 === 0 ? "1.5" : "1"}
              />
            );
          })}

          {/* ACTIVE WATCH HAND: Radial line with selected ring bubble */}
          <line
            x1="110"
            y1="110"
            x2={endPos.x}
            y2={endPos.y}
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.8"
          />
          <circle
            cx={endPos.x}
            cy={endPos.y}
            r="12"
            fill={accentHex}
            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            style={{ filter: `drop-shadow(0 0 6px rgba(255,255,255,0.3))` }}
          />
          <circle cx="110" cy="110" r="3.5" fill={accentHex} />

          {/* DIAL NUMBERS RENDERING */}
          {clockMode === 'hours' ? (
            <>
              {/* Outer circle hours 1..12 */}
              {outerHours.map((h, idx) => {
                const coords = getCoords(h, false, 12);
                const isSelected = hour === h;
                return (
                  <text
                    key={`out-${h}`}
                    x={coords.x}
                    y={coords.y}
                    className={`font-mono text-[9px] font-bold`}
                    fill={isSelected ? '#000000' : 'rgba(255, 255, 255, 0.7)'}
                    textAnchor="middle"
                    dominantBaseline="central"
                    pointerEvents="none"
                  >
                    {h}
                  </text>
                );
              })}

              {/* Inner circle hours 13..24/00 */}
              {innerHours.map((h, idx) => {
                const coords = getCoords(h % 12 || 12, true, 12);
                const isSelected = hour === h;
                return (
                  <text
                    key={`in-${h}`}
                    x={coords.x}
                    y={coords.y}
                    className={`font-mono text-[8px] font-bold`}
                    fill={isSelected ? '#000000' : 'rgba(255, 255, 255, 0.35)'}
                    textAnchor="middle"
                    dominantBaseline="central"
                    pointerEvents="none"
                  >
                    {h === 0 ? '00' : h}
                  </text>
                );
              })}
            </>
          ) : (
            <>
              {/* Minutes 00..55 step 5 */}
              {minsStep5.map((m) => {
                const coords = getCoords(m, false, 60);
                const isSelected = minute === m;
                return (
                  <text
                    key={`min-${m}`}
                    x={coords.x}
                    y={coords.y}
                    className="font-mono text-[9px] font-bold"
                    fill={isSelected ? '#000000' : 'rgba(255, 255, 255, 0.7)'}
                    textAnchor="middle"
                    dominantBaseline="central"
                    pointerEvents="none"
                  >
                    {String(m).padStart(2, '0')}
                  </text>
                );
              })}
            </>
          )}
        </svg>
      </div>

    </div>
  );
}
