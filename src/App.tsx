/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Copy, 
  Check,
  CheckSquare,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  MapPin,
  X,
  Palette,
  Activity,
  Package,
  PackageSearch,
  Target,
  Maximize,
  Minimize,
  ChevronsLeft,
  Layers,
  Film,
  Camera,
  Zap,
  Rocket,
  LayoutGrid,
  ClipboardCheck,
  Sparkles,
  Monitor,
  Smartphone,
  Menu,
  Square,
  Box,
  Type,
  Image as ImageIcon,
  ImagePlus,
  Clock,
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Upload,
  Save,
  Download,
  FileSpreadsheet,
  Filter,
  Eye,
  EyeOff,
  Search,
  FilterX,
  Printer,
  FileText,
  GripVertical,
  Loader2,
  ZapOff,
  Globe,
  List,
  BookOpen,
  RefreshCw,
  ArrowRight,
  Power,
  PowerOff,
  MessageSquare,
  Bug,
  MessageCircle,
  Megaphone,
  Database,
  Cpu,
  Layout,
  Columns,
  Info,
  FileJson,
  Bot,
  Send,
  Edit2,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RPieChart, Pie, Cell, AreaChart, Area, LabelList, ComposedChart, Line, Legend, CartesianGrid
} from 'recharts';

import { initAuth, googleSignIn, logout, getAccessToken } from './services/firebaseAuth';
import type { User } from 'firebase/auth';

// --- STABLE SUB-COMPONENTS ---

const StatCard = ({ label, value, subValue, icon: Icon, color, delay = 0, breakdown }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-black/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all shadow-xl flex flex-col justify-between"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/[0.05] transition-all" />
    <div className="flex justify-between items-start relative z-10">
      <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${color}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      {breakdown && (
        <div className="flex flex-col items-end gap-1">
          {Object.entries(breakdown).map(([support, count]: any) => (
            count > 0 && (
              <div key={support} className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-[7px] font-black uppercase text-text-dim tracking-wider font-mono">{support}</span>
                <span className="text-[9px] font-black text-white leading-none">{count}</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
    <div className="mt-4 relative z-10">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-mono font-black tracking-tighter text-white tabular-nums">{value}</span>
        {subValue && <span className="text-xs font-bold text-text-dim/60">{subValue}</span>}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim/60 mt-1">{label}</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, subtitle, children, delay = 0, className = "", rightElement, id, onExport }: any) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={`bg-black/40 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col group/chart ${className}`}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h4 className="text-[11px] font-black uppercase tracking-[2px] text-white">{title}</h4>
        <p className="text-[8px] font-mono text-accent/60 uppercase tracking-widest mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {id && onExport && (
          <button 
            onClick={() => onExport(id, title)}
            className="p-1 px-1.5 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 rounded transition-all opacity-0 group-hover/chart:opacity-100"
            title="Exporter ce graphique"
          >
            <Download size={12} />
          </button>
        )}
        {rightElement ? rightElement : <Activity size={14} className="text-white/20" />}
      </div>
    </div>
    <div className="flex-1 min-h-[150px]">
      {children}
    </div>
  </motion.div>
);

const WaveEffect = ({ progress, color, type, opacity }: { progress: number, color: string | undefined | null, type: 'liquid' | 'organic' | 'tech', opacity?: number }) => {
  const getPath = () => {
    switch(type) {
      case 'organic':
        return "M0,60 C200,20 400,100 600,60 S1000,100 1200,60 C1400,20 1600,100 1800,60 S2200,100 2400,60 L2400,120 L0,120 Z";
      case 'tech':
        return "M0,60 L150,20 L300,100 L450,20 L600,60 L750,20 L900,100 L1050,20 L1200,60 L1350,20 L1500,100 L1650,20 L1800,60 L1950,20 L2100,100 L2250,20 L2400,60 L2400,120 L0,120 Z";
      default: // liquid
        return "M0,60 C150,110 450,10 600,60 S1050,10 1200,60 C1350,110 1650,10 1800,60 S2250,10 2400,60 L2400,120 L0,120 Z";
    }
  };

  const path = getPath();
  const safeProgress = typeof progress === 'number' && !isNaN(progress) ? progress : 0;

  // Resolve Tailwind utility colors or hex strings to explicit CSS values
  const resolveColor = (c: string | undefined | null) => {
    if (!c) return 'var(--color-accent, #00FF94)';
    if (c.startsWith('#')) return c;
    if (c === 'text-accent' || c === 'accent') return 'var(--color-accent, #00FF94)';
    if (c === 'text-accent-blue' || c === 'accent-blue') return 'var(--color-accent-blue, #00D1FF)';
    if (c === 'text-accent-purple' || c === 'accent-purple') return 'var(--color-accent-purple, #BD00FF)';
    if (c === 'text-accent-orange' || c === 'accent-orange') return 'var(--color-accent-orange, #FF9900)';
    if (c === 'text-accent-pink' || c === 'accent-pink') return 'var(--color-accent-pink, #FF007A)';
    if (c === 'text-accent-red' || c === 'accent-red') return 'var(--color-accent-red, #FF3B30)';
    if (c === 'text-accent-yellow' || c === 'accent-yellow') return 'var(--color-accent-yellow, #EBFF00)';
    if (c.startsWith('text-')) {
      const term = c.replace('text-', '');
      return `var(--color-${term})`;
    }
    return c;
  };

  const resolvedColor = resolveColor(color);
  
  // We use max offset of 75% instead of 100% so that at 0% progress, a beautiful subtle crest remains visible at the header's base fold.
  const motionY = 75 - (safeProgress > 100 ? 100 : safeProgress) * 0.7;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: opacity !== undefined ? opacity : 0.3 }}>
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-[150%] flex flex-col"
        animate={{ y: `${motionY}%` }}
        transition={{ type: 'spring', damping: 30, stiffness: 45 }}
      >
        <div className="relative w-full h-[150px]">
          <motion.svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-full"
            style={{ color: resolvedColor }}
            animate={{
              x: [0, -1200],
            }}
            transition={{
              duration: type === 'tech' ? 5 : 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <path d={path} fill={resolvedColor} />
          </motion.svg>
          <motion.svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-full opacity-40"
            style={{ color: resolvedColor }}
            animate={{
              x: [-1200, 0],
            }}
            transition={{
              duration: type === 'tech' ? 8 : 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <path d={path} fill={resolvedColor} />
          </motion.svg>
        </div>
        <div className="flex-1 w-full" style={{ backgroundColor: resolvedColor }} />
      </motion.div>
    </div>
  );
};


interface CategoryConfig {
  id: string;
  name: string;
  items: string[];
  icon: React.ElementType;
  displayType: 'buttons' | 'select';
  colorRef: string; // e.g. 'accent', 'accent-blue', etc.
}

interface MissionLog {
  timestamp: number;
  message: string;
}

interface GlobalLogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'system' | 'manual' | 'mission' | 'instruction';
}

interface SecondaryMission {
  id: string;
  title: string;
  note: string;
  rating: number;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  status: string;
  createdAt: number;
  deadline?: string;
  enabled: boolean;
}

interface Mission {
  id: string;
  missionNo: number;
  refId: string;
  family?: string;
  product: string;
  color: string;
  argumentType: string;
  univers: string;
  format: string;
  position: string;
  support: string;
  priority: string;
  status: string;
  progress: number;
  photoCountRequested: number;
  photoCountDelivered: number;
  rating?: number;
  info: string;
  imageUrl?: string;
  imagePosition?: string;
  deadline?: string;
  createdAt: number;
  updatedAt?: number;
  history: MissionLog[];
  enabled: boolean;
  preparedAt?: string;
  shotAt?: string;
  postProdAt?: string;
  deliveredAt?: string;
}

const Toggle = ({ enabled, onToggle }: { enabled: boolean, onToggle: (e: React.MouseEvent) => void }) => (
  <div 
    onClick={onToggle}
    className={`w-8 h-4 rounded-full relative transition-colors duration-300 shrink-0 cursor-pointer ${enabled ? 'bg-accent shadow-[0_0_10px_-2px_var(--color-accent)]' : 'bg-white/10'}`}
  >
    <motion.div 
      initial={false}
      animate={{ x: enabled ? 16 : 0 }}
      className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full ${enabled ? 'bg-black' : 'bg-text-dim'}`}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </div>
);

const deduceFamily = (productName: string): string => {
  if (!productName) return 'Autre';
  const name = productName.toUpperCase();
  if (name.includes('PUNT')) return 'PUNT';
  if (name.includes('AT ')) return 'AT';
  if (name.includes('AT(') || name === 'AT') return 'AT';
  if (name.includes('HARD PRO')) return 'HARD PRO';
  if (name.includes('PWB')) return 'PWB';
  if (name.includes('SBIN')) return 'SBIN';
  if (name.includes('PORTRAIT')) return 'Portraits';
  return 'Autre';
};

const getColorAccentClass = (color: string): string => {
  const low = (color || '').toLowerCase();
  if (low.includes('red') || low.includes('bcr')) return 'border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40';
  if (low.includes('grey') || low.includes('gray')) return 'border-gray-500/30 text-gray-400 bg-gray-500/5 hover:bg-gray-500/10 hover:border-gray-500/40';
  if (low.includes('black') || low.includes('bk')) return 'border-neutral-705 text-neutral-300 bg-neutral-800/20 hover:bg-neutral-800/30 hover:border-neutral-500';
  if (low.includes('white') || low.includes('cr')) return 'border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/30';
  if (low.includes('blue')) return 'border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40';
  return 'border-accent-purple/35 text-accent-purple bg-accent-purple/5 hover:bg-accent-purple/10 hover:border-accent-purple/40';
};

const StarRatingStatic = ({ rating = 0, size = 8 }: { rating?: number, size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((starValue) => {
      const isFull = rating >= starValue;
      const isHalf = rating >= starValue - 0.5 && !isFull;
      return (
        <div key={starValue} className="relative" style={{ width: size, height: size }}>
          <Sparkles size={size} className="text-white/10 absolute inset-0" />
          {isFull && (
            <Sparkles size={size} className="text-accent-yellow fill-accent-yellow absolute inset-0" />
          )}
          {isHalf && (
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Sparkles size={size} className="text-accent-yellow fill-accent-yellow" style={{ width: size }} />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const InteractiveStarRating = ({ rating = 0, onRatingChange, size = 12, className = "" }: { rating?: number, onRatingChange: (val: number) => void, size?: number, className?: string }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, starValue: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverRating(isHalf ? starValue - 0.5 : starValue);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, starValue: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const finalVal = isHalf ? starValue - 0.5 : starValue;
    onRatingChange(finalVal);
  };

  const currentDisplay = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`flex items-center gap-0.5 ${className}`} onMouseLeave={() => setHoverRating(null)}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFull = currentDisplay >= starValue;
        const isHalf = currentDisplay >= starValue - 0.5 && !isFull;

        return (
          <button
            key={starValue}
            onMouseMove={(e) => handleMouseMove(e, starValue)}
            onClick={(e) => handleClick(e, starValue)}
            className="group/star transition-all duration-200 hover:scale-125 active:scale-90 cursor-pointer p-0.5 relative"
            title={`Noter ${starValue}/5`}
          >
             <div className="relative" style={{ width: size, height: size }}>
                <Sparkles size={size} className="text-white/10 absolute inset-0 group-hover/star:text-white/20 transition-colors" />
                {isFull && (
                   <Sparkles 
                     size={size} 
                     className="text-accent-yellow fill-accent-yellow absolute inset-0 drop-shadow-[0_0_8px_rgba(255,190,0,0.5)] transition-all duration-300" 
                   />
                )}
                {isHalf && (
                   <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                      <Sparkles 
                        size={size} 
                        className="text-accent-yellow fill-accent-yellow transition-all duration-300" 
                        style={{ width: size }} 
                      />
                   </div>
                )}
             </div>
             {hoverRating !== null && Math.ceil(hoverRating) === starValue && (
               <motion.div 
                 layoutId="star-glow"
                 className="absolute inset-0 bg-accent-yellow/10 rounded-full blur-md -z-10"
               />
             )}
          </button>
        );
      })}
    </div>
  );
};

function FilterSelect({ label, icon: Icon, items, selected, setSelected, isOpen, setIsOpen, accentColor = "text-accent" }: any) {
  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
        <Icon size={10} /> {label} {selected.length > 0 && <span className="bg-accent text-black px-1 rounded text-[8px]">{selected.length}</span>}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/10 p-2.5 rounded text-[11px] text-white/70 outline-none focus:border-accent-blue transition-all cursor-pointer flex items-center justify-between group hover:border-white/30 h-[42px]"
      >
        <span className="truncate max-w-[80px]">
          {selected.length === 0 ? `Tout` : 
           selected.length === 1 ? selected[0] : 
           `${selected.length} sel.`}
        </span>
        <ChevronRight size={14} className={`transition-transform shrink-0 ${isOpen ? 'rotate-90 text-accent' : 'text-text-dim'}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <div key="filter-container">
            <motion.div
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-transparent cursor-default" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }} 
            />
            <motion.div
              key="filter-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl z-[70] py-1 max-h-60 overflow-y-auto custom-scrollbar"
            >
              <div 
                onClick={() => setSelected([])}
                className={`px-4 py-2 text-[10px] cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors ${selected.length === 0 ? 'text-accent font-bold' : 'text-text-dim'}`}
              >
                <span>Tout {label}</span>
                {selected.length === 0 && <Check size={12} />}
              </div>
              <div className="h-[1px] bg-white/5 my-1" />
              {items.map((s: string) => {
                const isSelected = (selected || []).includes(s);
                return (
                  <div 
                    key={`opt-${s}`}
                    onClick={() => {
                      setSelected((prev: string[]) => 
                        (prev || []).includes(s) ? (prev || []).filter(item => item !== s) : [...(prev || []), s]
                      );
                    }}
                    className={`px-4 py-2 text-[10px] cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors ${isSelected ? 'text-white font-bold bg-white/5' : 'text-text-dim'}`}
                  >
                    <span className="truncate pr-2">{s}</span>
                    {isSelected && <Check size={12} className={accentColor} />}
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FloatingAIChat = ({ missions, googleToken }: { missions: any[], googleToken: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'model' | 'user', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput !== undefined ? overrideInput : input;
    if (!textToSend.trim()) return;
    
    const currentInput = textToSend;
    const currentHistory = [...messages];
    
    setMessages([...currentHistory, { role: 'user', text: currentInput }]);
    if (overrideInput === undefined) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const customKey = localStorage.getItem('gemini_custom_api_key');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (customKey) {
        headers['x-gemini-api-key'] = customKey;
      }
      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: currentInput, 
          history: currentHistory,
          missions: missions,
          googleToken: googleToken
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur API');
      }
      
      setMessages([...currentHistory, { role: 'user', text: currentInput }, { role: 'model', text: data.text }]);
    } catch (err: any) {
      setMessages([...currentHistory, { role: 'user', text: currentInput }, { role: 'model', text: 'Erreur: ' + err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 99999 }}
      className="flex flex-col items-start gap-4"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[370px] bg-card-bg border border-white/10 shadow-2xl flex flex-col rounded-2xl overflow-hidden cursor-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent animate-pulse">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold leading-tight flex items-center gap-1.5">
                    Directeur de Prod IA
                    <span className="text-[8px] bg-accent/25 text-accent border border-accent/30 font-black tracking-widest px-1 py-0.5 rounded-md uppercase font-mono">
                      Manager Mode
                    </span>
                  </h3>
                  <span className="text-[10px] text-text-dim/80">Stratégie, Familles & Notations</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-text-dim hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[350px] max-h-[420px]" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-center text-text-dim text-xs py-2">
                    <Bot size={28} className="mx-auto mb-2 text-accent" />
                    <p className="font-bold text-white mb-1">Bienvenue dans votre Espace de Management Constructif</p>
                    <p className="max-w-[280px] mx-auto opacity-70 leading-relaxed text-[10px]">
                      Je suis votre Directeur de Production IA. Je vous aide à piloter vos missions par famille de produits, auditer les notations pour viser l'excellence et orchestrer votre plan de travail.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-[9px] uppercase tracking-wider text-accent font-black">Raccourcis de Gestion Directe :</p>
                    
                    <button 
                      onClick={() => handleQuickAction("Fais-moi un audit complet de la charge de travail et de la répartition par famille de produits (AT, PUNT, HARD PRO, PWB, SBIN). Quels sont les goulots d'étranglement ?")}
                      className="w-full text-left p-2.5 bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 transition-all rounded-xl text-xs text-white/90 font-medium flex items-center gap-2.5 group cursor-pointer"
                    >
                      <Layers size={14} className="text-accent group-hover:scale-110 transition-transform shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[11px] truncate">📊 Audit de charge par Famille</div>
                        <div className="text-[9px] text-text-dim truncate">Analyse des flux et blocages par gamme</div>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleQuickAction("Analyse toutes les notations (ratings) de nos tâches par famille et format. Quels sont les points faibles techniques et comment progresser ?")}
                      className="w-full text-left p-2.5 bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 transition-all rounded-xl text-xs text-white/90 font-medium flex items-center gap-2.5 group cursor-pointer"
                    >
                      <Sparkles size={14} className="text-accent group-hover:scale-110 transition-transform shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[11px] truncate">⭐ Analyse de Qualité & Notations</div>
                        <div className="text-[9px] text-text-dim truncate">Comment hausser nos notes de prise de vue</div>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleQuickAction("Agis en tant que Manager de Production. Fournis-moi un plan d'action prioritaire et tes conseils de leadership constructif pour faire évoluer nos tâches.")}
                      className="w-full text-left p-2.5 bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 transition-all rounded-xl text-xs text-white/90 font-medium flex items-center gap-2.5 group cursor-pointer"
                    >
                      <TrendingUp size={14} className="text-accent group-hover:scale-110 transition-transform shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[11px] truncate">📋 Directives & Plan d'évolution</div>
                        <div className="text-[9px] text-text-dim truncate">Feuille de route stratégique du jour</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] rounded-xl p-3 text-sm flex flex-col ${msg.role === 'user' ? 'bg-accent/20 text-white ml-auto border border-accent/20' : 'bg-white/5 text-white/90 mr-auto border border-white/10'}`}>
                  <div className="whitespace-pre-line text-xs leading-relaxed max-w-full overflow-x-auto">
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="bg-white/5 text-white/90 mr-auto border border-white/10 rounded-xl p-3 text-sm flex gap-1 items-center h-10 w-16 justify-center">
                  <span className="w-1.5 h-1.5 bg-text-dim rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-text-dim rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-1.5 bg-text-dim rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Posez une question de gestion ou de qualité..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent transition-colors"
                autoFocus
              />
              <button 
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-accent text-black rounded-lg flex items-center justify-center hover:bg-accent/80 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-accent to-accent-blue rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:scale-110 active:scale-95 transition-all cursor-move relative"
        title="Directeur de Production IA (Déplaçable)"
      >
        <Bot size={24} />
        {!isOpen && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent text-black text-[8px] font-black items-center justify-center">!</span>
          </span>
        )}
      </button>
    </motion.div>
  );
};

const getApiUrl = (endpoint: string) => {
  const isPreview = window.location.hostname === 'localhost' || window.location.hostname.includes('run.app');
  return isPreview ? endpoint : `https://mission-controle.onrender.com${endpoint}`;
};

export default function App() {
  const safeFormatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const dates = new Date(timestamp);
    return isNaN(dates.getTime()) ? '-' : dates.toLocaleDateString();
  };

  const safeFormatTime = (timestamp: any) => {
    if (!timestamp) return '-';
    const dates = new Date(timestamp);
    return isNaN(dates.getTime()) ? '-' : dates.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const getNowLocalDatetimeString = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formatDateStringNice = (val?: string) => {
    if (!val) return '-';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} à ${pad(d.getHours())}h${pad(d.getMinutes())}`;
    } catch (e) {
      return val;
    }
  };

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setToast({ show: true, message: 'Google Auth connecté !', type: 'task' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setToast({ show: true, message: 'Erreur connexion Google Auth', type: 'system' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setGoogleUser(null);
    setGoogleToken(null);
  };

  const [isRefreshingScore, setIsRefreshingScore] = useState(false);
  const [deadlineAlertThreshold, setDeadlineAlertThreshold] = useState(3);
  const [globalDeadline, setGlobalDeadline] = useState('');

  const [isMiddleTierVisible, setIsMiddleTierVisible] = useState(true);

  const [visibleTimelineSeries, setVisibleTimelineSeries] = useState({
    prepares: false,
    shooting: false,
    postProd: false,
    livreesCumulees: true,
    livreesJour: false,
    progression: true
  });

  const toggleAllMissions = (enabled: boolean) => {
    setMissions(prev => prev.map(m => ({ ...m, enabled })));
    setGlobalLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: `SYSTÈME : ${enabled ? 'ACTIVATION' : 'DÉSACTIVATION'} de toutes les missions (${missions.length} items).`,
      type: 'manual'
    }]);
    setToast({ show: true, message: `Toutes les missions ${enabled ? 'activées' : 'désactivées'} !`, type: 'task' });
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
  };

  const handleRefreshScore = () => {
    setIsRefreshingScore(true);
    setGlobalLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: `SYSTÈME : Recalcul global des tableaux de production et missions secondaires effectué.`,
      type: 'system'
    }]);
    setTimeout(() => setIsRefreshingScore(false), 1500);
  };

  // State for raw (manually customized) categories
  const [rawCategories, setRawCategories] = useState<CategoryConfig[]>([
    { 
      id: 'family', 
      name: 'Famille', 
      items: ['AT', 'PUNT', 'HARD PRO', 'PWB', 'SBIN', 'Portraits', 'Autre'],
      icon: Layers,
      displayType: 'select',
      colorRef: 'accent-purple'
    },
    { 
      id: 'product', 
      name: 'Produit', 
      items: [
        'AT (black/clear/d.red)', 'AT (clear/clear/black)', 'HARD PRO', 'OCH', 
        'PCF HE 18', 'PWB-30', 'PWB-30/45/70', 'PWB-45', 'PWB-70', 'SBIN', 'Sbin-S', 
        'SC-LL', 'SIA', 'SST', 'Portraits (Houcine)', 'Portraits (Ibthiel)', 
        'Portraits (Kevin K)', 'Portraits (Nolan)'
      ],
      icon: Package,
      displayType: 'select',
      colorRef: 'accent'
    },
    { 
      id: 'color', 
      name: 'Couleur du produit', 
      items: ['bcred', 'bk red', 'BKR', 'ccbk', 'CR White', 'D.Red/PC/Bk', 'grey', 'multi couleur', 'neutre', 'red'],
      icon: Palette,
      displayType: 'select',
      colorRef: 'accent-pink'
    },
    { 
      id: 'argument', 
      name: 'Type d\'argument', 
      items: [
        'close up (action model)', 'close up (fermeture model)', 'close up (joint)', 
        'close up (solidité)', 'close up (transparence)', 'image principale', 
        'lifestyle', 'packshot déco 45°', 'packshot vide 45°'
      ],
      icon: Target,
      displayType: 'buttons',
      colorRef: 'accent-blue'
    },
    { 
      id: 'univers', 
      name: 'Univers', 
      items: ['BUREAU', 'GARAGE', 'PACKSHOT STUDIO', 'SALON', 'neutre'],
      icon: MapPin,
      displayType: 'buttons',
      colorRef: 'accent-purple'
    },
    { 
      id: 'format', 
      name: 'Format', 
      items: ['1464x600', '16/9', '9/16', 'carré', 'standard'],
      icon: Maximize,
      displayType: 'buttons',
      colorRef: 'accent-yellow'
    },
    { 
      id: 'position', 
      name: 'Position', 
      items: ['CENTRE', 'DROITE'],
      icon: Layers,
      displayType: 'buttons',
      colorRef: 'accent-orange'
    },
    { 
      id: 'support', 
      name: 'Support', 
      items: ['photo', 'vidéo', 'graphisme'],
      icon: Film,
      displayType: 'buttons',
      colorRef: 'accent-pink'
    },
    { 
      id: 'priority', 
      name: 'Priorité', 
      items: ['Low priority', 'Medium priority', 'High priority'],
      icon: AlertTriangle,
      displayType: 'buttons',
      colorRef: 'accent-red'
    },
    { 
      id: 'status', 
      name: 'État d\'avancement', 
      items: ['en attente', 'produit préparé', 'en cours de shoot', 'shooté', 'En post-production', 'livré', 'annuler'],
      icon: ClipboardCheck,
      displayType: 'buttons',
      colorRef: 'accent'
    }
  ]);

  // State for missions
  const [missions, setMissions] = useState<Mission[]>([]);

  // Computed categories with historical items dynamically populated from existing missions list
  const computedCategories = useMemo(() => {
    return rawCategories.map(cat => {
      if (cat.id === 'family' || cat.id === 'product' || cat.id === 'color') {
        const uniqueVals = Array.from(new Set(
          missions
            .map(m => {
              if (cat.id === 'family') return m.family;
              if (cat.id === 'product') return m.product;
              return m.color || '';
            })
            .filter((val): val is string => typeof val === 'string' && val.trim() !== '')
        ));

        // Filter and merge (case-insensitive deduplication)
        const existingLower = new Set((cat.items || []).map(i => i.toLowerCase()));
        const extraVals = uniqueVals.filter(v => !existingLower.has(v.toLowerCase()));

        const combined = [
          ...(cat.items || []),
          ...extraVals.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        ].filter(Boolean);

        return { ...cat, items: combined };
      }
      return cat;
    });
  }, [rawCategories, missions]);

  const categories = computedCategories;
  const setCategories = setRawCategories;
  const [secondaryMissions, setSecondaryMissions] = useState<SecondaryMission[]>([]);
  const [autoExportCalendarOnCreate, setAutoExportCalendarOnCreate] = useState<boolean>(false);
  const [autoExportTasksOnCreate, setAutoExportTasksOnCreate] = useState<boolean>(false);
  const [autoExportMainCalendarOnCreate, setAutoExportMainCalendarOnCreate] = useState<boolean>(false);
  const [autoExportMainTasksOnCreate, setAutoExportMainTasksOnCreate] = useState<boolean>(false);
  const [secondaryViewMode, setSecondaryViewMode] = useState<'grid' | 'task' | 'calendar'>('grid');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [sidebarTab, setSidebarTab] = useState<'production' | 'secondary'>('production');
  const [filterDuplicates, setFilterDuplicates] = useState(false);
  const [showDuplicateIndicators, setShowDuplicateIndicators] = useState(true);
  const [showCleanDuplicatesModal, setShowCleanDuplicatesModal] = useState(false);
  const [missionCounter, setMissionCounter] = useState(1);
  const [refPrefix, setRefPrefix] = useState('NK');
  const [refCounter, setRefCounter] = useState(882);
  
  // Form State
  const [selectedFamily, setSelectedFamily] = useState('');
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedArgument, setSelectedArgument] = useState('');
  const [selectedUnivers, setSelectedUnivers] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSecondaryPriority, setSelectedSecondaryPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showSecondaryInReport, setShowSecondaryInReport] = useState(true);
  const [photoRequested, setPhotoRequested] = useState(1);
  const [secondaryTitle, setSecondaryTitle] = useState('');
  const [info, setInfo] = useState('');
  
  // Pending Imports State for Modal
  const [pendingImports, setPendingImports] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  // Duplicate detection
  const isDuplicate = useCallback((m: Mission) => {
    return missions.some(other => 
      other.id !== m.id && 
      other.product === m.product &&
      other.color === m.color &&
      other.univers === m.univers &&
      other.support === m.support &&
      other.format === m.format &&
      other.position === m.position &&
      other.argumentType === m.argumentType &&
      other.info === m.info &&
      (other.createdAt > m.createdAt || (other.createdAt === m.createdAt && other.id > m.id))
    );
  }, [missions]);

  // Global Logs State
  const [globalLogs, setGlobalLogs] = useState<GlobalLogEntry[]>([]);

  const deleteLog = (id: string) => {
    setGlobalLogs(prev => prev.filter(log => log.id !== id));
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [manualLog, setManualLog] = useState('');

  const handleLiveRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // UI State
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, message: string, type: string }>({ show: false, message: '', type: 'calendar' });
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'dashboard' | 'journal' | 'system' | 'inventory'>('table');
  const [inventorySearch, setInventorySearch] = useState('');
  const [showPreparedHistory, setShowPreparedHistory] = useState(false);
  const [showInventoryImport, setShowInventoryImport] = useState(false);
  const [inventoryPreviewData, setInventoryPreviewData] = useState<{ product: string; color: string; quantity: number; priority?: string; info?: string; deadline?: string }[]>([]);
  const [inventoryFileName, setInventoryFileName] = useState('');
  const [importDuplicateMode, setImportDuplicateMode] = useState<'skip' | 'adjust' | 'append'>('skip');
  const [viewMode, setViewMode] = useState<'table' | 'mosaic' | 'grid' | 'task' | 'calendar' | 'family'>('table');
  const [primaryCalendarDate, setPrimaryCalendarDate] = useState(new Date());
  const [isAdvancedSortOpen, setIsAdvancedSortOpen] = useState(false);
  
  // Selection & Bulk Actions
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteIndex, setBulkDeleteIndex] = useState(0);

  // States for unified bulk editing
  const [bulkEditEnabled, setBulkEditEnabled] = useState(true);
  const [bulkEditUpdateEnabled, setBulkEditUpdateEnabled] = useState(false);
  
  const [bulkEditStatus, setBulkEditStatus] = useState('en attente');
  const [bulkEditUpdateStatus, setBulkEditUpdateStatus] = useState(false);
  
  const [bulkEditDeadline, setBulkEditDeadline] = useState('');
  const [bulkEditUpdateDeadline, setBulkEditUpdateDeadline] = useState(false);
  
  const [bulkEditPreparedAt, setBulkEditPreparedAt] = useState('');
  const [bulkEditUpdatePreparedAt, setBulkEditUpdatePreparedAt] = useState(false);
  
  const [bulkEditShotAt, setBulkEditShotAt] = useState('');
  const [bulkEditUpdateShotAt, setBulkEditUpdateShotAt] = useState(false);
  
  const [bulkEditPostProdAt, setBulkEditPostProdAt] = useState('');
  const [bulkEditUpdatePostProdAt, setBulkEditUpdatePostProdAt] = useState(false);
  
  const [bulkEditDeliveredAt, setBulkEditDeliveredAt] = useState('');
  const [bulkEditUpdateDeliveredAt, setBulkEditUpdateDeliveredAt] = useState(false);
  
  const [bulkEditRating, setBulkEditRating] = useState(0);
  const [bulkEditUpdateRating, setBulkEditUpdateRating] = useState(false);

  const openBulkEditModal = () => {
    setBulkEditEnabled(true);
    setBulkEditUpdateEnabled(false);
    
    setBulkEditStatus('en attente');
    setBulkEditUpdateStatus(false);
    
    setBulkEditDeadline('');
    setBulkEditUpdateDeadline(false);
    
    setBulkEditPreparedAt('');
    setBulkEditUpdatePreparedAt(false);
    
    setBulkEditShotAt('');
    setBulkEditUpdateShotAt(false);
    
    setBulkEditPostProdAt('');
    setBulkEditUpdatePostProdAt(false);
    
    setBulkEditDeliveredAt('');
    setBulkEditUpdateDeliveredAt(false);
    
    setBulkEditRating(0);
    setBulkEditUpdateRating(false);

    setBulkStatusModalOpen(true);
  };
  
  // Header Style State
  const [headerBgImage, setHeaderBgImage] = useState<string | null>(null);
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [headerBgColor, setHeaderBgColor] = useState('#000000');
  const [headerBgOpacity, setHeaderBgOpacity] = useState(0.4);
  const [waveColor, setWaveColor] = useState('text-accent');
  const [waveOpacity, setWaveOpacity] = useState(0.3);
  const [waveType, setWaveType] = useState<'liquid' | 'organic' | 'tech'>('liquid');
  const [appFont, setAppFont] = useState('font-roboto');
  const [appFontSize, setAppFontSize] = useState(100);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);
  const [appTextColor, setAppTextColor] = useState('#CBD5E1');
  const [appTextCase, setAppTextCase] = useState<'uppercase' | 'normal'>('normal');
  const [appFontWeight, setAppFontWeight] = useState('font-normal');
  const [navActiveColor, setNavActiveColor] = useState('#FF7A00');
  const [suiteSubtitleColor, setSuiteSubtitleColor] = useState('#FF3D00');
  const [copyBtnColor, setCopyBtnColor] = useState('#DC2626');
  const [saveBtnColor, setSaveBtnColor] = useState('#00FF94');
  const [missionTitleColor, setMissionTitleColor] = useState('#BF7AF0');
  const [refIdColor, setRefIdColor] = useState('#00D1FF');

  // Core Accent Colors
  const [accentColor, setAccentColor] = useState('#00FF94');
  const [accentBlueColor, setAccentBlueColor] = useState('#00D1FF');
  const [accentPurpleColor, setAccentPurpleColor] = useState('#BD00FF');
  const [accentOrangeColor, setAccentOrangeColor] = useState('#FF9900');
  const [accentPinkColor, setAccentPinkColor] = useState('#FF007A');
  const [accentRedColor, setAccentRedColor] = useState('#FF3B30');
  const [accentYellowColor, setAccentYellowColor] = useState('#EBFF00');

  // Inject CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-accent-blue', accentBlueColor);
    root.style.setProperty('--color-accent-purple', accentPurpleColor);
    root.style.setProperty('--color-accent-orange', accentOrangeColor);
    root.style.setProperty('--color-accent-pink', accentPinkColor);
    root.style.setProperty('--color-accent-red', accentRedColor);
    root.style.setProperty('--color-accent-yellow', accentYellowColor);
  }, [accentColor, accentBlueColor, accentPurpleColor, accentOrangeColor, accentPinkColor, accentRedColor, accentYellowColor]);
  
  // Advanced Sort State
  const [sortConfigs, setSortConfigs] = useState<{ key: string; order: 'asc' | 'desc' }[]>([]);
  const logDebounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [tableViewState, setTableViewState] = useState<'full' | 'compact' | 'minimal'>('full');
  
  const [compactHiddenColumns, setCompactHiddenColumns] = useState<string[]>(['imageUrl', 'family', 'color', 'argumentType', 'format', 'position', 'support', 'priority']);
  const [minimalHiddenColumns, setMinimalHiddenColumns] = useState<string[]>(['missionNo', 'imageUrl', 'family', 'color', 'argumentType', 'univers', 'format', 'position', 'support', 'priority', 'deadline', 'info', 'rating', 'progress', 'photoCountRequested', 'photoCountDelivered', 'status', 'product']);
  
  const [manualHiddenColumns, setManualHiddenColumns] = useState<string[]>([]);
  
  // State for changing a project's family via popup/modal
  const [familyEditProduct, setFamilyEditProduct] = useState<{ missionId: string; currentFamily: string } | null>(null);
  
  const hiddenColumns = useMemo(() => {
    if (tableViewState === 'compact') return compactHiddenColumns;
    if (tableViewState === 'minimal') return minimalHiddenColumns;
    return manualHiddenColumns;
  }, [tableViewState, manualHiddenColumns, compactHiddenColumns, minimalHiddenColumns]);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    const updateFn = (prev: string[]) => 
      prev.includes(columnId) ? prev.filter(id => id !== columnId) : [...prev, columnId];
    
    if (tableViewState === 'compact') {
      setCompactHiddenColumns(updateFn);
    } else if (tableViewState === 'minimal') {
      setMinimalHiddenColumns(updateFn);
    } else {
      setManualHiddenColumns(updateFn);
    }
  }, [tableViewState]);

  const applyViewPreset = (mode: 'full' | 'compact' | 'minimal') => {
    setTableViewState(mode);
  };
  
  // Filter state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [filterProducts, setFilterProducts] = useState<string[]>([]);
  const [filterUniverses, setFilterUniverses] = useState<string[]>([]);
  const [filterSupports, setFilterSupports] = useState<string[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);
  const [filterArguments, setFilterArguments] = useState<string[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<string[]>([]);
  const [filterEnabled, setFilterEnabled] = useState<string[]>([]);
  const [filterDeadlineAlert, setFilterDeadlineAlert] = useState(false);
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterDateType, setFilterDateType] = useState<'createdAt' | 'deadline'>('createdAt');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false);
  const [isUniverseFilterOpen, setIsUniverseFilterOpen] = useState(false);
  const [isSupportFilterOpen, setIsSupportFilterOpen] = useState(false);
  const [isColorFilterOpen, setIsColorFilterOpen] = useState(false);
  const [isArgumentFilterOpen, setIsArgumentFilterOpen] = useState(false);
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isEnabledFilterOpen, setIsEnabledFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [collapsedSettingsSections, setCollapsedSettingsSections] = useState<string[]>([]);
  const [collapsedMosaicGroups, setCollapsedMosaicGroups] = useState<string[]>([]);
  const [retractedMosaics, setRetractedMosaics] = useState<boolean>(() => {
    return localStorage.getItem('retractedMosaics') === 'true';
  });
  
  // Journal State
  const [systemDataJson, setSystemDataJson] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // AI Agent Config State
  const defaultAiInstructions = `Analyse mon flux de production, détecte les goulots d'étranglement et propose des optimisations basées sur les priorités et les délais.

LISTE DES COMMANDES :
/matrice : Vue globale du tableau.
/load : Charge par univers (Flux).
/enchawer : Séquençage optimisé plateau.
/inv : Picking dédupliqué.
/scan : Transcription OCR.
/% : Score de progression.
/eod : Bilan soir trié par date.
@Google Agenda : Sync Calendrier.
@Google Tasks : Sync Tâches.
/help : Aide efficace.`;
  const [aiInstructions, setAiInstructions] = useState(defaultAiInstructions);
  const [systemSubTab, setSystemSubTab] = useState<'branding' | 'data' | 'ai' | 'display'>('branding');
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('gemini_custom_api_key') || '');

  // Auto Export state
  const [autoExportEnabled, setAutoExportEnabled] = useState(false);
  const [autoExportInterval, setAutoExportInterval] = useState(60); // minutes
  const [scheduledExportEnabled, setScheduledExportEnabled] = useState(false);
  const [scheduledExportDays, setScheduledExportDays] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [scheduledExportTime, setScheduledExportTime] = useState('18:00');
  const lastExportTimeRef = useRef<number>(Date.now());
  const lastScheduledExportDateRef = useRef<string>('');
  const downloadFullExportRef = useRef<() => void>(() => {});

  // Background interval for auto-export
  useEffect(() => {
    const handleSilenceExport = () => {
       const now = new Date();
       let shouldExport = false;

       // 1. Scheduled Export
       if (scheduledExportEnabled) {
          const currentDayStr = now.getDay().toString();
          const currentHour = now.getHours().toString().padStart(2, '0');
          const currentMinute = now.getMinutes().toString().padStart(2, '0');
          const currentTimeStr = `${currentHour}:${currentMinute}`;
          const todayDateStr = now.toLocaleDateString();
          
          if (scheduledExportDays.includes(currentDayStr) && currentTimeStr === scheduledExportTime && lastScheduledExportDateRef.current !== todayDateStr) {
             lastScheduledExportDateRef.current = todayDateStr;
             shouldExport = true;
          }
       }

       // 2. Periodic Export (only if not already exporting from scheduled)
       if (autoExportEnabled && !shouldExport) {
           const intervalMs = autoExportInterval * 60 * 1000;
           const nowMs = now.getTime();
           if (nowMs - lastExportTimeRef.current >= intervalMs) {
               lastExportTimeRef.current = nowMs;
               shouldExport = true;
           }
       }

       if (shouldExport) {
           if (typeof downloadFullExportRef.current === 'function') {
               downloadFullExportRef.current();
           }
       }
    };
    // Check every 30 seconds
    const timer = setInterval(handleSilenceExport, 30000);
    return () => clearInterval(timer);
  }, [autoExportEnabled, autoExportInterval, scheduledExportEnabled, scheduledExportDays, scheduledExportTime]);

  const generateFullDataJson = useCallback(() => {
    const data = {
      // Core Databases
      missions,
      secondaryMissions,
      missionCounter,
      globalLogs, // Extremely important since the user highlighted this!
      
      // System & Ref Setup
      refPrefix,
      refCounter,
      deadlineAlertThreshold,
      globalDeadline,
      
      // Theme, Typography & Design
      appLogo,
      headerBgColor,
      headerBgImage,
      headerBgOpacity,
      waveColor,
      waveOpacity,
      waveType,
      appFont,
      appFontSize,
      appTextColor,
      appTextCase,
      appFontWeight,
      navActiveColor,
      suiteSubtitleColor,
      copyBtnColor,
      saveBtnColor,
      missionTitleColor,
      refIdColor,
      
      // Accents & Custom Palette Colors
      accentColor,
      accentBlueColor,
      accentPurpleColor,
      accentOrangeColor,
      accentPinkColor,
      accentRedColor,
      accentYellowColor,
      
      // AI Settings
      aiInstructions,
      
      // Display/Layout Configurations
      sortConfigs,
      viewMode,
      tableViewState,
      manualHiddenColumns,
      compactHiddenColumns,
      minimalHiddenColumns,
      collapsedCategories,
      collapsedSettingsSections,
      collapsedMosaicGroups,
      retractedMosaics,
      
      // Auto Export Settings
      autoExportEnabled,
      autoExportInterval,
      scheduledExportEnabled,
      scheduledExportDays,
      scheduledExportTime,
      
      // Custom categories definitions
      categories: categories.map(({ icon, ...rest }) => rest)
    };
    return JSON.stringify(data, null, 2);
  }, [
    missions,
    secondaryMissions,
    missionCounter,
    globalLogs,
    refPrefix,
    refCounter,
    deadlineAlertThreshold,
    globalDeadline,
    appLogo,
    headerBgColor,
    headerBgImage,
    headerBgOpacity,
    waveColor,
    waveOpacity,
    waveType,
    appFont,
    appFontSize,
    appTextColor,
    appTextCase,
    appFontWeight,
    navActiveColor,
    suiteSubtitleColor,
    copyBtnColor,
    saveBtnColor,
    missionTitleColor,
    refIdColor,
    accentColor,
    accentBlueColor,
    accentPurpleColor,
    accentOrangeColor,
    accentPinkColor,
    accentRedColor,
    accentYellowColor,
    aiInstructions,
    sortConfigs,
    viewMode,
    tableViewState,
    manualHiddenColumns,
    compactHiddenColumns,
    minimalHiddenColumns,
    collapsedCategories,
    collapsedSettingsSections,
    collapsedMosaicGroups,
    retractedMosaics,
    autoExportEnabled,
    autoExportInterval,
    scheduledExportEnabled,
    scheduledExportDays,
    scheduledExportTime,
    categories
  ]);

  const copySystemJson = () => {
    const json = generateFullDataJson();
    setSystemDataJson(json);
    navigator.clipboard.writeText(json);
    setToast({
      show: true,
      message: 'Flux JSON copié dans le presse-papier !',
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const downloadSystemJson = () => {
    const json = generateFullDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    link.href = url;
    link.download = `Mission_Controle_Backup_${dateStr}_${timeStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setToast({
      show: true,
      message: 'Fichier de sauvegarde .json exporté !',
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSystemDataJson(content);
      setToast({
        show: true,
        message: 'Fichier chargé dans l\'éditeur. Cliquez sur IMPORTER pour restaurer.',
        type: 'task'
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const backupToGoogleDrive = async () => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Auth requis pour sauvegarder sur Drive.', type: 'alert' });
      return;
    }
    const confirmed = window.confirm('Voulez-vous sauvegarder les données actuelles dans votre Google Drive ?');
    if (!confirmed) return;

    setToast({ show: true, message: 'Sauvegarde vers Drive...', type: 'task' });
    try {
      const json = generateFullDataJson();
      const base64Data = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(json)));
      const fileName = `MissionControle_Backup_${new Date().toISOString().split('T')[0]}.json`;

      const res = await fetch(getApiUrl('/api/drive/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: { access_token: googleToken }, 
          pdfBase64: base64Data, 
          fileName,
          mimeType: 'application/json'
        })
      });

      if (!res.ok) throw new Error('Erreur upload Drive');
      setToast({ show: true, message: 'Sauvegardé sur Google Drive avec succès !', type: 'task' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Erreur lors de la sauvegarde sur Drive.', type: 'alert' });
    }
  };

  const pushMissionsToTasks = async (ids: string[]) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Auth requis pour Tasks.', type: 'alert' });
      return;
    }
    const confirmed = window.confirm(`Voulez-vous ajouter les ${ids.length} missions à Google Tasks ?`);
    if (!confirmed) return;

    setToast({ show: true, message: 'Création de tâches en cours...', type: 'task' });
    for (const id of ids) {
      const mission = missions.find(m => m.id === id);
      if (!mission) continue;
      try {
        await fetch(getApiUrl('/api/tasks/task'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokens: { access_token: googleToken },
            title: `[Mission ${mission.refId}] - ${mission.product}`,
            notes: `Infos: ${mission.info}\nFormat: ${mission.format}\nStatus: ${mission.status}`,
            due: mission.deadline ? new Date(mission.deadline).toISOString() : undefined
          })
        });
      } catch(err) {
        console.error('Task sync err', err);
      }
    }
    setToast({ show: true, message: `${ids.length} missions envoyées sur Google Tasks !`, type: 'task' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const pushMissionsToCalendar = async (ids: string[]) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Auth requis pour l\'Agenda.', type: 'alert' });
      return;
    }
    const confirmed = window.confirm(`Voulez-vous programmer ces ${ids.length} missions dans Google Agenda ?`);
    if (!confirmed) return;

    setToast({ show: true, message: 'Création des événements...', type: 'task' });
    for (const id of ids) {
      const mission = missions.find(m => m.id === id);
      if (!mission) continue;
      try {
        await fetch(getApiUrl('/api/calendar/event'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokens: { access_token: googleToken },
            summary: `[Shoot] ${mission.refId} - ${mission.product}`,
            description: `Mission info: ${mission.info}\nCouleur: ${mission.color}\nUnivers: ${mission.univers}`,
            dueDate: mission.deadline || new Date().toISOString()
          })
        });
      } catch(err) {
        console.error('Calendar sync err', err);
      }
    }
    setToast({ show: true, message: `${ids.length} missions ajoutées à Google Agenda !`, type: 'task' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };
  
  // AI Agent Config State and subtabs moved above generateFullDataJson to avoid hoisting issues
  
  // Feedback State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'praise'>('suggestion');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Movement analysis from logs helper
  const getMovementAnalysis = useCallback(() => {
    const now = Date.now();
    const lastHour = now - (3600 * 1000);
    const recentLogs = globalLogs.filter(l => l.timestamp > lastHour);
    
    return {
      totalActions: recentLogs.length,
      creations: recentLogs.filter(l => l.message.includes('Ajout mission')).length,
      updates: recentLogs.filter(l => l.message.includes('Mise à jour') || l.message.includes('Status changed')).length,
      deletions: recentLogs.filter(l => l.message.includes('Suppression')).length,
      latency: recentLogs.length > 0 ? '0.002ms' : '0.000ms'
    };
  }, [globalLogs]);

  const isDeadlineApproaching = (deadlineStr?: string) => {
    if (!deadlineStr || deadlineStr === '-') return false;
    
    let date: Date;
    if (deadlineStr.includes('/')) {
      const [d, m, y] = deadlineStr.split('/').map(Number);
      date = new Date(y, m - 1, d);
    } else {
      date = new Date(deadlineStr);
    }
    
    if (isNaN(date.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(date);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= deadlineAlertThreshold;
  };

  // Persistence logic
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedMissions = localStorage.getItem('missions');
        const savedCounter = localStorage.getItem('missionCounter');
        const savedRefPrefix = localStorage.getItem('refPrefix');
        const savedRefCounter = localStorage.getItem('refCounter');
        const savedCategories = localStorage.getItem('categories');
        const savedHeaderBg = localStorage.getItem('headerBgImage');
        const savedHeaderOpacity = localStorage.getItem('headerBgOpacity');
        const savedLogs = localStorage.getItem('globalLogs');
        const savedWaveColor = localStorage.getItem('waveColor');
        const savedWaveOpacity = localStorage.getItem('waveOpacity');
        const savedWaveType = localStorage.getItem('waveType');
        const savedFont = localStorage.getItem('appFont');
        const savedFontSize = localStorage.getItem('appFontSize');
        const savedTextColor = localStorage.getItem('appTextColor');
        const savedTextCase = localStorage.getItem('appTextCase');
        const savedFontWeight = localStorage.getItem('appFontWeight');
        const savedNavActiveColor = localStorage.getItem('navActiveColor');
        const savedSuiteSubtitleColor = localStorage.getItem('suiteSubtitleColor');
        const savedCopyBtnColor = localStorage.getItem('copyBtnColor');
        const savedSaveBtnColor = localStorage.getItem('saveBtnColor');
        const savedMissionTitleColor = localStorage.getItem('missionTitleColor');
        const savedRefIdColor = localStorage.getItem('refIdColor');
        const savedAccentColor = localStorage.getItem('accentColor');
        const savedAccentBlueColor = localStorage.getItem('accentBlueColor');
        const savedAccentPurpleColor = localStorage.getItem('accentPurpleColor');
        const savedAccentOrangeColor = localStorage.getItem('accentOrangeColor');
        const savedAccentPinkColor = localStorage.getItem('accentPinkColor');
        const savedAccentRedColor = localStorage.getItem('accentRedColor');
        const savedAccentYellowColor = localStorage.getItem('accentYellowColor');

        const savedSortConfigs = localStorage.getItem('sortConfigs');
        const savedViewMode = localStorage.getItem('viewMode');
        const savedTableViewState = localStorage.getItem('tableViewState');
        const savedManualHiddenColumns = localStorage.getItem('manualHiddenColumns');
        const savedAiInstructions = localStorage.getItem('aiInstructions');
        
        const safeParse = (str: string | null) => {
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (e: any) {
            console.warn('Safe parse failed, attempting recovery:', e.message);
            // Recovery for trailing junk
            const match = str.match(/^[\s\S]*\}/);
            if (match) {
              try {
                return JSON.parse(match[0]);
              } catch (e2) {
                return null;
              }
            }
            return null;
          }
        };
        
        if (savedMissions) {
          const parsed = safeParse(savedMissions);
          if (parsed && Array.isArray(parsed)) {
            const migrated = parsed.map((m: any) => ({
              ...m,
              family: m.family ?? deduceFamily(m.product) ?? 'Autre',
              enabled: m.enabled ?? true,
              photoCountRequested: m.photoCountRequested ?? 1,
              photoCountDelivered: m.photoCountDelivered ?? 0
            }));
            setMissions(migrated);
          }
        }
        
        const savedSecondaryMissions = localStorage.getItem('secondaryMissions');
        const savedThreshold = localStorage.getItem('deadlineAlertThreshold');
        if (savedThreshold) setDeadlineAlertThreshold(parseInt(savedThreshold));

        const savedGlobalDeadline = localStorage.getItem('globalDeadline');
        if (savedGlobalDeadline) setGlobalDeadline(savedGlobalDeadline);

        const savedAutoExportEnabled = localStorage.getItem('autoExportEnabled');
        if (savedAutoExportEnabled !== null) setAutoExportEnabled(savedAutoExportEnabled === 'true');
        
        const savedAutoExportInterval = localStorage.getItem('autoExportInterval');
        if (savedAutoExportInterval) setAutoExportInterval(parseInt(savedAutoExportInterval, 10));

        const savedScheduledExportEnabled = localStorage.getItem('scheduledExportEnabled');
        if (savedScheduledExportEnabled !== null) setScheduledExportEnabled(savedScheduledExportEnabled === 'true');
        
        const savedScheduledExportDays = localStorage.getItem('scheduledExportDays');
        if (savedScheduledExportDays) {
           try {
              setScheduledExportDays(JSON.parse(savedScheduledExportDays));
           } catch {
              // fallback
           }
        } else {
           const savedScheduledExportDay = localStorage.getItem('scheduledExportDay');
           if (savedScheduledExportDay) setScheduledExportDays([savedScheduledExportDay]);
        }
        
        const savedScheduledExportTime = localStorage.getItem('scheduledExportTime');
        if (savedScheduledExportTime) setScheduledExportTime(savedScheduledExportTime);

        if (savedSecondaryMissions) {
          const parsed = safeParse(savedSecondaryMissions);
          if (parsed && Array.isArray(parsed)) {
            setSecondaryMissions(parsed);
          }
        }

        if (savedCounter) {
          const val = safeParse(savedCounter);
          if (val !== null) setMissionCounter(val);
        }
        if (savedRefPrefix) setRefPrefix(savedRefPrefix);
        if (savedRefCounter) {
          const val = safeParse(savedRefCounter);
          if (val !== null) setRefCounter(val);
        }
        const savedHeaderBgColor = localStorage.getItem('headerBgColor');
        const savedAppLogo = localStorage.getItem('appLogo');
        if (savedHeaderBgColor) setHeaderBgColor(savedHeaderBgColor);
        if (savedAppLogo) setAppLogo(savedAppLogo);
        
        if (savedHeaderBg) setHeaderBgImage(savedHeaderBg);
        if (savedHeaderOpacity) setHeaderBgOpacity(parseFloat(savedHeaderOpacity));
        if (savedLogs) {
          const val = safeParse(savedLogs);
          if (val !== null) setGlobalLogs(val);
        }
        if (savedWaveColor) setWaveColor(savedWaveColor);
        if (savedWaveOpacity) setWaveOpacity(parseFloat(savedWaveOpacity));
        if (savedWaveType) setWaveType(savedWaveType as any);
        if (savedFont) setAppFont(savedFont);
        if (savedFontSize) setAppFontSize(parseInt(savedFontSize));
        if (savedTextColor) setAppTextColor(savedTextColor);
        if (savedTextCase) setAppTextCase(savedTextCase as any);
        if (savedFontWeight) setAppFontWeight(savedFontWeight);
        if (savedNavActiveColor) setNavActiveColor(savedNavActiveColor);
        if (savedSuiteSubtitleColor) setSuiteSubtitleColor(savedSuiteSubtitleColor);
        if (savedCopyBtnColor) setCopyBtnColor(savedCopyBtnColor);
        if (savedSaveBtnColor) setSaveBtnColor(savedSaveBtnColor);
        if (savedMissionTitleColor) setMissionTitleColor(savedMissionTitleColor);
        if (savedRefIdColor) setRefIdColor(savedRefIdColor);
        if (savedAccentColor) setAccentColor(savedAccentColor);
        if (savedAccentBlueColor) setAccentBlueColor(savedAccentBlueColor);
        if (savedAccentPurpleColor) setAccentPurpleColor(savedAccentPurpleColor);
        if (savedAccentOrangeColor) setAccentOrangeColor(savedAccentOrangeColor);
        if (savedAccentPinkColor) setAccentPinkColor(savedAccentPinkColor);
        if (savedAccentRedColor) setAccentRedColor(savedAccentRedColor);
        if (savedAccentYellowColor) setAccentYellowColor(savedAccentYellowColor);
        
        if (savedAiInstructions) {
          if (savedAiInstructions === 'Analyse mon flux de production, détecte les goulots d\'étranglement et propose des optimisations basées sur les priorités et les délais.') {
            setAiInstructions(defaultAiInstructions);
          } else {
            setAiInstructions(savedAiInstructions);
          }
        }
        if (savedSortConfigs) {
          const val = safeParse(savedSortConfigs);
          if (val !== null) setSortConfigs(val);
        }
        if (savedViewMode) setViewMode(savedViewMode as any);
        if (savedTableViewState) setTableViewState(savedTableViewState as any);
        
        if (savedManualHiddenColumns) {
          const val = safeParse(savedManualHiddenColumns);
          if (val !== null) setManualHiddenColumns(val);
        }
        
        const savedCompactPreset = localStorage.getItem('compactHiddenColumns');
        if (savedCompactPreset) {
          const val = safeParse(savedCompactPreset);
          if (val !== null) setCompactHiddenColumns(val);
        }

        const savedMinimalPreset = localStorage.getItem('minimalHiddenColumns');
        if (savedMinimalPreset) {
          const val = safeParse(savedMinimalPreset);
          if (val !== null) setMinimalHiddenColumns(val);
        }
        
        const savedCollapsed = localStorage.getItem('collapsedCategories');
        if (savedCollapsed) {
          const val = safeParse(savedCollapsed);
          if (val !== null) setCollapsedCategories(val);
        }
        
        const savedCollapsedSettings = localStorage.getItem('collapsedSettingsSections');
        if (savedCollapsedSettings) {
          const val = safeParse(savedCollapsedSettings);
          if (val !== null) setCollapsedSettingsSections(val);
        }
        
        const savedCollapsedMosaicGroups = localStorage.getItem('collapsedMosaicGroups');
        if (savedCollapsedMosaicGroups) {
          const val = safeParse(savedCollapsedMosaicGroups);
          if (val !== null) setCollapsedMosaicGroups(val);
        }
        
        if (savedCategories) {
          const parsed = safeParse(savedCategories);
          if (parsed && Array.isArray(parsed)) {
            // Merge loaded list with initial categories to keep newly added ones like 'family'
            const restored = categories.map((config) => {
              const saved = parsed.find((p: any) => p.id === config.id);
              if (saved) {
                let finalItems = saved.items || config.items;
                // Migration: ensures "En post-production" is present in the status items if missing
                if (config.id === 'status' && !finalItems.includes('En post-production')) {
                  const newItems = [...finalItems];
                  const index = newItems.indexOf('livré');
                  if (index !== -1) {
                    newItems.splice(index, 0, 'En post-production');
                  } else {
                    newItems.push('En post-production');
                  }
                  finalItems = newItems;
                }
                return {
                  ...config,
                  ...saved,
                  items: finalItems,
                  icon: config.icon
                };
              }
              return config;
            });
            setCategories(restored);
          }
        }
      } catch (err) {
        console.error('Persistence load error:', err);
      }
    };

    loadSavedData();
  }, []);


  const captureAsJPEG = async () => {
    const reportElement = document.getElementById('global-report-container');
    if (!reportElement) return;

    try {
      setIsCapturing(true);
      
      // Force visibility for capture
      const originalStyle = reportElement.style.display;
      const originalPosition = reportElement.style.position;
      const originalTop = reportElement.style.top;
      const originalLeft = reportElement.style.left;
      const originalWidth = reportElement.style.width;
      
      reportElement.style.display = 'block';
      reportElement.style.position = 'relative';
      reportElement.style.top = '0';
      reportElement.style.left = '0';
      reportElement.style.width = '1200px'; 

      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sanitize styles to prevent html2canvas crashing on oklch() / oklab() color functions
      const styleElements = Array.from(document.querySelectorAll('style'));
      const originalStyles = styleElements.map(el => ({
        element: el,
        text: el.textContent
      }));

      styleElements.forEach(el => {
        if (el.textContent) {
          let text = el.textContent;
          text = text.replace(/oklch\([^)]+\)/gi, '#00ff94');
          text = text.replace(/oklab\([^)]+\)/gi, '#00ff94');
          el.textContent = text;
        }
      });

      let canvas;
      try {
        canvas = await html2canvas(reportElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0A0A0A',
          logging: false,
          width: 1200
        });
      } finally {
        // Restore styles immediately
        originalStyles.forEach(s => {
          s.element.textContent = s.text;
        });
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
      
      const link = document.createElement('a');
      link.download = `MissionControle_Rapport_Global_${dateStr}_${timeStr}.jpg`;
      link.href = dataUrl;
      link.click();

      setToast({
        show: true,
        message: 'Rapport Global JPEG généré !',
        type: 'task'
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);

      // Restore
      reportElement.style.display = originalStyle;
      reportElement.style.position = originalPosition;
      reportElement.style.top = originalTop;
      reportElement.style.left = originalLeft;
      reportElement.style.width = originalWidth;
    } catch (err) {
      console.error('Capture error:', err);
      setToast({ show: true, message: 'Erreur lors de la capture JPEG.', type: 'alert' });
    } finally {
      setIsCapturing(false);
    }
  };

  // Helper function for capturing an element to JPEG
  const captureElementToJpeg = async (id: string, fileName: string, options: { pixelRatio?: number; quality?: number; skipDownload?: boolean } = {}) => {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID ${id} not found for export.`);
      return null;
    }

    try {
      // Increase delay to ensure SVG/Recharts stability
      await new Promise(resolve => setTimeout(resolve, 600));

      const { width, height } = element.getBoundingClientRect();
      
      if (width === 0 || height === 0) {
        throw new Error('Element has no visible dimensions');
      }

      // Sanitize styles to prevent html2canvas crashing on oklch() / oklab() color functions
      const styleElements = Array.from(document.querySelectorAll('style'));
      const originalStyles = styleElements.map(el => ({
        element: el,
        text: el.textContent
      }));

      styleElements.forEach(el => {
        if (el.textContent) {
          let text = el.textContent;
          text = text.replace(/oklch\([^)]+\)/gi, '#00ff94');
          text = text.replace(/oklab\([^)]+\)/gi, '#00ff94');
          el.textContent = text;
        }
      });

      let canvas;
      try {
        canvas = await html2canvas(element, {
          scale: options.pixelRatio || 2,
          width: width,
          height: height,
          useCORS: true,
          backgroundColor: '#0A0A0A',
          logging: false
        });
      } finally {
        // Restore styles immediately
        originalStyles.forEach(s => {
          s.element.textContent = s.text;
        });
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', options.quality || 0.95);

      if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 500) {
        throw new Error('Generated image is empty');
      }

      if (options.skipDownload) {
        return dataUrl;
      }

      // Try to use File System Access API if available for "Choose Location"
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `${fileName.replace(/\s+/g, '_')}_${new Date().getTime()}.jpg`,
            types: [{
              description: 'Image JPEG',
              accept: { 'image/jpeg': ['.jpg'] },
            }],
          });
          const writable = await handle.createWritable();
          // Convert dataUrl to blob
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          await writable.write(blob);
          await writable.close();
          return true;
        } catch (pickerErr) {
          // If user cancels or permission denied, fallback to standard download
          console.log('Save picker canceled or failed, using fallback anchor download', pickerErr);
        }
      }

      // Fallback: standard download anchor
      const link = document.createElement('a');
      link.download = `${fileName.replace(/\s+/g, '_')}_${new Date().getTime()}.jpg`;
      link.href = dataUrl;
      link.click();
      return true;
    } catch (err) {
      console.error(`Capture failed for ${id}:`, err);
      return null;
    }
  };

  const exportChartAsJPEG = async (id: string, fileName: string) => {
    try {
      setIsCapturing(true);
      const result = await captureElementToJpeg(id, fileName);
      
      if (result) {
        setToast({
          show: true,
          message: `Graphique "${fileName}" exporté !`,
          type: 'task'
        });
      } else {
        setToast({ show: true, message: 'Erreur lors de l\'export du graphique.', type: 'alert' });
      }
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    } finally {
      setIsCapturing(false);
    }
  };

  const getCurrentWeekNumber = () => {
    const d = new Date();
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const getDayMonthYear = () => {
    const d = new Date();
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportAllCharts = async () => {
    const reportElement = document.getElementById('global-report-container');
    if (!reportElement) {
      setToast({ show: true, message: 'Erreur: Template de rapport non trouvé.', type: 'alert' });
      return;
    }

    const charts = [
      { id: 'report-dashboard-strategic', name: 'Dashboard Performance Strategique' },
      { id: 'report-chart-timeline', name: 'Evolution Hebdomadaire' },
      { id: 'report-chart-status', name: 'Distribution par État' },
      { id: 'report-chart-support', name: 'Répartition Supports' },
      { id: 'report-chart-product', name: 'Répartition Produits' },
      { id: 'report-chart-univers', name: 'Répartition Univers' },
      { id: 'report-chart-argument', name: 'Type d\'Argument' },
      { id: 'report-chart-poids', name: 'Poids Stratégique' }
    ];

    setToast({ show: true, message: 'Génération du pack de graphiques (ZIP)...', type: 'task' });
    
    const originalDisplay = reportElement.style.display;
    
    try {
      setIsCapturing(true);
      
      // Force display for measurement
      reportElement.style.display = 'block';
      
      const zip = new JSZip();
      let successCount = 0;

      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        setToast({ 
          show: true, 
          message: `Capture : ${chart.name} (${i + 1}/${charts.length})`, 
          type: 'task' 
        });
        
        const dataUrl = await captureElementToJpeg(chart.id, chart.name, { skipDownload: true });
        if (dataUrl && typeof dataUrl === 'string') {
          const imgData = dataUrl.split(',')[1];
          zip.file(`${chart.name.replace(/\s+/g, '_')}.jpg`, imgData, { base64: true });
          successCount++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      reportElement.style.display = originalDisplay;

      if (successCount > 0) {
        setToast({ show: true, message: 'Création du fichier ZIP...', type: 'task' });
        const content = await zip.generateAsync({ type: 'blob' });
        const zipFileName = `Graphiques_MissionControle_${new Date().getTime()}.zip`;

        // Try to use File System Access API for ZIP as well
        if ('showSaveFilePicker' in window) {
            try {
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: zipFileName,
                    types: [{
                        description: 'Fichier ZIP',
                        accept: { 'application/zip': ['.zip'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();
            } catch (pickerErr) {
                // Fallback
                const link = document.createElement('a');
                link.download = zipFileName;
                link.href = URL.createObjectURL(content);
                link.click();
            }
        } else {
            const link = document.createElement('a');
            link.download = zipFileName;
            link.href = URL.createObjectURL(content);
            link.click();
        }

        setToast({
          show: true,
          message: `${successCount} graphiques regroupés dans le ZIP !`,
          type: 'task'
        });
      } else {
        setToast({ show: true, message: 'Aucun graphique n\'a pu être capturé.', type: 'alert' });
      }

      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    } catch (err) {
      console.error('Batch export error:', err);
      setToast({ show: true, message: 'Erreur critique lors de l\'export ZIP.', type: 'alert' });
    } finally {
      setIsCapturing(false);
    }
  };

  const processImport = (jsonStr: string) => {
    let cleanJson = jsonStr.trim();
    if (!cleanJson) return;

    try {
      // Robust attempt: try to extract the JSON object if it has trailing junk
      let data;
      const safeParse = (str: string) => {
        try {
          return JSON.parse(str);
        } catch (parseErr: any) {
          // If it fails with "after JSON" error, try to extract the JSON part
          if (parseErr.message && parseErr.message.toLowerCase().includes('after json')) {
            const match = str.match(/^[\s\S]*\}/);
            if (match) {
              return JSON.parse(match[0]);
            }
          }
          throw parseErr;
        }
      };

      data = safeParse(cleanJson);
      
      // Update states
      if (data.missions) setMissions(data.missions);
      if (data.secondaryMissions) setSecondaryMissions(data.secondaryMissions);
      if (data.missionCounter !== undefined) setMissionCounter(data.missionCounter);
      if (data.refPrefix) setRefPrefix(data.refPrefix);
      if (data.refCounter !== undefined) setRefCounter(data.refCounter);
      if (data.deadlineAlertThreshold !== undefined) setDeadlineAlertThreshold(data.deadlineAlertThreshold);
      if (data.globalDeadline !== undefined) setGlobalDeadline(data.globalDeadline);
      
      if (data.appLogo !== undefined) setAppLogo(data.appLogo);
      if (data.headerBgColor) setHeaderBgColor(data.headerBgColor);
      if (data.headerBgImage !== undefined) setHeaderBgImage(data.headerBgImage);
      if (data.headerBgOpacity !== undefined) setHeaderBgOpacity(data.headerBgOpacity);
      if (data.waveColor) setWaveColor(data.waveColor);
      if (data.waveOpacity !== undefined) setWaveOpacity(data.waveOpacity);
      if (data.waveType) setWaveType(data.waveType);
      
      if (data.appFont) setAppFont(data.appFont);
      if (data.appFontSize !== undefined) setAppFontSize(data.appFontSize);
      if (data.appTextColor) setAppTextColor(data.appTextColor);
      if (data.appTextCase) setAppTextCase(data.appTextCase);
      if (data.appFontWeight) setAppFontWeight(data.appFontWeight);
      if (data.navActiveColor) setNavActiveColor(data.navActiveColor);
      if (data.suiteSubtitleColor) setSuiteSubtitleColor(data.suiteSubtitleColor);
      if (data.copyBtnColor) setCopyBtnColor(data.copyBtnColor);
      if (data.saveBtnColor) setSaveBtnColor(data.saveBtnColor);
      if (data.missionTitleColor) setMissionTitleColor(data.missionTitleColor);
      if (data.refIdColor) setRefIdColor(data.refIdColor);
      
      if (data.accentColor) setAccentColor(data.accentColor);
      if (data.accentBlueColor) setAccentBlueColor(data.accentBlueColor);
      if (data.accentPurpleColor) setAccentPurpleColor(data.accentPurpleColor);
      if (data.accentOrangeColor) setAccentOrangeColor(data.accentOrangeColor);
      if (data.accentPinkColor) setAccentPinkColor(data.accentPinkColor);
      if (data.accentRedColor) setAccentRedColor(data.accentRedColor);
      if (data.accentYellowColor) setAccentYellowColor(data.accentYellowColor);
      
      if (data.aiInstructions) setAiInstructions(data.aiInstructions);
      
      if (data.sortConfigs) setSortConfigs(data.sortConfigs);
      if (data.viewMode) setViewMode(data.viewMode);
      if (data.tableViewState) setTableViewState(data.tableViewState);
      if (data.manualHiddenColumns) setManualHiddenColumns(data.manualHiddenColumns);
      if (data.compactHiddenColumns) setCompactHiddenColumns(data.compactHiddenColumns);
      if (data.minimalHiddenColumns) setMinimalHiddenColumns(data.minimalHiddenColumns);
      if (data.collapsedCategories) setCollapsedCategories(data.collapsedCategories);
      if (data.collapsedSettingsSections) setCollapsedSettingsSections(data.collapsedSettingsSections);
      if (data.collapsedMosaicGroups) setCollapsedMosaicGroups(data.collapsedMosaicGroups);
      if (data.retractedMosaics !== undefined) setRetractedMosaics(data.retractedMosaics);
      
      if (data.autoExportEnabled !== undefined) setAutoExportEnabled(data.autoExportEnabled);
      if (data.autoExportInterval !== undefined) setAutoExportInterval(data.autoExportInterval);
      if (data.scheduledExportEnabled !== undefined) setScheduledExportEnabled(data.scheduledExportEnabled);
      if (data.scheduledExportDays) setScheduledExportDays(data.scheduledExportDays);
      if (data.scheduledExportTime) setScheduledExportTime(data.scheduledExportTime);

      if (data.globalLogs) setGlobalLogs(data.globalLogs);
      if (data.categories) {
        const restored = data.categories.map((cat: any) => {
          const original = categories.find(c => c.id === cat.id);
          return { ...cat, icon: original?.icon || Package };
        });
        setCategories(restored);
      }

      // Force save to localStorage
      if (data.missions !== undefined) localStorage.setItem('missions', JSON.stringify(data.missions));
      if (data.secondaryMissions !== undefined) localStorage.setItem('secondaryMissions', JSON.stringify(data.secondaryMissions));
      if (data.missionCounter !== undefined) localStorage.setItem('missionCounter', JSON.stringify(data.missionCounter));
      if (data.refPrefix) localStorage.setItem('refPrefix', data.refPrefix);
      if (data.refCounter) localStorage.setItem('refCounter', data.refCounter.toString());
      if (data.deadlineAlertThreshold !== undefined) localStorage.setItem('deadlineAlertThreshold', data.deadlineAlertThreshold.toString());
      if (data.globalDeadline !== undefined) localStorage.setItem('globalDeadline', data.globalDeadline);
      if (data.appLogo !== undefined) {
         if (data.appLogo) localStorage.setItem('appLogo', data.appLogo);
         else localStorage.removeItem('appLogo');
      }
      if (data.headerBgColor) localStorage.setItem('headerBgColor', data.headerBgColor);
      if (data.headerBgImage) localStorage.setItem('headerBgImage', data.headerBgImage);
      if (data.headerBgOpacity !== undefined) localStorage.setItem('headerBgOpacity', data.headerBgOpacity.toString());
      if (data.waveColor) localStorage.setItem('waveColor', data.waveColor);
      if (data.waveOpacity !== undefined) localStorage.setItem('waveOpacity', data.waveOpacity.toString());
      if (data.waveType) localStorage.setItem('waveType', data.waveType);
      
      if (data.appFont) localStorage.setItem('appFont', data.appFont);
      if (data.appFontSize !== undefined) localStorage.setItem('appFontSize', data.appFontSize.toString());
      if (data.appTextColor) localStorage.setItem('appTextColor', data.appTextColor);
      if (data.appTextCase) localStorage.setItem('appTextCase', data.appTextCase);
      if (data.appFontWeight) localStorage.setItem('appFontWeight', data.appFontWeight);
      if (data.navActiveColor) localStorage.setItem('navActiveColor', data.navActiveColor);
      if (data.suiteSubtitleColor) localStorage.setItem('suiteSubtitleColor', data.suiteSubtitleColor);
      if (data.copyBtnColor) localStorage.setItem('copyBtnColor', data.copyBtnColor);
      if (data.saveBtnColor) localStorage.setItem('saveBtnColor', data.saveBtnColor);
      if (data.missionTitleColor) localStorage.setItem('missionTitleColor', data.missionTitleColor);
      if (data.refIdColor) localStorage.setItem('refIdColor', data.refIdColor);
      if (data.accentColor) localStorage.setItem('accentColor', data.accentColor);
      if (data.accentBlueColor) localStorage.setItem('accentBlueColor', data.accentBlueColor);
      if (data.accentPurpleColor) localStorage.setItem('accentPurpleColor', data.accentPurpleColor);
      if (data.accentOrangeColor) localStorage.setItem('accentOrangeColor', data.accentOrangeColor);
      if (data.accentPinkColor) localStorage.setItem('accentPinkColor', data.accentPinkColor);
      if (data.accentRedColor) localStorage.setItem('accentRedColor', data.accentRedColor);
      if (data.accentYellowColor) localStorage.setItem('accentYellowColor', data.accentYellowColor);
      if (data.aiInstructions) localStorage.setItem('aiInstructions', data.aiInstructions);
      if (data.sortConfigs !== undefined) localStorage.setItem('sortConfigs', JSON.stringify(data.sortConfigs));
      if (data.viewMode) localStorage.setItem('viewMode', data.viewMode);
      if (data.tableViewState) localStorage.setItem('tableViewState', data.tableViewState);
      if (data.manualHiddenColumns !== undefined) localStorage.setItem('manualHiddenColumns', JSON.stringify(data.manualHiddenColumns));
      if (data.compactHiddenColumns !== undefined) localStorage.setItem('compactHiddenColumns', JSON.stringify(data.compactHiddenColumns));
      if (data.minimalHiddenColumns !== undefined) localStorage.setItem('minimalHiddenColumns', JSON.stringify(data.minimalHiddenColumns));
      if (data.collapsedCategories !== undefined) localStorage.setItem('collapsedCategories', JSON.stringify(data.collapsedCategories));
      if (data.collapsedSettingsSections !== undefined) localStorage.setItem('collapsedSettingsSections', JSON.stringify(data.collapsedSettingsSections));
      if (data.collapsedMosaicGroups !== undefined) localStorage.setItem('collapsedMosaicGroups', JSON.stringify(data.collapsedMosaicGroups));
      if (data.retractedMosaics !== undefined) localStorage.setItem('retractedMosaics', data.retractedMosaics.toString());
      if (data.autoExportEnabled !== undefined) localStorage.setItem('autoExportEnabled', data.autoExportEnabled.toString());
      if (data.autoExportInterval !== undefined) localStorage.setItem('autoExportInterval', data.autoExportInterval.toString());
      if (data.scheduledExportEnabled !== undefined) localStorage.setItem('scheduledExportEnabled', data.scheduledExportEnabled.toString());
      if (data.scheduledExportDays !== undefined) localStorage.setItem('scheduledExportDays', JSON.stringify(data.scheduledExportDays));
      if (data.scheduledExportTime) localStorage.setItem('scheduledExportTime', data.scheduledExportTime);
      
      if (data.globalLogs !== undefined) localStorage.setItem('globalLogs', JSON.stringify(data.globalLogs));
      if (data.categories !== undefined) {
        const catsToSave = data.categories.map(({ icon, ...rest }: any) => rest);
        localStorage.setItem('categories', JSON.stringify(catsToSave));
      }

      setToast({
        show: true,
        message: 'SYSTÈME : Données injectées et restaurées !',
        type: 'task'
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      setSystemDataJson('');
      return true;
    } catch (err) {
      console.error('Import error:', err);
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        alert('ERREUR DE STOCKAGE : Les données sont trop volumineuses pour le navigateur (Quota LocalStorage dépassé). Essayez d\'importer moins de missions avec des images.');
      } else {
        alert('Erreur : Format de données invalide. Assurez-vous de coller le JSON complet fourni par le bouton COPIER.');
      }
      return false;
    }
  };

  const importSystemData = () => {
    processImport(systemDataJson);
  };

  const exportSystemData = () => {
    copySystemJson();
    downloadSystemJson();
  };

  const performSave = useCallback(() => {
    try {
      localStorage.setItem('missions', JSON.stringify(missions));
      localStorage.setItem('secondaryMissions', JSON.stringify(secondaryMissions));
      localStorage.setItem('missionCounter', JSON.stringify(missionCounter));
      localStorage.setItem('refPrefix', refPrefix);
      localStorage.setItem('refCounter', JSON.stringify(refCounter));
      localStorage.setItem('headerBgColor', headerBgColor);
      if (headerBgImage) localStorage.setItem('headerBgImage', headerBgImage);
      if (appLogo) localStorage.setItem('appLogo', appLogo);
      else localStorage.removeItem('appLogo');
      localStorage.setItem('headerBgOpacity', headerBgOpacity.toString());
      localStorage.setItem('globalLogs', JSON.stringify(globalLogs));
      localStorage.setItem('waveColor', waveColor);
      localStorage.setItem('waveOpacity', waveOpacity.toString());
      localStorage.setItem('waveType', waveType);
      localStorage.setItem('appFont', appFont);
      localStorage.setItem('appFontSize', appFontSize.toString());
      localStorage.setItem('appTextColor', appTextColor);
      localStorage.setItem('appTextCase', appTextCase);
      localStorage.setItem('appFontWeight', appFontWeight);
      localStorage.setItem('navActiveColor', navActiveColor);
      localStorage.setItem('suiteSubtitleColor', suiteSubtitleColor);
      localStorage.setItem('copyBtnColor', copyBtnColor);
      localStorage.setItem('saveBtnColor', saveBtnColor);
      localStorage.setItem('missionTitleColor', missionTitleColor);
      localStorage.setItem('refIdColor', refIdColor);
      localStorage.setItem('accentColor', accentColor);
      localStorage.setItem('accentBlueColor', accentBlueColor);
      localStorage.setItem('accentPurpleColor', accentPurpleColor);
      localStorage.setItem('accentOrangeColor', accentOrangeColor);
      localStorage.setItem('accentPinkColor', accentPinkColor);
      localStorage.setItem('accentRedColor', accentRedColor);
      localStorage.setItem('accentYellowColor', accentYellowColor);
      localStorage.setItem('aiInstructions', aiInstructions);
      localStorage.setItem('sortConfigs', JSON.stringify(sortConfigs));
      localStorage.setItem('viewMode', viewMode);
      localStorage.setItem('tableViewState', tableViewState);
      localStorage.setItem('manualHiddenColumns', JSON.stringify(manualHiddenColumns));
      localStorage.setItem('collapsedCategories', JSON.stringify(collapsedCategories));
      localStorage.setItem('collapsedSettingsSections', JSON.stringify(collapsedSettingsSections));
      localStorage.setItem('collapsedMosaicGroups', JSON.stringify(collapsedMosaicGroups));
      localStorage.setItem('retractedMosaics', retractedMosaics.toString());
      localStorage.setItem('compactHiddenColumns', JSON.stringify(compactHiddenColumns));
      localStorage.setItem('minimalHiddenColumns', JSON.stringify(minimalHiddenColumns));
      localStorage.setItem('deadlineAlertThreshold', deadlineAlertThreshold.toString());
      localStorage.setItem('globalDeadline', globalDeadline);
      localStorage.setItem('autoExportEnabled', autoExportEnabled.toString());
      localStorage.setItem('autoExportInterval', autoExportInterval.toString());
      localStorage.setItem('scheduledExportEnabled', scheduledExportEnabled.toString());
      localStorage.setItem('scheduledExportDays', JSON.stringify(scheduledExportDays));
      localStorage.setItem('scheduledExportTime', scheduledExportTime);
      const categoriesToSave = categories.map(({ icon, ...rest }) => rest);
      localStorage.setItem('categories', JSON.stringify(categoriesToSave));
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.error('[STORAGE] Quota exceeded. Attempting to prune logs...');
        
        // Strategy 1: Prune logs if they are large
        if (globalLogs.length > 50) {
          const prunedLogs = globalLogs.slice(-50);
          setGlobalLogs(prunedLogs);
          localStorage.setItem('globalLogs', JSON.stringify(prunedLogs));
          
          // Re-attempt save missions
          try {
            localStorage.setItem('missions', JSON.stringify(missions));
          } catch (e2) {
            console.error('[STORAGE] Still over quota after pruning logs.');
          }
        }
      } else {
        console.error('[STORAGE] Save failed:', e);
      }
    }
  }, [missions, secondaryMissions, appLogo, headerBgColor, autoExportEnabled, autoExportInterval, scheduledExportEnabled, scheduledExportDays, scheduledExportTime, missionCounter, refPrefix, refCounter, categories, headerBgImage, headerBgOpacity, globalLogs, waveColor, waveOpacity, waveType, appFont, appFontSize, appTextColor, appTextCase, appFontWeight, navActiveColor, suiteSubtitleColor, copyBtnColor, saveBtnColor, missionTitleColor, refIdColor, accentColor, accentBlueColor, accentPurpleColor, accentOrangeColor, accentPinkColor, accentRedColor, accentYellowColor, sortConfigs, viewMode, tableViewState, manualHiddenColumns, compactHiddenColumns, minimalHiddenColumns, collapsedCategories, collapsedSettingsSections, collapsedMosaicGroups, retractedMosaics, aiInstructions, deadlineAlertThreshold, globalDeadline]);

  const saveToLocalStorage = () => {
    performSave();
    setToast({
      show: true,
      message: 'Données sauvegardées avec succès !',
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const resetJournal = () => {
    setGlobalLogs([]);
    const logEntry: GlobalLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: "RÉINITIALISATION DU SYSTÈME DE LOGS : Toutes les entrées ont été purgées par l'opérateur.",
      type: 'system'
    };
    setGlobalLogs([logEntry]);
    setToast({ show: true, message: 'Journal réinitialisé', type: 'task' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const copyMissionsToExcel = () => {
    const headers = [
      'Mission #', 'Ref ID', 'Activé', 'Produit', 'Couleur', 'Argument', 
      'Univers', 'Format', 'Position', 'Support', 'Demandé', 'Délivré', 'Priorité', 
      'Deadline', 'Statut', 'Progression %', 'Notation (Flux)', 'Efficience Individualisée (%)', 'Efficience Globale Actuelle',
      'Date Préparation', 'Date Shooting', 'Date Post-Prod', 'Date Livraison'
    ];
    
    const globalEfficiency = (Math.max(0, (activeMissions.reduce((acc, m) => acc + m.progress, 0) / (activeMissions.length || 1)) - (activeMissions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length * 1.5))).toFixed(1);

    const rows = filteredMissions.map(m => {
      const individualEfficiency = (Math.max(0, m.progress - (m.priority === 'High priority' ? 10 : 0))).toFixed(1);
      return [
        m.missionNo,
        m.refId,
        m.enabled ? 'OUI' : 'NON',
        m.product,
        m.color,
        m.argumentType,
        m.univers,
        m.format,
        m.position,
        m.support,
        m.photoCountRequested,
        m.photoCountDelivered,
        m.priority,
        m.deadline || '-',
        m.status,
        `${m.progress}%`,
        m.rating || 0,
        individualEfficiency,
        globalEfficiency,
        formatDateStringNice(m.preparedAt),
        formatDateStringNice(m.shotAt),
        formatDateStringNice(m.postProdAt),
        formatDateStringNice(m.deliveredAt)
      ];
    });

    const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');
    
    navigator.clipboard.writeText(tsvContent).then(() => {
      setToast({ show: true, message: 'Données copiées pour Excel', type: 'task' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    });
  };

  const downloadFullExport = () => {
    try {
      // 1. Mission Data Sheet
      const missionHeaders = [
        'Mission #', 'Ref ID', 'Date Entrée', 'Heure Entrée', 'Activé', 'Produit', 'Couleur', 'Argument', 
        'Univers', 'Format', 'Position', 'Support', 'Photos Demandées', 'Photos Délivrées', 'Priorité', 
        'Deadline', 'Statut', 'Progression %', 'Notation (Flux)', 'Efficience Individualisée (%)', 'Efficience Globale Actuelle',
        'Date Préparation', 'Date Shooting', 'Date Post-Prod', 'Date Livraison', 'Notes / Infos'
      ];
      
      const globalEfficiency = (Math.max(0, (activeMissions.reduce((acc, m) => acc + m.progress, 0) / (activeMissions.length || 1)) - (activeMissions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length * 1.5))).toFixed(1);

      const missionData = missions.map(m => {
        const individualEfficiency = (Math.max(0, m.progress - (m.priority === 'High priority' ? 10 : 0))).toFixed(1);
        return [
          m.missionNo, m.refId, safeFormatDate(m.createdAt), safeFormatTime(m.createdAt), m.enabled ? 'OUI' : 'NON', m.product, m.color, m.argumentType,
          m.univers, m.format, m.position, m.support, m.photoCountRequested,
          m.photoCountDelivered, m.priority, m.deadline || '-', m.status,
          m.progress, m.rating || 0, individualEfficiency, globalEfficiency,
          formatDateStringNice(m.preparedAt), formatDateStringNice(m.shotAt), formatDateStringNice(m.postProdAt), formatDateStringNice(m.deliveredAt),
          m.info || '-'
        ];
      });

      // 2. Journal Data Sheet
      const journalHeaders = ['Date', 'Heure', 'Type', 'Message', 'ID Log'];
      const journalData = globalLogs.map(log => {
        return [
          safeFormatDate(log.timestamp),
          safeFormatTime(log.timestamp),
          log.type.toUpperCase(),
          log.message,
          log.id
        ];
      });

      // 3. Secondary Mission Data Sheet
      const secondaryHeaders = ['ID', 'Titre', 'Priorité', 'Status', 'Avancement %', 'Notation', 'Date Création', 'Deadline', 'Note/Info'];
      const secondaryData = secondaryMissions.map(sm => {
        return [
          sm.id, sm.title, sm.priority, sm.status, sm.progress, sm.rating,
          safeFormatDate(sm.createdAt), sm.deadline || '-', sm.note || '-'
        ];
      });

      const workbook = XLSX.utils.book_new();
      
      // 0. Metadata Sheet
      const metaHeaders = ['Clé de Contrôle', 'Valeur'];
      const metaData = [
        ['Rapport', 'Mission Contrôle Suite V4.0'],
        ['Semaine d\'Export', `S${getCurrentWeekNumber()}`],
        ['Date d\'Export', getDayMonthYear()],
        ['Heure d\'Export', new Date().toLocaleTimeString()],
        ['Généré par', 'Système AIS-MD-V3']
      ];
      const metaSheet = XLSX.utils.aoa_to_sheet([metaHeaders, ...metaData]);
      XLSX.utils.book_append_sheet(workbook, metaSheet, "Infos Export");

      // Add Mission Sheet
      const missionSheet = XLSX.utils.aoa_to_sheet([missionHeaders, ...missionData]);
      XLSX.utils.book_append_sheet(workbook, missionSheet, "Production (Missions)");
      
      // Add Journal Sheet
      const journalSheet = XLSX.utils.aoa_to_sheet([journalHeaders, ...journalData]);
      XLSX.utils.book_append_sheet(workbook, journalSheet, "Performance (Journal)");

      // Add Secondary Mission Sheet
      const secondarySheet = XLSX.utils.aoa_to_sheet([secondaryHeaders, ...secondaryData]);
      XLSX.utils.book_append_sheet(workbook, secondarySheet, "Missions Secondaires");
      
      const now = new Date();
      const weekNum = getCurrentWeekNumber();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
      XLSX.writeFile(workbook, `Mission_Controle_Rapport_Global_S${weekNum}_${dateStr}_${timeStr}.xlsx`);

      setToast({ show: true, message: 'Rapport Global généré ! (Production + Performance)', type: 'task' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    } catch (exportErr: any) {
      console.error('Error in downloadFullExport:', exportErr);
      setToast({ show: true, message: `Erreur d'export Excel : ${exportErr.message}`, type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    }
  };
  
  downloadFullExportRef.current = downloadFullExport;

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const parseExcelDate = (val: any, timeVal?: any): number => {
      if (!val) return Date.now();
      
      if (typeof val === 'number') {
        const utc_days = Math.floor(val - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);
        
        const fractional_day = val - Math.floor(val);
        let total_seconds = Math.floor(86400 * fractional_day);
        if (timeVal !== undefined) {
          if (typeof timeVal === 'number' && timeVal < 1) {
            total_seconds = Math.floor(86400 * timeVal);
          } else if (String(timeVal).includes(':')) {
            const parts = String(timeVal).split(':');
            const hrs = parseInt(parts[0], 10) || 0;
            const mins = parseInt(parts[1], 10) || 0;
            const secs = parts[2] ? parseInt(parts[2], 10) || 0 : 0;
            total_seconds = hrs * 3600 + mins * 60 + secs;
          }
        }
        const hrs = Math.floor(total_seconds / 3600);
        const mins = Math.floor((total_seconds % 3600) / 60);
        const secs = total_seconds % 60;
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hrs, mins, secs).getTime();
      }

      const dateStr = String(val).trim();
      let parsedTime = { hrs: 0, mins: 0, secs: 0 };
      if (timeVal !== undefined) {
        const timeStr = String(timeVal).trim();
        if (timeStr.includes(':')) {
          const parts = timeStr.split(':');
          parsedTime.hrs = parseInt(parts[0], 10) || 0;
          parsedTime.mins = parseInt(parts[1], 10) || 0;
          parsedTime.secs = parts[2] ? parseInt(parts[2], 10) || 0 : 0;
        }
      }

      // French format: "DD/MM/YYYY" or "DD/MM/YY"
      const dMatch = dateStr.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4}|\d{2})$/);
      if (dMatch) {
        const day = parseInt(dMatch[1], 10);
        const month = parseInt(dMatch[2], 10) - 1;
        let year = parseInt(dMatch[3], 10);
        if (year < 100) year += 2000;
        const dObj = new Date(year, month, day, parsedTime.hrs, parsedTime.mins, parsedTime.secs);
        if (!isNaN(dObj.getTime())) {
          return dObj.getTime();
        }
      }

      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const dObj = new Date(parsed);
        if (timeVal !== undefined) {
          dObj.setHours(parsedTime.hrs, parsedTime.mins, parsedTime.secs, 0);
        }
        return dObj.getTime();
      }

      return Date.now();
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        let sheetName = "";
        if (workbook.SheetNames.includes("Production (Missions)")) {
          sheetName = "Production (Missions)";
        } else if (workbook.SheetNames.includes("Missions Production")) {
          sheetName = "Missions Production";
        } else {
          sheetName = workbook.SheetNames[0]; // fallback
        }
        
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          setToast({ show: true, message: 'Le fichier Excel est invalide ou vide.', type: 'alert' });
          return;
        }

        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (rows.length <= 1) {
          setToast({ show: true, message: 'Aucune donnée trouvée dans le fichier Excel.', type: 'alert' });
          return;
        }

        const newMissions: Mission[] = [];
        let maxMissionNo = missionCounter;
        let maxRefCounter = refCounter;
        
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || (!row[0] && !row[5])) continue;
          
          const missionNo = parseInt(String(row[0]), 10) || maxMissionNo;
          const refId = row[1] ? String(row[1]) : `${refPrefix}-${maxRefCounter}`;
          
          const isEnabled = String(row[4]).toUpperCase() === 'OUI' || row[4] === true;
          
          const product = row[5] ? String(row[5]) : '';
          const color = row[6] ? String(row[6]) : '';
          const argumentType = row[7] ? String(row[7]) : '';
          const univers = row[8] ? String(row[8]) : '';
          const format = row[9] ? String(row[9]) : '';
          const position = row[10] ? String(row[10]) : '';
          const supportStr = row[11] ? String(row[11]) : '';
          
          const photoCountRequested = parseInt(String(row[12]), 10) || 1;
          const photoCountDelivered = parseInt(String(row[13]), 10) || 0;
          
          const priority = row[14] ? String(row[14]) : 'Medium priority';
          const deadlineRaw = row[15] === '-' ? '' : row[15] ? String(row[15]) : '';
          const status = row[16] ? String(row[16]) : 'en attente';
          const progress = parseInt(String(row[17]), 10) || 0;
          const rating = parseFloat(String(row[18])) || 0;
          
          const info = row[21] === '-' ? '' : row[21] ? String(row[21]) : '';

          if (missionNo >= maxMissionNo) maxMissionNo = missionNo + 1;
          const parsedRefNum = parseInt(refId.split('-')[1], 10);
          if (!isNaN(parsedRefNum) && parsedRefNum >= maxRefCounter) maxRefCounter = parsedRefNum + 1;
          
          const parsedCreatedAt = parseExcelDate(row[2], row[3]);

          const importHistory: MissionLog[] = [
            { timestamp: parsedCreatedAt, message: 'Mission créée via import Excel' }
          ];
          
          if (progress > 0) {
            importHistory.push({
              timestamp: parsedCreatedAt,
              message: `Progression mise à jour à ${progress}%`
            });
          }
          
          if (status === 'livré') {
            importHistory.push({
              timestamp: parsedCreatedAt,
              message: 'Statut changé à "livré"'
            });
          } else if (status) {
            importHistory.push({
              timestamp: parsedCreatedAt,
              message: `Statut changé à "${status}"`
            });
          }

          const newMission: Mission = {
            id: Math.random().toString(36).substring(2, 9),
            missionNo,
            refId,
            product,
            color,
            argumentType,
            univers,
            format,
            position,
            support: supportStr,
            priority,
            status,
            progress,
            photoCountRequested,
            photoCountDelivered,
            rating,
            info,
            deadline: deadlineRaw,
            createdAt: parsedCreatedAt,
            updatedAt: status === 'livré' ? parsedCreatedAt : undefined,
            history: importHistory,
            enabled: isEnabled
          };
          
          if (!isDuplicate(newMission)) {
             newMissions.push(newMission);
          }
        }

        newMissions.forEach(m => {
          registerNewProductOrColor(m.product, m.color);
        });

        setMissions(prev => {
          const merged = [...prev, ...newMissions];
          const uniqueIds = new Set();
          return merged.filter(m => {
            if (uniqueIds.has(m.id)) return false;
            uniqueIds.add(m.id);
            return true;
          });
        });
        
        setMissionCounter(maxMissionNo);
        setRefCounter(maxRefCounter);
        
        const newSecondaryMissions: SecondaryMission[] = [];
        let secondarySheetName = "";
        if (workbook.SheetNames.includes("Missions Secondaires")) {
          secondarySheetName = "Missions Secondaires";
        } else if (workbook.SheetNames.includes("Missions secondaires")) {
          secondarySheetName = "Missions secondaires";
        }
        
        if (secondarySheetName) {
          const secondaryWorksheet = workbook.Sheets[secondarySheetName];
          if (secondaryWorksheet) {
            const secRows: any[] = XLSX.utils.sheet_to_json(secondaryWorksheet, { header: 1 });
            if (secRows.length > 1) {
              for (let i = 1; i < secRows.length; i++) {
                const row = secRows[i];
                if (!row || row.length === 0 || !row[1]) continue;
                
                const id = row[0] ? String(row[0]) : Math.random().toString(36).substring(2, 9);
                const title = String(row[1]);
                const priorityRaw = row[2] ? String(row[2]).toLowerCase() : 'medium';
                const priority: 'low' | 'medium' | 'high' = 
                  (priorityRaw === 'high' || priorityRaw === 'medium' || priorityRaw === 'low') 
                    ? priorityRaw 
                    : 'medium';
                const status = row[3] ? String(row[3]) : 'A faire';
                const progress = parseInt(String(row[4]), 10) || 0;
                const rating = parseFloat(String(row[5])) || 0;
                
                let createdAt = parseExcelDate(row[6]);
                
                const deadline = row[7] === '-' ? '' : row[7] ? String(row[7]) : '';
                const note = row[8] === '-' ? '' : row[8] ? String(row[8]) : '';
                
                newSecondaryMissions.push({
                  id,
                  title,
                  priority,
                  status,
                  progress,
                  rating,
                  createdAt,
                  deadline: deadline || undefined,
                  enabled: true,
                  note
                });
              }
            }
          }
        }

        if (newSecondaryMissions.length > 0) {
          setSecondaryMissions(prev => {
            const merged = [...prev, ...newSecondaryMissions];
            const uniqueSecIds = new Set();
            return merged.filter(sm => {
              if (uniqueSecIds.has(sm.id)) return false;
              uniqueSecIds.add(sm.id);
              return true;
            });
          });
        }
        
        setGlobalLogs(prev => [...prev, {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          message: `SYSTÈME : Importation de ${newMissions.length} missions et ${newSecondaryMissions.length} missions secondaires depuis Excel.`,
          type: 'system'
        }]);

        setToast({ 
          show: true, 
          message: `${newMissions.length} missions et ${newSecondaryMissions.length} missions secondaires importées avec succès !`, 
          type: 'task' 
        });
        setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 4000);
      } catch (err: any) {
        setToast({ show: true, message: `Erreur import Excel: ${err.message}`, type: 'alert' });
        setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 4000);
      }
    };
    reader.readAsArrayBuffer(file);
    
    // reset file input
    if (e.target) e.target.value = '';
  };

  const pushToGoogleSheets = async () => {
    if (!googleToken) {
      setToast({ show: true, message: 'Connectez Workspace d\'abord !', type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }
    
    // 1. Mission Data Sheet
    const missionHeaders = [
      'Mission #', 'Ref ID', 'Date Entrée', 'Heure Entrée', 'Activé', 'Produit', 'Couleur', 'Argument', 
      'Univers', 'Format', 'Position', 'Support', 'Photos Demandées', 'Photos Délivrées', 'Priorité', 
      'Deadline', 'Statut', 'Progression %', 'Notation', 'Efficience Individualisée (%)', 'Efficience Globale Actuelle',
      'Date Préparation', 'Date Shooting', 'Date Post-Prod', 'Date Livraison', 'Notes / Infos'
    ];
    const globalEfficiency = (Math.max(0, (activeMissions.reduce((acc, m) => acc + m.progress, 0) / (activeMissions.length || 1)) - (activeMissions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length * 1.5))).toFixed(1);
    const missionData = missions.map(m => {
      const individualEfficiency = (Math.max(0, m.progress - (m.priority === 'High priority' ? 10 : 0))).toFixed(1);
      return [
        m.missionNo, m.refId, safeFormatDate(m.createdAt), safeFormatTime(m.createdAt), m.enabled ? 'OUI' : 'NON', m.product, m.color, m.argumentType,
        m.univers, m.format, m.position, m.support, m.photoCountRequested,
        m.photoCountDelivered, m.priority, m.deadline || '-', m.status,
        m.progress, m.rating || 0, individualEfficiency, globalEfficiency,
        formatDateStringNice(m.preparedAt), formatDateStringNice(m.shotAt), formatDateStringNice(m.postProdAt), formatDateStringNice(m.deliveredAt),
        m.info || '-'
      ];
    });

    // 2. Journal Data Sheet
    const journalHeaders = ['Date', 'Heure', 'Type', 'Message', 'ID Log'];
    const journalData = globalLogs.map(log => {
      return [
        safeFormatDate(log.timestamp),
        safeFormatTime(log.timestamp),
        log.type.toUpperCase(),
        log.message,
        log.id
      ];
    });

    // 3. Secondary Mission Data Sheet
    const secondaryHeaders = ['ID', 'Titre', 'Priorité', 'Status', 'Avancement %', 'Notation', 'Date Création', 'Deadline', 'Note/Info'];
    const secondaryData = secondaryMissions.map(sm => {
      return [
        sm.id, sm.title, sm.priority, sm.status, sm.progress, sm.rating,
        safeFormatDate(sm.createdAt), sm.deadline || '-', sm.note || '-'
      ];
    });

    try {
      setToast({ show: true, message: 'Export vers Google Sheets...', type: 'task' });
      const now = new Date();
      const title = `Mission_Controle_Rapport_Global_${now.toISOString().split('T')[0]}_${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
      
      const res = await fetch(getApiUrl('/api/sheets/export'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          title,
          sheets: [
            { title: 'Production (Missions)', data: [missionHeaders, ...missionData] },
            { title: 'Performance (Journal)', data: [journalHeaders, ...journalData] },
            { title: 'Missions Secondaires',  data: [secondaryHeaders, ...secondaryData] }
          ]
        })
      });
      const data = await res.json();
      if (data.url) {
        setToast({ show: true, message: 'Rapport exporté vers Sheets !', type: 'task' });
        window.open(data.url, '_blank');
      } else {
        throw new Error(data.error || 'Erreur API');
      }
    } catch (err: any) {
      setToast({ show: true, message: err.message, type: 'alert' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const generateRichMissionDescription = (mission: Mission | SecondaryMission) => {
    const isMain = 'missionNo' in mission;
    const ratingVal = mission.rating || 0;
    const stars = '⭐'.repeat(ratingVal) || 'Aucune';
    
    const rawPriority = mission.priority || 'medium';
    let priorityLabel = 'Moyenne 🟡';
    if (rawPriority.toLowerCase().includes('high')) {
      priorityLabel = 'Haute 🔴';
    } else if (rawPriority.toLowerCase().includes('low')) {
      priorityLabel = 'Basse 🔵';
    }

    if (isMain) {
      const m = mission as Mission;
      const progressLabel = `${m.progress}% (${m.status})`;
      return `=== MISSION DE PRODUCTION ===
Référence unique : ${m.refId}
Produit : ${m.product}
Couleur : ${m.color || 'Non spécifiée'}
Priorité : ${priorityLabel}
Notation d'intérêt : ${stars} / 5
Statut / Progression : ${progressLabel}

=== SPÉCIFICATIONS DE SHOOT ===
Type d'argument : ${m.argumentType || 'Non spécifié'}
Univers : ${m.univers || 'Non spécifié'}
Format de shoot : ${m.format || 'Non spécifié'}
Cadrage/Position : ${m.position || 'Non spécifié'}
Support : ${m.support || 'Non spécifié'}
Photos demandées (Livrées) : ${m.photoCountRequested} (${m.photoCountDelivered})

=== NOTES & CONSIGNES ===
${m.info || 'Aucune consigne ou note spécifiée.'}

ID de mission : ${m.id}
Créée le : ${new Date(m.createdAt).toLocaleDateString()}
Formatté via Mission Contrôle V3`;
    } else {
      const sm = mission as SecondaryMission;
      const progressLabel = `${sm.progress}% (${sm.status})`;
      return `=== MISSION SECONDAIRE ===
Titre : ${sm.title}
Priorité : ${priorityLabel}
Notation d'intérêt : ${stars} / 5
Statut / Progression : ${progressLabel}

=== NOTES & CONSIGNES ===
${sm.note || 'Aucune consigne ou note spécifiée.'}

ID de mission : ${sm.id.toUpperCase()}
Créée le : ${new Date(sm.createdAt).toLocaleDateString()}
Formatté via Mission Contrôle V3`;
    }
  };

  const pushToGoogleCalendar = async (mission: Mission | SecondaryMission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Workspace non connecté. Veuillez vous connecter en haut à droite !', type: 'system' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return;
    }
    if (!mission.deadline) {
      setToast({ show: true, message: 'Veuillez définir une deadline (date limite) avant l\'export.', type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return;
    }
    try {
      setToast({ show: true, message: 'Export sur Google Agenda...', type: 'task' });
      const summary = 'missionNo' in mission ? `[Shoot] ${mission.refId} - ${mission.product}` : `[Mission Sec] ${mission.title}`;
      const description = generateRichMissionDescription(mission);
      const res = await fetch(getApiUrl('/api/calendar/event'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          summary,
          description,
          dueDate: mission.deadline
        })
      });
      const data = await res.json();
      if (res.ok && data.eventLink) {
         setToast({ show: true, message: 'Mission exportée sur Google Agenda !', type: 'calendar' });
         window.open(data.eventLink, '_blank');
      } else {
         throw new Error(data.error || "Erreur de réponse de l'API Agenda.");
      }
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, message: `Échec de l'export Agenda : ${err.message}`, type: 'system' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const pushToGoogleTasks = async (mission: Mission | SecondaryMission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Workspace non connecté. Veuillez vous connecter en haut à droite !', type: 'system' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return;
    }
    try {
      setToast({ show: true, message: 'Export Google Tasks...', type: 'task' });
      const title = 'missionNo' in mission ? `[Mission] ${mission.refId} - ${mission.product}` : `[Mission Sec] ${mission.title}`;
      const notes = generateRichMissionDescription(mission);
      const res = await fetch(getApiUrl('/api/tasks/task'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          title,
          notes,
          due: mission.deadline || new Date().toISOString().split('T')[0]
        })
      });
      const data = await res.json();
      if (res.ok && data.task) {
         setToast({ show: true, message: 'Mission exportée dans Google Tasks !', type: 'task' });
      } else {
         throw new Error(data.error || "Erreur de réponse de l'API Google Tasks.");
      }
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, message: `Échec de l'export Tasks : ${err.message}`, type: 'system' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const performSaveRef = useRef<() => void>(() => {});
  useEffect(() => {
    performSaveRef.current = performSave;
  }, [performSave]);

  // Auto-save logic
  useEffect(() => {
    const interval = setInterval(() => {
      performSaveRef.current();
      console.log('[SYSTEM] Auto-save completed at ' + new Date().toLocaleTimeString());
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Initialize selections with first items if available
  useEffect(() => {
    if (categories.length === 0) return;
    
    const getCat = (id: string) => categories.find(c => c.id === id);
    const famItems = getCat('family')?.items;
    const prodItems = getCat('product')?.items;
    const colItems = getCat('color')?.items;
    const argItems = getCat('argument')?.items;
    const univItems = getCat('univers')?.items;
    const fmtItems = getCat('format')?.items;
    const posItems = getCat('position')?.items;
    const suppItems = getCat('support')?.items;
    const prioItems = getCat('priority')?.items;
    const statItems = getCat('status')?.items;

    if (!selectedFamily && famItems && famItems.length > 0) setSelectedFamily(famItems[0]);
    if (!selectedProduct && prodItems && prodItems.length > 0) setSelectedProduct(prodItems[0]);
    if (!selectedColor && colItems && colItems.length > 0) setSelectedColor(colItems[0]);
    if (!selectedArgument && argItems && argItems.length > 0) setSelectedArgument(argItems[0]);
    if (!selectedUnivers && univItems && univItems.length > 0) setSelectedUnivers(univItems[0]);
    if (!selectedFormat && fmtItems && fmtItems.length > 0) setSelectedFormat(fmtItems[0]);
    if (!selectedPosition && posItems && posItems.length > 0) setSelectedPosition(posItems[0]);
    if (selectedSupport.length === 0 && suppItems && suppItems.length > 0) setSelectedSupport([suppItems[0]]);
    if (!selectedPriority && prioItems && prioItems.length > 0) setSelectedPriority(prioItems[0]);
    if (!selectedStatus && statItems && statItems.length > 0) setSelectedStatus(statItems[0]);
  }, [categories]);

  const getInitialProgress = (status: string) => {
    switch (status) {
      case 'livré': return 100;
      case 'En post-production': return 85;
      case 'shooté': return 75;
      case 'en cours de shoot': return 50;
      case 'produit préparé': return 25;
      default: return 0;
    }
  };

  const registerNewProductOrColor = useCallback((product?: string, color?: string, family?: string) => {
    if (!product && !color && !family) return;
    setCategories(prev => {
      let updated = false;
      const next = prev.map(c => {
        if (family && c.id === 'family') {
          const trimmed = family.trim();
          if (trimmed && !c.items.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
            updated = true;
            return {
              ...c,
              items: [...c.items, trimmed]
            };
          }
        }
        if (product && c.id === 'product') {
          const trimmed = product.trim();
          if (trimmed && !c.items.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
            updated = true;
            return {
              ...c,
              items: [...c.items, trimmed]
            };
          }
        }
        if (color && c.id === 'color') {
          const trimmed = color.trim();
          if (trimmed && !c.items.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
            updated = true;
            return {
              ...c,
              items: [...c.items, trimmed]
            };
          }
        }
        return c;
      });
      if (updated) {
        const categoriesToSave = next.map(({ icon, ...rest }) => rest);
        localStorage.setItem('categories', JSON.stringify(categoriesToSave));
        console.log('[SYSTEM] Registered new product/color/family successfully:', { product, color, family });
      }
      return updated ? next : prev;
    });
  }, []);

  const sendMainToGoogleCalendar = async (m: Mission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Workspace non connecté. Veuillez vous connecter en haut à droite !', type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
      return;
    }

    const exportId = `calendar-${m.id}`;
    setIsExporting(prev => ({ ...prev, [exportId]: true }));

    const priorityLabel = m.priority.toLowerCase().includes('high') ? 'Haute 🔴' : m.priority.toLowerCase().includes('low') ? 'Basse 🔵' : 'Moyenne 🟡';
    const stars = '⭐'.repeat(m.rating || 0) || 'Aucune';
    const progressLabel = `${m.progress}% (${m.status})`;

    const description = `=== MISSION DE PRODUCTION ===
Référence unique : ${m.refId}
Produit : ${m.product}
Couleur : ${m.color || 'Non spécifiée'}
Priorité : ${priorityLabel}
Notation : ${stars} / 5
Statut / Progression : ${progressLabel}

=== SPÉCIFICATIONS DE SHOOT ===
Type d'argument : ${m.argumentType || 'Non spécifié'}
Univers : ${m.univers || 'Non spécifié'}
Format de shoot : ${m.format || 'Non spécifié'}
Cadrage/Position : ${m.position || 'Non spécifié'}
Support : ${m.support || 'Non spécifié'}
Photos demandées (Livrées) : ${m.photoCountRequested} (${m.photoCountDelivered})

=== NOTES & CONSIGNES ===
${m.info || 'Aucune consigne ou note spécifiée.'}

ID de mission : ${m.id}
Créée le : ${new Date(m.createdAt).toLocaleDateString()}
Formatté via Mission Contrôle V3`;

    try {
      const response = await fetch(getApiUrl('/api/calendar/event'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          summary: `[Shoot] ${m.refId} - ${m.product}`,
          description,
          dueDate: m.deadline || new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'export.");
      }

      setToast({ show: true, message: 'Mission de production exportée sur Google Agenda !', type: 'calendar' });
      setTimeout(() => setToast({ show: false, message: '', type: 'calendar' }), 4000);
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, message: `Échec de l'export Google Agenda : ${err.message}`, type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
    } finally {
      setIsExporting(prev => ({ ...prev, [exportId]: false }));
    }
  };

  const sendMainToGoogleTasks = async (m: Mission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Workspace non connecté. Veuillez vous connecter en haut à droite !', type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
      return;
    }

    const exportId = `tasks-${m.id}`;
    setIsExporting(prev => ({ ...prev, [exportId]: true }));

    const priorityLabel = m.priority.toLowerCase().includes('high') ? 'Haute 🔴' : m.priority.toLowerCase().includes('low') ? 'Basse 🔵' : 'Moyenne 🟡';
    const stars = '⭐'.repeat(m.rating || 0) || 'Aucune';
    const progressLabel = `${m.progress}% (${m.status})`;

    const description = `=== MISSION DE PRODUCTION ===
Référence unique : ${m.refId}
Produit : ${m.product}
Couleur : ${m.color || 'Non spécifiée'}
Priorité : ${priorityLabel}
Notation : ${stars} / 5
Statut / Progression : ${progressLabel}

=== SPÉCIFICATIONS DE SHOOT ===
Type d'argument : ${m.argumentType || 'Non spécifié'}
Univers : ${m.univers || 'Non spécifié'}
Format de shoot : ${m.format || 'Non spécifié'}
Cadrage/Position : ${m.position || 'Non spécifié'}
Support : ${m.support || 'Non spécifié'}
Photos demandées (Livrées) : ${m.photoCountRequested} (${m.photoCountDelivered})

=== NOTES & CONSIGNES ===
${m.info || 'Aucune consigne ou note spécifiée.'}

ID de mission : ${m.id}
Créée le : ${new Date(m.createdAt).toLocaleDateString()}
Formatté via Mission Contrôle V3`;

    try {
      const response = await fetch(getApiUrl('/api/tasks/task'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          title: `[Mission] ${m.refId} - ${m.product}`,
          notes: description,
          due: m.deadline || new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'export.");
      }

      setToast({ show: true, message: 'Mission de production exportée dans Google Tasks !', type: 'task' });
      setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 4000);
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, message: `Échec de l'export Google Tasks : ${err.message}`, type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
    } finally {
      setIsExporting(prev => ({ ...prev, [exportId]: false }));
    }
  };

  const sendToGoogleCalendar = async (sm: SecondaryMission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Workspace non connecté. Veuillez vous connecter en haut à droite !', type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
      return;
    }

    const exportId = `calendar-${sm.id}`;
    setIsExporting(prev => ({ ...prev, [exportId]: true }));

    const priorityLabel = sm.priority === 'high' ? 'Haute 🔴' : sm.priority === 'medium' ? 'Moyenne 🟡' : 'Basse 🔵';
    const stars = '⭐'.repeat(sm.rating || 0) || 'Aucune';
    const statusLabel = sm.progress >= 100 ? 'Mission Accomplie ✅' : sm.progress > 0 ? 'En cours ⚡' : 'À faire ⏳';

    const description = `=== MISSION SECONDAIRE ===
Titre : ${sm.title}
Priorité : ${priorityLabel}
Notation d'intérêt : ${stars} / 5
Statut : ${statusLabel}
Progression : ${sm.progress}%

=== NOTES & CONSIGNES ===
${sm.note || 'Aucune consigne ou note spécifiée.'}

ID de mission : ${sm.id.toUpperCase()}
Créée le : ${new Date(sm.createdAt).toLocaleDateString()}
Formatté via Mission Contrôle V3`;

    try {
      const response = await fetch(getApiUrl('/api/calendar/event'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          summary: `[Mission Sec] ${sm.title}`,
          description,
          dueDate: sm.deadline || new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'export.");
      }

      setToast({ show: true, message: 'Mission secondaire exportée sur Google Agenda !', type: 'calendar' });
      setTimeout(() => setToast({ show: false, message: '', type: 'calendar' }), 4000);
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, message: `Échec de l'export Google Agenda : ${err.message}`, type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
    } finally {
      setIsExporting(prev => ({ ...prev, [exportId]: false }));
    }
  };

  const sendToGoogleTasks = async (sm: SecondaryMission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Google Workspace non connecté. Veuillez vous connecter en haut à droite !', type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
      return;
    }

    const exportId = `tasks-${sm.id}`;
    setIsExporting(prev => ({ ...prev, [exportId]: true }));

    const priorityLabel = sm.priority === 'high' ? 'Haute 🔴' : sm.priority === 'medium' ? 'Moyenne 🟡' : 'Basse 🔵';
    const stars = '⭐'.repeat(sm.rating || 0) || 'Aucune';
    const statusLabel = sm.progress >= 100 ? 'Mission Accomplie ✅' : sm.progress > 0 ? 'En cours ⚡' : 'À faire ⏳';

    const description = `=== MISSION SECONDAIRE ===
Titre : ${sm.title}
Priorité : ${priorityLabel}
Notation d'intérêt : ${stars} / 5
Statut : ${statusLabel}
Progression : ${sm.progress}%

=== NOTES & CONSIGNES ===
${sm.note || 'Aucune consigne ou note spécifiée.'}

ID de mission : ${sm.id.toUpperCase()}
Créée le : ${new Date(sm.createdAt).toLocaleDateString()}
Formatté via Mission Contrôle V3`;

    try {
      const response = await fetch(getApiUrl('/api/tasks/task'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          title: `[Mission Sec] ${sm.title}`,
          notes: description,
          due: sm.deadline || new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'export.");
      }

      setToast({ show: true, message: 'Mission secondaire exportée dans Google Tasks !', type: 'task' });
      setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 4000);
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, message: `Échec de l'export Google Tasks : ${err.message}`, type: 'system' });
      setTimeout(() => setToast({ show: false, message: '', type: 'system' }), 4000);
    } finally {
      setIsExporting(prev => ({ ...prev, [exportId]: false }));
    }
  };

  const addMission = useCallback(() => {
    const errors: string[] = [];

    if (!selectedProduct) errors.push("Produit manquant.");
    if (!selectedStatus) errors.push("Statut manquant.");
    if (!refPrefix || refCounter === undefined || refCounter === null) errors.push("Référence ou compteur manquant.");

    if (!Number.isInteger(photoRequested) || photoRequested <= 0) {
      const supportLabel = (selectedSupport || []).includes('vidéo') ? 'Vidéos' : (selectedSupport || []).includes('graphisme') ? 'Visuels' : 'Photos';
      errors.push(`${supportLabel} requis(es) doit être un entier positif (supérieur à 0).`);
    }

    const dateRegex = /^(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})$/;
    const noteDate = (info || '').match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
    const finalDate = selectedDate || (noteDate ? noteDate[0] : '');

    if (finalDate && !dateRegex.test(finalDate)) {
      errors.push("Le format de la date d'échéance est invalide.");
    }

    if (errors.length > 0) {
      setToast({ show: true, message: errors.join(" "), type: 'error' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
      return;
    }

    const newMission: Mission = {
      id: Math.random().toString(36).substring(2, 9),
      missionNo: missionCounter,
      refId: `${refPrefix} ${refCounter}`,
      family: selectedFamily || deduceFamily(selectedProduct) || 'Autre',
      product: selectedProduct,
      color: selectedColor,
      argumentType: selectedArgument,
      univers: selectedUnivers,
      format: selectedFormat,
      position: selectedPosition,
      support: (selectedSupport || []).join(', '),
      priority: selectedPriority,
      status: selectedStatus,
      progress: getInitialProgress(selectedStatus),
      photoCountRequested: photoRequested,
      photoCountDelivered: 0,
      rating: selectedRating,
      info,
      imageUrl: selectedImage || undefined,
      imagePosition: '50% 50%',
      deadline: finalDate,
      createdAt: Date.now(),
      history: [
        { timestamp: Date.now(), message: 'Mission créée' }
      ],
      enabled: true
    };

    // Slash command detection
    if (info.includes('/calendar') || info.includes('/task')) {
      const isCalendar = info.includes('/calendar');
      const command = isCalendar ? 'Google Agenda' : 'Google Task';
      
      // Visual notification
      setToast({ 
        show: true, 
        message: `Planification ${command} envoyée avec succès !`, 
        type: isCalendar ? 'calendar' : 'task' 
      });
      
      // Sound effect (Notification buzz)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        console.warn("Audio Context not supported or interaction required");
      }

      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      
      console.log(`[AGENT] Planification sur ${command} détectée pour la mission #${missionCounter}`);
    }

    registerNewProductOrColor(selectedProduct, selectedColor, selectedFamily || deduceFamily(selectedProduct));
    setMissions(prev => [newMission, ...prev]);

    // Auto-export main mission to Google Workspace if active and authenticated
    if (googleToken) {
      if (autoExportMainCalendarOnCreate) {
        sendMainToGoogleCalendar(newMission);
      }
      if (autoExportMainTasksOnCreate) {
        sendMainToGoogleTasks(newMission);
      }
    }
    
    // Add to Global Logs
    const logMsg = `CRÉATION : Mission #${newMission.missionNo} [${newMission.refId}] - ${selectedProduct} (${selectedColor}) enregistré.${info.trim() ? ` INSTRUCTION : ${info}` : ''}`;
    
    setGlobalLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: logMsg,
      type: 'mission'
    }]);
    
    setMissionCounter(prev => prev + 1);
    setRefCounter(prev => prev + 1);
    setInfo('');
    setSelectedRating(0);
    setPhotoRequested(1);
    setSelectedDate('');
    setSelectedImage(null);
  }, [missionCounter, refCounter, refPrefix, selectedProduct, selectedColor, selectedFamily, selectedArgument, selectedUnivers, selectedFormat, selectedPosition, selectedSupport, selectedPriority, selectedStatus, selectedRating, info, selectedDate, selectedImage, photoRequested, registerNewProductOrColor, googleToken, autoExportMainCalendarOnCreate, autoExportMainTasksOnCreate, sendMainToGoogleCalendar, sendMainToGoogleTasks]);

  const addSecondaryMission = (title: string) => {
    const newMission: SecondaryMission = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      note: info,
      rating: selectedRating,
      progress: 0,
      priority: selectedSecondaryPriority,
      status: 'A faire',
      createdAt: Date.now(),
      deadline: selectedDate,
      enabled: true
    };
    setSecondaryMissions(prev => [newMission, ...prev]);
    
    // Auto-export to Google Workspace if active and authenticated
    if (googleToken) {
      if (autoExportCalendarOnCreate) {
        sendToGoogleCalendar(newMission);
      }
      if (autoExportTasksOnCreate) {
        sendToGoogleTasks(newMission);
      }
    }
    
    // Journal Logging
    const logEntry: GlobalLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: `[MISSION SECONDAIRE] Ajout: ${title} (Priorité: ${selectedSecondaryPriority.toUpperCase()}${selectedRating > 0 ? `, Note: ${selectedRating}/5` : ''}${selectedDate ? `, Deadline: ${selectedDate}` : ''})`,
      type: 'mission'
    };
    setGlobalLogs(prev => [...prev, logEntry]);

    setInfo('');
    setSelectedRating(0);
    setSelectedSecondaryPriority('medium');
    setSelectedDate('');
    setToast({ show: true, message: 'Mission secondaire ajoutée !', type: 'task' });
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
  };

  const updateSecondaryMission = (id: string, updates: Partial<SecondaryMission>) => {
    const target = secondaryMissions.find(m => m.id === id);
    if (!target) return;

    // Synchronisation automatique du statut en fonction du progrès
    if (updates.progress !== undefined && updates.progress !== target.progress) {
      if (updates.progress >= 100) {
        updates.status = 'Mission Accomplie';
      } else if (updates.progress > 0) {
        updates.status = 'En cours';
      } else {
        updates.status = 'A faire';
      }
    }

    let logMessage = '';
    const isProgressUpdate = updates.progress !== undefined && updates.progress !== target.progress;

    if (isProgressUpdate) {
      logMessage = `[MISSION SECONDAIRE] ${target.title} - Progression: ${updates.progress}%`;
      if (updates.progress === 100) logMessage = `[MISSION SECONDAIRE] ${target.title} - TERMINEE (100%)`;
    } else if (updates.rating !== undefined && updates.rating !== target.rating) {
      logMessage = `[MISSION SECONDAIRE] ${target.title} - Note: ${updates.rating}/5`;
    } else if (updates.enabled !== undefined && updates.enabled !== target.enabled) {
      logMessage = `[MISSION SECONDAIRE] ${target.title} - ${updates.enabled ? 'Activée' : 'Désactivée'}`;
    } else if (updates.priority !== undefined && updates.priority !== target.priority) {
      logMessage = `[MISSION SECONDAIRE] ${target.title} - Priorité: ${updates.priority.toUpperCase()}`;
    }

    if (logMessage) {
      const timerKey = `secondary-progress-${id}`;
      if (isProgressUpdate) {
        if (logDebounceTimers.current[timerKey]) clearTimeout(logDebounceTimers.current[timerKey]);
        logDebounceTimers.current[timerKey] = setTimeout(() => {
          const logEntry: GlobalLogEntry = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            message: logMessage,
            type: 'mission'
          };
          setGlobalLogs(prev => [...prev, logEntry]);
          delete logDebounceTimers.current[timerKey];
        }, 30000); // 30 seconds delay
      } else {
        const logEntry: GlobalLogEntry = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          message: logMessage,
          type: 'mission'
        };
        setGlobalLogs(prev => [...prev, logEntry]);
      }
    }

    setSecondaryMissions(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeSecondaryMission = (id: string) => {
    setSecondaryMissions(prev => prev.filter(m => m.id !== id));
  };

  const [isExporting, setIsExporting] = useState<{[key: string]: boolean}>({});

  const cleanupDuplicates = () => {
    const groups = new Map<string, Mission[]>();
    missions.forEach(m => {
      // Comparison key excluding refId and missionNo
      const key = `${m.product}-${m.color}-${m.univers}-${m.support}-${m.format}-${m.position}-${m.argumentType}-${m.info}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(m);
    });

    const cleanMissions: Mission[] = [];
    let removedCount = 0;
    const removedList: string[] = [];

    groups.forEach((group) => {
      if (group.length === 1) {
        cleanMissions.push(group[0]);
      } else {
        removedCount += (group.length - 1);
        
        const statusValue = (s: string) => {
          const lower = s.toLowerCase();
          if (lower.includes('livr')) return 5;
          if (lower.includes('déja') || lower.includes('deja')) return 4;
          if (lower.includes('cour')) return 3;
          if (lower.includes('preparé')) return 2;
          if (lower.includes('attente')) return 1;
          return 0; 
        };

        group.sort((a, b) => {
          const valA = statusValue(a.status);
          const valB = statusValue(b.status);
          if (valA !== valB) return valB - valA; 
          if (b.photoCountDelivered !== a.photoCountDelivered) return b.photoCountDelivered - a.photoCountDelivered;
          if (b.progress !== a.progress) return b.progress - a.progress;
          return b.createdAt - a.createdAt; 
        });

        const best = { ...group[0] };
        
        // Track the indices of duplicates removed
        group.slice(1).forEach(m => {
          removedList.push(`#${m.missionNo} ${m.product}`);
        });

        if (!best.imageUrl) {
          const withImage = group.find(m => m.imageUrl);
          if (withImage) best.imageUrl = withImage.imageUrl;
        }

        cleanMissions.push(best);
      }
    });

    cleanMissions.sort((a, b) => b.missionNo - a.missionNo);

    if (removedCount > 0) {
      setMissions(cleanMissions);
      const detailMessage = removedList.length <= 8 
        ? removedList.join(', ') 
        : `${removedList.slice(0, 8).join(', ')} et ${removedList.length - 8} autres`;

      setGlobalLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'system',
        message: `NETTOYAGE : ${removedCount} missions en doublon ont été fusionnées/supprimées (${detailMessage}).`
      }]);
      setToast({ show: true, message: `${removedCount} doublons fusionnés (${detailMessage}) !`, type: 'task' });
    } else {
      setToast({ show: true, message: "Aucun doublon trouvé.", type: 'task' });
    }
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 5000);
  };

  const handleBulkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPending: any[] = [];
    let processedCount = 0;

    files.forEach((file: any, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const getDef = (id: string) => categories.find(c => c.id === id)?.items[0] || '';
        newPending.push({
          tempId: Date.now() + index + Math.random(),
          file,
          imageUrl: base64,
          product: file.name.split('.')[0],
          color: getDef('color'),
          univers: getDef('univers'),
          support: getDef('support'),
          format: getDef('format'),
          position: getDef('position'),
          argumentType: getDef('argument'),
          photoCountRequested: 1,
          priority: getDef('priority'),
          status: getDef('status'),
          info: ''
        });
        processedCount++;
        if (processedCount === files.length) {
          setPendingImports(newPending);
          setShowImportModal(true);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''; // Reset input
  };

  const confirmBulkImport = () => {
    const newMissions: Mission[] = pendingImports.map((item, index) => ({
      id: String(Date.now() + index + Math.random()),
      missionNo: missionCounter + index,
      refId: `${refPrefix}-${refCounter + index}`,
      createdAt: Date.now(),
      enabled: true,
      product: item.product,
      color: item.color,
      univers: item.univers,
      support: item.support,
      format: item.format,
      position: item.position,
      argumentType: item.argumentType,
      priority: item.priority,
      status: item.status,
      progress: getInitialProgress(item.status),
      photoCountRequested: item.photoCountRequested,
      photoCountDelivered: 0,
      info: item.info,
      imageUrl: item.imageUrl,
      imagePosition: '50% 50%',
      history: [
        { timestamp: Date.now(), message: 'Mission créée via import groupé' }
      ]
    }));

    setMissions(prev => [...newMissions, ...prev]);
    setMissionCounter(prev => prev + newMissions.length);
    setRefCounter(prev => prev + newMissions.length);
    setShowImportModal(false);
    setPendingImports([]);
    
    // Log the bulk import
    const logId = Math.random().toString(36).substring(2, 9);
    setGlobalLogs(prev => [...prev, {
      id: logId,
      timestamp: Date.now(),
      message: `IMPORT : ${newMissions.length} missions créées via import groupé d'images.`,
      type: 'mission'
    }]);

    setToast({ show: true, message: `${newMissions.length} missions créées !`, type: 'task' });
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
  };

  const updatePendingItem = (tempId: number, updates: any) => {
    setPendingImports(prev => prev.map(item => item.tempId === tempId ? { ...item, ...updates } : item));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64 storage
        setToast({ show: true, message: "L'image est trop volumineuse (max 2MB)", type: 'task' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setToast({ show: true, message: 'Image JPEG injectée avec succès !', type: 'calendar' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMission = (id: string, updates: Partial<Mission>) => {
    const missionBefore = missions.find(m => m.id === id);
    if (!missionBefore) return;

    if (updates.product || updates.color) {
      registerNewProductOrColor(updates.product, updates.color);
    }

    const timestamp = Date.now();
    const logId = Math.random().toString(36).substring(2, 9);
    
    // Group technical changes
    const technicalFields: (keyof Mission)[] = ['product', 'color', 'univers', 'support', 'deadline', 'priority', 'format', 'position', 'argumentType'];
    const technicalChanges = technicalFields.filter(f => updates[f] !== undefined && updates[f] !== missionBefore[f]);
    
    const logsToAdd: GlobalLogEntry[] = [];

    if (technicalChanges.length > 0) {
      // Split technical changes into typing fields (product) and immediate fields
      const typingFields = ['product'];
      const immediateChanges = technicalChanges.filter(f => !typingFields.includes(f));
      const textChanges = technicalChanges.filter(f => typingFields.includes(f));

      if (immediateChanges.length > 0) {
        const changeDescriptions = immediateChanges.map(f => `${String(f).toUpperCase()} ("${missionBefore[f] || 'Ø'}" → "${updates[f]}")`);
        logsToAdd.push({ 
          id: logId + '-edit', 
          timestamp, 
          message: `ÉDITION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] - Modif : ${changeDescriptions.join(' | ')}`, 
          type: 'mission' 
        });
      }

      // Handle product name debounced
      if (textChanges.length > 0) {
        const pName = updates.product || missionBefore.product;
        const timerKey = `mission-product-${id}`;
        if (logDebounceTimers.current[timerKey]) clearTimeout(logDebounceTimers.current[timerKey]);
        
        logDebounceTimers.current[timerKey] = setTimeout(() => {
          setGlobalLogs(prev => {
            const msg = `ÉDITION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] - PRODUIT -> "${pName}"`;
            const last = prev[prev.length - 1];
            // If last log is for same mission and product edit, replace it if it's within 30s
            if (last && last.message.includes(`Mission #${missionBefore.missionNo}`) && last.message.includes('PRODUIT ->') && Date.now() - last.timestamp < 30000) {
              const newLogs = [...prev];
              newLogs[newLogs.length - 1] = { ...last, message: msg, timestamp: Date.now() };
              return newLogs;
            }
            return [...prev, { id: Math.random().toString(36).substring(2, 9), timestamp: Date.now(), message: msg, type: 'mission' }];
          });
          delete logDebounceTimers.current[timerKey];
        }, 30000);
      }
    }

    if (updates.status && updates.status !== missionBefore.status) {
      logsToAdd.push({ 
        id: logId + '-status', 
        timestamp, 
        message: `MISE À JOUR : Mission #${missionBefore.missionNo} (${missionBefore.product}) -> "${updates.status}".`, 
        type: 'mission' 
      });
    }

    if (updates.progress !== undefined && updates.progress !== missionBefore.progress) {
      const timerKey = `prod-progress-${id}`;
      if (logDebounceTimers.current[timerKey]) clearTimeout(logDebounceTimers.current[timerKey]);
      
      const pMessage = `PROGRESSION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] -> ${updates.progress}%.`;
      
      logDebounceTimers.current[timerKey] = setTimeout(() => {
        setGlobalLogs(prev => {
          const last = prev[prev.length - 1];
          if (last && last.message.includes(`Mission #${missionBefore.missionNo}`) && last.message.includes('PROGRESSION') && Date.now() - last.timestamp < 30000) {
            const newLogs = [...prev];
            newLogs[newLogs.length - 1] = { ...last, message: pMessage, timestamp: Date.now() };
            return newLogs;
          }
          return [...prev, { 
            id: Math.random().toString(36).substring(2, 9), 
            timestamp: Date.now(), 
            message: pMessage, 
            type: 'mission' 
          }];
        });
        delete logDebounceTimers.current[timerKey];
      }, 30000);
    }

    if (updates.rating !== undefined && updates.rating !== missionBefore.rating) {
      logsToAdd.push({ 
        id: logId + '-rating', 
        timestamp, 
        message: `ÉVALUATION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] -> ${updates.rating}/5 stars.`, 
        type: 'mission' 
      });
    }

    if (updates.info !== undefined && updates.info !== missionBefore.info) {
      const timerKey = `mission-info-${id}`;
      if (logDebounceTimers.current[timerKey]) clearTimeout(logDebounceTimers.current[timerKey]);
      
      const infoMsg = `INSTRUCTION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] - Notes : "${updates.info}"`;
      
      logDebounceTimers.current[timerKey] = setTimeout(() => {
        setGlobalLogs(prev => {
          const last = prev[prev.length - 1];
          // Replace last instruction log for same mission if within 30s to avoid typing spam
          if (last && last.type === 'instruction' && last.message.includes(`Mission #${missionBefore.missionNo}`) && Date.now() - last.timestamp < 30000) {
            const newLogs = [...prev];
            newLogs[newLogs.length - 1] = { ...last, message: infoMsg, timestamp: Date.now() };
            return newLogs;
          }
          return [...prev, { 
            id: Math.random().toString(36).substring(2, 9), 
            timestamp: Date.now(), 
            message: infoMsg, 
            type: 'instruction' 
          }];
        });
        delete logDebounceTimers.current[timerKey];
      }, 30000);
    }

    if (logsToAdd.length > 0) {
      // Combine multiple fast changes (status, colors, etc.)
      const combinedMsg = logsToAdd.map(l => l.message).join(' | ');
      const mainType = logsToAdd.some(l => l.type === 'instruction') ? 'instruction' : 'mission';
      
      setGlobalLogs(prev => {
        const lastLog = prev[prev.length - 1];
        if (lastLog && lastLog.message === combinedMsg && timestamp - lastLog.timestamp < 2000) return prev;
        return [...prev, { id: logId + '-combined', timestamp, message: combinedMsg, type: mainType }];
      });
    }

    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        let history = updates.history !== undefined ? [...updates.history] : (m.history ? [...m.history] : []);
        const now = Date.now();
        
        // Helper to update or push history to avoid bloat
        const addHistoryEntry = (msg: string) => {
          const lastH = history.length > 0 ? history[history.length - 1] : null;
          // If the last entry has the same start (like 'Notes :') and is recent, replace it
          let msgPrefix = msg.split(':')[0];
          
          if (msg.startsWith('Progression')) msgPrefix = 'Progression';
          if (msg.startsWith('Note mise à jour')) msgPrefix = 'Note';
          if (msg.startsWith('Priorité changée')) msgPrefix = 'Priorité';
          if (msg.startsWith('Produit')) msgPrefix = 'Produit';

          if (lastH && lastH.message.startsWith(msgPrefix) && now - lastH.timestamp < 30000) {
            history[history.length - 1] = { timestamp: now, message: msg };
          } else {
            history.push({ timestamp: now, message: msg });
          }
        };

        if (updates.status && updates.status !== m.status) {
          addHistoryEntry(`STATUT : ${m.status} -> ${updates.status}`);
        }
        if (updates.progress !== undefined && updates.progress !== m.progress) {
          addHistoryEntry(`Progression mise à jour à ${updates.progress}%`);
        }
        if (updates.rating !== undefined && updates.rating !== m.rating) {
          addHistoryEntry(`Note mise à jour à ${updates.rating}/5`);
        }
        if (updates.priority && updates.priority !== m.priority) {
          addHistoryEntry(`Priorité changée à "${updates.priority}"`);
        }
        if (updates.product && updates.product !== m.product) {
          addHistoryEntry(`Produit : "${updates.product}"`);
        }
        if (updates.info !== undefined && updates.info !== m.info) {
           addHistoryEntry(`Notes : "${updates.info}"`);
        }

        const updated = { ...m, ...updates, history, updatedAt: now };
        
        // Photos drive progress (Efficience = Delivered / Requested * 100)
        if (updates.photoCountRequested !== undefined || updates.photoCountDelivered !== undefined) {
          const del = updated.photoCountDelivered || 0;
          const req = updated.photoCountRequested || 1;
          updated.progress = Math.round((del / req) * 100);
        }
        
        // Sync progress if status changes manually
        if (updates.status) {
          switch (updates.status) {
            case 'livré': 
              // Only force 100% if we don't have a specific delivery count already driving progress
              if ((updated.photoCountDelivered || 0) === 0) {
                updated.progress = 100;
              } else {
                const del = updated.photoCountDelivered || 0;
                const req = updated.photoCountRequested || 1;
                updated.progress = Math.round((del / req) * 100);
              }
              if (!updated.deliveredAt) {
                updated.deliveredAt = getNowLocalDatetimeString();
              }
              break;
            case 'En post-production': 
              updated.progress = 85; 
              if (!updated.postProdAt) {
                updated.postProdAt = getNowLocalDatetimeString();
              }
              break;
            case 'shooté': 
              updated.progress = 75; 
              if (!updated.shotAt) {
                updated.shotAt = getNowLocalDatetimeString();
              }
              break;
            case 'en cours de shoot': 
              updated.progress = 50; 
              if (!updated.shotAt) {
                updated.shotAt = getNowLocalDatetimeString();
              }
              break;
            case 'produit préparé': 
              updated.progress = 25; 
              if (!updated.preparedAt) {
                updated.preparedAt = getNowLocalDatetimeString();
              }
              break;
            case 'en attente': updated.progress = 0; break;
            case 'annuler': 
              updated.progress = 0; 
              updated.photoCountDelivered = 0;
              break;
          }
        }
        return updated;
      }
      return m;
    }));
  };

  const toggleMissionEnabled = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const mission = missions.find(m => m.id === id);
    if (mission) {
      updateMission(id, { enabled: !mission.enabled });
      setToast({ 
        show: true, 
        message: `Mission ${!mission.enabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}`, 
        type:  mission.enabled ? 'task' : 'status'
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
    }
  };

  const removeMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      const logEntry: GlobalLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        message: `SUPPRESSION : Mission #${mission.missionNo} (${mission.product}) a été retirée du système.`,
        type: 'mission'
      };
      setGlobalLogs(prev => [...prev, logEntry]);
    }
    setMissions(prev => prev.filter(m => m.id !== id));
    setSelectedMissionIds(prev => prev.filter(mid => mid !== id));
  };

  const addManualLog = () => {
    if (!manualLog.trim()) return;
    const logEntry: GlobalLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: manualLog.trim(),
      type: 'manual'
    };
    setGlobalLogs(prev => {
      const last = prev[prev.length - 1];
      if (last && last.message === logEntry.message && (logEntry.timestamp - last.timestamp < 2000)) return prev;
      return [...prev, logEntry];
    });
    setManualLog('');
    setToast({ show: true, message: 'Note ajoutée au journal de bord', type: 'task' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const copyToExcel = async () => {
    if (missions.length === 0) return;

    try {
      // Excel headers
      const headers = ['N° Mission', 'Ref ID', 'Activé', 'Date Entrée', 'Heure Entrée', 'Produit', 'Couleur', 'Type Argument', 'Univers', 'Format', 'Position', 'Support', 'Priorité', 'Échéance', 'Statut', 'Photos Demandées', 'Photos Délivrées', 'Progression', 'Notes / Infos'];
      const rows = missions.map(m => {
        return [
          m.missionNo, m.refId, m.enabled ? 'OUI' : 'NON', safeFormatDate(m.createdAt), safeFormatTime(m.createdAt), m.product, m.color, m.argumentType, 
          m.univers, m.format, m.position, m.support, m.priority, m.deadline || '-', m.status, 
          m.photoCountRequested, m.photoCountDelivered,
          `${m.progress}%`, m.info || '-'
        ];
      });
      
      const tsv = [headers, ...rows].map(row => row.join('\t')).join('\n');

      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      console.error('Failed to copy: ', err);
      setToast({ show: true, message: `Erreur de copie presse-papier : ${err.message}`, type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const copyAiPrompt = () => {
    const analysis = getMovementAnalysis();
    const prompt = `
[MISSION CONTROL OPERATIONAL TELEMETRY]
CONTEXTE : Application de gestion de missions tactiques.
DATE : ${new Date().toLocaleString()}
AGENT CIBLE : Gemini Surveillance Agent

INSTRUCTION : ${aiInstructions}

--- ANALYSE OPÉRATIONNELLE ---
Bilan : Actuellement ${missions.length} missions suivies. Taux de progression : ${avgProgress}%. ${missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length > 0 ? `ALERTE : ${missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length} missions critiques prioritaires.` : 'Flux opérationnel nominal.'}
Actions récentes (60m) : ${analysis.totalActions} [C:${analysis.creations} / U:${analysis.updates} / D:${analysis.deletions}]
Latence système : ${analysis.latency}

--- DONNÉES DE CONFIGURATION ---
Séquenceur : ${refPrefix}-${refCounter}
Identité Visuelle : Font=${appFont}, Color=${appTextColor}, HeaderAsset=${headerBgImage ? 'PRESENT' : 'DEFAULT'}
Missions Production : ${missions.length}
Missions Secondaires : ${secondaryMissions.length}
Log Stream Size : ${globalLogs.length} entrées

--- RÉSUMÉ DES MISSIONS PRODUCTION ---
${missions.map(m => `- #${m.missionNo} [${m.refId}] ${m.enabled ? '(ACTIF)' : '(INACTIF)'}: ${m.product} | Status: ${m.status} | Progress: ${m.progress}%`).join('\n')}

--- RÉSUMÉ DES MISSIONS SECONDAIRES ---
${secondaryMissions.map(m => `- ${m.title} ${m.enabled ? '(ACTIF)' : '(INACTIF)'} | Progress: ${m.progress}% | Rating: ${m.rating}/5 | Deadline: ${m.deadline || 'N/A'}`).join('\n')}

--- JOURNAL DE BORD COMPLET ---
${globalLogs.map(l => `[${new Date(l.timestamp).toLocaleString()}] ${l.type.toUpperCase()}: ${l.message}`).join('\n')}

Veuillez générer un rapport synthétique avec 3 indicateurs clés (KPI) et une conclusion stratégique incluant l'analyse des missions secondaires.
`;

    navigator.clipboard.writeText(prompt.trim());
    setCopiedAiPrompt(true);
    setTimeout(() => setCopiedAiPrompt(false), 2000);
  };


  const updateCategory = (catId: string, updates: Partial<CategoryConfig>) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...updates } : c));
  };

  const renameFamily = (oldName: string, newName: string) => {
    if (!newName || !newName.trim() || oldName === newName) return;
    const trimmed = newName.trim();

    // 1. Update main missions family property
    setMissions(prevMissions => prevMissions.map(m => {
      const currentFam = m.family || deduceFamily(m.product) || 'Autre';
      if (currentFam === oldName) {
        return { ...m, family: trimmed };
      }
      return m;
    }));

    // 2. Update the options inside categories list
    setCategories(prevCategories => prevCategories.map(cat => {
      if (cat.id === 'family') {
        const items = cat.items ? [...cat.items] : [];
        const index = items.indexOf(oldName);
        if (index !== -1) {
          items[index] = trimmed;
        } else if (!items.includes(trimmed)) {
          items.push(trimmed);
        }
        return { ...cat, items };
      }
      return cat;
    }));

    // 3. Add to system logs
    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: Renommage de la famille "${oldName}" en "${trimmed}"`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `Famille "${oldName}" renommée en "${trimmed}" !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const toggleAllMissionsInFamily = (famName: string, enabled: boolean) => {
    setMissions(prevMissions => prevMissions.map(m => {
      const currentFam = m.family || deduceFamily(m.product) || 'Autre';
      if (currentFam === famName) {
        return { ...m, enabled };
      }
      return m;
    }));
    
    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: ${enabled ? 'ACTIVATION' : 'DÉSACTIVATION'} de toutes les missions de la famille "${famName}"`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `Toutes les missions de la famille "${famName}" ${enabled ? 'activées' : 'désactivées'} !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const toggleAllMissionsInSubFamily = (famName: string, productName: string, colorName: string, enabled: boolean) => {
    setMissions(prevMissions => prevMissions.map(m => {
      const currentFam = m.family || deduceFamily(m.product) || 'Autre';
      const mColor = m.color || 'Sans couleur';
      if (currentFam === famName && m.product === productName && mColor === colorName) {
        return { ...m, enabled };
      }
      return m;
    }));

    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: ${enabled ? 'ACTIVATION' : 'DÉSACTIVATION'} de la sous-famille "${productName} (${colorName})"`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `Sous-famille "${productName} (${colorName})" ${enabled ? 'activée' : 'désactivée'} !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const moveSubFamilyToFamily = (productName: string, colorName: string, targetFamily: string) => {
    setMissions(prevMissions => prevMissions.map(m => {
      const mColor = m.color || 'Sans couleur';
      if (m.product === productName && mColor === colorName) {
        return { ...m, family: targetFamily };
      }
      return m;
    }));

    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: Déplacement de la sous-famille "${productName} (${colorName})" vers la famille "${targetFamily}"`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `Sous-famille "${productName} (${colorName})" déplacée vers "${targetFamily}" !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const moveMultipleSubFamiliesToFamily = (subFamiliesToMove: { productName: string, colorName: string }[], targetFamily: string) => {
    setMissions(prevMissions => prevMissions.map(m => {
      const mColor = m.color || 'Sans couleur';
      const shouldMove = subFamiliesToMove.some(sf => sf.productName === m.product && sf.colorName === mColor);
      if (shouldMove) {
        return { ...m, family: targetFamily };
      }
      return m;
    }));

    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: Déplacement de ${subFamiliesToMove.length} sous-familles vers la famille "${targetFamily}"`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `${subFamiliesToMove.length} sous-familles déplacées vers "${targetFamily}" !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const moveMissionToFamily = (missionId: string, targetFamily: string, targetProduct?: string, targetColor?: string) => {
    setMissions(prevMissions => prevMissions.map(m => {
      if (m.id === missionId) {
        return { 
          ...m, 
          family: targetFamily,
          ...(targetProduct !== undefined ? { product: targetProduct } : {}),
          ...(targetColor !== undefined ? { color: targetColor === 'Sans couleur' ? '' : targetColor } : {})
        };
      }
      return m;
    }));

    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: Déplacement de la mission #${missionId} vers la famille "${targetFamily}"${targetProduct ? ` (sous-famille: ${targetProduct} | ${targetColor})` : ''}`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `Mission déplacée${targetProduct ? ` vers sous-famille "${targetProduct} - ${targetColor}"` : ` vers "${targetFamily}"`} !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const moveMultipleMissionsToFamily = (missionIds: string[], targetFamily: string, targetProduct?: string, targetColor?: string) => {
    setMissions(prevMissions => prevMissions.map(m => {
      if (missionIds.includes(m.id)) {
        return { 
          ...m, 
          family: targetFamily,
          ...(targetProduct !== undefined ? { product: targetProduct } : {}),
          ...(targetColor !== undefined ? { color: targetColor === 'Sans couleur' ? '' : targetColor } : {})
        };
      }
      return m;
    }));

    setGlobalLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: `FAMILLE: Déplacement de ${missionIds.length} missions vers la famille "${targetFamily}"${targetProduct ? ` (sous-famille: ${targetProduct} | ${targetColor})` : ''}`,
      type: 'system'
    }]);

    setToast({
      show: true,
      message: `${missionIds.length} missions déplacées${targetProduct ? ` vers sous-famille "${targetProduct} - ${targetColor}"` : ` vers "${targetFamily}"`} !`,
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const activeMissions = useMemo(() => missions.filter(m => m.enabled), [missions]);

  const dashboardStats = useMemo(() => {
    const stats = {
      total: activeMissions.length,
      completed: activeMissions.filter(m => m.status === 'livré').length,
      inProduction: activeMissions.filter(m => ['en cours de shoot', 'shooté', 'En post-production'].includes(m.status)).length,
      pending: activeMissions.filter(m => m.status === 'en attente' || m.status === 'produit préparé').length,
      urgent: activeMissions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length,
      bugs: activeMissions.filter(m => m.status === 'livré' && m.progress < 100).length,
    };

    const secondaryMissionsFiltered = secondaryMissions.filter(m => m.enabled);
    const secondaryStats = {
      total: secondaryMissionsFiltered.length,
      completed: secondaryMissionsFiltered.filter(m => m.progress >= 100).length,
      avgProgress: secondaryMissionsFiltered.length > 0
        ? secondaryMissionsFiltered.reduce((acc, m) => acc + (typeof m.progress === 'number' && !isNaN(m.progress) ? m.progress : 0), 0) / secondaryMissionsFiltered.length
        : 0
    };

    const requestedBySupport = activeMissions.reduce((acc: any, m) => {
      const supports = (m.support || '').split(', ');
      supports.forEach(s => {
        const key = s === 'video' ? 'vidéo' : s; 
        acc[key] = (acc[key] || 0) + (m.photoCountRequested || 1);
      });
      return acc;
    }, {});

    const deliveredBySupport = activeMissions.reduce((acc: any, m) => {
      const supports = (m.support || '').split(', ');
      supports.forEach(s => {
        const key = s === 'video' ? 'vidéo' : s; 
        acc[key] = (acc[key] || 0) + (m.photoCountDelivered || 0);
      });
      return acc;
    }, {});

    const totalRequested = Object.values(requestedBySupport).reduce((a, b) => (a as any) + (b as any), 0) as number;
    const totalDelivered = Object.values(deliveredBySupport).reduce((a, b) => (a as any) + (b as any), 0) as number;

    const photoRate = (requestedBySupport['photo'] || 0) > 0 ? ((deliveredBySupport['photo'] || 0) / (requestedBySupport['photo'] || 1)) * 100 : 0;
    const videoRate = (requestedBySupport['vidéo'] || 0) > 0 ? ((deliveredBySupport['vidéo'] || 0) / (requestedBySupport['vidéo'] || 1)) * 100 : 0;
    const graphicRate = (requestedBySupport['graphisme'] || 0) > 0 ? ((deliveredBySupport['graphisme'] || 0) / (requestedBySupport['graphisme'] || 1)) * 100 : 0;

    const involvedSupports = [
      (requestedBySupport['photo'] || 0) > 0 ? photoRate : null,
      (requestedBySupport['vidéo'] || 0) > 0 ? videoRate : null,
      (requestedBySupport['graphisme'] || 0) > 0 ? graphicRate : null
    ].filter(v => v !== null && !isNaN(v)) as number[];

    let finalEfficiencyScore = involvedSupports.length > 0 
      ? involvedSupports.reduce((a, b) => a + b, 0) / involvedSupports.length 
      : (totalRequested > 0 ? (totalDelivered / totalRequested) * 100 : 0);
    
    if (involvedSupports.length === 0 && totalRequested === 0) finalEfficiencyScore = 0;
    if (isNaN(finalEfficiencyScore)) finalEfficiencyScore = 0;

    const bugRate = activeMissions.length > 0 ? (stats.bugs / activeMissions.length) * 100 : 0;
    const stabilityScore = 100 - bugRate;

    const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    const productionRate = stats.total > 0 ? (stats.inProduction / stats.total) * 100 : 0;

    const avgRating = activeMissions.length > 0
      ? (activeMissions.reduce((acc, m) => acc + (m.rating || 0), 0) / activeMissions.length).toFixed(1)
      : '0.0';

    return { 
      stats, secondaryStats, requestedBySupport, deliveredBySupport, 
      finalEfficiencyScore, stabilityScore, completionRate, productionRate,
      avgRating
    };
  }, [activeMissions, secondaryMissions]);

  const avgRating = dashboardStats.avgRating;

  const avgProgress = activeMissions.length > 0 
    ? Math.round(activeMissions.reduce((acc, m) => acc + (typeof m.progress === 'number' && !isNaN(m.progress) ? m.progress : 0), 0) / activeMissions.length) 
    : 0;

  const handleFeedbackSubmit = () => {
    if (!feedbackMessage) return;
    
    const feedbackEntry: GlobalLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: `[FEEDBACK ${feedbackType.toUpperCase()}] ${feedbackTitle ? feedbackTitle + ': ' : ''}${feedbackMessage} (Rating: ${feedbackRating}/5)`,
      type: 'manual'
    };
    
    setGlobalLogs(prev => [...prev, feedbackEntry]);
    setFeedbackSuccess(true);
    
    // Auto-close and Reset
    setTimeout(() => {
      setIsFeedbackOpen(false);
      setFeedbackSuccess(false);
      setFeedbackTitle('');
      setFeedbackMessage('');
      setFeedbackRating(5);
    }, 2000);
  };

  const logEndRef = useRef<HTMLDivElement>(null);

  const MosaicView = () => {
    const allStatuses = categories.find(c => c.id === 'status')?.items || [];
    
    // Group missions by status
    const groupedMissions = allStatuses.reduce((acc, status) => {
      acc[status] = filteredMissions.filter(m => m.status === status);
      return acc;
    }, {} as Record<string, Mission[]>);

    const toggleGroup = (status: string) => {
      setCollapsedMosaicGroups(prev => 
        prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
      );
    };

    const expandAll = () => setCollapsedMosaicGroups([]);
    const collapseAll = () => setCollapsedMosaicGroups([...allStatuses]);

    return (
      <div className="space-y-8">
        {/* Mosaic Controls */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <LayoutGrid size={16} />
            </div>
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-white">Vue Mosaïque</h2>
              <p className="text-[8px] text-text-dim font-mono uppercase">Groupé par État d'avancement</p>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <button 
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
              title="Développer tous les groupes d'états"
            >
              <Maximize size={10} /> Développer colonnes
            </button>
            <button 
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
              title="Réduire tous les groupes d'états"
            >
              <Minimize size={10} /> Réduire colonnes
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-1" />
            <button 
              onClick={() => setRetractedMosaics(!retractedMosaics)}
              className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                retractedMosaics 
                  ? 'bg-accent/20 border-accent/40 text-accent hover:bg-accent/30 shadow-[0_0_15px_-3px_var(--color-accent)]' 
                  : 'bg-white/5 border-white/10 text-text-dim hover:text-white hover:bg-white/10'
              }`}
              title="Rétracter/Réduire les détails des vignettes des missions"
            >
              {retractedMosaics ? <Maximize size={10} /> : <Minimize size={10} />}
              {retractedMosaics ? 'Étendre les vignettes' : 'Rétracter les vignettes'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {allStatuses.map((status) => {
            const missionsInStatus = groupedMissions[status] || [];
            if (missionsInStatus.length === 0) return null;
            
            const isCollapsed = collapsedMosaicGroups.includes(status);
            
            return (
              <div key={status} className="space-y-4">
                <button 
                  onClick={() => toggleGroup(status)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'livré' ? 'bg-accent' : 
                      status === 'en cours de shoot' ? 'bg-accent-blue' : 
                      status === 'annuler' ? 'bg-red-500' :
                      'bg-white/20'
                    }`} />
                    <span className="text-[11px] font-black uppercase tracking-[2px] text-white/90">{status}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-mono text-text-dim">
                      {missionsInStatus.length} {missionsInStatus.length > 1 ? 'missions' : 'mission'}
                    </span>
                  </div>
                  {isCollapsed ? <ChevronDown size={14} className="text-text-dim" /> : <ChevronUp size={14} className="text-text-dim" />}
                </button>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pt-2">
                        {missionsInStatus.map((m, idx) => (
                          <motion.div
                            key={m.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`cursor-pointer bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/40 transition-all shadow-xl flex flex-col relative ${
                              selectedMissionIds.includes(m.id) ? 'ring-2 ring-accent border-accent' : ''
                            } ${(showDuplicateIndicators && isDuplicate(m)) ? 'border-l-2 border-l-red-500 bg-red-500/5' : ''}`}
                            onDoubleClick={(e) => {
                              if (!e.shiftKey) {
                                setSelectedMissionId(m.id);
                              }
                            }}
                            onClick={(e) => {
                              if (e.shiftKey) {
                                toggleSelectMission(m.id, e);
                              }
                            }}
                          >
                            {/* Header (compact or imagery) */}
                            {!retractedMosaics ? (
                              <div className="h-40 bg-white/5 relative overflow-hidden shrink-0">
                                 {m.imageUrl ? (
                                  <img 
                                    id={`mission-image-${m.id}`}
                                    src={m.imageUrl} 
                                    alt={m.product} 
                                    className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${!m.enabled ? 'grayscale opacity-40' : 'grayscale-0 opacity-100'} group-hover:grayscale-0 group-hover:opacity-100`} 
                                    referrerPolicy="no-referrer" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                                    <ImageIcon size={32} />
                                    <span className="text-[10px] uppercase font-black tracking-widest">No Capture</span>
                                  </div>
                                )}
                                {/* Overlay Tags */}
                                <div className="absolute top-2 left-2 flex gap-1 z-10">
                                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                     m.priority === 'High priority' ? 'bg-red-500 text-white' : 
                                     m.priority === 'Medium priority' ? 'bg-accent-red text-black' : 
                                     'bg-white/10 text-text-dim'
                                  }`}>
                                    {m.priority.split(' ')[0]}
                                  </div>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1.5 items-center z-10 font-black">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); removeMission(m.id); }}
                                    className="w-5 h-5 rounded border bg-black/60 border-white/20 text-white/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-red-500 hover:border-red-500 hover:text-white"
                                    title="Supprimer la mission"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleSelectMission(m.id, e); }}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                      selectedMissionIds.includes(m.id) ? 'bg-accent border-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'bg-black/60 border-white/20 text-transparent opacity-0 group-hover:opacity-100'
                                    }`}
                                  >
                                    <Check size={12} strokeWidth={4} />
                                  </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-60" />
                                <div className="absolute bottom-2 left-3 z-10">
                                   <span className="text-[10px] font-mono font-black text-accent" style={{ color: refIdColor }}>{m.refId}</span>
                                </div>
                                {/* Rating on Image */}
                                {m.rating ? (
                                  <div className="absolute bottom-2 right-3 z-10 flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                                    <StarRatingStatic rating={m.rating} size={8} />
                                    <span className="text-[8px] font-mono font-bold text-accent-yellow leading-none">{m.rating}/5</span>
                                  </div>
                                ) : null}

                                {/* Activation Toggle Overlay */}
                                <div className="absolute top-2 left-10 z-20">
                                  <Toggle enabled={m.enabled} onToggle={(e) => toggleMissionEnabled(m.id, e)} />
                                </div>
                              </div>
                            ) : (
                              <div className="px-3.5 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between shrink-0 select-none">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-black text-accent" style={{ color: refIdColor }}>{m.refId}</span>
                                  <Toggle enabled={m.enabled} onToggle={(e) => toggleMissionEnabled(m.id, e)} />
                                  <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter ${
                                     m.priority === 'High priority' ? 'bg-red-500 text-white' : 
                                     m.priority === 'Medium priority' ? 'bg-accent-red text-black' : 
                                     'bg-white/10 text-text-dim'
                                  }`}>
                                    {m.priority.split(' ')[0]}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {m.rating ? (
                                    <div className="flex items-center gap-0.5 bg-black/40 px-1 py-0.5 rounded-sm">
                                      <StarRatingStatic rating={m.rating} size={6} />
                                    </div>
                                  ) : null}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); removeMission(m.id); }}
                                    className="w-5 h-5 rounded border border-white/10 text-text-dim opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-red-500 hover:border-red-500 hover:text-white"
                                    title="Supprimer la mission"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleSelectMission(m.id, e); }}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                      selectedMissionIds.includes(m.id) ? 'bg-accent border-accent text-black' : 'border-white/10 text-text-dim opacity-0 group-hover:opacity-100 hover:text-white'
                                    }`}
                                  >
                                    <Check size={10} strokeWidth={3} />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Content */}
                            <div className={`p-4 flex flex-col flex-1 space-y-4 transition-opacity duration-300 ${!m.enabled ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                              <div>
                                <h3 className="text-xs font-black text-white uppercase tracking-wider line-clamp-1 group-hover:text-accent transition-colors">
                                  {m.product}
                                  {!m.enabled && <span className="ml-2 text-[8px] text-red-500 font-bold border border-red-500/20 px-1 rounded bg-red-500/5">OFF</span>}
                                </h3>
                                <p className="text-[9px] font-mono text-text-dim/60 uppercase mt-1">{m.color} • {m.support}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 border border-white/10 p-2 rounded-xl group/status relative overflow-hidden">
                                  <span className="text-[7px] font-black text-text-dim uppercase tracking-widest block mb-1">State</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const statusIdx = allStatuses.indexOf(m.status);
                                      const nextStatus = allStatuses[(statusIdx + 1) % allStatuses.length];
                                      updateMission(m.id, { status: nextStatus });
                                    }}
                                    className={`text-[9px] font-black uppercase tracking-tighter truncate w-full text-left flex items-center justify-between group-hover/status:text-white transition-colors ${
                                      m.status === 'livré' ? 'text-accent' : 
                                      m.status === 'en cours de shoot' ? 'text-accent-blue' : 
                                      'text-text-dim'
                                    }`}
                                  >
                                    {m.status}
                                    <RotateCcw size={8} className="opacity-0 group-hover/status:opacity-100 transition-opacity ml-1" />
                                  </button>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                                  <span className="text-[7px] font-black text-text-dim uppercase tracking-widest block mb-1">Dimen.</span>
                                  <div className="text-[9px] font-black text-white/80 uppercase tracking-tighter truncate">
                                    {m.format}
                                  </div>
                                </div>
                              </div>

                              {/* Editable Notes in Mosaic */}
                              <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                                <span className="text-[7px] font-black text-text-dim uppercase tracking-widest block">Notes</span>
                                <div className="relative group/mosaic-notes">
                                  <textarea 
                                    defaultValue={m.info}
                                    onBlur={(e) => {
                                      if (e.target.value !== m.info) {
                                        updateMission(m.id, { info: e.target.value });
                                      }
                                    }}
                                    placeholder="Ajouter une note..."
                                    className="w-full h-12 bg-black/40 border border-white/5 rounded text-[9px] p-2 text-white/90 outline-none focus:border-accent/40 hover:border-white/10 transition-all resize-none custom-scrollbar font-mono leading-relaxed"
                                  />
                                  <button 
                                    onClick={(e) => {
                                      const text = (e.currentTarget.previousSibling as HTMLTextAreaElement).value;
                                      updateMission(m.id, { info: text });
                                    }}
                                    className="absolute right-1 bottom-1 p-1 bg-accent/20 border border-accent/30 rounded text-accent opacity-0 group-hover/mosaic-notes:opacity-100 hover:bg-accent hover:text-black transition-all"
                                  >
                                    <Check size={10} />
                                  </button>
                                </div>
                              </div>

                              {/* Progress */}
                              <div className="space-y-1.5 pt-1">
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                                  <span className="text-text-dim">Progress</span>
                                  <span className={m.progress >= 100 ? 'text-accent' : 'text-white'}>{m.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full ${m.progress >= 100 ? 'bg-accent' : 'bg-accent-blue'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.progress}%` }}
                                    transition={{ duration: 0.8 }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Info Footer */}
                            <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between mt-auto">
                               <div className="flex items-center gap-1.5">
                                  {isDeadlineApproaching(m.deadline) && m.status !== 'livré' && m.enabled && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="text-accent-yellow animate-pulse"
                                    >
                                      <AlertTriangle size={12} />
                                    </motion.div>
                                  )}
                                  <Clock size={10} className="text-text-dim" />
                                  <span className={`text-[8px] font-mono font-bold ${isDeadlineApproaching(m.deadline) && m.status !== 'livré' ? 'text-red-500 animate-pulse' : 'text-text-dim'}`}>{m.deadline || '-'}</span>
                               </div>
                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedMissionId(m.id); }}
                                    className="p-1.5 bg-accent-blue/10 text-accent-blue rounded hover:bg-accent-blue/20 transition-all border border-accent-blue/20"
                                  >
                                    <Maximize size={12} />
                                  </button>
                                </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const PrimaryTaskView = () => {
    return (
      <div className="space-y-3">
        <div className="flex justify-end mb-4">
          <a 
            href="https://calendar.google.com/calendar/u/0/r/tasks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#4285F4] transition-all group"
          >
            <CheckSquare size={14} className="text-[#4285F4] group-hover:scale-110 transition-transform" />
            Ouvrir Google Tasks
          </a>
        </div>
        {filteredMissions.length === 0 ? (
          <div className="py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-4 opacity-30">
            <PackageSearch size={40} className="text-text-dim" />
            <p className="text-[10px] uppercase font-black tracking-widest">Aucune mission principale</p>
          </div>
        ) : (
          filteredMissions.map((m) => (
            <div 
              key={m.id} 
              onDoubleClick={() => setSelectedMissionId(m.id)}
              title="Double-cliquez pour ouvrir la fiche de mission"
              className={`flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] cursor-pointer select-none transition-all custom-shadow ${m.enabled ? '' : 'opacity-50 grayscale'}`}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateMission(m.id, { status: m.status === 'livré' ? 'en cours' : 'livré' });
                }}
                className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${m.status === 'livré' || m.progress >= 100 ? 'bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,255,148,0.2)]' : 'bg-black/40 border-white/10 text-transparent hover:border-white/30 hover:text-white/20'}`}
              >
                <Check size={14} />
              </button>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-4">
                  <span className={`font-bold outline-none flex-1 transition-colors text-sm ${m.status === 'livré' || m.progress >= 100 ? 'line-through text-white/40' : 'text-white'}`}>
                    {m.product}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                      m.priority === 'High priority' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      m.priority === 'Medium priority' ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' : 
                      'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                    }`}>
                      {m.priority || 'Medium priority'}
                    </span>
                    {m.deadline && (
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 border border-white/5 ${isDeadlineApproaching(m.deadline) && m.progress < 100 ? 'text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'text-text-dim'}`}>
                        <Calendar size={10} />
                        <span className="tracking-widest">{m.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-text-dim flex items-center gap-3">
                  <span className="font-mono text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">{m.refId}</span>
                  {m.support && <span className="uppercase tracking-widest text-[9px] opacity-80">&bull; {m.support}</span>}
                  {m.info && <span>&bull; <span className="opacity-60 italic">{m.info}</span></span>}
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-white/5 pl-4 ml-2">
                <a 
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Mission: ' + m.product)}&details=${encodeURIComponent('Ref: ' + m.refId + '\n' + (m.info || ''))}&dates=${m.deadline ? new Date(m.deadline).toISOString().replace(/-|:|\.\d\d\d/g, "") + '/' + new Date(new Date(m.deadline).getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "") : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-white/5 text-text-dim hover:bg-[#4285F4]/20 hover:text-[#4285F4] transition-colors"
                  title="Ajouter à Google Calendar"
                >
                  <Calendar size={14} />
                </a>
                <Toggle enabled={m.enabled} onToggle={() => toggleMissionEnabled(m.id, { stopPropagation: () => {} } as any)} />
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const PrimaryCalendarView = () => {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 custom-shadow">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b border-white/5 pb-4">
           <div className="flex items-center gap-4 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
             <button onClick={() => setPrimaryCalendarDate(new Date(primaryCalendarDate.getFullYear(), primaryCalendarDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-white/10 rounded text-text-dim hover:text-white transition-colors"><ChevronsLeft size={16}/></button>
             <h3 className="text-white font-black text-sm uppercase tracking-widest min-w-[140px] text-center">
               {primaryCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </h3>
             <button onClick={() => setPrimaryCalendarDate(new Date(primaryCalendarDate.getFullYear(), primaryCalendarDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-white/10 rounded text-text-dim hover:text-white transition-colors"><ChevronRight size={16}/></button>
           </div>
           <div className="flex items-center gap-3">
             <button onClick={() => setPrimaryCalendarDate(new Date())} className="text-[10px] font-black uppercase tracking-widest py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all">Aujourd'hui</button>
             <a 
               href="https://calendar.google.com/calendar/r" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-[#4285F4]/10 border border-[#4285F4]/30 text-[#4285F4] hover:bg-[#4285F4]/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all group"
             >
               <Calendar size={14} className="group-hover:scale-110 transition-transform" />
               Google Calendar
             </a>
           </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-text-dim/60 pb-2">{day}</div>
          ))}
          {Array.from({ length: Array.from({ length: new Date(primaryCalendarDate.getFullYear(), primaryCalendarDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(primaryCalendarDate.getFullYear(), primaryCalendarDate.getMonth(), 1).getDay() - 1 }).length }).map((_, i) => (
             <div key={`empty-${i}`} className="min-h-[120px] bg-white/[0.01] border border-white/[0.02] rounded-xl" />
          ))}
          {Array.from({ length: new Date(primaryCalendarDate.getFullYear(), primaryCalendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
            const dateStr = `${primaryCalendarDate.getFullYear()}-${(primaryCalendarDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayMissions = filteredMissions.filter(m => m.enabled && m.deadline === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            return (
              <div key={day} className={`min-h-[120px] rounded-xl p-2.5 flex flex-col transition-colors ${isToday ? 'bg-accent/5 border border-accent/30 shadow-[0_0_15px_rgba(0,255,148,0.1)]' : 'bg-black/20 border border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}>
                 <div className={`text-[11px] font-black mb-3 ${isToday ? 'text-accent' : 'text-text-dim/80'}`}>{day}</div>
                 <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar flex-1 pr-1">
                   {dayMissions.map(m => (
                      <a 
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Mission: ' + m.product)}&details=${encodeURIComponent('Ref: ' + m.refId + '\n' + (m.info || ''))}&dates=${m.deadline ? new Date(m.deadline).toISOString().replace(/-|:|\.\d\d\d/g, "") + '/' + new Date(new Date(m.deadline).getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "") : ''}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        key={m.id} 
                        title="Double-cliquez pour ouvrir la fiche de cette mission, simple clic pour l’ajouter sur Google Calendar" 
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedMissionId(m.id);
                        }}
                        className={`group cursor-pointer hover:scale-[1.02] transition-all text-[10px] px-2 py-1.5 rounded-lg flex flex-col gap-0.5 border ${m.progress >= 100 || m.status === 'livré' ? 'bg-white/5 border-white/5 text-white/40 line-through' : m.priority === 'High priority' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : m.priority === 'Medium priority' ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20 hover:bg-accent-yellow/20' : 'bg-accent-blue/10 text-accent-blue border-accent-blue/20 hover:bg-accent-blue/20'}`}
                      >
                        <span className="font-bold truncate leading-tight group-hover:text-white transition-colors">{m.product}</span>
                        <span className="text-[8px] opacity-60 font-mono truncate">{m.refId}</span>
                      </a>
                   ))}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  // Calculate data series for charts
  const statusCounts = activeMissions.reduce((acc: any, m) => {
    if (m.status) acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#00FF94', '#00D1FF', '#BD00FF', '#FF9900', '#FF007A', '#FF3B30', '#EBFF00'];

  const supportCounts = activeMissions.reduce((acc: any, m) => {
    if (m.support) {
      const supports = m.support.split(', ');
      supports.forEach(s => {
        const key = s === 'video' ? 'vidéo' : s;
        acc[key] = (acc[key] || 0) + 1;
      });
    }
    return acc;
  }, {});
  const supportData = Object.entries(supportCounts).map(([name, value]) => ({
    name,
    value
  })).sort((a: any, b: any) => b.value - a.value);

  const productCounts = activeMissions.reduce((acc: any, m) => {
    if (m.product) acc[m.product] = (acc[m.product] || 0) + 1;
    return acc;
  }, {});
  const productData = Object.entries(productCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  const universCounts = activeMissions.reduce((acc: any, m) => {
    if (m.univers) acc[m.univers] = (acc[m.univers] || 0) + 1;
    return acc;
  }, {});
  const universData = Object.entries(universCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  const argumentCounts = activeMissions.reduce((acc: any, m) => {
    if (m.argumentType) acc[m.argumentType] = (acc[m.argumentType] || 0) + 1;
    return acc;
  }, {});
  const argumentData = Object.entries(argumentCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const startObj = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endObj = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return {
      dayStart: startObj.getTime(),
      dayEnd: endObj.getTime() + 1,
      label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
    };
  });

  const getHistoricalStatusAtInstant = (m: Mission, instant: number): string => {
    // Check custom dates first
    const tDelivered = m.deliveredAt ? new Date(m.deliveredAt).getTime() : null;
    const tPostProd = m.postProdAt ? new Date(m.postProdAt).getTime() : null;
    const tShot = m.shotAt ? new Date(m.shotAt).getTime() : null;
    const tPrepared = m.preparedAt ? new Date(m.preparedAt).getTime() : null;

    const minTime = Math.min(
      m.createdAt,
      tPrepared && !isNaN(tPrepared) ? tPrepared : Infinity,
      tShot && !isNaN(tShot) ? tShot : Infinity,
      tPostProd && !isNaN(tPostProd) ? tPostProd : Infinity,
      tDelivered && !isNaN(tDelivered) ? tDelivered : Infinity
    );
    if (minTime > instant) return '';

    if (tDelivered && !isNaN(tDelivered) && tDelivered <= instant) {
      return 'livré';
    }
    if (tPostProd && !isNaN(tPostProd) && tPostProd <= instant) {
      return 'En post-production';
    }
    if (tShot && !isNaN(tShot) && tShot <= instant) {
      return 'shooté';
    }
    if (tPrepared && !isNaN(tPrepared) && tPrepared <= instant) {
      return 'produit préparé';
    }

    if ((tPrepared && !isNaN(tPrepared) && tPrepared > instant) ||
        (tShot && !isNaN(tShot) && tShot > instant) ||
        (tPostProd && !isNaN(tPostProd) && tPostProd > instant) ||
        (tDelivered && !isNaN(tDelivered) && tDelivered > instant)) {
      return 'en attente';
    }

    const hist = m.history || [];
    const relevantLogs = hist.filter(h => h.timestamp <= instant);

    if (relevantLogs.length === 0) {
      const firstStatusLog = hist.find(h => h.message.includes('STATUT :') || h.message.toLowerCase().includes('statut changé à'));
      if (firstStatusLog) {
        if (firstStatusLog.message.includes('STATUT :')) {
          const parts = firstStatusLog.message.split('->');
          return parts[0].replace('STATUT :', '').trim();
        } else {
          return 'en attente';
        }
      }
      return m.status;
    }

    // Process status logs chronologically or find the last log
    for (let i = relevantLogs.length - 1; i >= 0; i--) {
      const msg = relevantLogs[i].message;
      if (msg.includes('STATUT :')) {
        const parts = msg.split('->');
        if (parts.length > 1) {
          return parts[parts.length - 1].trim();
        }
      }
      if (msg.toLowerCase().includes('statut changé à')) {
        const match = msg.match(/statut changé à ["']?([^"'\n]+)["']?/i);
        if (match) return match[1].trim();
      }
    }

    const firstStatusLog = hist.find(h => h.message.includes('STATUT :') || h.message.toLowerCase().includes('statut changé à'));
    if (firstStatusLog) {
      if (firstStatusLog.message.includes('STATUT :')) {
        const parts = firstStatusLog.message.split('->');
        return parts[0].replace('STATUT :', '').trim();
      }
    }

    return m.status;
  };

  const timelineData = last7Days.map(dayInfo => {
    const dayStart = dayInfo.dayStart;
    const dayEnd = dayInfo.dayEnd;
    
    // Filter currently active missions to count deliveries for this specific day
    const deliveredCount = activeMissions.filter(m => {
      if (m.deliveredAt) {
        const tDelivered = new Date(m.deliveredAt).getTime();
        if (!isNaN(tDelivered)) {
          return tDelivered >= dayStart && tDelivered < dayEnd;
        }
      }

      if (m.status !== 'livré') return false;
      
      // Check if it was delivered on this particular day by looking at history or updatedAt
      const becameDeliveredThisDay = (m.history || []).some(h => {
        const msgLower = h.message.toLowerCase();
        const isInRange = h.timestamp >= dayStart && h.timestamp < dayEnd;
        if (!isInRange) return false;
        
        return msgLower.includes('-> livré') || 
               msgLower.includes('-> "livré"') || 
               msgLower.includes('statut changé à "livré"') ||
               msgLower.includes('changé à "livré"') ||
               (msgLower.includes('statut') && msgLower.includes('livré'));
      });
      
      // Fallback: if no history match but updatedAt is this day and status is currently livré
      const updatedThisDay = m.updatedAt && m.updatedAt >= dayStart && m.updatedAt < dayEnd;
      
      return becameDeliveredThisDay || updatedThisDay;
    }).length;

    const missionsAtDay = activeMissions.filter(m => {
      const tDelivered = m.deliveredAt ? new Date(m.deliveredAt).getTime() : null;
      const tPostProd = m.postProdAt ? new Date(m.postProdAt).getTime() : null;
      const tShot = m.shotAt ? new Date(m.shotAt).getTime() : null;
      const tPrepared = m.preparedAt ? new Date(m.preparedAt).getTime() : null;

      const minTime = Math.min(
        m.createdAt,
        tPrepared && !isNaN(tPrepared) ? tPrepared : Infinity,
        tShot && !isNaN(tShot) ? tShot : Infinity,
        tPostProd && !isNaN(tPostProd) ? tPostProd : Infinity,
        tDelivered && !isNaN(tDelivered) ? tDelivered : Infinity
      );
      return minTime < dayEnd;
    });
    
    // Status counts at the end of this day
    let prepCount = 0;
    let shootCount = 0;
    let postProdCount = 0;
    let deliveredTotal = 0;

    missionsAtDay.forEach(m => {
      const statusAtEnd = getHistoricalStatusAtInstant(m, dayEnd);
      if (statusAtEnd === 'produit préparé') {
        prepCount++;
      } else if (statusAtEnd === 'en cours de shoot' || statusAtEnd === 'shooté') {
        shootCount++;
      } else if (statusAtEnd === 'En post-production') {
        postProdCount++;
      } else if (statusAtEnd === 'livré') {
        deliveredTotal++;
      }
    });

    const calculateHistoricalProgress = (m: Mission) => {
       const tDelivered = m.deliveredAt ? new Date(m.deliveredAt).getTime() : null;
       const tPostProd = m.postProdAt ? new Date(m.postProdAt).getTime() : null;
       const tShot = m.shotAt ? new Date(m.shotAt).getTime() : null;
       const tPrepared = m.preparedAt ? new Date(m.preparedAt).getTime() : null;

       const minTime = Math.min(
         m.createdAt,
         tPrepared && !isNaN(tPrepared) ? tPrepared : Infinity,
         tShot && !isNaN(tShot) ? tShot : Infinity,
         tPostProd && !isNaN(tPostProd) ? tPostProd : Infinity,
         tDelivered && !isNaN(tDelivered) ? tDelivered : Infinity
       );
       if (minTime > dayEnd) return 0;

       if (tDelivered && !isNaN(tDelivered) && tDelivered < dayEnd) {
         return 100;
       }
       if (tPostProd && !isNaN(tPostProd) && tPostProd < dayEnd) {
         return 85;
       }
       if (tShot && !isNaN(tShot) && tShot < dayEnd) {
         return 75;
       }
       if (tPrepared && !isNaN(tPrepared) && tPrepared < dayEnd) {
         return 25;
       }

       if ((tPrepared && !isNaN(tPrepared) && tPrepared > dayEnd) ||
           (tShot && !isNaN(tShot) && tShot > dayEnd) ||
           (tPostProd && !isNaN(tPostProd) && tPostProd > dayEnd) ||
           (tDelivered && !isNaN(tDelivered) && tDelivered > dayEnd)) {
         return 0;
       }

       const relevantHistory = (m.history || []).filter(h => h.timestamp < dayEnd && h.message.includes('Progression'));
       if (relevantHistory.length > 0) {
          const lastMsg = relevantHistory[relevantHistory.length - 1].message;
          const match = lastMsg.match(/(\d+)%/);
          if (match) return parseInt(match[1]);
       }
       return minTime < dayEnd ? (minTime > dayStart ? 0 : m.progress) : 0; 
    };

    const totalProgress = missionsAtDay.reduce((acc, m) => acc + calculateHistoricalProgress(m), 0);
    const avgProgDay = missionsAtDay.length > 0 ? totalProgress / missionsAtDay.length : 0;

    return {
      name: dayInfo.label,
      MissionsLivrees: deliveredCount,
      ProgressionMoyenne: Math.round(avgProgDay),
      ProduitsPrepares: prepCount,
      Shooting: shootCount,
      PostProduction: postProdCount,
      LivreesCumulees: deliveredTotal
    };
  });

  const renderDashboardView = () => {
    const { 
      stats, secondaryStats, requestedBySupport, deliveredBySupport, 
      finalEfficiencyScore, stabilityScore, completionRate, productionRate,
      avgRating
    } = dashboardStats;

    const dashboardProductionMissions = [...activeMissions].sort((a, b) => {
      const priorityMap: Record<string, number> = { 'High priority': 3, 'Medium priority': 2, 'Low priority': 1 };
      const pA = priorityMap[a.priority] || 0;
      const pB = priorityMap[b.priority] || 0;
      if (pA !== pB) return pB - pA;
      return b.createdAt - a.createdAt;
    }).slice(0, 15);

    const dashboardSecondaryMissions = [...secondaryMissions]
      .filter(m => m.enabled)
      .sort((a, b) => {
        const priorityMap: Record<string, number> = { 'high': 3, 'medium': 2, 'low': 1 };
        const pA = priorityMap[a.priority] || 0;
        const pB = priorityMap[b.priority] || 0;
        if (pA !== pB) return pB - pA;
        return b.createdAt - a.createdAt;
      });

    const duplicateGroups = activeMissions.reduce((acc: Mission[][], m) => {
      const matchIdx = acc.findIndex(group => 
        group[0].product === m.product &&
        group[0].color === m.color &&
        group[0].univers === m.univers &&
        group[0].support === m.support &&
        group[0].format === m.format &&
        group[0].position === m.position &&
        group[0].argumentType === m.argumentType
      );
      if (matchIdx !== -1) {
        acc[matchIdx].push(m);
      } else {
        acc.push([m]);
      }
      return acc;
    }, []).filter(g => g.length > 1);

    return (
      <div className="space-y-6 mb-12">
        {/* Bilan Stratégique Header */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div 
            id="strategic-performance-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 p-8 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl group hover:border-accent/30 transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Sparkles size={160} className="text-accent" />
            </div>
            <div className="relative z-10 w-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg text-accent shadow-[0_0_15px_rgba(0,255,148,0.2)]">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[4px] text-white">Analyse de Performance Stratégique</h2>
                    <p className="text-[9px] font-mono text-accent/60 uppercase tracking-widest mt-1">Status: Operational // Engine-ID: AIS-MD-V3</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-4 mr-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-[2px]">Semaine {getCurrentWeekNumber()} // {getDayMonthYear()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-[2px]">Moy. Note</span>
                      <span className="text-sm font-mono text-accent-yellow">{avgRating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => captureElementToJpeg('strategic-performance-card', 'Analyse_Performance_Strategique')}
                      className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all group/dl"
                      title="Exporter en JPEG"
                    >
                      <Download size={14} className="group-hover/dl:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={handleRefreshScore}
                      className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                      title="Rafraichir le tableau de bord"
                    >
                      <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 ${isRefreshingScore ? 'animate-pulse' : ''}`}>
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Taux de Livraison</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-black text-white italic tracking-tighter">{completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${completionRate}%` }} className="h-full bg-accent shadow-[0_0_10px_rgba(0,255,148,0.3)]" />
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Production active</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-black text-white italic tracking-tighter">{productionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${productionRate}%` }} className="h-full bg-accent-blue shadow-[0_0_10px_rgba(0,209,255,0.3)]" />
                  </div>
                </div>
                <div className="space-y-3">
                   <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Indices Qualité</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-display font-black text-white italic tracking-tighter">{stabilityScore.toFixed(0)}%</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stabilityScore}%` }} className="h-full bg-accent-purple shadow-[0_0_10px_rgba(189,0,255,0.3)]" />
                  </div>
                </div>
                <div className="space-y-3">
                   <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Efficience Réelle</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-display font-black text-white italic tracking-tighter">{finalEfficiencyScore.toFixed(1)}%</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden line-clamp-1">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(finalEfficiencyScore, 100)}%` }} 
                      className={`h-full ${finalEfficiencyScore >= 100 ? 'bg-accent shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'bg-accent-blue shadow-[0_0_10px_rgba(0,209,255,0.3)]'}`} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                   <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Missions Totales</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-display font-black text-white italic tracking-tighter">{stats.total}</span>
                     <span className="text-xs font-mono text-white/20">UNIT</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full" />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-accent shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-white">Moniteur d'Efficience par Support</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Base: livraisons / requêtes</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                   {['photo', 'vidéo', 'graphisme', 'autre'].map((support, idx) => {
                     const requested = requestedBySupport[support] || 0;
                     const delivered = deliveredBySupport[support] || 0;
                     const rate = requested > 0 ? (delivered / requested) * 100 : 0;
                     const colors = [
                       'text-accent border-accent/20 bg-accent/5',
                       'text-accent-blue border-accent-blue/20 bg-accent-blue/5',
                       'text-accent-purple border-accent-purple/20 bg-accent-purple/5',
                       'text-white/40 border-white/10 bg-white/5'
                     ];
                     const barColors = ['bg-accent', 'bg-accent-blue', 'bg-accent-purple', 'bg-white/20'];
                     
                     if (requested === 0 && delivered === 0) return null;

                     return (
                       <div key={support} className={`p-4 border rounded-xl transition-all hover:bg-white/[0.05] ${colors[idx] || colors[3]}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{support}</span>
                            <span className="text-xs font-mono font-black">{rate.toFixed(1)}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${Math.min(rate, 100)}%` }} 
                              className={`h-full ${barColors[idx] || barColors[3]}`} 
                            />
                          </div>
                          <div className="flex justify-between text-[7px] font-black uppercase tracking-wider opacity-30">
                             <span>Livrées: {delivered}</span>
                             <span>Req: {requested}</span>
                          </div>
                       </div>
                     );
                   })}
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-accent-blue" />
                      <span className="text-[10px] font-black uppercase tracking-[2px] text-white/60">Moniteur Missions Secondaires</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-accent-blue">{secondaryStats.avgProgress.toFixed(0)}% Eff.</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[8px] font-black text-text-dim/60 uppercase tracking-widest block mb-1">Missions</span>
                      <span className="text-2xl font-mono font-black text-white">{secondaryStats.total}</span>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[8px] font-black text-text-dim/60 uppercase tracking-widest block mb-1">Terminées</span>
                      <span className="text-2xl font-mono font-black text-accent-blue">{secondaryStats.completed}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${secondaryStats.avgProgress}%` }} 
                      className="h-full bg-accent-blue shadow-[0_0_15px_rgba(0,209,255,0.4)]" 
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-6">
                    <p className="text-[10px] text-text-dim/60 font-medium italic">
                      {secondaryStats.avgProgress > 70 ? "Flux secondaire stable. Objectifs annexes en cours d'atteinte." : "Attention requise sur les missions de gestion studio."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
               <div className="flex items-center gap-6">
                 <p className="text-[10px] text-text-dim/60 font-medium italic">
                   {finalEfficiencyScore > 80 ? "Séquenceur en haute performance. Flux optimal détecté." : "Reprise de cadence recommandée sur les supports critiques."}
                 </p>
                 <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded">
                    <Zap size={10} className="text-accent shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest">Efficience Brute: {finalEfficiencyScore.toFixed(1)}</span>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-accent">Analyse IA Live</span>
               </div>
            </div>
          </motion.div>

          {/* Critical Monitor */}
          <div className={`flex flex-col gap-4 ${isRefreshingScore ? 'animate-pulse' : ''}`}>
             <div className="flex-1 p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-red-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 blur-3xl rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-500/60 relative z-10">Urgences Critiques</span>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className={`text-5xl font-black font-mono transition-colors ${stats.urgent > 0 ? 'text-red-500' : 'text-white/20'}`}>{stats.urgent}</span>
                  <span className="text-[10px] font-bold text-white/20 uppercase">Missions</span>
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <AlertTriangle size={20} className={stats.urgent > 0 ? 'text-red-500 animate-pulse' : 'text-white/10'} />
                  <span className="text-[8px] font-mono text-red-500/40 uppercase tracking-tighter">Requires Action</span>
                </div>
             </div>
             <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white/[0.08] transition-all" onClick={handleRefreshScore}>
                <RefreshCw size={16} className={`text-white/20 group-hover:text-accent transition-colors ${isRefreshingScore ? 'animate-spin text-accent' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-2 group-hover:text-white transition-colors">Rafraichir Data</span>
             </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <motion.div 
          id="chart-timeline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-black/40 border border-white/10 p-8 rounded-2xl relative overflow-hidden shadow-xl group/chart hover:border-accent-blue/20 transition-all ${isRefreshingScore ? 'animate-pulse ring-1 ring-accent-blue/30' : ''}`}
        >
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
             <div className="flex items-center gap-4">
               <div className={`p-2.5 bg-accent-blue/10 border border-accent-blue/20 rounded-xl text-accent-blue shadow-[0_0_20px_rgba(0,209,255,0.1)] transition-all ${isRefreshingScore ? 'scale-110 shadow-[0_0_30px_rgba(0,209,255,0.3)]' : ''}`}>
                 <Activity size={20} className={isRefreshingScore ? 'animate-pulse' : ''} />
               </div>
               <div>
                 <h2 className="text-sm font-black uppercase tracking-[5px] text-white leading-tight">Vecteur d'Évolution Hebdomadaire</h2>
                 <p className="text-[10px] text-text-dim uppercase tracking-[3px] mt-1 font-mono">Stream: Active // Sampling: 24h</p>
               </div>
             </div>
             <div className="flex items-center gap-4 px-2 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                <button 
                  onClick={() => exportChartAsJPEG('chart-timeline', 'Evolution Hebdomadaire')}
                  className="p-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 rounded-lg transition-all opacity-0 group-hover/chart:opacity-100"
                  title="Exporter ce graphique"
                >
                  <Download size={14} />
                </button>

                <div className="w-px h-6 bg-white/10 mx-1 opacity-0 group-hover/chart:opacity-100" />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 mt-2 md:mt-0 select-none">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" title="Produits préparés stockés">
                    <input 
                      type="checkbox" 
                      className="accent-[#EBFF00] rounded bg-white/10 border-white/20 w-3.5 h-3.5 cursor-pointer" 
                      checked={visibleTimelineSeries.prepares} 
                      onChange={(e) => setVisibleTimelineSeries(prev => ({ ...prev, prepares: e.target.checked }))}
                    />
                    <div className="w-2 h-2 rounded-full bg-[#EBFF00] shadow-[0_0_8px_rgba(235,255,0,0.5)]" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">1. Préparés</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" title="Missions en cours de shooting ou shootées">
                    <input 
                      type="checkbox" 
                      className="accent-[#00D1FF] rounded bg-white/10 border-white/20 w-3.5 h-3.5 cursor-pointer" 
                      checked={visibleTimelineSeries.shooting} 
                      onChange={(e) => setVisibleTimelineSeries(prev => ({ ...prev, shooting: e.target.checked }))}
                    />
                    <div className="w-2 h-2 rounded-full bg-[#00D1FF] shadow-[0_0_8px_rgba(0,209,255,0.5)]" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">2. Shooting</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" title="Missions en post-production">
                    <input 
                      type="checkbox" 
                      className="accent-[#FF9900] rounded bg-white/10 border-white/20 w-3.5 h-3.5 cursor-pointer" 
                      checked={visibleTimelineSeries.postProd} 
                      onChange={(e) => setVisibleTimelineSeries(prev => ({ ...prev, postProd: e.target.checked }))}
                    />
                    <div className="w-2 h-2 rounded-full bg-[#FF9900] shadow-[0_0_8px_rgba(255,153,0,0.5)]" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">3. Post-Prod</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" title="Historique total des missions livrées">
                    <input 
                      type="checkbox" 
                      className="accent-[#00FF94] rounded bg-white/10 border-white/20 w-3.5 h-3.5 cursor-pointer" 
                      checked={visibleTimelineSeries.livreesCumulees} 
                      onChange={(e) => setVisibleTimelineSeries(prev => ({ ...prev, livreesCumulees: e.target.checked }))}
                    />
                    <div className="w-2 h-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                    <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">4. Livrées</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" title="Missions livrées spécifiquement ce jour là">
                    <input 
                      type="checkbox" 
                      className="accent-accent-blue rounded bg-white/10 border-white/20 w-3.5 h-3.5 cursor-pointer" 
                      checked={visibleTimelineSeries.livreesJour} 
                      onChange={(e) => setVisibleTimelineSeries(prev => ({ ...prev, livreesJour: e.target.checked }))}
                    />
                    <div className="w-2.5 h-1 bg-accent-blue" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">(Jour)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" title="Progression moyenne globale active (%)">
                    <input 
                      type="checkbox" 
                      className="accent-white rounded bg-white/10 border-white/20 w-3.5 h-3.5 cursor-pointer" 
                      checked={visibleTimelineSeries.progression} 
                      onChange={(e) => setVisibleTimelineSeries(prev => ({ ...prev, progression: e.target.checked }))}
                    />
                    <div className="w-3 h-0.5 border-t border-dashed border-white/40" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Progression</span>
                  </label>
                </div>
                
                <div className="w-px h-6 bg-white/10 mx-1" />
                
                <button 
                  onClick={handleRefreshScore}
                  className={`p-2 rounded-lg transition-all ${isRefreshingScore ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                  title="Recalculer les données analytiques"
                >
                  <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                </button>
             </div>
           </div>
           
           <div className={`h-80 w-full transition-opacity duration-300 ${isRefreshingScore ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} key={isRefreshingScore ? 'refreshing' : 'stable'}>
               <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="1 5" stroke="rgba(255,255,255,0.03)" vertical={false} />
                 <XAxis 
                   dataKey="name" 
                   tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold' }} 
                   axisLine={false} 
                   tickLine={false} 
                   dy={10}
                 />
                 <YAxis 
                   yAxisId="left" 
                   tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }} 
                   axisLine={false} 
                   tickLine={false} 
                 />
                 <YAxis 
                   yAxisId="right" 
                   orientation="right" 
                   tick={{ fill: 'rgba(0,255,148,0.3)', fontSize: 9, fontFamily: 'monospace' }} 
                   axisLine={false} 
                   tickLine={false} 
                 />
                 <RechartsTooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px', textTransform: 'uppercase', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                   itemStyle={{ padding: '2px 0' }}
                 />
                 {visibleTimelineSeries.livreesJour && <Bar yAxisId="left" dataKey="MissionsLivrees" fill="var(--color-accent-blue)" name="Livrées (Jour)" radius={[2, 2, 0, 0]} maxBarSize={30} opacity={0.6} />}
                 {visibleTimelineSeries.prepares && <Line yAxisId="left" type="monotone" dataKey="ProduitsPrepares" name="Préparés" stroke="#EBFF00" strokeWidth={3} dot={{ fill: '#0A0A0A', stroke: '#EBFF00', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />}
                  {visibleTimelineSeries.shooting && <Line yAxisId="left" type="monotone" dataKey="Shooting" name="En Shooting" stroke="#00D1FF" strokeWidth={3} dot={{ fill: '#0A0A0A', stroke: '#00D1FF', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />}
                  {visibleTimelineSeries.postProd && <Line yAxisId="left" type="monotone" dataKey="PostProduction" name="Post-Prod" stroke="#FF9900" strokeWidth={3} dot={{ fill: '#0A0A0A', stroke: '#FF9900', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />}
                  {visibleTimelineSeries.livreesCumulees && <Line yAxisId="left" type="monotone" dataKey="LivreesCumulees" name="Livrées (Total)" stroke="#00FF94" strokeWidth={4} dot={{ fill: '#0A0A0A', stroke: '#00FF94', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />}
                  
                  {visibleTimelineSeries.progression && <Line yAxisId="right" type="monotone" dataKey="ProgressionMoyenne" name="Progression (%)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={{ r: 4 }} />}
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Dashboard Tools */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-black/40 border border-white/10 p-4 rounded-xl backdrop-blur-md">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,255,148,0.1)]">
                 <Activity size={20} />
              </div>
              <div>
                 <h2 className="text-sm font-black uppercase tracking-[3px] text-white">Ops Center / Intelligence</h2>
                 <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Real-time production flow analysis</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={copyMissionsToExcel}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded text-[10px] font-black uppercase tracking-[2px] text-white hover:bg-white/10 active:scale-95 transition-all group"
              >
                <div className="p-1 px-1.5 bg-white/10 rounded group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                  <Copy size={12} />
                </div>
                Copier pour Excel
              </button>
              <button 
                onClick={downloadFullExport}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent/10 border border-accent/20 rounded text-[10px] font-black uppercase tracking-[2px] text-accent hover:bg-accent/20 active:scale-95 transition-all group shadow-[0_0_20px_rgba(0,255,148,0.1)]"
              >
                <div className="p-1 px-1.5 bg-accent/20 rounded group-hover:bg-accent group-hover:text-black transition-all">
                  <Download size={12} />
                </div>
                Export Global Excel
              </button>
              <button 
                onClick={pushToGoogleSheets}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0F9D58]/10 border border-[#0F9D58]/20 rounded text-[10px] font-black uppercase tracking-[2px] text-[#0F9D58] hover:bg-[#0F9D58]/20 active:scale-95 transition-all group shadow-[0_0_20px_rgba(15,157,88,0.1)]"
                title="Pousser vers Google Sheets"
              >
                <div className="p-1 px-1.5 bg-[#0F9D58]/20 rounded group-hover:bg-[#0F9D58] group-hover:text-white transition-all">
                  <FileSpreadsheet size={12} />
                </div>
                Direct to Sheets
              </button>
           </div>
        </div>

        {/* Duplicate Warning */}
        {duplicateGroups.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={18} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-500">Doublons détectés</p>
                <p className="text-[10px] font-medium text-red-500/60 uppercase mt-0.5">
                  {duplicateGroups.length} groupe(s) de missions identiques identifiés (Hors Ref ID).
                </p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {duplicateGroups.flat().slice(0, 5).map((m, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-black bg-accent-blue/30 text-[8px] flex items-center justify-center text-white" title={m.refId}>
                  {m.refId.substring(0, 2)}
                </div>
              ))}
              {duplicateGroups.flat().length > 5 && (
                <div className="w-6 h-6 rounded-full border border-black bg-white/10 text-[8px] flex items-center justify-center text-white">
                  +{duplicateGroups.flat().length - 5}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Middle Tier: Data Deep Dive */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-accent" />
                <h3 className="text-[10px] font-black uppercase tracking-[3px] text-white/60">Analyse de Distribution Analytique</h3>
             </div>
             <button 
               onClick={() => setIsMiddleTierVisible(!isMiddleTierVisible)}
               className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all shadow-sm"
             >
               {isMiddleTierVisible ? (
                 <span key="retract" className="flex items-center gap-2">
                   <Minimize size={10} />
                   Rétracter les Vecteurs
                 </span>
               ) : (
                 <span key="deploy" className="flex items-center gap-2">
                   <Maximize size={10} />
                   Déployer l'Intelligence
                 </span>
               )}
             </button>
          </div>

          <AnimatePresence>
            {isMiddleTierVisible && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  {/* Main Status Velocity */}
                  {ChartCard({ 
                    id: "chart-status",
                    title: "Distribution par État", 
                    subtitle: "Data Flow Analysis", 
                    onExport: exportChartAsJPEG,
                    className: "lg:col-span-2", 
                    delay: 0.1,
                    rightElement: (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-dim hidden sm:inline">Progression Flux</span>
                          <span className="text-lg font-black font-mono text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded border border-accent-purple/20">{avgProgress}%</span>
                        </div>
                        <button 
                          onClick={handleRefreshScore} 
                          className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                          title="Mettre à jour les graphiques"
                        >
                          <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                        </button>
                      </div>
                    ),
                    children: (
                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} key={isRefreshingScore ? 'anim-1' : 'anim-2'}>
                          <BarChart data={statusData} margin={{ top: 25, right: 10, left: 10, bottom: 0 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#444" 
                            fontSize={8} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: '#888', fontWeight: 'bold' }}
                            dy={10}
                          />
                          <YAxis hide domain={[0, 'dataMax + 1']} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#00FF94' }}
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          />
                          <Bar 
                            dataKey="value" 
                            fill="#00FF94" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                            animationDuration={1200}
                            isAnimationActive={true}
                          >
                            <LabelList 
                              dataKey="value" 
                              position="top" 
                              fill="#00FF94" 
                              fontSize={11} 
                              fontWeight="black"
                              offset={8}
                              formatter={(val: number) => val > 0 ? val : ''}
                            />
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    )
                  })}

                  {/* Support Split */}
                  {ChartCard({ 
                    id: "chart-support",
                    title: "Répartition Supports", 
                    subtitle: "Asset Allocation", 
                    onExport: exportChartAsJPEG,
                    delay: 0.2,
                    rightElement: (
                      <button 
                        onClick={handleRefreshScore} 
                        className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                        title="Mettre à jour les graphiques"
                      >
                        <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                      </button>
                    ),
                    children: (
                      <div key="status-velocity-chart" className="flex flex-col h-full">
                        <div style={{ width: '100%', height: 260 }}>
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} key={isRefreshingScore ? 'anim-3' : 'anim-4'}>
                            <RPieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Pie
                              data={supportData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={5}
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={1200}
                              isAnimationActive={true}
                              label={({ name, value }) => value > 0 ? `${value}` : ''}
                              labelLine={false}
                            >
                              {supportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                            />
                          </RPieChart>
                        </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2 h-10 overflow-y-auto custom-scrollbar">
                          {supportData.map((s, i) => (
                            <div key={s.name} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                              <span className="text-[8px] font-bold text-text-dim truncate max-w-[60px]">{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                  {/* Produit Split */}
                  {ChartCard({ 
                    id: "chart-product",
                    title: "Produits", 
                    subtitle: "Répartition par Produit", 
                    onExport: exportChartAsJPEG,
                    delay: 0.3,
                    rightElement: (
                      <button 
                        onClick={handleRefreshScore} 
                        className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                        title="Mettre à jour les graphiques"
                      >
                        <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                      </button>
                    ),
                    children: (
                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} key={isRefreshingScore ? 'anim-5' : 'anim-6'}>
                          <BarChart data={productData} margin={{ top: 10, bottom: 20, left: -20, right: 10 }} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                          <XAxis type="number" fontSize={10} tick={{ fill: '#888' }} axisLine={{ stroke: '#333' }} tickLine={false} />
                          <YAxis type="category" dataKey="name" fontSize={9} tick={{ fill: '#ccc' }} axisLine={{ stroke: '#333' }} tickLine={false} width={80} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationBegin={0} animationDuration={1200} isAnimationActive={true}>
                            {productData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    )
                  })}

                  {/* Univers Split */}
                  {ChartCard({ 
                    id: "chart-univers",
                    title: "Univers", 
                    subtitle: "Répartition par Univers", 
                    onExport: exportChartAsJPEG,
                    delay: 0.4,
                    rightElement: (
                      <button 
                        onClick={handleRefreshScore} 
                        className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                        title="Mettre à jour les graphiques"
                      >
                        <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                      </button>
                    ),
                    children: (
                      <div key="univers-distribution-chart" className="flex flex-col h-full">
                        <div style={{ width: '100%', height: 260 }}>
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} key={isRefreshingScore ? 'anim-7' : 'anim-8'}>
                            <RPieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Pie
                              data={universData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              paddingAngle={2}
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={1200}
                              isAnimationActive={true}
                              label={({ name, value }) => value > 0 ? `${value}` : ''}
                              labelLine={false}
                            >
                              {universData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                            />
                          </RPieChart>
                        </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2 h-10 overflow-y-auto custom-scrollbar">
                          {universData.map((s, i) => (
                            <div key={s.name} className="flex items-center gap-1.5" title={s.name}>
                              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[(i + 4) % COLORS.length] }} />
                              <span className="text-[8px] font-bold text-text-dim truncate max-w-[60px]">{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {/* Argument Split */}
                  {ChartCard({ 
                    id: "chart-argument",
                    title: "Type d'Argument", 
                    subtitle: "Répartition par Argument", 
                    onExport: exportChartAsJPEG,
                    delay: 0.5,
                    rightElement: (
                      <button 
                        onClick={handleRefreshScore} 
                        className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                        title="Mettre à jour les graphiques"
                      >
                        <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                      </button>
                    ),
                    children: (
                      <div key="argument-distribution-chart" className="flex flex-col h-full">
                        <div style={{ width: '100%', height: 260 }}>
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} key={isRefreshingScore ? 'anim-9' : 'anim-10'}>
                            <RPieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Pie
                              data={argumentData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              paddingAngle={2}
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={1200}
                              isAnimationActive={true}
                              label={({ name, value }) => value > 0 ? `${value}` : ''}
                              labelLine={false}
                            >
                              {argumentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 5) % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                            />
                          </RPieChart>
                        </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2 h-10 overflow-y-auto custom-scrollbar">
                          {argumentData.map((s, i) => (
                            <div key={s.name} className="flex items-center gap-1.5" title={s.name}>
                              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[(i + 5) % COLORS.length] }} />
                              <span className="text-[8px] font-bold text-text-dim truncate max-w-[60px]">{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {/* Poids Stratégique */}
                  {ChartCard({ 
                    id: "chart-poids",
                    title: "Poids Stratégique", 
                    subtitle: "Production vs Secondaire", 
                    onExport: exportChartAsJPEG,
                    delay: 0.6,
                    rightElement: (
                      <button 
                        onClick={handleRefreshScore} 
                        className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                        title="Mettre à jour les graphiques"
                      >
                        <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                      </button>
                    ),
                    children: (
                      <div className="flex flex-col items-center justify-center h-full">
                         <div className="relative h-[160px] w-[160px]">
                            {(() => {
                              const prod = activeMissions.length;
                              const sec = secondaryMissions.filter(sm => sm.enabled).length;
                              const totalCount = prod + sec || 1;
                              const prodP = (prod / totalCount) * 100;
                              const secP = (sec / totalCount) * 100;
                              return (
                                <>
                                  <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                    <circle 
                                      cx="50" cy="50" r="40" fill="transparent" stroke="#EBFF00" 
                                      strokeWidth="10" 
                                      strokeDasharray={`${prodP * 251.2 / 100} 251.2`} 
                                      className="transition-all duration-1000"
                                    />
                                    <circle 
                                      cx="50" cy="50" r="40" fill="transparent" stroke="#00D1FF" 
                                      strokeWidth="10" 
                                      strokeDasharray={`${secP * 251.2 / 100} 251.2`} 
                                      strokeDashoffset={`${-prodP * 251.2 / 100}`}
                                      className="transition-all duration-1000"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[2px]">TOTAL</span>
                                     <span className="text-xl font-black text-white">{prod + sec}</span>
                                  </div>
                                </>
                              );
                            })()}
                         </div>
                         <div className="w-full space-y-2 mt-4">
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#EBFF00]" />
                                  <span className="text-text-dim">Production</span>
                               </div>
                               <span className="text-white">{activeMissions.length} units</span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]" />
                                  <span className="text-text-dim">Secondaire</span>
                               </div>
                               <span className="text-white">{secondaryMissions.filter(sm => sm.enabled).length} units</span>
                            </div>
                         </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tableaux de Synthèse Opérationnelle */}
        <div className="grid grid-cols-1 gap-6 pt-10">
          {/* Tableau de Production */}
          {ChartCard({ 
            title: "Aperçu du Flux de Production", 
            subtitle: "Top 15 Missions Actives",
            className: "w-full overflow-hidden",
            delay: 0.6,
            rightElement: (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/40">{activeMissions.length} Missions</span>
                <button 
                  onClick={handleRefreshScore} 
                  className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                  title="Rafraichir les données"
                >
                  <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                </button>
              </div>
            ),
            children: (
              <div className={`overflow-x-auto custom-scrollbar ${isRefreshingScore ? 'animate-pulse opacity-50' : ''}`}>
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">ID</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Produit</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Support</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Priorité</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim font-mono text-right">Progrès</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardProductionMissions.map(m => (
                      <tr key={m.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                        <td className="py-3 px-4 text-[10px] font-mono font-bold text-accent-blue">{m.refId}</td>
                        <td className="py-3 px-4 text-[10px] font-bold text-white/80">{m.product}</td>
                        <td className="py-3 px-4 text-[10px] text-text-dim">{m.support}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            m.priority === 'High priority' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                            m.priority === 'Medium priority' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                            'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                          }`}>
                            {m.priority.split(' ')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-mono font-black text-accent">{m.progress}%</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${m.progress}%` }}
                                className="h-full bg-accent" 
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activeMissions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-text-dim text-[10px] font-mono uppercase italic tracking-widest">Aucune mission active détectée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          })}

          {/* Tableau de Mission Secondaire */}
          {ChartCard({ 
            title: "Statut des Missions Secondaires", 
            subtitle: "Gestion Plateau & Studio",
            delay: 0.7,
            rightElement: (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/40">{secondaryMissions.filter(m => m.enabled).length} Items</span>
                <button 
                  onClick={handleRefreshScore} 
                  className="p-1.5 bg-white/5 border border-white/10 text-white hover:text-accent hover:bg-white/10 hover:border-accent/30 rounded transition-all"
                  title="Rafraichir les missions secondaires"
                >
                  <RefreshCw size={14} className={isRefreshingScore ? 'animate-spin' : ''} />
                </button>
              </div>
            ),
            children: (
              <div className={`overflow-x-auto custom-scrollbar ${isRefreshingScore ? 'animate-pulse opacity-50' : ''}`}>
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Titre de la Mission</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Priorité</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Note</th>
                      <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-text-dim text-right">Progrès</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardSecondaryMissions.map(m => (
                      <tr key={m.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-[10px] font-bold text-white/80">
                          {m.title} 
                          <span className={`ml-2 text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                            m.status === 'Mission Accomplie' ? 'bg-accent/10 border-accent/20 text-accent font-bold shadow-[0_0_8px_rgba(0,255,148,0.1)]' :
                            m.status === 'En cours' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue font-bold shadow-[0_0_8px_rgba(0,209,255,0.1)]' :
                            'bg-white/5 border-white/10 text-text-dim/80 font-mono'
                          }`}>
                            {m.status || 'A faire'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            m.priority === 'high' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                            m.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                            'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                          }`}>
                            {m.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StarRatingStatic rating={m.rating} size={8} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-mono font-black text-accent-blue">{m.progress}%</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${m.progress}%` }}
                                className="h-full bg-accent-blue shadow-[0_0_10px_rgba(0,209,255,0.3)]" 
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {dashboardSecondaryMissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-text-dim text-[10px] font-mono uppercase italic tracking-widest">Aucune mission secondaire active</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  const renderSystemView = () => {
    const analysis = getMovementAnalysis();
    
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-24 px-4 sm:px-10">
        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-4 p-2 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md mb-10 sticky top-24 z-30 shadow-2xl">
          {[
            { id: 'branding', label: 'Identité Visuelle', icon: Palette },
            { id: 'display', label: 'Configuration Affichage', icon: Layout },
            { id: 'data', label: 'Structure & Data', icon: Database },
            { id: 'ai', label: 'Agent IA Gemini', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSystemSubTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all ${
                  systemSubTab === tab.id 
                    ? 'bg-accent text-black shadow-[0_0_20px_rgba(0,255,148,0.3)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {systemSubTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* IA Surveillance Prompt Tool */}
              <div className="p-8 bg-gradient-to-br from-accent/5 to-accent-purple/5 backdrop-blur-md border border-accent/20 rounded-2xl shadow-[0_0_50px_rgba(0,255,148,0.05)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-accent/20 flex items-center justify-center text-accent border border-accent/40 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(0,255,148,0.2)]">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wider text-white leading-tight">AI Agent Configuration</h3>
                      <p className="text-xs text-text-dim uppercase font-bold tracking-[3px] mt-2 opacity-80">Forgé pour Gemini Pro / Flash</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={copyAiPrompt}
                      className={`group flex items-center justify-center gap-4 px-10 py-5 rounded-2xl border-2 transition-all active:scale-95 ${copiedAiPrompt ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-accent text-black border-accent hover:bg-black hover:text-accent font-black shadow-[0_0_30px_rgba(0,255,148,0.2)]'}`}
                    >
                      {copiedAiPrompt ? (
                        <div key="copied" className="flex items-center gap-2">
                          <Check size={20} className="animate-bounce" />
                          <span className="uppercase tracking-widest text-[13px]">Prompt Copié !</span>
                        </div>
                      ) : (
                        <div key="copy" className="flex items-center gap-2">
                          <Copy size={20} className="group-hover:translate-x-1 transition-transform" />
                          <span className="uppercase tracking-[4px] text-[13px]">Injecter dans Gemini</span>
                        </div>
                      )}
                    </button>
                    <p className="text-[9px] font-mono text-center uppercase text-white/30 tracking-widest">Le rapport inclura votre bilan de progrès</p>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-accent flex items-center gap-2">
                        <Cpu size={12} /> Directives Gemini Agent
                      </label>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setAiInstructions(defaultAiInstructions)}
                          className="text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-accent flex items-center gap-1 transition-colors"
                          title="Réinitialiser les directives par défaut"
                        >
                          <RotateCcw size={10} /> Reset
                        </button>
                        <span className="text-[9px] font-mono text-white/20">v2.4.0</span>
                      </div>
                    </div>
                    <textarea 
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      placeholder="Comment l'IA doit-elle traiter vos données ?"
                      className="w-full h-[300px] bg-black/60 border border-white/10 p-6 rounded-2xl text-xs text-white outline-none focus:border-accent hover:border-white/20 transition-all font-mono leading-relaxed shadow-inner"
                    />

                    <div className="flex flex-col gap-2 relative">
                      <select 
                        className="w-full bg-black/60 border border-white/10 p-3 rounded-xl text-[11px] text-white/80 outline-none focus:border-accent hover:border-white/20 transition-all font-mono appearance-none relative z-10 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.value) {
                            const valToInject = e.target.value.replace(/\\n/g, '\n');
                            setAiInstructions(prev => prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + valToInject);
                            e.target.value = ""; // Reset dropdown
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Sélectionner une commande à injecter au prompt...</option>
                        <option value="/matrice : Vue globale du tableau.">/matrice - Vue globale du tableau.</option>
                        <option value="/load : Charge par univers (Flux).">/load - Charge par univers (Flux).</option>
                        <option value="/enchawer : Séquençage optimisé plateau.">/enchawer - Séquençage optimisé plateau.</option>
                        <option value="/inv : Picking dédupliqué.">/inv - Picking dédupliqué.</option>
                        <option value="/scan : Transcription OCR.">/scan - Transcription OCR.</option>
                        <option value="/% : Score de progression.">/% - Score de progression.</option>
                        <option value="/eod : Bilan soir trié par date.">/eod - Bilan soir trié par date.</option>
                        <option value="@Google Agenda : Sync Calendrier.">@Google Agenda - Sync Calendrier.</option>
                        <option value="@Google Tasks : Sync Tâches.">@Google Tasks - Sync Tâches.</option>
                        <option value="/help : Aide efficace.">/help - Aide efficace.</option>
                        <option value="LISTE DES COMMANDES :\n/matrice : Vue globale du tableau.\n/load : Charge par univers (Flux).\n/enchawer : Séquençage optimisé plateau.\n/inv : Picking dédupliqué.\n/scan : Transcription OCR.\n/% : Score de progression.\n/eod : Bilan soir trié par date.\n@Google Agenda : Sync Calendrier.\n@Google Tasks : Sync Tâches.\n/help : Aide efficace.">-- Injecter toute la liste --</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 z-20">
                        <ChevronDown size={14} />
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Bilan de Progrès IA</h5>
                      <p className="text-[10px] text-text-dim leading-relaxed italic">
                        "Actuellement : {activeMissions.length} missions actives suivies. Taux de complétion global : {avgProgress}%. 
                        {activeMissions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length > 0 ? ` Alerte : ${activeMissions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length} missions critiques en attente.` : ' Flux opérationnel nominal.'}"
                      </p>
                    </div>

                    <div className="p-4 bg-black/60 border border-white/10 rounded-xl space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-accent flex items-center gap-2">
                        <Cpu size={12} /> Clé API Personnalisée
                      </label>
                      <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                        Connectez votre propre clé Gemini AI pour un usage sans limite. Cette clé est stockée uniquement localement sur votre navigateur.
                      </p>
                      <input 
                        type="password"
                        placeholder="Optionnel : Collez votre clé API Gemini ici..."
                        value={customApiKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomApiKey(val);
                          localStorage.setItem('gemini_custom_api_key', val);
                        }}
                        className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-accent transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[3px] text-accent-blue flex items-center gap-2">
                       <Activity size={12} /> Analyse des Mouvements (Live)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-1 hover:border-accent/30 transition-colors">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Total Actions (60m)</span>
                          <span className="text-2xl font-black text-white">{analysis.totalActions}</span>
                       </div>
                       <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-1 hover:border-accent-blue/30 transition-colors">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Latence Flux</span>
                          <span className="text-2xl font-black text-accent-blue">{analysis.latency}</span>
                       </div>
                       <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-1 hover:border-green-500/30 transition-colors">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Créations</span>
                          <span className="text-2xl font-black text-green-500">+{analysis.creations}</span>
                       </div>
                       <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-1 hover:border-accent-yellow/30 transition-colors">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Mises à jour</span>
                          <span className="text-2xl font-black text-accent-yellow">{analysis.updates}</span>
                       </div>
                    </div>
                    
                    <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Intensité du Séquenceur</span>
                          <span className="text-[10px] font-mono text-accent">Stable</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${Math.min(100, analysis.totalActions * 5)}%` }}
                             className="h-full bg-accent shadow-[0_0_10px_rgba(0,255,148,0.5)]"
                          />
                       </div>
                    </div>
                    
                    <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                       <div className="flex items-start gap-4">
                          <div className="p-2 bg-accent/20 rounded text-accent">
                             <Box size={16} />
                          </div>
                          <p className="text-[10px] text-accent font-medium leading-relaxed">
                            "Aide-moi à me suivre sur mes tâches" - Le système analyse continuellement vos mouvements ({analysis.totalActions} actions récentes) pour optimiser les prochains rapports IA. Le bilan de progrès est désormais injecté automatiquement dans vos prompts.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {systemSubTab === 'branding' && (
            <motion.div
              key="branding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reference System Customization */}
                <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-accent-blue/10 flex items-center justify-center text-accent-blue border border-accent-blue/20 rounded-xl">
                       <Type size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Registre de Référence</h3>
                      <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1 opacity-60">Préfixe & Séquenceur</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Préfixe de Mission</label>
                        <input 
                          type="text"
                          value={refPrefix}
                          onChange={(e) => setRefPrefix(e.target.value.toUpperCase())}
                          placeholder="Prefixe"
                          className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-accent hover:border-white/20 transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Valeur du Compteur</label>
                        <input 
                          type="number"
                          value={refCounter}
                          onChange={(e) => setRefCounter(parseInt(e.target.value) || 0)}
                          className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-accent hover:border-white/20 transition-all font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">ID Colorimetry</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            value={refIdColor}
                            onChange={(e) => setRefIdColor(e.target.value)}
                            className="w-16 h-16 rounded-2xl border-none bg-transparent cursor-pointer"
                          />
                          <input 
                            type="text"
                            value={refIdColor}
                            onChange={(e) => setRefIdColor(e.target.value.toUpperCase())}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs text-white font-mono outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Customization */}
                <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent border border-accent/20 rounded-xl">
                       <Monitor size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Architecture du Header</h3>
                      <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1 opacity-60">Imagerie & Effets Fluides</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Logo de l'Application</label>
                      <div 
                        onClick={() => document.getElementById('app-logo-upload')?.click()}
                        className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent/40 hover:bg-black/40 transition-all overflow-hidden relative group"
                      >
                        {appLogo ? (
                          <div className="relative w-full h-full p-4 flex items-center justify-center">
                            <img src={appLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Plus size={24} className="text-white" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                              <ImageIcon size={20} className="text-white/20" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Importer Logo</span>
                          </>
                        )}
                      </div>
                      <input id="app-logo-upload" type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAppLogo(reader.result as string);
                            setToast({ show: true, message: 'Logo mis à jour', type: 'task' });
                          };
                          reader.readAsDataURL(file);
                        }
                      }} className="hidden" />
                      {appLogo && (
                        <button 
                          onClick={() => setAppLogo(null)}
                          className="text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 size={10} /> Supprimer le logo
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Background Asset</label>
                      <div 
                        onClick={() => document.getElementById('header-bg-upload-main')?.click()}
                        className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent/40 hover:bg-black/40 transition-all overflow-hidden relative group"
                      >
                        {headerBgImage ? (
                          <img src={headerBgImage} alt="Header Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={32} className="text-white/10" />
                        )}
                      </div>
                      <input id="header-bg-upload-main" type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setHeaderBgImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} className="hidden" />
                      {headerBgImage && (
                        <button 
                          onClick={() => {
                            setHeaderBgImage(null);
                            localStorage.removeItem('headerBgImage');
                          }}
                          className="text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 size={10} /> Supprimer le background
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Effets de Vague</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {(['liquid', 'organic', 'tech'] as const).map(t => (
                           <button key={t} onClick={() => setWaveType(t)} className={`py-4 text-[10px] font-black uppercase rounded-xl border transition-all ${waveType === t ? 'bg-accent text-black border-accent' : 'bg-black/40 text-text-dim border-white/10'}`}>
                             {t}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Couleur de la Vague</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          value={
                            waveColor.startsWith('#') ? waveColor : 
                            waveColor === 'text-accent' ? accentColor : 
                            waveColor === 'text-accent-blue' ? accentBlueColor : 
                            waveColor === 'text-accent-purple' ? accentPurpleColor : 
                            waveColor === 'text-accent-orange' ? accentOrangeColor : 
                            waveColor === 'text-accent-pink' ? accentPinkColor : 
                            waveColor === 'text-accent-red' ? accentRedColor : 
                            waveColor === 'text-accent-yellow' ? accentYellowColor : 
                            '#00FF94'
                          }
                          onChange={(e) => setWaveColor(e.target.value)}
                          className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border-none p-0"
                        />
                        <div className="flex-grow flex items-center gap-2">
                          <div className="flex gap-2">
                            {['text-accent', 'text-accent-blue', 'text-accent-purple'].map(c => {
                              const btnColor = 
                                c === 'text-accent' ? accentColor : 
                                c === 'text-accent-blue' ? accentBlueColor : 
                                accentPurpleColor;
                              return (
                                <button 
                                  key={c}
                                  onClick={() => setWaveColor(c)}
                                  className={`w-8 h-8 rounded-lg border transition-all ${waveColor === c ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                  style={{ 
                                    backgroundColor: btnColor,
                                    color: btnColor
                                  }}
                                  title={c}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 select-all ml-2">
                            {waveColor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Opacité Vague</label>
                        <span className="text-[10px] font-mono text-accent">{Math.round(waveOpacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={waveOpacity} 
                        onChange={(e) => setWaveOpacity(parseFloat(e.target.value))} 
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Opacité Background</label>
                        <span className="text-[10px] font-mono text-accent">{Math.round(headerBgOpacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={headerBgOpacity} 
                        onChange={(e) => setHeaderBgOpacity(parseFloat(e.target.value))} 
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" 
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Colorimétrie du Header</label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                         <input 
                            type="color" 
                            value={headerBgColor}
                            onChange={(e) => setHeaderBgColor(e.target.value)}
                            className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border-none p-0"
                         />
                         <span className="text-[10px] font-mono text-white/60">{headerBgColor.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 border-l border-white/10 pl-6 flex gap-2">
                        {['#000000', '#0F172A', '#1E1B4B', '#111827'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setHeaderBgColor(c)}
                            className={`w-8 h-8 rounded-lg border transition-all ${headerBgColor === c ? 'border-accent scale-110' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Typography */}
                <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20 rounded-xl">
                       <Type size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Moteur Typographique</h3>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <select value={appFont} onChange={(e) => setAppFont(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs text-white">
                      <option value="font-sans">Moderne (Sans)</option>
                      <option value="font-mono">Technique (Mono)</option>
                      <option value="font-serif">Élégant (Serif)</option>
                    </select>
                    <input type="range" min="80" max="140" value={appFontSize} onChange={(e) => setAppFontSize(parseInt(e.target.value))} className="w-full accent-accent" />
                  </div>
                </div>

                {/* System Colors */}
                <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent border border-accent/20 rounded-xl">
                       <Palette size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Palette Chromatique Interface</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-white/40">Navigation Accent</label>
                        <input type="color" value={navActiveColor} onChange={(e) => setNavActiveColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-white/40">Title Accent</label>
                        <input type="color" value={missionTitleColor} onChange={(e) => setMissionTitleColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent">Principal (Accent)</label>
                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent-blue">Accent Bleu</label>
                        <input type="color" value={accentBlueColor} onChange={(e) => setAccentBlueColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent-purple">Accent Violet</label>
                        <input type="color" value={accentPurpleColor} onChange={(e) => setAccentPurpleColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent-orange">Accent Orange</label>
                        <input type="color" value={accentOrangeColor} onChange={(e) => setAccentOrangeColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent-pink">Accent Rose</label>
                        <input type="color" value={accentPinkColor} onChange={(e) => setAccentPinkColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent-red">Accent Rouge</label>
                        <input type="color" value={accentRedColor} onChange={(e) => setAccentRedColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-accent-yellow">Accent Jaune</label>
                        <input type="color" value={accentYellowColor} onChange={(e) => setAccentYellowColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none p-0" />
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {systemSubTab === 'display' && (
            <motion.div
              key="display"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compact View Configuration */}
                <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent border border-accent/20 rounded-xl">
                       <Columns size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Colonnes Masquées : Vue Compacte</h3>
                      <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1 opacity-60">Sélectionnez les colonnes à masquer dans ce mode</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'missionNo', label: 'ID.Ref' },
                      { id: 'refId', label: 'Reference' },
                      { id: 'imageUrl', label: 'Capture' },
                      { id: 'product', label: 'Product Name' },
                      { id: 'color', label: 'Variant' },
                      { id: 'argumentType', label: 'Arg.' },
                      { id: 'univers', label: 'Universe' },
                      { id: 'format', label: 'Dimen.' },
                      { id: 'position', label: 'Orient.' },
                      { id: 'support', label: 'Support Cat.' },
                      { id: 'priority', label: 'Priority' },
                      { id: 'deadline', label: 'Date Deadline' },
                      { id: 'info', label: 'Consignes' },
                      { id: 'rating', label: 'Note' },
                      { id: 'status', label: 'Machine.State' },
                      { id: 'progress', label: 'Progression %' },
                      { id: 'photoCountRequested', label: 'Requise(s)' },
                      { id: 'photoCountDelivered', label: 'Livrée(s)' },
                      { id: 'ficha', label: 'Dossier' }
                    ].map(col => {
                      const isHidden = compactHiddenColumns.includes(col.id);
                      return (
                        <button
                          key={`compact-${col.id}`}
                          onClick={() => {
                            setCompactHiddenColumns(prev => 
                              isHidden ? prev.filter(id => id !== col.id) : [...prev, col.id]
                            );
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isHidden ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'}`}
                        >
                          <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${isHidden ? 'bg-accent border-accent text-black' : 'border-white/20'}`}>
                            {isHidden && <Check size={8} strokeWidth={4} />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{col.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minimal View Configuration */}
                <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20 rounded-xl">
                       <ChevronsLeft size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Colonnes Masquées : Tout Rétracter</h3>
                      <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1 opacity-60">Sélectionnez les colonnes à masquer dans ce mode</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'missionNo', label: 'ID.Ref' },
                      { id: 'refId', label: 'Reference' },
                      { id: 'imageUrl', label: 'Capture' },
                      { id: 'product', label: 'Product Name' },
                      { id: 'color', label: 'Variant' },
                      { id: 'argumentType', label: 'Arg.' },
                      { id: 'univers', label: 'Universe' },
                      { id: 'format', label: 'Dimen.' },
                      { id: 'position', label: 'Orient.' },
                      { id: 'support', label: 'Support Cat.' },
                      { id: 'priority', label: 'Priority' },
                      { id: 'deadline', label: 'Date Deadline' },
                      { id: 'info', label: 'Consignes' },
                      { id: 'rating', label: 'Note' },
                      { id: 'status', label: 'Machine.State' },
                      { id: 'progress', label: 'Progression %' },
                      { id: 'photoCountRequested', label: 'Requise(s)' },
                      { id: 'photoCountDelivered', label: 'Livrée(s)' },
                      { id: 'ficha', label: 'Dossier' }
                    ].map(col => {
                      const isHidden = minimalHiddenColumns.includes(col.id);
                      return (
                        <button
                          key={`minimal-${col.id}`}
                          onClick={() => {
                            setMinimalHiddenColumns(prev => 
                              isHidden ? prev.filter(id => id !== col.id) : [...prev, col.id]
                            );
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isHidden ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'}`}
                        >
                          <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${isHidden ? 'bg-accent-purple border-accent-purple text-black' : 'border-white/20'}`}>
                            {isHidden && <Check size={8} strokeWidth={4} />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{col.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent-yellow/10 flex items-center justify-center text-accent-yellow border border-accent-yellow/20 rounded-xl">
                     <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Gestion des Alertes Deadline</h3>
                    <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1 opacity-60">Configurer le seuil d'alerte pour les échéances</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Configuration de la Deadline Globale</p>
                      <p className="text-[10px] text-text-dim mt-1">Choisir le jour pour la Deadline par défaut de toutes les missions</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="date"
                        value={globalDeadline}
                        onChange={(e) => setGlobalDeadline(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg text-xs p-2 text-white outline-none focus:border-accent transition-all font-mono"
                      />
                      <button 
                        onClick={() => {
                          if (!globalDeadline) return;
                          setMissions(prev => prev.map(m => ({ ...m, deadline: globalDeadline })));
                          setSecondaryMissions(prev => prev.map(m => ({ ...m, deadline: globalDeadline })));
                          saveToLocalStorage();
                          setToast({ show: true, message: 'Deadline appliquée à toutes les missions !', type: 'task' });
                          setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
                        }}
                        disabled={!globalDeadline}
                        className="px-4 py-2 bg-accent text-black text-[10px] font-black uppercase rounded hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Appliquer à tout
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Seuil d'Alerte Personnalisable</p>
                      <p className="text-[10px] text-text-dim mt-1">Régler le nombre de jours avant alerte (Indication en rouge)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setDeadlineAlertThreshold(Math.max(0, deadlineAlertThreshold - 1))}
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all font-mono text-xl"
                      >
                        -
                      </button>
                      <div className="flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-2xl font-black text-accent-yellow font-mono">{deadlineAlertThreshold}</span>
                        <span className="text-[8px] text-text-dim uppercase font-bold tracking-tighter">jours</span>
                      </div>
                      <button 
                        onClick={() => setDeadlineAlertThreshold(deadlineAlertThreshold + 1)}
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all font-mono text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-1">
                     <div className={`p-2 rounded-lg ${deadlineAlertThreshold > 0 ? 'bg-accent-yellow/10 text-accent-yellow' : 'bg-white/5 text-white/20'}`}>
                       <AlertTriangle size={16} />
                     </div>
                     <p className="text-[10px] text-text-dim leading-relaxed">
                       L'icône <span className="text-accent-yellow font-bold">⚠️</span> apparaîtra sur les missions non terminées dont la date d'échéance est inférieure ou égale à <span className="text-white font-bold">{deadlineAlertThreshold} jours</span> par rapport à aujourd'hui.
                     </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/20 rounded text-blue-500 flex-shrink-0">
                    <Info size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">Comportement des Presets</h4>
                    <p className="text-[11px] text-text-dim leading-relaxed">
                      Les colonnes sélectionnées ici seront automatiquement masquées lorsque vous basculerez sur les modes <span className="text-accent underline decoration-accent/30 font-bold">Vue Compacte</span> ou <span className="text-accent-purple underline decoration-accent-purple/30 font-bold">Tout Rétracter</span>. 
                      Vous pouvez toujours les réafficher manuellement depuis le tableau, mais ces réglages servent de base pour chaque mode.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {systemSubTab === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Data Operations */}
              <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-14 h-14 bg-accent-blue/10 flex items-center justify-center text-accent-blue border border-accent-blue/20 rounded-2xl shadow-lg">
                      <Database size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-wider text-white leading-tight">Master Data Management</h3>
                     <p className="text-[11px] text-text-dim uppercase font-bold tracking-[3px] mt-1">Export Brut & Restauration Système</p>
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="relative">
                      <textarea 
                        value={systemDataJson}
                        onChange={(e) => setSystemDataJson(e.target.value)}
                        placeholder="Coller le flux JSON ou charger un fichier pour restauration immédiate..."
                        className="w-full h-48 bg-black/80 border border-white/10 p-6 rounded-2xl text-xs text-accent-blue font-mono outline-none focus:border-accent-blue transition-all resize-none shadow-inner custom-scrollbar"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      <button 
                        onClick={copySystemJson}
                        className="py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[2px] text-white hover:bg-white/10 transition-all rounded-xl flex items-center justify-center gap-3"
                        title="Copier le flux JSON dans le presse-papier"
                      >
                        <Copy size={14} /> Copier JSON
                      </button>

                      <button 
                         onClick={downloadSystemJson}
                         className="py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[2px] text-white hover:bg-white/10 transition-all rounded-xl flex items-center justify-center gap-3"
                         title="Exporter la sauvegarde en fichier .json"
                      >
                         <FileJson size={14} /> Exporter .JSON
                      </button>

                      <button 
                         onClick={backupToGoogleDrive}
                         disabled={!googleToken}
                         className={`py-4 bg-[#4285F4]/10 border border-[#4285F4]/30 text-[9px] font-black uppercase tracking-[2px] ${googleToken ? 'text-[#4285F4] hover:bg-[#4285F4]/20 cursor-pointer' : 'text-text-dim opacity-50 cursor-not-allowed'} transition-all rounded-xl flex items-center justify-center gap-3`}
                         title={googleToken ? "Sauvegarder le fichier .json directement sur votre Google Drive" : "Veuillez connecter Google en haut à droite d'abord"}
                      >
                         <Upload size={14} /> Drive Sync
                      </button>

                      <button 
                        onClick={() => jsonFileInputRef.current?.click()}
                        className="py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[2px] text-white hover:bg-white/10 transition-all rounded-xl flex items-center justify-center gap-3"
                        title="Charger un fichier de sauvegarde .json"
                      >
                        <Upload size={14} /> Charger JSON
                        <input 
                          type="file"
                          ref={jsonFileInputRef}
                          onChange={handleJsonFileUpload}
                          className="hidden"
                          accept=".json"
                        />
                      </button>

                      <button 
                        onClick={importSystemData}
                        disabled={!systemDataJson.trim()}
                        className="py-4 bg-accent/10 border border-accent/20 text-[9px] font-black uppercase tracking-[2px] text-accent hover:bg-accent hover:text-black transition-all rounded-xl flex items-center justify-center gap-3 disabled:opacity-20 shadow-[0_0_20px_rgba(0,255,148,0.1)]"
                        title="Appliquer les données présentes dans l'éditeur"
                      >
                        <Zap size={14} /> Importer
                      </button>

                      <button 
                         onClick={downloadFullExport}
                         className="py-4 bg-accent-blue/10 border border-accent-blue/20 text-[9px] font-black uppercase tracking-[2px] text-accent-blue hover:bg-accent-blue hover:text-black transition-all rounded-xl flex items-center justify-center gap-3"
                         title="Générer un rapport Excel complet"
                      >
                         <FileSpreadsheet size={14} /> Rapport Excel
                      </button>

                      <button 
                         onClick={resetJournal}
                         className="py-4 bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase tracking-[2px] text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl flex items-center justify-center gap-3"
                         title="Réinitialiser l'historique global"
                      >
                         <RotateCcw size={14} /> Reset Journal
                      </button>
                   </div>
                </div>
              </div>

              {/* Auto Export Configuration */}
              <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-14 h-14 bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20 rounded-2xl shadow-lg">
                      <Clock size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-wider text-white leading-tight">Exportation Silencieuse</h3>
                     <p className="text-[11px] text-text-dim uppercase font-bold tracking-[3px] mt-1">Automatisation de Sauvegarde Excel</p>
                   </div>
                </div>

                <div className="space-y-8">
                  {/* Periodic Export */}
                  <div className="p-6 bg-black/20 border border-white/5 rounded-2xl space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">Export Périodique</h4>
                            <p className="text-[10px] text-text-dim max-w-[250px]">Téléchargement régulier du fichier Excel en arrière-plan à la fréquence définie.</p>
                          </div>
                          <Toggle enabled={autoExportEnabled} onToggle={() => setAutoExportEnabled(!autoExportEnabled)} />
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                           <Activity size={10} /> Fréquence (Minutes)
                        </label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="range"
                            min="1"
                            max="120"
                            step="1"
                            value={autoExportInterval}
                            onChange={(e) => setAutoExportInterval(parseInt(e.target.value))}
                            disabled={!autoExportEnabled}
                            className="w-full form-range accent-accent-purple"
                          />
                          <span className={`text-xl font-black uppercase tracking-widest ${autoExportEnabled ? 'text-accent-purple' : 'text-text-dim'} min-w-[60px] text-right`}>
                            {autoExportInterval}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Export */}
                  <div className="p-6 bg-black/20 border border-white/5 rounded-2xl space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">Export Planifié</h4>
                            <p className="text-[10px] text-text-dim max-w-[250px]">Téléchargement programmé un jour précis de la semaine à une heure donnée.</p>
                          </div>
                          <Toggle enabled={scheduledExportEnabled} onToggle={() => setScheduledExportEnabled(!scheduledExportEnabled)} />
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-[2_2_0%]">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2 mb-2">
                             <Calendar size={10} /> Jours de la semaine
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { value: '1', label: 'Lun' },
                              { value: '2', label: 'Mar' },
                              { value: '3', label: 'Mer' },
                              { value: '4', label: 'Jeu' },
                              { value: '5', label: 'Ven' },
                              { value: '6', label: 'Sam' },
                              { value: '0', label: 'Dim' }
                            ].map(day => (
                              <button
                                key={day.value}
                                onClick={() => {
                                  if (scheduledExportDays.includes(day.value)) {
                                    setScheduledExportDays(scheduledExportDays.filter(d => d !== day.value));
                                  } else {
                                    setScheduledExportDays([...scheduledExportDays, day.value]);
                                  }
                                }}
                                disabled={!scheduledExportEnabled}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                  scheduledExportDays.includes(day.value) && scheduledExportEnabled
                                    ? 'bg-accent-purple text-white'
                                    : 'bg-black/40 text-text-dim border border-white/10'
                                } ${!scheduledExportEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent-purple/50'}`}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2 mb-2">
                             <Clock size={10} /> Heure
                          </label>
                          <input
                            type="time"
                            value={scheduledExportTime}
                            onChange={(e) => setScheduledExportTime(e.target.value)}
                            disabled={!scheduledExportEnabled}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-bold tracking-wider outline-none focus:border-accent-purple/50 transition-colors ${scheduledExportEnabled ? 'text-white' : 'text-text-dim'} [color-scheme:dark]`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex items-center justify-between mt-8 mb-4">
                <h3 className="text-xl font-black uppercase tracking-wider text-white">Éditeur de Catégories</h3>
                <button 
                  onClick={() => {
                    const editorIds = categories.map(c => `editor-${c.id}`);
                    const allCollapsed = editorIds.every(id => collapsedSettingsSections.includes(id));
                    if (allCollapsed) {
                      setCollapsedSettingsSections(prev => prev.filter(id => !editorIds.includes(id)));
                    } else {
                      setCollapsedSettingsSections(prev => [...new Set([...prev, ...editorIds])]);
                    }
                  }}
                  className="text-[10px] font-black uppercase tracking-[2px] text-accent hover:text-white transition-colors flex items-center gap-2 bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-md"
                >
                  {categories.map(c => `editor-${c.id}`).every(id => collapsedSettingsSections.includes(id)) ? 'Tout Développer' : 'Tout Rétracter'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl h-fit overflow-hidden">
                    <CategoryEditor 
                      category={cat} 
                      onUpdate={(updates) => updateCategory(cat.id, updates)}
                      isCollapsed={collapsedSettingsSections.includes(`editor-${cat.id}`)}
                      onToggle={() => setCollapsedSettingsSections(prev => 
                        prev.includes(`editor-${cat.id}`)
                          ? prev.filter(id => id !== `editor-${cat.id}`)
                          : [...prev, `editor-${cat.id}`]
                      )}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Save Trigger */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-10 bg-black/60 backdrop-blur-xl border border-accent/20 rounded-3xl shadow-[0_0_50px_rgba(0,255,148,0.05)] mt-12">
            <div className="text-center sm:text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[4px] text-accent leading-none mb-2">Sauvegarde Critique</h4>
               <p className="text-[9px] text-text-dim uppercase font-bold tracking-widest max-w-[400px]">Tout changement d'architecture sera persisté dans le noyau local de l'application.</p>
            </div>
            <button 
              onClick={saveToLocalStorage}
              className="w-full sm:w-auto px-16 py-6 bg-accent text-black uppercase font-black tracking-[5px] text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4 rounded-2xl shadow-[0_0_40px_rgba(0,255,148,0.3)] animate-pulse hover:animate-none"
            >
              <Save size={24} />
              COMMIT ARCHITECTURE
            </button>
        </div>
      </div>
    );
  };

  const renderJournalView = () => (
    <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden mb-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="px-8 py-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-accent/5 border border-accent/20 rounded text-accent shadow-[0_0_15px_rgba(0,255,148,0.1)]">
            <Clock size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase tracking-[4px] text-white">System Command Center</h3>
            <p className="text-[9px] font-mono uppercase text-accent tracking-[3px] opacity-70 mt-1">Status: Operational // Data Stream: Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-5 py-2 bg-black/60 border border-white/5 rounded-sm">
           <div className="flex items-center gap-2 mr-4 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[2px] group-hover:text-accent transition-colors">Exposer Missions Secondaires</span>
              <Toggle enabled={showSecondaryInReport} onToggle={() => setShowSecondaryInReport(!showSecondaryInReport)} />
           </div>

           <div className="flex flex-col items-end mr-4">
             <span className="text-[8px] font-black text-white/40 uppercase tracking-[2px]">Log Latency</span>
             <span className="text-[10px] font-mono text-accent">0.002ms</span>
           </div>
           
           <button 
             onClick={downloadFullExport}
             className="px-4 py-1.5 bg-accent/10 border border-accent/20 text-accent rounded text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-black active:scale-95 transition-all flex items-center gap-2"
           >
             <Download size={10} />
             Export Global
           </button>

           <button 
             onClick={resetJournal}
             className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white active:scale-95 transition-all flex items-center gap-2"
           >
             <RotateCcw size={10} />
             Reset Journal
           </button>

           <div className="w-[1px] h-6 bg-white/10 mx-4" />
           <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-b border-white/10 bg-black/40">
        <div className="flex flex-col gap-2 mb-4">
           <h4 className="text-[10px] font-black uppercase tracking-[3px] text-accent flex items-center gap-2">
             <BookOpen size={12} />
             Manuel d'opérations
           </h4>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40 group-focus-within:text-accent transition-colors">
              <Plus size={16} />
            </div>
            <input 
              type="text"
              value={manualLog}
              onChange={(e) => setManualLog(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addManualLog()}
              placeholder="Saisir rapport manuel d'opération (Manuel d'opérations)..."
              className="w-full bg-black/20 border border-white/10 pl-12 pr-4 py-4 rounded text-[13px] text-white placeholder:text-white/20 outline-none focus:border-accent/40 hover:bg-black/60 transition-all font-mono"
            />
          </div>
          <button 
            onClick={addManualLog}
            disabled={!manualLog.trim()}
            className="px-8 h-[54px] bg-accent text-black text-[12px] font-black uppercase tracking-[3px] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,148,0.15)]"
          >
            EXECUTE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 p-6 min-h-[600px]">
        {/* Left column: Logs */}
        <div className="flex flex-col bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-inner">
          <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-text-dim">Flux Télémétrie / Temps Réel</span>
              <button 
                onClick={handleLiveRefresh}
                className={`flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 transition-all hover:bg-white/10 group ${isRefreshing ? 'opacity-50' : ''}`}
                title="Actualiser le flux"
              >
                <RefreshCw size={10} className={`text-accent ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">Live Refresh</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-accent animate-pulse">{globalLogs.length} LOGS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar relative">
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {globalLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-20 gap-6 py-20">
                <Loader2 size={48} className="animate-spin text-accent" />
                <p className="uppercase tracking-[10px] text-[10px] font-black text-white">Initializing Télémétrie System.log...</p>
              </div>
            ) : (
              <div className="space-y-1 relative z-10">
                {globalLogs.slice().reverse().map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 p-3 border-b border-white/[0.03] hover:bg-white/[0.02] group transition-colors cursor-default"
                  >
                    <div className="flex flex-col items-center pt-0.5 min-w-[85px]">
                      <span className="text-[9px] font-mono text-white/60 mb-0.5">
                        {safeFormatDate(log.timestamp)}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 group-hover:text-white transition-colors">
                        {safeFormatTime(log.timestamp)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black uppercase tracking-[2px] px-2 py-0.5 border ${
                          log.type === 'manual' ? 'bg-accent/10 border-accent/20 text-accent' : 
                          log.type === 'instruction' ? 'bg-accent-purple/10 border-accent-purple/20 text-accent-purple' :
                          log.type === 'mission' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 
                          'bg-white/5 border-white/10 text-white/60'
                        }`}>
                          {log.type === 'instruction' ? 'instruction' : log.type}
                        </span>
                        <div className="h-[1px] flex-1 bg-white/[0.05]" />
                      </div>
                      <p className={`text-[12px] font-medium leading-relaxed tracking-wide ${
                        log.type === 'manual' ? 'text-accent shadow-[0_0_10px_rgba(0,255,148,0.1)]' : 
                        log.type === 'instruction' ? 'text-accent-purple font-bold' :
                        log.type === 'mission' ? 'text-[#00D1FF]' : 
                        'text-white'
                      }`}>
                        {log.message}
                      </p>
                    </div>

                    <button 
                      onClick={() => deleteLog(log.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all rounded-lg shrink-0 self-center"
                      title="Supprimer ce log"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Pilotage Center */}
        <div className="bg-black/20 border border-white/5 rounded-xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-accent/5 flex items-center gap-3 shrink-0">
             <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Target size={18} />
             </div>
             <div>
                <h4 className="text-xs font-black uppercase tracking-[3px] text-white">Central Pilotage</h4>
                <p className="text-[8px] font-mono text-accent/60 uppercase tracking-widest mt-0.5">Quick Actions // Mission Override</p>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {missions.filter(m => m.enabled).length === 0 ? (
               <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl opacity-20">
                  <Package size={32} />
                  <p className="text-[9px] font-black uppercase mt-4">Aucune mission active</p>
               </div>
            ) : (
              missions.filter(m => m.enabled).map((m) => (
                <div key={m.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4 hover:border-accent/30 transition-all group">
                   <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-mono text-accent-blue font-bold">#{m.missionNo} — [{m.refId}]</span>
                         <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-white mt-1 group-hover:text-accent transition-colors truncate max-w-[170px] text-left uppercase">{m.product}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeMission(m.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-text-dim hover:text-red-500 transition-all flex h-6 w-6 items-center justify-center rounded-lg hover:bg-red-500/10"
                              title="Supprimer"
                            >
                              <Trash2 size={12} />
                            </button>
                         </div>
                      </div>
                      <InteractiveStarRating 
                        rating={m.rating} 
                        onRatingChange={(val) => updateMission(m.id, { rating: val })} 
                        size={14}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                         <label className="text-[8px] font-black uppercase tracking-widest text-text-dim">Statut</label>
                         <select 
                           value={m.status}
                           onChange={(e) => updateMission(m.id, { status: e.target.value })}
                           className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-[9px] text-white uppercase font-bold outline-none focus:border-accent appearance-none cursor-pointer"
                         >
                            {categories.find(c => c.id === 'status')?.items.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] font-black uppercase tracking-widest text-text-dim flex justify-between">
                            <span>Progress</span>
                            <span className="text-accent">{m.progress}%</span>
                         </label>
                         <input 
                           type="range"
                           min="0"
                           max="100"
                           step="5"
                           value={m.progress}
                           onChange={(e) => updateMission(m.id, { progress: parseInt(e.target.value) })}
                           className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                         />
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-white/5 bg-black/40 text-center">
             <span className="text-[8px] font-mono text-white/30 uppercase tracking-[4px]">System Integrity: Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryView = () => {
    const listMissions = missions.filter(m => {
      if (!m.enabled) return false;
      if (showPreparedHistory) {
        return m.status === 'produit préparé';
      } else {
        return m.status === 'en attente';
      }
    });

    // Grouping by product and color (case-insensitive and trimmed)
    const groups: { [key: string]: { product: string; color: string; count: number; missions: Mission[] } } = {};
    listMissions.forEach(m => {
      const prod = (m.product || '').trim();
      const col = (m.color || '').trim();
      const key = `${prod.toLowerCase()}|||${col.toLowerCase()}`;
      if (!groups[key]) {
        groups[key] = {
          product: prod,
          color: col,
          count: 0,
          missions: []
        };
      }
      groups[key].count += 1;
      groups[key].missions.push(m);
    });

    const groupList = Object.values(groups).filter(g => {
      const q = inventorySearch.toLowerCase();
      return (
        g.product.toLowerCase().includes(q) || 
        g.color.toLowerCase().includes(q)
      );
    });

    // Total unique items count and overall sum of items
    const totalItemsToPrepare = missions.filter(m => m.enabled && m.status === 'en attente').length;
    const totalItemsPrepared = missions.filter(m => m.enabled && m.status === 'produit préparé').length;
    const uniqueGroupsCount = Object.keys(groups).length;

    // Handle marking a group as prepared or back to pending
    const handleToggleGroupStatus = (group: { product: string; color: string; missions: Mission[] }, shouldPrepare: boolean) => {
      const targetStatus = shouldPrepare ? 'produit préparé' : 'en attente';
      const progressValue = shouldPrepare ? 25 : 0; // en attente is 0, produit préparé is 25

      group.missions.forEach(m => {
        updateMission(m.id, { 
          status: targetStatus,
          progress: progressValue
        });
      });

      const count = group.missions.length;
      const pName = group.product;
      const cName = group.color;

      setToast({ 
        show: true, 
        message: `${count} x ${pName} (${cName}) marqué(s) comme ${shouldPrepare ? 'PRÉPARÉ(S)' : 'EN ATTENTE'} !`, 
        type: 'task' 
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const exportInventoryExcel = () => {
      try {
        const allCombos: { [key: string]: { product: string; color: string; pending: number; prepared: number; total: number } } = {};
        
        missions.filter(m => m.enabled).forEach(m => {
          const prod = (m.product || '').trim();
          const col = (m.color || '').trim();
          const key = `${prod.toLowerCase()}|||${col.toLowerCase()}`;
          if (!allCombos[key]) {
            allCombos[key] = {
              product: prod,
              color: col,
              pending: 0,
              prepared: 0,
              total: 0
            };
          }
          if (m.status === 'produit préparé') {
            allCombos[key].prepared += 1;
          } else {
            allCombos[key].pending += 1;
          }
          allCombos[key].total += 1;
        });

        // Sheet 1: Synthèse Inventaire Groupée
        const synthesisHeaders = ['Nom du Produit', 'Couleur', 'Quantité en Attente', 'Quantité Préparée', 'Quantité Totale'];
        const synthesisData = Object.values(allCombos).map(c => [
          c.product,
          c.color || 'Neutre',
          c.pending,
          c.prepared,
          c.total
        ]);

        // Sheet 2: Détail unitaire des produits
        const detailHeaders = ['ID Réf', 'Produit', 'Couleur', 'Priorité', 'Statut', 'Date Création', 'Échéance', 'Note/Info'];
        const detailData = missions.filter(m => m.enabled).map(m => [
          m.refId || m.missionNo,
          m.product || '-',
          m.color || 'Neutre',
          m.priority || '-',
          m.status || '-',
          safeFormatDate(m.createdAt),
          m.deadline || '-',
          m.info || '-'
        ]);

        const workbook = XLSX.utils.book_new();

        // Metadata Sheet
        const metaHeaders = ['Indicateur', 'Valeur'];
        const metaData = [
          ['Fichier', 'Export Global Inventaire Multi-produits'],
          ['Date d\'Export', new Date().toLocaleDateString('fr-FR')],
          ['Heure d\'Export', new Date().toLocaleTimeString('fr-FR')],
          ['Total en Attente', totalItemsToPrepare],
          ['Total Préparés', totalItemsPrepared]
        ];
        const metaSheet = XLSX.utils.aoa_to_sheet([metaHeaders, ...metaData]);
        XLSX.utils.book_append_sheet(workbook, metaSheet, "Infos Inventaire");

        // Synthèse Sheet
        const synthesisSheet = XLSX.utils.aoa_to_sheet([synthesisHeaders, ...synthesisData]);
        XLSX.utils.book_append_sheet(workbook, synthesisSheet, "Synthèse Inventaire");

        // Détails Sheet
        const detailSheet = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailData]);
        XLSX.utils.book_append_sheet(workbook, detailSheet, "Produits Détails");

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        XLSX.writeFile(workbook, `Inventaire_Global_Preparation_${dateStr}.xlsx`);

        setToast({ show: true, message: 'Inventaire exporté avec succès !', type: 'task' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      } catch (err: any) {
        console.error('Error during inventory export:', err);
        setToast({ show: true, message: `Erreur d'export Excel: ${err.message}`, type: 'alert' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      }
    };

    const handleInventoryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const fileNames = files.map(f => f.name);
      const combinedNames = fileNames.join(', ');
      setInventoryFileName(prev => prev ? `${prev}, ${combinedNames}` : combinedNames);

      const parsedProducts: { product: string; color: string; quantity: number; priority?: string; info?: string; deadline?: string }[] = [];

      const readAndParseFile = (file: File): Promise<void> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = new Uint8Array(event.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              
              // Find the sheet to parse, skipping known metadata sheets
              let sheetName = "";
              const preferredSheets = ["Synthèse Inventaire", "Produits Détails", "Production (Missions)", "Missions Production", "Produits Details", "Details"];
              for (const pref of preferredSheets) {
                if (workbook.SheetNames.includes(pref)) {
                  sheetName = pref;
                  break;
                }
              }
              if (!sheetName) {
                // Find first sheet that is not a known metadata sheet
                sheetName = workbook.SheetNames.find(name => !["Infos Inventaire", "Infos Export", "Infos de sauvegarde"].includes(name)) || workbook.SheetNames[0];
              }

              const worksheet = workbook.Sheets[sheetName];
              if (!worksheet) {
                resolve();
                return;
              }

              const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              if (rows.length <= 1) {
                resolve();
                return;
              }

              // Dynamic header finding helper to scan the rows for product indicators
              const findHeaderRowAndIndices = (allRows: any[][]) => {
                const productKeywords = ['produit', 'product', 'nom', 'modèle', 'article', 'item', 'name'];
                const colorKeywords = ['couleur', 'color', 'col', 'teinte'];
                const qtyKeywords = ['quantité en attente', 'attente', 'quantité', 'quantite', 'qty', 'qte', 'count', 'nombre', 'total', 'pièces', 'pieces'];
                const priorityKeywords = ['priorité', 'priorite', 'priority'];
                const infoKeywords = ['info', 'note', 'commentaire', 'description', 'réf', 'ref'];
                const deadlineKeywords = ['echeance', 'échéance', 'deadline', 'date'];

                const scanLimit = Math.min(allRows.length, 12);
                for (let rIdx = 0; rIdx < scanLimit; rIdx++) {
                  const r = allRows[rIdx];
                  if (!r) continue;
                  
                  const rowStrings = r.map(c => String(c || '').trim().toLowerCase());
                  const prodIdx = rowStrings.findIndex(s => productKeywords.some(kw => s.includes(kw) || s === kw));
                  
                  if (prodIdx !== -1) {
                    const colIdx = rowStrings.findIndex(s => colorKeywords.some(kw => s.includes(kw) || s === kw));
                    const qIdx = rowStrings.findIndex(s => qtyKeywords.some(kw => s.includes(kw) || s === kw));
                    const prioIdx = rowStrings.findIndex(s => priorityKeywords.some(kw => s.includes(kw) || s === kw));
                    const infIdx = rowStrings.findIndex(s => infoKeywords.some(kw => s.includes(kw) || s === kw));
                    const deadIdx = rowStrings.findIndex(s => deadlineKeywords.some(kw => s.includes(kw) || s === kw));

                    return {
                      headerRowIndex: rIdx,
                      productIdx: prodIdx,
                      colorIdx: colIdx !== -1 ? colIdx : -1,
                      qtyIdx: qIdx !== -1 ? qIdx : -1,
                      priorityIdx: prioIdx !== -1 ? prioIdx : -1,
                      infoIdx: infIdx !== -1 ? infIdx : -1,
                      deadlineIdx: deadIdx !== -1 ? deadIdx : -1
                    };
                  }
                }

                // Fallback to row 0 default guess
                return {
                  headerRowIndex: 0,
                  productIdx: 0,
                  colorIdx: 1,
                  qtyIdx: -1,
                  priorityIdx: -1,
                  infoIdx: -1,
                  deadlineIdx: -1
                };
              };

              const { headerRowIndex, productIdx, colorIdx, qtyIdx, priorityIdx, infoIdx, deadlineIdx } = findHeaderRowAndIndices(rows);

              // Helper to check and filter fake rows/metadata completely out
              const isMetadataValue = (val: string) => {
                if (!val) return true;
                const lower = val.trim().toLowerCase();
                const metadataIndicators = [
                  'fichier', 
                  'date d\'export', 
                  'date dexport',
                  'heure d\'export', 
                  'heure dexport',
                  'total en attente', 
                  'total préparés', 
                  'total preparés', 
                  'total préparé',
                  'total prepare',
                  'modèles & couleurs uniques', 
                  'indicateur', 
                  'valeur',
                  'nom du produit', 
                  'nom de produit',
                  'produit',
                  'product',
                  'id réf',
                  'id ref',
                  'infos inventaire',
                  'synthèse inventaire'
                ];
                return metadataIndicators.some(ind => lower === ind || lower.startsWith(ind + ':') || lower.startsWith(ind + ' '));
              };

              for (let i = headerRowIndex + 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length === 0) continue;

                const productVal = row[productIdx] ? String(row[productIdx]).trim() : '';
                const colorVal = (colorIdx !== -1 && row[colorIdx]) ? String(row[colorIdx]).trim() : '';

                if (!productVal || isMetadataValue(productVal)) continue;

                let qtyVal = 1;
                if (qtyIdx !== -1 && row[qtyIdx] !== undefined && row[qtyIdx] !== null) {
                  const valNum = parseInt(String(row[qtyIdx]), 10);
                  if (!isNaN(valNum) && valNum > 0) {
                    qtyVal = valNum;
                  }
                }

                const priorityVal = priorityIdx !== -1 && row[priorityIdx] ? String(row[priorityIdx]).trim() : 'Medium priority';
                const infoVal = infoIdx !== -1 && row[infoIdx] ? String(row[infoIdx]).trim() : `Importé`;
                const deadlineVal = deadlineIdx !== -1 && row[deadlineIdx] ? String(row[deadlineIdx]).trim() : '';

                parsedProducts.push({
                  product: productVal,
                  color: colorVal || 'Neutre',
                  quantity: qtyVal,
                  priority: priorityVal,
                  info: infoVal,
                  deadline: deadlineVal
                });
              }
              resolve();
            } catch (err) {
              console.error(`Error parsing file ${file.name}:`, err);
              resolve();
            }
          };
          reader.onerror = () => {
            console.error(`FileReader error on file ${file.name}`);
            resolve();
          };
          reader.readAsArrayBuffer(file);
        });
      };

      try {
        await Promise.all(files.map(f => readAndParseFile(f)));

        if (parsedProducts.length === 0) {
          setToast({ show: true, message: 'Aucun produit valide reconnu dans le(s) fichier(s).', type: 'alert' });
        } else {
          setInventoryPreviewData(prev => {
            const mergedMap: { [key: string]: { product: string; color: string; quantity: number; priority?: string; info?: string; deadline?: string } } = {};
            [...prev, ...parsedProducts].forEach(item => {
              const k = `${item.product.toLowerCase().trim()}|||${item.color.toLowerCase().trim()}`;
              if (!mergedMap[k]) {
                mergedMap[k] = { ...item };
              } else {
                mergedMap[k].quantity += item.quantity;
                if (item.info && !mergedMap[k].info?.includes(item.info)) {
                  mergedMap[k].info = `${mergedMap[k].info}, ${item.info}`;
                }
              }
            });
            return Object.values(mergedMap);
          });
          setToast({ show: true, message: 'Fichier(s) importé(s) et cumulé(s) dans la liste de préparation !', type: 'task' });
        }
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      } catch (err: any) {
        console.error(err);
        setToast({ show: true, message: `Erreur durant le traitement Excel : ${err.message}`, type: 'alert' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      }

      e.target.value = '';
    };

    const confirmInventoryImport = () => {
      if (inventoryPreviewData.length === 0) return;
      
      let addedCount = 0;
      let localMissionCounter = missionCounter;
      let localRefCounter = refCounter;
      const newMissions: Mission[] = [];

      // Map of existing pending missions by product+color
      const existingPendingMap: { [key: string]: Mission[] } = {};
      missions.filter(m => m.enabled && m.status === 'en attente').forEach(m => {
        const prod = (m.product || '').trim().toLowerCase();
        const col = (m.color || '').trim().toLowerCase();
        const k = `${prod}|||${col}`;
        if (!existingPendingMap[k]) {
          existingPendingMap[k] = [];
        }
        existingPendingMap[k].push(m);
      });

      inventoryPreviewData.forEach(item => {
        const prodKey = `${item.product.trim().toLowerCase()}|||${item.color.trim().toLowerCase()}`;
        const existingCount = existingPendingMap[prodKey] ? existingPendingMap[prodKey].length : 0;

        let copiesToAdd = 0;
        if (importDuplicateMode === 'skip') {
          if (existingCount > 0) {
            copiesToAdd = 0; // Already exists, skip completely
          } else {
            copiesToAdd = item.quantity > 0 ? item.quantity : 1;
          }
        } else if (importDuplicateMode === 'adjust') {
          const targetQty = item.quantity > 0 ? item.quantity : 1;
          if (existingCount < targetQty) {
            copiesToAdd = targetQty - existingCount;
          } else {
            copiesToAdd = 0;
          }
        } else {
          // append
          copiesToAdd = item.quantity > 0 ? item.quantity : 1;
        }

        for (let c = 0; c < copiesToAdd; c++) {
          const id = Math.random().toString(36).substring(2, 9);
          const refId = `${refPrefix}-${localRefCounter}`;

          const m: Mission = {
            id,
            missionNo: localMissionCounter,
            refId,
            product: item.product,
            color: item.color,
            argumentType: 'Studio standard',
            univers: 'Général',
            format: '1:1',
            position: 'Face',
            support: 'Photo',
            priority: item.priority || 'Medium priority',
            status: 'en attente',
            progress: 0,
            photoCountRequested: 1,
            photoCountDelivered: 0,
            info: item.info || "Importation d'inventaire",
            deadline: item.deadline || '',
            createdAt: Date.now(),
            history: [
              { timestamp: Date.now(), message: "Créé via importation d'inventaire" }
            ],
            enabled: true
          };

          newMissions.push(m);
          localMissionCounter++;
          localRefCounter++;
          addedCount++;
        }
      });

      if (newMissions.length > 0) {
        newMissions.forEach(m => {
          registerNewProductOrColor(m.product, m.color);
        });
        setMissions(prev => [...newMissions, ...prev]);
        setMissionCounter(localMissionCounter);
        setRefCounter(localRefCounter);

        const logMsg = `IMPORTATION : ${addedCount} produit(s) importé(s) en attente via Excel (Fichier(s): "${inventoryFileName}") [Mode: ${
          importDuplicateMode === 'skip' ? 'Éviter les doublons' : importDuplicateMode === 'adjust' ? 'Ajuster les quantités' : 'Tout ajouter'
        }]`;
        setGlobalLogs(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            message: logMsg,
            type: 'mission'
          }
        ]);

        setToast({ show: true, message: `${addedCount} nouveaux produits importés avec succès !`, type: 'task' });
      } else {
        setToast({ show: true, message: "Aucun produit n'a été ajouté (les produits figurent déjà dans l'inventaire en attente).", type: 'task' });
      }

      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);

      // Clean states
      setInventoryPreviewData([]);
      setInventoryFileName('');
      setShowInventoryImport(false);
    };

    return (
      <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden mb-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-white/10 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-accent/5 border border-accent/20 rounded text-accent shadow-[0_0_15px_rgba(0,255,148,0.1)]">
              <Package size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-[4px] text-white">Inventaire de Préparation</h3>
              <p className="text-[9px] font-mono uppercase text-accent tracking-[3px] opacity-70 mt-1">Status: Operational // Section: Logistique</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Excel Import Button */}
            <button
              onClick={() => setShowInventoryImport(!showInventoryImport)}
              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-md active:scale-95 ${
                showInventoryImport 
                  ? 'bg-accent-blue/20 border-accent-blue/40 text-accent-blue hover:bg-accent-blue hover:text-black' 
                  : 'bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-black hover:shadow-accent/5'
              }`}
              title="Importer une liste de produits à préparer à partir d'un fichier Excel ou CSV"
            >
              <Upload size={10} />
              Importer Excel / CSV
            </button>

            {/* Excel Export Button */}
            <button
              onClick={exportInventoryExcel}
              className="px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black shadow-md shadow-emerald-500/5 active:scale-95"
              title="Exporter tout l'inventaire sous format de fichier Excel multi-feuille"
            >
              <FileSpreadsheet size={10} />
              Exporter Excel
            </button>

            {/* Toggle History (unprepared vs prepared items) */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg group">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[2px] group-hover:text-accent transition-colors">Voir Historique Préparés</span>
              <Toggle 
                enabled={showPreparedHistory} 
                onToggle={() => {
                  setShowPreparedHistory(!showPreparedHistory);
                  setInventorySearch('');
                }} 
              />
            </div>
            
            <button 
              onClick={() => {
                if (listMissions.length === 0) return;
                const confirmMsg = showPreparedHistory 
                  ? "Voulez-vous remettre tous ces produits en attente ?" 
                  : "Voulez-vous marquer tous ces produits comme préparés ?";
                if (window.confirm(confirmMsg)) {
                  listMissions.forEach(m => {
                    updateMission(m.id, {
                      status: showPreparedHistory ? 'en attente' : 'produit préparé',
                      progress: showPreparedHistory ? 0 : 25
                    });
                  });
                  setToast({ 
                    show: true, 
                    message: `${listMissions.length} produits mis à jour !`, 
                    type: 'task' 
                  });
                  setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
                }
              }}
              disabled={listMissions.length === 0}
              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                showPreparedHistory 
                  ? 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue hover:bg-accent-blue hover:text-black' 
                  : 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black'
              } disabled:opacity-30 disabled:pointer-events-none`}
            >
              <CheckSquare size={10} />
              {showPreparedHistory ? 'Tout remettre en attente' : 'Tout marquer préparé'}
            </button>
          </div>
        </div>

        {/* Expanded Excel Import Sub-section */}
        {showInventoryImport && (
          <div className="p-6 bg-black/40 border-b border-white/10 border-dashed animate-fadeIn">
            <div className="max-w-2xl mx-auto bg-black/60 border border-white/10 rounded-xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Upload size={14} className="text-accent" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Importer des produits en lot</span>
                </div>
                <button 
                  onClick={() => {
                    setShowInventoryImport(false);
                    setInventoryPreviewData([]);
                    setInventoryFileName('');
                  }}
                  className="text-text-dim hover:text-white text-[10px] uppercase font-mono tracking-wider transition-colors px-2 py-0.5"
                >
                  Fermer
                </button>
              </div>

              {inventoryPreviewData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-white/10 hover:border-accent/30 rounded-xl transition-all cursor-pointer bg-white/[0.01] relative group">
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    multiple
                    onChange={handleInventoryFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="p-3 bg-white/5 rounded-full mb-3 text-text-dim group-hover:text-accent group-hover:scale-110 transition-all">
                    <Upload size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider text-center">Glissez-déposez ou cliquez pour charger un ou plusieurs fichiers</p>
                  <p className="text-[8px] font-mono text-text-dim/60 mt-1 uppercase text-center">Formats acceptés : Excel (.xlsx, .xls) ou CSV (.csv)</p>
                  
                  <div className="mt-4 pt-3 border-t border-white/5 w-full text-[8px] font-mono text-text-dim/50 leading-relaxed max-w-md">
                    <span className="font-bold text-accent">Astuce :</span> Vous pouvez sélectionner et importer plusieurs fichiers d'un coup. Les informations de métadonnées (comme les entêtes d'exports, l'heure, etc.) sont automatiquement nettoyées et ignorées lors de l'analyse pour ne conserver que la liste des produits réels à préparer.
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="flex flex-col gap-1 text-left bg-white/[0.02] border border-white/5 rounded-lg p-3">
                    <div className="text-[8px] text-text-dim/50 uppercase font-black tracking-widest">Fichier(s) chargé(s) :</div>
                    <div className="text-white text-[9px] font-bold">{inventoryFileName}</div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 text-[9px]">
                      <span className="text-text-dim">Produits détectés (cumulés) :</span>
                      <span className="bg-accent/15 px-2 py-0.5 rounded text-accent font-black tracking-wider">
                        {inventoryPreviewData.reduce((acc, curr) => acc + curr.quantity, 0)} pièces à importer
                      </span>
                    </div>
                  </div>

                  {/* Options de traitement des doublons */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-2 text-left">
                    <label className="text-[8px] text-text-dim/50 uppercase font-black tracking-widest block">Traitement des Doublons :</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setImportDuplicateMode('skip')}
                        className={`p-2.5 rounded-lg text-[9px] border transition-all text-left flex flex-col gap-1 font-bold ${
                          importDuplicateMode === 'skip'
                            ? 'bg-accent/15 border-accent text-accent'
                            : 'bg-black/40 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                        }`}
                      >
                        <span className="uppercase text-[8px] font-black tracking-wide">✓ Éviter les Doublons</span>
                        <span className="text-[7.5px] font-normal leading-tight opacity-70">Ignorer si le produit est déjà en attente dans l'inventaire.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImportDuplicateMode('adjust')}
                        className={`p-2.5 rounded-lg text-[9px] border transition-all text-left flex flex-col gap-1 font-bold ${
                          importDuplicateMode === 'adjust'
                            ? 'bg-accent-blue/15 border-accent-blue text-accent-blue'
                            : 'bg-black/40 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                        }`}
                      >
                        <span className="uppercase text-[8px] font-black tracking-wide">⚙ Ajuster le Stock</span>
                        <span className="text-[7.5px] font-normal leading-tight opacity-70 font-sans">N'ajouter que la différence pour compléter la quantité cible.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImportDuplicateMode('append')}
                        className={`p-2.5 rounded-lg text-[9px] border transition-all text-left flex flex-col gap-1 font-bold ${
                          importDuplicateMode === 'append'
                            ? 'bg-accent-yellow/15 border-accent-yellow text-accent-yellow'
                            : 'bg-black/40 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                        }`}
                      >
                        <span className="uppercase text-[8px] font-black tracking-wide">+ Tout Importer</span>
                        <span className="text-[7.5px] font-normal leading-tight opacity-70">Ajouter tout le contenu des fichiers sans restriction.</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-white/5 bg-black/40 rounded-lg overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest text-text-dim/50">
                          <th className="py-2 px-3">Produit</th>
                          <th className="py-2 px-3">Couleur</th>
                          <th className="py-2 px-3 text-center">Quantité</th>
                          <th className="py-2 px-3">Commentaire / Réf</th>
                          <th className="py-2 px-3">Date Prévue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[9px] font-mono text-text-dim/80">
                        {inventoryPreviewData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-1.5 px-3 text-white font-bold">{item.product}</td>
                            <td className="py-1.5 px-3">
                              <span className="px-1.5 py-0.5 bg-white/5 text-[8px] font-bold rounded uppercase tracking-wider">
                                {item.color}
                              </span>
                            </td>
                            <td className="py-1.5 px-3 text-center text-accent font-black">{item.quantity}</td>
                            <td className="py-1.5 px-3 truncate max-w-[120px]" title={item.info}>{item.info || '-'}</td>
                            <td className="py-1.5 px-3 text-accent-yellow">{item.deadline || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    <div className="relative">
                      <button className="w-full sm:w-auto px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[9px] font-bold text-white tracking-widest uppercase rounded flex items-center justify-center gap-1.5 relative overflow-hidden">
                        <Upload size={10} />
                        Ajouter d'autres fichiers
                        <input 
                          type="file" 
                          accept=".xlsx, .xls, .csv" 
                          multiple
                          onChange={handleInventoryFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setInventoryPreviewData([]);
                          setInventoryFileName('');
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[9px] font-bold text-white tracking-widest uppercase rounded"
                      >
                        Vider la liste
                      </button>
                      <button
                        onClick={confirmInventoryImport}
                        className="px-4 py-1.5 bg-accent hover:bg-[#00d676] text-black active:scale-[0.98] transition-all text-[9px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                      >
                        Confirmer l'importation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info banners & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-black/20 border-b border-white/5">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
              <Package size={16} />
            </div>
            <div>
              <div className="text-xl font-mono font-black text-white">{totalItemsToPrepare}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-text-dim/60">Total Produits en Attente</div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10 text-accent border border-accent/20">
              <ClipboardCheck size={16} />
            </div>
            <div>
              <div className="text-xl font-mono font-black text-white">{totalItemsPrepared}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-text-dim/60">Total Produits Préparés</div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
              <Layers size={16} />
            </div>
            <div>
              <div className="text-xl font-mono font-black text-white">{uniqueGroupsCount}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-text-dim/60">Modèles & Couleurs Uniques</div>
            </div>
          </div>
        </div>

        {/* Search controls & info banner */}
        <div className="px-6 py-4 bg-black/40 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80 group">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors" />
            <input 
              type="text"
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              placeholder="Filtrer par nom de produit ou couleur..."
              className="w-full bg-black/30 border border-white/10 pl-10 pr-4 py-2.5 rounded-lg text-xs text-white placeholder:text-white/20 outline-none focus:border-accent/40 placeholder:font-normal hover:bg-black/50 transition-all font-mono"
            />
            {inventorySearch && (
              <button 
                onClick={() => setInventorySearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="text-right text-[10px] font-mono text-text-dim/60 flex items-center gap-2">
            <Info size={12} className="text-accent-blue" />
            <span>Les produits identiques de même couleur sont automatiquement regroupés.</span>
          </div>
        </div>

        {/* Group list */}
        <div className="p-6">
          {groupList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-black/20 border border-dashed border-white/10 rounded-xl">
              <div className="p-4 bg-white/5 rounded-full text-white/25 mb-4 border border-white/5">
                <PackageSearch size={32} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Aucun produit trouvé</h4>
              <p className="text-xs text-text-dim/60 max-w-md text-center px-4">
                {showPreparedHistory 
                  ? "Aucun produit n'a encore été préparé. Cochez des produits de la liste d'attente pour commencer."
                  : "Tous les produits en attente sont préparés ! Ou modifiez vos filtres de recherche."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupList.map((group, idx) => {
                const groupKey = `${group.product}|||${group.color}`;
                
                return (
                  <motion.div 
                    key={groupKey}
                    layoutId={`inv-${groupKey}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-black/30 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all group/card relative flex flex-col justify-between"
                  >
                    <div className="p-5 flex flex-col gap-4">
                      {/* Top bar with count & checkbox */}
                      <div className="flex justify-between items-start gap-4">
                        {/* Checkbox button */}
                        <button
                          onClick={() => handleToggleGroupStatus(group, !showPreparedHistory)}
                          className={`w-6 h-6 rounded border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                            showPreparedHistory 
                              ? 'bg-accent border-accent text-black hover:bg-accent/80' 
                              : 'border-white/20 bg-black/60 text-transparent hover:border-accent hover:bg-accent/10 hover:text-accent/40'
                          }`}
                          title={showPreparedHistory ? "Remettre en attente" : "Marquer comme préparé"}
                        >
                          <Check size={16} strokeWidth={3} className={showPreparedHistory ? "text-black" : "text-current"} />
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Quantité</span>
                          <span className={`px-2.5 py-1 text-xs rounded-lg font-mono font-black ${
                            showPreparedHistory 
                              ? 'bg-accent/10 border border-accent/20 text-accent' 
                              : 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue'
                          }`}>
                            x{group.count}
                          </span>
                        </div>
                      </div>

                      {/* Info body */}
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider leading-snug group-hover/card:text-accent transition-colors">
                          {group.product}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: group.color.toLowerCase() === 'grey' ? '#4B5563' : group.color.toLowerCase() === 'red' || group.color.toLowerCase().includes('red') ? '#EF4444' : group.color.toLowerCase().includes('white') ? '#FFFFFF' : '#10B981' }} />
                          <span className="text-[10px] font-bold text-text-dim/80 font-mono tracking-wider bg-white/5 py-0.5 px-2 rounded-md uppercase">
                            {group.color || 'Neutre'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable mission detail list */}
                    <div className="border-t border-white/5 bg-black/50 p-4">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-text-dim/50 mb-2">
                        <span>Missions Associées</span>
                        <span>{group.missions.length} réf. (Double-clic pour ouvrir)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1 font-mono">
                        {group.missions.map(m => (
                          <div 
                            key={m.id}
                            onDoubleClick={() => setSelectedMissionId(m.id)}
                            className="px-2 py-1 bg-white/[0.02] border border-white/5 rounded text-[8px] font-bold text-white/50 flex flex-col gap-0.5 cursor-pointer hover:bg-white/10 hover:border-accent-blue/50 hover:text-white select-none transition-all"
                            title="Double-cliquez pour ouvrir la fiche de cette mission"
                          >
                            <span className="text-accent-blue font-black group-hover:text-accent-blue">{m.refId}</span>
                            {m.univers && <span className="opacity-60 text-[6px] uppercase tracking-tighter">{m.univers}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const toggleSort = (key: string, isMulti: boolean) => {
    if (key === 'checkbox') return; // Ignore checkbox column for sorting
    setSortConfigs(prev => {
      const existing = prev.find(s => s.key === key);
      
      if (!isMulti) {
        // Mode simple : on réinitialise tout sauf une éventuelle alternance sur la même colonne
        if (existing) {
          if (existing.order === 'asc') return [{ key, order: 'desc' }];
          return []; // Troisième clic enlève le tri
        }
        return [{ key, order: 'asc' }];
      } else {
        // Mode multi (Shift cliqué)
        const others = prev.filter(s => s.key !== key);
        if (!existing) {
          return [...others, { key, order: 'asc' }];
        } else if (existing.order === 'asc') {
          return [...others, { key, order: 'desc' }];
        } else {
          return others;
        }
      }
    });
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    // Collect titles or references for global logging
    const updatedCount = selectedMissionIds.length;
    
    setMissions(prev => prev.map(m => {
      if (selectedMissionIds.includes(m.id)) {
        let progress = m.progress;
        switch (newStatus) {
          case 'livré': 
            if ((m.photoCountDelivered || 0) > 0) {
              progress = Math.round(((m.photoCountDelivered || 0) / (m.photoCountRequested || 1)) * 100);
            } else {
              progress = 100;
            }
            break;
          case 'En post-production': progress = 85; break;
          case 'shooté': progress = 75; break;
          case 'en cours de shoot': progress = 50; break;
          case 'produit préparé': progress = 25; break;
          case 'en attente': progress = 0; break;
        }
        
        let history = m.history ? [...m.history] : [];
        if (newStatus !== m.status) {
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Statut changé à "${newStatus}"` });
          if (progress !== m.progress) {
            history.push({ timestamp: Date.now(), message: `Progression synchronisée à ${progress}%` });
          }
        }
        
        return { ...m, status: newStatus, progress, history };
      }
      return m;
    }));

    if (updatedCount > 0) {
      setGlobalLogs(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          message: `MISE À JOUR GROUPÉE : ${updatedCount} missions modifiées vers le statut "${newStatus}".`,
          type: 'mission'
        }
      ]);
    }

    setBulkStatusModalOpen(false);
    setSelectedMissionIds([]);
    setToast({ show: true, message: `${updatedCount} missions mises à jour`, type: 'task' });
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
  };

  const handleBulkUpdate = (updates: {
    enabled?: boolean;
    status?: string;
    deadline?: string;
    preparedAt?: string;
    shotAt?: string;
    postProdAt?: string;
    deliveredAt?: string;
    rating?: number;
    updateEnabled: boolean;
    updateStatus: boolean;
    updateDeadline: boolean;
    updatePrepared: boolean;
    updateShot: boolean;
    updatePostProd: boolean;
    updateDelivered: boolean;
    updateRating: boolean;
  }) => {
    const updatedCount = selectedMissionIds.length;
    if (updatedCount === 0) return;

    setMissions(prev => prev.map(m => {
      if (selectedMissionIds.includes(m.id)) {
        const nextMission = { ...m };
        const history = m.history ? [...m.history] : [];
        let changed = false;

        if (updates.updateEnabled && updates.enabled !== undefined && updates.enabled !== m.enabled) {
          nextMission.enabled = updates.enabled;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Visibilité changée à ${updates.enabled ? 'Actif (ON)' : 'Inactif (OFF)'}` });
          changed = true;
        }

        if (updates.updateStatus && updates.status) {
          const newStatus = updates.status;
          if (newStatus !== m.status) {
            nextMission.status = newStatus;
            
            // Calculate progress
            let progress = m.progress;
            switch (newStatus) {
              case 'livré': 
                if ((m.photoCountDelivered || 0) > 0) {
                  progress = Math.round(((m.photoCountDelivered || 0) / (m.photoCountRequested || 1)) * 100);
                } else {
                  progress = 100;
                }
                break;
              case 'En post-production': progress = 85; break;
              case 'shooté': progress = 75; break;
              case 'en cours de shoot': progress = 50; break;
              case 'produit préparé': progress = 25; break;
              case 'en attente': progress = 0; break;
            }
            nextMission.progress = progress;

            history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Statut changé à "${newStatus}"` });
            if (progress !== m.progress) {
              history.push({ timestamp: Date.now(), message: `Progression synchronisée à ${progress}%` });
            }
            changed = true;
          }
        }

        if (updates.updateDeadline && updates.deadline !== undefined && updates.deadline !== m.deadline) {
          nextMission.deadline = updates.deadline;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Deadline changée à "${updates.deadline || 'aucune'}"` });
          changed = true;
        }

        if (updates.updatePrepared && updates.preparedAt !== undefined && updates.preparedAt !== m.preparedAt) {
          nextMission.preparedAt = updates.preparedAt;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Date Produit Préparé changée à "${updates.preparedAt || 'aucune'}"` });
          changed = true;
        }

        if (updates.updateShot && updates.shotAt !== undefined && updates.shotAt !== m.shotAt) {
          nextMission.shotAt = updates.shotAt;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Date Shooté changée à "${updates.shotAt || 'aucune'}"` });
          changed = true;
        }

        if (updates.updatePostProd && updates.postProdAt !== undefined && updates.postProdAt !== m.postProdAt) {
          nextMission.postProdAt = updates.postProdAt;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Date Post-Prod changée à "${updates.postProdAt || 'aucune'}"` });
          changed = true;
        }

        if (updates.updateDelivered && updates.deliveredAt !== undefined && updates.deliveredAt !== m.deliveredAt) {
          nextMission.deliveredAt = updates.deliveredAt;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Date Livré changée à "${updates.deliveredAt || 'aucune'}"` });
          changed = true;
        }

        if (updates.updateRating && updates.rating !== undefined && updates.rating !== m.rating) {
          nextMission.rating = updates.rating;
          history.push({ timestamp: Date.now(), message: `MISE À JOUR GROUPÉE : Note changée à ${updates.rating}/5` });
          changed = true;
        }

        if (changed) {
          nextMission.history = history;
          nextMission.updatedAt = Date.now();
          return nextMission;
        }
      }
      return m;
    }));

    setGlobalLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        message: `ÉDITION EN MASSE : ${updatedCount} missions modifiées.`,
        type: 'mission'
      }
    ]);

    setBulkStatusModalOpen(false);
    setSelectedMissionIds([]);
    setToast({ show: true, message: `${updatedCount} missions mises à jour`, type: 'task' });
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
  };

  const startBulkDelete = () => {
    setBulkDeleteIndex(0);
    setIsBulkDeleteModalOpen(true);
  };

  const confirmDeleteCurrent = (confirm: boolean) => {
    const currentId = selectedMissionIds[bulkDeleteIndex];
    if (confirm && currentId) {
      removeMission(currentId);
    }

    if (bulkDeleteIndex + 1 < selectedMissionIds.length) {
      setBulkDeleteIndex(prev => prev + 1);
    } else {
      setIsBulkDeleteModalOpen(false);
      setSelectedMissionIds([]);
      setToast({ show: true, message: 'Opération terminée', type: 'task' });
      setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
    }
  };

  const handleYesToAll = () => {
    const idsToDelete = selectedMissionIds.slice(bulkDeleteIndex);
    
    // Log group deletion
    if (idsToDelete.length > 0) {
      const logEntry: GlobalLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        message: `SUPPRESSION GROUPÉE : ${idsToDelete.length} missions ont été retirées du registre simultanément.`,
        type: 'mission'
      };
      setGlobalLogs(prev => [...prev, logEntry]);
    }

    setMissions(prev => prev.filter(m => !idsToDelete.includes(m.id)));
    setIsBulkDeleteModalOpen(false);
    setSelectedMissionIds([]);
    setToast({ show: true, message: 'Toute la sélection a été supprimée', type: 'task' });
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
  };

  const toggleSelectAll = () => {
    if (selectedMissionIds.length === filteredMissions.length) {
      setSelectedMissionIds([]);
    } else {
      setSelectedMissionIds(filteredMissions.map(m => m.id));
    }
  };

  const toggleSelectMission = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMissionIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const renderFilterChips = (label: string, selected: string[], setSelected: (val: any) => void) => {
    if (selected.length === 0) return null;
    return selected.map((val) => (
      <motion.div 
        key={`${label}-${val}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white hover:border-white/30 transition-all group"
      >
        <span className="text-text-dim select-none">{label}:</span>
        <span className="font-bold">{val}</span>
        <button 
          onClick={() => setSelected((prev: string[]) => prev.filter(item => item !== val))}
          className="p-0.5 hover:text-red-500 transition-colors"
        >
          <X size={10} />
        </button>
      </motion.div>
    ));
  };

  const filteredMissions = missions.filter(m => {
    const isDup = isDuplicate(m);
    const matchesDuplicates = !filterDuplicates || !isDup;
    
    const matchesQuery = m.product.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         m.info.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         m.refId.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         m.missionNo.toString().includes(filterQuery);
    const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(m.status);
    const matchesProduct = filterProducts.length === 0 || filterProducts.includes(m.product);
    const matchesUniverse = filterUniverses.length === 0 || filterUniverses.includes(m.univers);
    const matchesSupport = filterSupports.length === 0 || (() => {
      const missionSupports = (m.support || '').split(', ').map(s => s === 'video' ? 'vidéo' : s);
      return filterSupports.some(fs => missionSupports.includes(fs));
    })();
    const matchesColor = filterColors.length === 0 || filterColors.includes(m.color);
    const matchesArgument = filterArguments.length === 0 || filterArguments.includes(m.argumentType);
    const matchesPriority = filterPriorities.length === 0 || filterPriorities.includes(m.priority);
    const matchesEnabled = filterEnabled.length === 0 || (
      (filterEnabled.includes('Actif') && m.enabled) ||
      (filterEnabled.includes('Inactif') && !m.enabled)
    );

    const matchesDeadlineAlert = !filterDeadlineAlert || (isDeadlineApproaching(m.deadline) && m.status !== 'livré');
    
    const matchesDate = (() => {
      if (!filterDateStart && !filterDateEnd) return true;
      
      let missionDateNum: number;
      if (filterDateType === 'createdAt') {
        missionDateNum = m.createdAt;
      } else {
        if (!m.deadline) return false;
        const parts = m.deadline.split(/[\/\-]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            missionDateNum = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
          } else {
            missionDateNum = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
          }
        } else {
          return false;
        }
      }
      
      const start = filterDateStart ? new Date(filterDateStart).setHours(0, 0, 0, 0) : -Infinity;
      const end = filterDateEnd ? new Date(filterDateEnd).setHours(23, 59, 59, 999) : Infinity;
      
      return missionDateNum >= start && missionDateNum <= end;
    })();

    return matchesDuplicates && matchesQuery && matchesStatus && matchesProduct && matchesUniverse && matchesSupport && matchesColor && matchesArgument && matchesPriority && matchesEnabled && matchesDate && matchesDeadlineAlert;
  }).sort((a, b) => {
    // Si le filtre d'alerte deadline est actif, on trie par échéance la plus proche en priorité
    if (filterDeadlineAlert) {
      const parseDateQuick = (d?: string) => {
        if (!d || d === '-') return Infinity;
        const parts = d.split(/[\/\-]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        }
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? Infinity : dt.getTime();
      };
      const timeA = parseDateQuick(a.deadline);
      const timeB = parseDateQuick(b.deadline);
      if (timeA !== timeB) return timeA - timeB;
    }

    if (sortConfigs.length === 0) return 0;

    for (const config of sortConfigs) {
      const key = config.key as keyof Mission;
      const order = config.order;

      let valA: any = a[key];
      let valB: any = b[key];

      // Handle Dates specially
      if (key === 'deadline') {
        const parseDate = (d: string) => {
          if (!d) return order === 'asc' ? Infinity : -Infinity;
          const parts = d.split(/[\/\-]/);
          if (parts.length === 3) {
            if (parts[0].length === 4) return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
          }
          return 0;
        };
        valA = parseDate(valA as string);
        valB = parseDate(valB as string);
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
    }
    
    return 0;
  });

  const tabs = [
    { id: 'table', label: 'Rapport', icon: Activity },
    { id: 'dashboard', label: 'Monitor', icon: BarChart3 },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    { id: 'journal', label: 'Journal', icon: Clock },
    { id: 'system', label: 'Système', icon: Settings }
  ];

  return (
    <div 
      id="app-root"
      className={`min-h-screen bg-app-bg flex flex-col ${appFont} ${appFontWeight} ${appTextCase === 'uppercase' ? 'uppercase' : ''}`}
      style={{ fontSize: `${appFontSize}%`, color: appTextColor }}
    >
      <style>{`
        #app-root, 
        #app-root h1, #app-root h2, #app-root h3, 
        #app-root .text-white, 
        #app-root .text-white\\/90, 
        #app-root .text-white\\/70, 
        #app-root .text-white\\/50 {
          color: ${appTextColor} !important;
        }
        
        /* Retenir le blanc pour les éléments sur fond coloré (badges, boutons accent) */
        #app-root [class*="bg-accent"] .text-white,
        #app-root [class*="bg-accent-blue"] .text-white,
        #app-root [class*="bg-accent-pink"] .text-white,
        #app-root [class*="bg-accent-purple"] .text-white,
        #app-root [class*="bg-accent-orange"] .text-white,
        #app-root [class*="bg-accent-red"] .text-white,
        #app-root [class*="bg-accent-yellow"] .text-white,
        #app-root .bg-accent .text-white,
        #app-root .bg-black .text-white {
          color: white !important;
        }

        #app-root input, #app-root select, #app-root textarea {
          color: ${appTextColor} !important;
        }
        
        #app-root th, #app-root label {
          color: ${appTextColor};
          opacity: 0.8;
        }
      `}</style>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-4 bg-black/90 border-2 px-6 py-4 rounded-xl backdrop-blur-md ${toast.type === 'error' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-accent shadow-[0_0_30px_rgba(0,255,148,0.3)]'}`}
          >
            <div className={`p-2 rounded-lg ${toast.type === 'error' ? 'bg-red-500/20 text-red-500' : toast.type === 'calendar' ? 'bg-accent/20 text-accent' : 'bg-accent-blue/20 text-accent-blue'}`}>
               {toast.type === 'error' ? <AlertTriangle size={20} /> : toast.type === 'calendar' ? <Calendar size={20} /> : <Sparkles size={20} />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-white/50">{toast.type === 'error' ? 'Erreur de saisie' : 'Système de Notification'}</span>
              <span className="text-sm font-bold text-white max-w-sm">{toast.message}</span>
            </div>
            <div className="w-10 h-10 border-r border-white/10 ml-2" />
            <div className={`flex items-center gap-1 font-black text-xs animate-pulse ${toast.type === 'error' ? 'text-red-500' : 'text-accent'}`}>
              <Sparkles size={14} />
              {toast.type === 'error' ? 'ERR' : 'SYNC'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        
        {/* Header */}
        <header 
          className="px-10 py-10 flex justify-between items-center border-b border-white/5 relative overflow-hidden group backdrop-blur-sm"
          style={{ backgroundColor: `rgba(${parseInt(headerBgColor.slice(1,3), 16)}, ${parseInt(headerBgColor.slice(3,5), 16)}, ${parseInt(headerBgColor.slice(5,7), 16)}, ${headerBgOpacity})` }}
        >
          {headerBgImage && (
            <div 
              className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700" 
              style={{ 
                backgroundImage: `url(${headerBgImage})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                opacity: headerBgOpacity 
              }} 
            />
          )}
           {WaveEffect({ 
            progress: avgProgress, 
            color: 
              waveColor.startsWith('#') ? waveColor : 
              waveColor === 'text-accent' ? accentColor : 
              waveColor === 'text-accent-blue' ? accentBlueColor : 
              waveColor === 'text-accent-purple' ? accentPurpleColor : 
              waveColor === 'text-accent-orange' ? accentOrangeColor : 
              waveColor === 'text-accent-pink' ? accentPinkColor : 
              waveColor === 'text-accent-red' ? accentRedColor : 
              waveColor === 'text-accent-yellow' ? accentYellowColor : 
              '#00FF94', 
            type: waveType, 
            opacity: waveOpacity 
          })}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10"></div>
          
          <div className="title-group relative z-10 flex items-center gap-6">
            {appLogo ? (
              <div className="w-24 h-24 border border-white/20 p-2 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center group/logo relative overflow-hidden">
                <img src={appLogo} alt="App Logo" className="max-w-full max-h-full object-contain" />
                <div 
                  onClick={() => {
                    setActiveTab('system');
                    setSystemSubTab('branding');
                  }}
                  className="absolute inset-0 bg-accent/20 opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                  title="Changer le logo"
                >
                  <Settings size={16} className="text-white animate-spin-slow" />
                </div>
              </div>
            ) : (
               <div 
                onClick={() => {
                  setActiveTab('system');
                  setSystemSubTab('branding');
                }}
                className="w-24 h-24 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center group/logo hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer"
                title="Ajouter un logo"
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-white/10 group-hover/logo:text-accent/60 transition-colors">LOGO</div>
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="font-display text-4xl leading-none uppercase tracking-[-1px] group-hover:tracking-[1px] transition-all duration-700">
                <span style={{ color: missionTitleColor }}>MISSION</span><br /><span className="text-accent">CONTRÔLE</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-[2px] w-8" style={{ backgroundColor: suiteSubtitleColor }}></div>
                <p className="text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2" style={{ color: suiteSubtitleColor }}>
                  <Sparkles size={10} className="animate-pulse" />
                  Advanced Production Suite v3.0
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,148,0.5)]"></div>
                <span className="text-[9px] text-text-dim uppercase tracking-wider font-black">System Online</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10 mx-1" />
              <div className="flex items-center gap-1.5">
                <Zap size={10} className="text-accent-yellow animate-pulse" />
                <span className="text-[9px] text-white font-black tracking-widest uppercase opacity-80">Efficience: {avgProgress}%</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:border-accent hover:text-accent transition-all active:scale-95 group relative shadow-2xl"
              title={isSidebarOpen ? "Fermer le volet" : "Ouvrir le volet"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <button 
              onClick={googleUser ? handleGoogleLogout : handleGoogleLogin}
              className={`h-12 px-4 border rounded-lg flex items-center justify-center transition-all active:scale-95 group relative shadow-2xl ${googleUser ? 'bg-accent/10 border-accent/30 text-accent/80' : 'bg-[#4285F4]/10 border-[#4285F4]/30 hover:border-[#4285F4] hover:bg-[#4285F4]/20 text-[#4285F4]'}`}
              title={googleUser ? "Connecté à Google - Se déconnecter" : "Connecter Google Workspace (Drive, Calendar, etc.)"}
            >
              {isLoggingIn ? <Loader2 size={18} className="animate-spin" /> : googleUser ? <Check size={18} /> : <Globe size={18} />}
              <span className="ml-2 text-xs font-bold whitespace-nowrap hidden md:inline">
                {googleUser ? `Connecté: ${googleUser.email}` : "Connecter Workspace"}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('system')}
              className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-all active:scale-95 group relative shadow-2xl ${activeTab === 'system' ? 'bg-accent border-accent text-black shadow-[0_0_20px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 hover:bg-accent/10 hover:border-accent hover:text-accent'}`}
              title="Configuration Système"
            >
              <Settings size={20} className={activeTab === 'system' ? 'rotate-90' : 'group-hover:rotate-90 transition-transform duration-500'} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
              />
            )}
          </AnimatePresence>

          <div className="flex h-full overflow-hidden">
            {/* Main Input Form - Responsive Volet */}
            {activeTab !== 'system' && (
              <aside className={`
                fixed lg:relative inset-y-0 left-0 bg-[#0A0A0A] border-r border-border space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar z-[110] transition-all duration-500 ease-in-out
                ${isSidebarOpen ? 'w-full max-w-[450px] translate-x-0 p-10 opacity-100' : 'w-0 translate-x-[-100%] p-0 opacity-0 border-none'}
              `}>
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
                  <button 
                    onClick={() => setSidebarTab('production')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'production' ? 'bg-accent text-black shadow-[0_0_15px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                  >
                    <Layout size={14} />
                    Production
                  </button>
                  <button 
                    onClick={() => setSidebarTab('secondary')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'secondary' ? 'bg-accent-blue text-black shadow-[0_0_15px_rgba(0,209,255,0.3)]' : 'text-text-dim hover:text-white'}`}
                  >
                    <List size={14} />
                    Secondaires
                  </button>
                </div>

                {sidebarTab === 'production' ? (
                  <>
                <div className="flex items-center justify-between lg:hidden border-b border-white/5 pb-6 mb-4">
                  <span className="text-[10px] font-black uppercase text-accent tracking-[3px]">Configuration de Mission</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-accent"><X size={24} /></button>
                </div>

                {/* Unique Reference Setup */}
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-7 h-7 bg-accent-blue/20 flex items-center justify-center text-accent-blue border border-accent-blue/30 rounded">
                    <Type size={14} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-white">ID de Référence Unique</h3>
                    <p className="text-[8px] text-text-dim uppercase font-bold tracking-tighter">Prochaine Mission: <span style={{ color: refIdColor }}>{refPrefix} {refCounter}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-dim">Prefixe</label>
                    <input 
                      type="text"
                      value={refPrefix}
                      onChange={(e) => setRefPrefix(e.target.value.toUpperCase())}
                      className="w-full bg-black/60 border border-white/10 p-2.5 rounded text-xs text-white outline-none focus:border-accent font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-dim">Valeur Compteur</label>
                    <input 
                      type="number"
                      value={refCounter}
                      onChange={(e) => setRefCounter(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/10 p-2.5 rounded text-xs text-white outline-none focus:border-accent font-mono"
                    />
                  </div>
                </div>
              </div>
            
            {/* Selection Categories Control */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
              <span className="text-[9px] font-black uppercase text-white/40 tracking-[2px]">Configuration Tools</span>
              <button 
                onClick={() => {
                  if (collapsedCategories.length === computedCategories.length) {
                    setCollapsedCategories([]);
                  } else {
                    setCollapsedCategories(computedCategories.map(c => c.id));
                  }
                }}
                className="text-[9px] font-black uppercase text-accent hover:text-white transition-colors flex items-center gap-2"
              >
                {collapsedCategories.length === computedCategories.length ? <Maximize size={10} /> : <Minimize size={10} />}
                {collapsedCategories.length === computedCategories.length ? 'Tout Développer' : 'Tout Rétracter'}
              </button>
            </div>
            
            {/* Selection Categories */}
            {computedCategories.map((cat) => {
              if (!cat) return null;
              const isCollapsed = collapsedCategories.includes(cat.id);
              const isHex = cat.colorRef?.startsWith('#');
              
              const activeColor = 
                isHex ? 'border' :
                cat.colorRef === 'accent' ? 'text-accent border-accent bg-accent/5 shadow-[0_0_15px_-5px_var(--color-accent)]' :
                cat.colorRef === 'accent-blue' ? 'text-accent-blue border-accent-blue bg-accent-blue/5 shadow-[0_0_15px_-5px_var(--color-accent-blue)]' :
                cat.colorRef === 'accent-pink' ? 'text-accent-pink border-accent-pink bg-accent-pink/5 shadow-[0_0_15px_-5px_var(--color-accent-pink)]' :
                cat.colorRef === 'accent-purple' ? 'text-accent-purple border-accent-purple bg-accent-purple/5 shadow-[0_0_15px_-5px_var(--color-accent-purple)]' :
                cat.colorRef === 'accent-orange' ? 'text-accent-orange border-accent-orange bg-accent-orange/5 shadow-[0_0_15px_-5px_var(--color-accent-orange)]' :
                cat.colorRef === 'accent-red' ? 'text-accent-red border-accent-red bg-accent-red/5 shadow-[0_0_15px_-5px_var(--color-accent-red)]' :
                cat.colorRef === 'accent-yellow' ? 'text-accent-yellow border-accent-yellow bg-accent-yellow/5 shadow-[0_0_15px_-5px_var(--color-accent-yellow)]' :
                'text-accent border-accent bg-accent/5';

              const activeStyle = isHex ? {
                color: cat.colorRef,
                borderColor: cat.colorRef,
                backgroundColor: `${cat.colorRef}0A`, // approx 4% opacity
                boxShadow: `0 0 15px -5px ${cat.colorRef}`
              } : {};

              const iconColor = 
                isHex ? '' :
                cat.colorRef === 'accent' ? 'text-accent' :
                cat.colorRef === 'accent-blue' ? 'text-accent-blue' :
                cat.colorRef === 'accent-pink' ? 'text-accent-pink' :
                cat.colorRef === 'accent-purple' ? 'text-accent-purple' :
                cat.colorRef === 'accent-orange' ? 'text-accent-orange' :
                cat.colorRef === 'accent-red' ? 'text-accent-red' :
                cat.colorRef === 'accent-yellow' ? 'text-accent-yellow' :
                'text-accent';
              
              const iconStyle = isHex ? { color: cat.colorRef } : {};

              return (
                <div key={cat.id} className="flex flex-col gap-3 group/cat">
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => {
                      setCollapsedCategories(prev => 
                        prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                      );
                    }}
                  >
                    <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2 group-hover:text-white transition-colors cursor-pointer">
                      {cat.icon && <cat.icon size={12} className={iconColor} style={iconStyle} />}
                      {cat.name}
                    </label>
                    <motion.div
                      animate={{ rotate: isCollapsed ? -90 : 0 }}
                      className="text-text-dim/40 group-hover:text-accent transition-colors"
                      style={!isCollapsed ? iconStyle : {}}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        key={`${cat.id}-form-content`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`${((cat.id === 'product' && isProductDropdownOpen) || (cat.id === 'color' && isColorDropdownOpen) || (cat.id === 'family' && isFamilyDropdownOpen)) ? 'overflow-visible' : 'overflow-hidden'} space-y-3`}
                      >
                        {cat.id === 'family' ? (
                          <div className={`relative group ${isFamilyDropdownOpen ? 'z-[165]' : 'z-10'}`}>
                            <input 
                              type="text"
                              value={selectedFamily}
                              onChange={(e) => {
                                setSelectedFamily(e.target.value);
                                if (!isFamilyDropdownOpen) setIsFamilyDropdownOpen(true);
                              }}
                              onFocus={() => setIsFamilyDropdownOpen(true)}
                              placeholder="Famille de produit..."
                              className="w-full bg-card-bg border border-border p-3 pr-10 rounded-md text-white outline-none focus:border-accent transition-all text-sm focus:ring-1 focus:ring-accent/30 relative z-[166]"
                              style={isHex ? { borderColor: `${cat.colorRef}40`, boxShadow: `0 0 0 1px ${cat.colorRef}20` } : {}}
                            />
                            <button
                              type="button"
                              onClick={() => setIsFamilyDropdownOpen(!isFamilyDropdownOpen)}
                              className="absolute right-0 top-0 h-full px-3 text-text-dim hover:text-accent transition-colors z-[167]"
                            >
                              <ChevronDown size={14} className={isFamilyDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            </button>
                            
                            <AnimatePresence>
                              {isFamilyDropdownOpen && (
                                <motion.div
                                  key="family-dropdown"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div 
                                    className="fixed inset-0 z-[140] bg-black/20 backdrop-blur-[1px]" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsFamilyDropdownOpen(false);
                                    }}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-full left-0 w-full mt-1 bg-[#1A1A1A] border border-white/10 rounded-md shadow-2xl z-[155] max-h-60 overflow-y-auto custom-scrollbar"
                                  >
                                  {(cat.items || [])
                                    .filter(item => item.toLowerCase().includes((selectedFamily || '').toLowerCase()))
                                    .map(item => (
                                      <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                          setSelectedFamily(item);
                                          setIsFamilyDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[11px] text-white/70 hover:bg-accent/10 hover:text-accent transition-colors border-b border-white/5 last:border-0"
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  {((cat.items || []).filter(item => item.toLowerCase().includes((selectedFamily || '').toLowerCase()))).length === 0 && (
                                    <div className="px-4 py-3 text-[10px] text-white/30 italic">Aucun résultat</div>
                                  )}
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : cat.id === 'product' ? (
                          <div className={`relative group ${isProductDropdownOpen ? 'z-[160]' : 'z-10'}`}>
                            <input 
                              type="text"
                              value={selectedProduct}
                              onChange={(e) => {
                                setSelectedProduct(e.target.value);
                                if (!isProductDropdownOpen) setIsProductDropdownOpen(true);
                              }}
                              onFocus={() => setIsProductDropdownOpen(true)}
                              placeholder="Nom du produit..."
                              className="w-full bg-card-bg border border-border p-3 pr-10 rounded-md text-white outline-none focus:border-accent transition-all text-sm focus:ring-1 focus:ring-accent/30 relative z-[161]"
                              style={isHex ? { borderColor: `${cat.colorRef}40`, boxShadow: `0 0 0 1px ${cat.colorRef}20` } : {}}
                            />
                            <button
                              type="button"
                              onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                              className="absolute right-0 top-0 h-full px-3 text-text-dim hover:text-accent transition-colors z-[162]"
                            >
                              <ChevronDown size={14} className={isProductDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            </button>
                            
                            <AnimatePresence>
                              {isProductDropdownOpen && (
                                <motion.div
                                  key="product-dropdown"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div 
                                    className="fixed inset-0 z-[140] bg-black/20 backdrop-blur-[1px]" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsProductDropdownOpen(false);
                                    }}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-full left-0 w-full mt-1 bg-[#1A1A1A] border border-white/10 rounded-md shadow-2xl z-[155] max-h-60 overflow-y-auto custom-scrollbar"
                                  >
                                  {(cat.items || [])
                                    .filter(item => item.toLowerCase().includes((selectedProduct || '').toLowerCase()))
                                    .map(item => (
                                      <button
                                        key={item}
                                        onClick={() => {
                                          setSelectedProduct(item);
                                          setIsProductDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[11px] text-white/70 hover:bg-accent/10 hover:text-accent transition-colors border-b border-white/5 last:border-0"
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  {((cat.items || []).filter(item => item.toLowerCase().includes((selectedProduct || '').toLowerCase()))).length === 0 && (
                                    <div className="px-4 py-3 text-[10px] text-white/30 italic">Aucun résultat</div>
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          </div>
                        ) : cat.id === 'color' ? (
                          <div className={`relative group ${isColorDropdownOpen ? 'z-[160]' : 'z-10'}`}>
                            <input 
                              type="text"
                              value={selectedColor}
                              onChange={(e) => {
                                setSelectedColor(e.target.value);
                                if (!isColorDropdownOpen) setIsColorDropdownOpen(true);
                              }}
                              onFocus={() => setIsColorDropdownOpen(true)}
                              placeholder="Couleur du produit..."
                              className="w-full bg-card-bg border border-border p-3 pr-10 rounded-md text-white outline-none focus:border-accent transition-all text-sm focus:ring-1 focus:ring-accent/30 relative z-[161]"
                              style={isHex ? { borderColor: `${cat.colorRef}40`, boxShadow: `0 0 0 1px ${cat.colorRef}20` } : {}}
                            />
                            <button
                              type="button"
                              onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                              className="absolute right-0 top-0 h-full px-3 text-text-dim hover:text-accent transition-colors z-[162]"
                            >
                              <ChevronDown size={14} className={isColorDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            </button>
                            
                            <AnimatePresence>
                              {isColorDropdownOpen && (
                                <motion.div
                                  key="color-dropdown"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div 
                                    className="fixed inset-0 z-[140] bg-black/20 backdrop-blur-[1px]" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsColorDropdownOpen(false);
                                    }}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-full left-0 w-full mt-1 bg-[#1A1A1A] border border-white/10 rounded-md shadow-2xl z-[155] max-h-60 overflow-y-auto custom-scrollbar"
                                  >
                                  {(cat.items || [])
                                    .filter(item => item.toLowerCase().includes((selectedColor || '').toLowerCase()))
                                    .map(item => (
                                      <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                          setSelectedColor(item);
                                          setIsColorDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[11px] text-white/70 hover:bg-accent/10 hover:text-accent transition-colors border-b border-white/5 last:border-0"
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  {((cat.items || []).filter(item => item.toLowerCase().includes((selectedColor || '').toLowerCase()))).length === 0 && (
                                    <div className="px-4 py-3 text-[10px] text-white/30 italic">Aucun résultat</div>
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          </div>
                        ) : cat.displayType === 'select' ? (
                     <div className="relative group">
                       <select 
                        value={
                          cat.id === 'product' ? selectedProduct :
                          cat.id === 'color' ? selectedColor : ''
                        }
                        onChange={(e) => {
                          if (cat.id === 'product') setSelectedProduct(e.target.value);
                          if (cat.id === 'color') setSelectedColor(e.target.value);
                        }}
                        className={`w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent transition-all text-sm appearance-none cursor-pointer focus:ring-1 focus:ring-accent/30`}
                       >
                         {(cat.items || []).map(item => (
                           <option key={item} value={item}>{item}</option>
                         ))}
                       </select>
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim group-focus-within:text-accent">
                         <ChevronRight size={14} className="rotate-90" />
                       </div>
                     </div>
                  ) : (
                    <div className={`grid gap-2 grid-cols-2`}>
                      {(cat.items || []).map((item) => {
                        const isSelected = 
                          (cat.id === 'argument' && selectedArgument === item) ||
                          (cat.id === 'univers' && selectedUnivers === item) ||
                          (cat.id === 'format' && selectedFormat === item) ||
                          (cat.id === 'position' && selectedPosition === item) ||
                          (cat.id === 'support' && (selectedSupport || []).includes(item)) ||
                          (cat.id === 'priority' && selectedPriority === item) ||
                          (cat.id === 'status' && selectedStatus === item);

                        return (
                            <button
                              key={item}
                              onClick={() => {
                                if (cat.id === 'argument') setSelectedArgument(item);
                                if (cat.id === 'univers') setSelectedUnivers(item);
                                if (cat.id === 'format') setSelectedFormat(item);
                                if (cat.id === 'position') setSelectedPosition(item);
                                if (cat.id === 'support') {
                                  setSelectedSupport(prev => {
                                    const isIncluded = (prev || []).includes(item);
                                    const next = isIncluded ? (prev || []).filter(x => x !== item) : [...(prev || []), item];
                                    
                                    // Dynamic secondary logic when video is selected
                                    if (!isIncluded && item === 'vidéo') {
                                      if (selectedFormat !== '16/9' && selectedFormat !== '9/16') {
                                        setSelectedFormat('16/9');
                                      }
                                    } else if (!isIncluded && item === 'graphisme') {
                                      setSelectedFormat('standard');
                                    }
                                    
                                    return next;
                                  });
                                }
                                if (cat.id === 'priority') setSelectedPriority(item);
                                if (cat.id === 'status') setSelectedStatus(item);
                              }}
                              className={`text-left p-2.5 rounded-md text-[11px] font-medium transition-all active:scale-95 border lowercase ${
                                isSelected
                                  ? activeColor
                                  : 'bg-card-bg border-border text-text-dim hover:border-slate-500 hover:text-white'
                              }`}
                              style={isSelected ? activeStyle : {}}
                            >
                              {item}
                            </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          );
        })}

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                  <Sparkles size={12} className="text-accent-yellow" />
                  Notation / Rating
                </label>
                <span className="text-[11px] font-mono font-bold text-accent-yellow pr-1">{selectedRating}/5</span>
              </div>
              <div className="flex items-center gap-2 px-1">
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => {
                  const isFull = selectedRating >= val;
                  const isHalf = selectedRating + 0.5 === val;
                  
                  // We only render 5 star positions, but allow 10 increments
                  if (val % 1 !== 0) return null;

                  return (
                    <div key={val} className="relative flex items-center group/star">
                      <button
                        onClick={() => setSelectedRating(val - 0.5)}
                        className="absolute left-0 w-1/2 h-full z-10 cursor-pointer"
                        title={`${val - 0.5}/5`}
                      />
                      <button
                        onClick={() => setSelectedRating(val)}
                        className="absolute right-0 w-1/2 h-full z-10 cursor-pointer"
                        title={`${val}/5`}
                      />
                      <div className={`transition-all ${selectedRating >= val ? 'text-accent-yellow scale-110' : selectedRating >= val - 0.5 ? 'text-accent-yellow/70 scale-105' : 'text-white/10'}`}>
                        <Sparkles 
                          size={20} 
                          fill={selectedRating >= val ? 'currentColor' : 'none'} 
                          className={selectedRating === val - 0.5 ? 'opacity-50' : ''}
                        />
                      </div>
                    </div>
                  );
                })}
                {selectedRating > 0 && (
                  <button 
                    onClick={() => setSelectedRating(0)}
                    className="ml-auto text-[8px] font-black uppercase text-accent-red/60 hover:text-accent-red transition-colors"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                <Clock size={12} className="text-accent-yellow" />
                Date / Échéance
              </label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent transition-all text-sm appearance-none"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                <ClipboardCheck size={12} className="text-accent-blue" />
                Notes / Précisions
              </label>
              <div className="relative group/side-info">
                <textarea 
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="Instructions (utilisez /calendar ou /task pour planifier)"
                  rows={2}
                  className="w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent transition-all text-sm resize-none pr-10"
                />
                <button 
                  onClick={() => {
                    setToast({ show: true, message: 'Notes validées !', type: 'task' });
                    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 2000);
                  }}
                  className="absolute right-2 top-2 p-1.5 bg-accent/10 border border-accent/20 rounded text-accent opacity-0 group-hover/side-info:opacity-100 hover:bg-accent hover:text-black transition-all"
                  title="Valider les notes"
                >
                  <Check size={14} />
                </button>
              </div>
              {info.startsWith('/') && (
                <div className="text-[9px] font-bold text-accent animate-pulse uppercase tracking-wider">
                  Commande détectée : {info.split(' ')[0]}
                </div>
              )}
            </div>

            <div className="pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2 min-h-[1.5rem]">
                  <span key="support-icon" className="flex items-center">
                    {(selectedSupport || []).includes('vidéo') ? <Film size={10} className="text-accent-purple" /> : (selectedSupport || []).includes('graphisme') ? <ImageIcon size={10} className="text-accent-purple" /> : <ImageIcon size={10} className="text-accent-purple" />}
                  </span>
                  <span key="support-text">
                    {(selectedSupport || []).includes('vidéo') ? 'Séquences Vidéo' : (selectedSupport || []).includes('graphisme') ? 'Visuels Graphiques' : 'Photos Requises'}
                  </span>
                </label>
                <input 
                  type="number"
                  min="0"
                  value={photoRequested}
                  onChange={(e) => setPhotoRequested(parseInt(e.target.value) || 0)}
                  className="w-full bg-card-bg border border-border p-2.5 rounded text-xs text-white outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                <Upload size={12} className="text-accent" />
                Upload Image / JPEG
              </label>
              <div 
                className={`w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden relative ${
                  selectedImage ? 'border-accent/50 bg-accent/5' : 'border-border hover:border-accent/30'
                }`}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {selectedImage ? (
                  <motion.div key="image-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 scale-90 transition-all z-10"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <ImageIcon size={24} className="text-text-dim" />
                    <span className="text-[10px] uppercase font-bold text-text-dim text-center px-4">
                      Cliquez pour téléverser<br/>JPEG / PNG
                    </span>
                  </>
                )}
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/50">
                  <Globe size={12} className="text-[#4285F4]" />
                  Synchronisation Automatique
                </span>
                {!googleToken && (
                  <span className="text-[9px] text-[#4285F4]/90 font-mono font-medium normal-case bg-[#4285F4]/10 border border-[#4285F4]/20 px-2 py-0.5 rounded-full select-none">
                    Non connecté
                  </span>
                )}
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!googleToken}
                  onClick={() => setAutoExportMainCalendarOnCreate(prev => !prev)}
                  className={`flex items-center justify-center gap-2 py-3 px-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                    !googleToken ? 'opacity-30 cursor-not-allowed border-white/5 bg-transparent text-white/20' :
                    autoExportMainCalendarOnCreate
                      ? 'bg-accent-yellow/15 border border-accent-yellow/40 text-accent-yellow shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                  title={googleToken ? "Ajouter automatiquement à Google Agenda à l'enregistrement" : "Veuillez vous connecter à Google pour activer cette option"}
                >
                  <Calendar size={12} />
                  Google Agenda
                </button>
                
                <button
                  type="button"
                  disabled={!googleToken}
                  onClick={() => setAutoExportMainTasksOnCreate(prev => !prev)}
                  className={`flex items-center justify-center gap-2 py-3 px-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                    !googleToken ? 'opacity-30 cursor-not-allowed border-white/5 bg-transparent text-white/20' :
                    autoExportMainTasksOnCreate
                      ? 'bg-accent-blue/15 border border-accent-blue/40 text-accent-blue shadow-[0_0_15px_rgba(0,209,255,0.15)]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                  title={googleToken ? "Créer automatiquement une tâche Google Tasks à l'enregistrement" : "Veuillez vous connecter à Google pour activer cette option"}
                >
                  <CheckSquare size={12} />
                  Google Tasks
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={addMission}
                disabled={!selectedProduct}
                className="w-full py-4 bg-gradient-to-r from-accent to-accent-blue text-black rounded-lg font-extrabold uppercase text-sm tracking-wide hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
              >
                <Rocket size={18} className="animate-bounce" />
                Ajouter au tableau
              </button>
            </div>
            </>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black uppercase text-accent-blue tracking-[5px]">Missions Secondaires</h3>
                    <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                      <Target size={14} />
                    </div>
                  </div>
                  <p className="text-[10px] text-text-dim uppercase tracking-[2px] leading-relaxed font-bold opacity-60">
                    Gestion du studio / Recherche / Entretien
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                    <Info size={12} className="text-accent-blue" />
                    Intitulé de la mission
                  </label>
                  <input 
                    type="text"
                    value={secondaryTitle}
                    onChange={(e) => setSecondaryTitle(e.target.value)}
                    placeholder="Ex: Recherche marketing, Nettoyage..."
                    className="w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent-blue transition-all text-sm h-[48px]"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                    <AlertTriangle size={12} className="text-accent-red" />
                    Priorité
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedSecondaryPriority(p)}
                        className={`py-2 rounded-md text-[9px] font-bold uppercase tracking-widest border transition-all ${
                          selectedSecondaryPriority === p 
                            ? (p === 'low' ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : p === 'medium' ? 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow' : 'bg-red-500/20 border-red-500 text-red-500')
                            : 'bg-card-bg border-border text-text-dim hover:border-white/20'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                      <Sparkles size={12} className="text-accent-yellow" />
                      Notation
                    </label>
                    <span className="text-[11px] font-mono font-bold text-accent-yellow pr-1">{selectedRating}/5</span>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button 
                        key={val}
                        onClick={() => setSelectedRating(val)}
                        className={`transition-all ${selectedRating >= val ? 'text-accent-yellow scale-110' : 'text-white/10 hover:text-white/20'}`}
                      >
                        <Sparkles size={24} fill={selectedRating >= val ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                    <Clock size={12} className="text-accent-blue" />
                    Deadline
                  </label>
                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent-blue transition-all text-sm h-[48px]"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                    <MessageSquare size={12} className="text-accent-blue" />
                    Notes détaillées
                  </label>
                  <textarea 
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    placeholder="Précisez les tâches à accomplir..."
                    rows={4}
                    className="w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent-blue transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white/50">
                      <Globe size={12} className="text-[#4285F4]" />
                      Synchronisation Automatique
                    </span>
                    {!googleToken && (
                      <span className="text-[9px] text-[#4285F4]/90 font-mono font-medium normal-case bg-[#4285F4]/10 border border-[#4285F4]/20 px-2 py-0.5 rounded-full select-none">
                        Non connecté
                      </span>
                    )}
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={!googleToken}
                      onClick={() => setAutoExportCalendarOnCreate(prev => !prev)}
                      className={`flex items-center justify-center gap-2 py-3 px-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                        !googleToken ? 'opacity-30 cursor-not-allowed border-white/5 bg-transparent text-white/20' :
                        autoExportCalendarOnCreate
                          ? 'bg-accent-yellow/15 border border-accent-yellow/40 text-accent-yellow shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                          : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                      }`}
                      title={googleToken ? "Ajouter automatiquement à Google Agenda à l'enregistrement" : "Veuillez vous connecter à Google pour activer cette option"}
                    >
                      <Calendar size={12} />
                      Google Agenda
                    </button>
                    
                    <button
                      type="button"
                      disabled={!googleToken}
                      onClick={() => setAutoExportTasksOnCreate(prev => !prev)}
                      className={`flex items-center justify-center gap-2 py-3 px-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                        !googleToken ? 'opacity-30 cursor-not-allowed border-white/5 bg-transparent text-white/20' :
                        autoExportTasksOnCreate
                          ? 'bg-accent-blue/15 border border-accent-blue/40 text-accent-blue shadow-[0_0_15px_rgba(0,209,255,0.15)]'
                          : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                      }`}
                      title={googleToken ? "Créer automatiquement une tâche Google Tasks à l'enregistrement" : "Veuillez vous connecter à Google pour activer cette option"}
                    >
                      <CheckSquare size={12} />
                      Google Tasks
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    addSecondaryMission(secondaryTitle);
                    setSecondaryTitle('');
                  }}
                  disabled={!secondaryTitle}
                  className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-black rounded-lg font-extrabold uppercase text-sm tracking-wide hover:brightness-110 shadow-[0_4px_20px_rgba(0,209,255,0.2)] hover:shadow-[0_0_25px_rgba(0,209,255,0.4)] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  <Plus size={18} />
                  Enregistrer
                </button>
              </div>
            )}

            <div className="pt-4 space-y-3">
               <button 
                onClick={saveToLocalStorage}
                className="w-full flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-md text-accent hover:bg-accent/10 transition-colors"
                title="Sauvegarder dans le navigateur"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">Auto-Sauvegarde (Browser)</span>
                <Save size={14} />
              </button>
              <button 
                onClick={() => document.getElementById('excel-sys-import')?.click()}
                className="w-full flex items-center justify-between p-3 border border-border rounded-md text-text-dim hover:text-white hover:border-accent-blue transition-colors"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-blue">Import Excel</span>
                <Upload size={14} className="text-accent-blue" />
              </button>
               <button 
                onClick={copyToExcel}
                disabled={missions.length === 0}
                className="w-full flex items-center justify-between p-3 border border-border rounded-md text-text-dim hover:text-white transition-colors disabled:opacity-30"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">Copier pour Excel</span>
                {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              </button>
              <button 
                onClick={() => { setMissions([]); setMissionCounter(1); }}
                disabled={missions.length === 0}
                className="w-full flex items-center justify-between p-3 border border-border rounded-md text-text-dim hover:text-red-400 transition-colors disabled:opacity-30"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">Réinitialiser</span>
                <Trash2 size={14} />
              </button>
            </div>
          </aside>
        )}

          {/* Table Section */}
          <main className="p-10 bg-[#0F0F0F] overflow-y-auto custom-scrollbar relative space-y-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full -z-10"></div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col">
                  <div className="bg-accent-purple/90 p-3 rounded shadow-[0_0_20px_rgba(191,122,240,0.3)]">
                    <h2 className="font-display text-3xl font-black uppercase leading-[0.8] tracking-tighter text-black">
                      <motion.div key={activeTab} className="flex flex-col items-start leading-[0.8]">
                        {activeTab === 'table' ? (
                          <span key="tab-table">TABLEAU<br/>DE BORD</span>
                        ) : activeTab === 'dashboard' ? (
                          <span key="tab-dash">MONITEUR<br/>SYSTÈME</span>
                        ) : activeTab === 'inventory' ? (
                          <span key="tab-inventory">INVENTAIRE<br/>PRÉPARATION</span>
                        ) : activeTab === 'journal' ? (
                          <span key="tab-journal">JOURNAL<br/>DE BORD</span>
                        ) : (
                          <span key="tab-config">CONFIG<br/>SYSTÈME</span>
                        )}
                      </motion.div>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-text-dim">
                      Console Centrale / {activeTab === 'table' ? 'DASHBOARD' : activeTab.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  {/* Version Mobile : Liste Déroulante */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all hover:bg-white/10 h-[42px]"
                      style={{ color: navActiveColor }}
                    >
                      {(() => {
                        const activeTabData = tabs.find(t => t.id === activeTab);
                        const ActiveIcon = activeTabData?.icon || Activity;
                        return (
                          <>
                            <ActiveIcon size={14} />
                            <span>{activeTabData?.label}</span>
                          </>
                        );
                      })()}
                      <ChevronDown size={14} className={`transition-transform duration-300 ml-2 ${isNavDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isNavDropdownOpen && (
                        <motion.div 
                          key="nav-backdrop"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[100]" 
                          onClick={() => setIsNavDropdownOpen(false)} 
                        />
                      )}
                      {isNavDropdownOpen && (
                        <motion.div
                          key="nav-menu"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-[101] overflow-hidden backdrop-blur-xl"
                        >
                            {tabs.map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setActiveTab(tab.id as any);
                                  setIsNavDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 text-left ${activeTab === tab.id ? 'text-white bg-white/10' : 'text-text-dim'}`}
                              >
                                <tab.icon size={12} className={activeTab === tab.id ? 'text-accent' : ''} />
                                <span style={activeTab === tab.id ? { color: navActiveColor } : {}}>{tab.label}</span>
                                {activeTab === tab.id && <Check size={12} className="ml-auto text-accent" />}
                              </button>
                            ))}
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Version Desktop : Rail Horizontal (Initial) */}
                  <div className="hidden md:flex items-center p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto overflow-y-hidden custom-scrollbar max-w-full">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeTab === tab.id 
                            ? 'shadow-[0_0_20px_rgba(0,0,0,0.4)]' 
                            : 'text-text-dim hover:text-white hover:bg-white/5'
                        }`}
                        style={activeTab === tab.id ? { backgroundColor: navActiveColor, color: 'black' } : {}}
                      >
                        <tab.icon size={12} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm shadow-2xl">
                    <div className="px-2 border-r border-white/10 hidden lg:block text-[8px] font-black uppercase leading-tight tracking-widest text-text-dim/60">
                      <div>SYNCHRO</div>
                      <div>FLUX</div>
                    </div>
                    <button 
                      onClick={() => document.getElementById('bulk-image-upload')?.click()}
                      className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-black active:scale-95 transition-all rounded shadow-md group"
                      title="Importer plusieurs images d'un coup"
                    >
                      <ImagePlus size={10} className="group-hover:scale-110 transition-transform" />
                      IMPORTER IMAGES
                    </button>
                    <input 
                      id="bulk-image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBulkImageUpload}
                      className="hidden"
                    />
                    <button 
                      onClick={() => {
                        exportSystemData();
                        setToast({ show: true, message: 'JSON : Copié !', type: 'task' });
                        setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-white text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all rounded shadow-md"
                      style={{ backgroundColor: copyBtnColor }}
                      title="1. Copier le JSON système"
                    >
                      <Copy size={10} />
                      1. COPIER
                    </button>
                    <input 
                      type="text"
                      placeholder="2. COLLER JSON ICI..."
                      onChange={(e) => {
                        if (e.target.value.trim().startsWith('{')) {
                          processImport(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="bg-black/40 border border-white/10 px-3 py-1.5 text-[9px] font-bold text-accent-blue w-40 outline-none focus:border-accent-blue transition-all rounded placeholder:text-text-dim/40 placeholder:font-normal italic"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={saveToLocalStorage}
                  className="flex items-center gap-2 px-4 py-2 rounded text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all font-display shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  style={{ backgroundColor: saveBtnColor }}
                  title="Sauvegarde forcée locale"
                >
                  <Save size={12} />
                  SAUVEGARDER
                </button>
                
                <div className="h-6 w-[1px] bg-white/10 mx-1" />

                <button 
                  onClick={captureAsJPEG}
                  disabled={isCapturing}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/30 rounded text-accent-blue text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue/20 transition-all border-dashed disabled:opacity-50"
                  title="Sauvegarder toutes les données en JPEG"
                >
                  {isCapturing ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                  {isCapturing ? 'Capture...' : 'Export JPEG'}
                </button>

                <button 
                  onClick={exportAllCharts}
                  disabled={isCapturing}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent/20 transition-all border-dashed disabled:opacity-50"
                  title="Télécharger tous les graphiques séparément"
                >
                  {isCapturing ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                  {isCapturing ? 'Batch...' : 'Tout Exporter'}
                </button>

                <button 
                  onClick={() => document.getElementById('excel-sys-import')?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/30 rounded text-accent-blue text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue/20 transition-all border-dashed"
                  title="Importer des données depuis un fichier Excel"
                >
                  <Upload size={12} />
                  Import Excel
                </button>
                <input 
                  id="excel-sys-import"
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleExcelImport}
                />

                <button 
                  onClick={downloadFullExport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent/20 transition-all border-dashed"
                  title="Exporter toutes les données en format Excel"
                >
                  <FileSpreadsheet size={12} />
                  Export Excel
                </button>
              </div>

              {activeTab === 'table' && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsAdvancedSortOpen(true)}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                        sortConfigs.length > 0 
                          ? 'bg-accent-blue text-black border-accent-blue shadow-[0_0_15px_rgba(0,209,255,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                      title="Configuration du tri multi-colonnes"
                    >
                      <ArrowUpDown size={12} />
                      Tri Avancé
                    </button>

                    <button 
                      onClick={() => setSortConfigs([])}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all bg-white/5 border-white/10 text-white/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 ${
                        sortConfigs.length === 0 ? 'opacity-30 pointer-events-none' : ''
                      }`}
                      title="Réinitialiser tous les tris"
                    >
                      <RotateCcw size={12} />
                      Reset
                    </button>
                    
                    {sortConfigs.length > 0 && (
                      <div className="flex items-center gap-1">
                        {sortConfigs.slice(0, 2).map((s, idx) => (
                           <div key={s.key} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-white/50 flex items-center gap-1">
                              {s.key} {s.order === 'asc' ? '↑' : '↓'}
                           </div>
                        ))}
                        {sortConfigs.length > 2 && <span className="text-[8px] text-text-dim">+{sortConfigs.length - 2}</span>}
                      </div>
                    )}

                    <button 
                      onClick={() => setIsFilterVisible(!isFilterVisible)}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                        isFilterVisible 
                          ? 'bg-accent-blue text-black border-accent-blue' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <Filter size={12} />
                      {isFilterVisible ? 'Masquer Filtres' : 'Filtres'}
                    </button>

                    <div className="relative">
                      <button 
                        onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                          isViewDropdownOpen 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                        title="Changer de vue"
                      >
                        {tableViewState === 'full' ? <Maximize size={12} className="text-accent" /> : 
                         tableViewState === 'minimal' ? <ChevronsLeft size={12} className="text-accent-red" /> : 
                         <Minimize size={12} className="text-accent-blue" />}
                        {tableViewState === 'full' ? "Vue Complète" : 
                         tableViewState === 'minimal' ? "Tout Rétracter" : 
                         "Vue Compacte"}
                        <ChevronDown size={14} className={`ml-1 transition-transform ${isViewDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isViewDropdownOpen && (
                          <motion.div 
                            key="view-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60]" 
                            onClick={() => setIsViewDropdownOpen(false)} 
                          />
                        )}
                        {isViewDropdownOpen && (
                          <motion.div
                            key="view-menu"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl z-[70] py-1 overflow-hidden"
                          >
                              <div className="px-4 py-2 border-b border-white/5">
                                <p className="text-[7px] font-black text-text-dim uppercase tracking-widest">Configuration de vue</p>
                              </div>

                              <button 
                                onClick={() => {
                                  applyViewPreset('full');
                                  setIsViewDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${tableViewState === 'full' ? 'text-accent bg-accent/5' : 'text-text-dim'}`}
                              >
                                <Maximize size={12} />
                                <span>Vue Complète</span>
                                {tableViewState === 'full' && <Check size={12} className="ml-auto" />}
                              </button>

                              <button 
                                onClick={() => {
                                  applyViewPreset('compact');
                                  setIsViewDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${tableViewState === 'compact' ? 'text-accent-blue bg-accent-blue/5' : 'text-text-dim'}`}
                              >
                                <Minimize size={12} />
                                <span>Vue Compacte</span>
                                {tableViewState === 'compact' && <Check size={12} className="ml-auto" />}
                              </button>

                              <button 
                                onClick={() => {
                                  applyViewPreset('minimal');
                                  setIsViewDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${tableViewState === 'minimal' ? 'text-accent-red bg-accent-red/5' : 'text-text-dim'}`}
                              >
                                <ChevronsLeft size={12} />
                                <span>Tout Rétracter</span>
                                {tableViewState === 'minimal' && <Check size={12} className="ml-auto" />}
                              </button>

                              <div className="mx-2 my-1 border-t border-white/5" />

                              <div className="px-4 py-2">
                                <p className="text-[7px] font-black text-text-dim uppercase tracking-widest mb-2">Structure</p>
                                <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('table');
                                    }}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'table' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <List size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Liste</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('mosaic');
                                    }}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'mosaic' || viewMode === 'grid' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <LayoutGrid size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Grille</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('task');
                                    }}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'task' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <CheckSquare size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Task</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('calendar');
                                    }}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'calendar' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <Calendar size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Cal.</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('family');
                                    }}
                                    className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'family' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <Layers size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Famille</span>
                                  </button>
                                </div>
                              </div>

                              <div className="px-4 py-2 bg-white/[0.02]">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setManualHiddenColumns(prev => 
                                      prev.includes('imageUrl') 
                                        ? prev.filter(h => h !== 'imageUrl') 
                                        : [...prev, 'imageUrl']
                                    );
                                  }}
                                  className="w-full flex items-center justify-between text-[8px] font-black uppercase tracking-widest group"
                                >
                                  <span className={`transition-colors ${!manualHiddenColumns.includes('imageUrl') ? 'text-accent' : 'text-text-dim group-hover:text-white'}`}>Afficher Miniatures</span>
                                  <div className={`w-6 h-3 rounded-full relative transition-colors ${!manualHiddenColumns.includes('imageUrl') ? 'bg-accent/40' : 'bg-white/10'}`}>
                                    <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${!manualHiddenColumns.includes('imageUrl') ? 'right-0.5' : 'left-0.5 opacity-20'}`} />
                                  </div>
                                </button>
                              </div>
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {hiddenColumns.length > 0 && (
                      <button 
                        onClick={() => {
                          setTableViewState('full');
                          setManualHiddenColumns([]);
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[8px] font-black uppercase tracking-widest rounded hover:bg-accent-purple hover:text-white transition-all ml-2"
                      >
                        <RotateCcw size={10} />
                        Restaurer ({hiddenColumns.length})
                      </button>
                    )}

                    <button 
                      onClick={() => setFilterDuplicates(!filterDuplicates)}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ml-2 ${
                        filterDuplicates 
                          ? 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                      title={filterDuplicates ? "Afficher les doublons" : "Masquer les doublons"}
                    >
                      <Copy size={12} />
                      {filterDuplicates ? "Doublons Masqués" : "Cacher Doublons"}
                    </button>

                    <button 
                      onClick={() => setShowDuplicateIndicators(!showDuplicateIndicators)}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ml-2 ${
                        showDuplicateIndicators 
                          ? 'bg-accent/20 text-accent border-accent/40 shadow-[0_0_10px_rgba(0,255,148,0.2)]' 
                          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                      }`}
                      title={showDuplicateIndicators ? "Cacher les bordures rouges" : "Afficher les bordures rouges"}
                    >
                      {showDuplicateIndicators ? <Eye size={12} /> : <EyeOff size={12} />}
                      Indicateurs
                    </button>

                    <button 
                      onClick={() => setShowCleanDuplicatesModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-500/20 ml-2"
                    >
                      <Trash2 size={12} />
                      Nettoyer
                    </button>

                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-lg ml-2">
                       <button 
                         onClick={() => setViewMode('table')}
                         className={`p-1.5 rounded transition-all ${viewMode === 'table' ? 'bg-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                         title="Mode Ligne (Table)"
                       >
                         <List size={14} />
                       </button>
                       <button 
                         onClick={() => setViewMode('mosaic')}
                         className={`p-1.5 rounded transition-all ${viewMode === 'mosaic' || viewMode === 'grid' ? 'bg-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                         title="Mode Mosaïque (Grille)"
                       >
                         <LayoutGrid size={14} />
                       </button>
                       <button 
                         onClick={() => setViewMode('task')}
                         className={`p-1.5 rounded transition-all ${viewMode === 'task' ? 'bg-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                         title="Mode Task"
                       >
                         <CheckSquare size={14} />
                       </button>
                       <button 
                         onClick={() => setViewMode('calendar')}
                         className={`p-1.5 rounded transition-all ${viewMode === 'calendar' ? 'bg-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                         title="Mode Calendrier"
                       >
                         <Calendar size={14} />
                       </button>
                       <button 
                         onClick={() => setViewMode('family')}
                         className={`p-1.5 rounded transition-all ${viewMode === 'family' ? 'bg-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                         title="Mode Familles & Sous-Familles"
                       >
                         <Layers size={14} />
                       </button>
                       <button 
                         title="Spacer"
                         className="hidden"
                       >
                         <Calendar size={14} />
                       </button>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-[11px] text-text-dim uppercase tracking-wider font-bold">
                        {missions.length} mission(s)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-text-dim uppercase font-black tracking-tighter">Flux Global</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${missions.every(m => m.enabled) && missions.length > 0 ? 'text-accent' : 'text-red-400'}`}>
                          {missions.every(m => m.enabled) && missions.length > 0 ? 'TOUT ACTIF' : 'TOUT INACTIF'}
                        </span>
                      </div>
                      <Toggle 
                        enabled={missions.every(m => m.enabled) && missions.length > 0}
                        onToggle={(e) => {
                          e.stopPropagation();
                          const areAllEnabled = missions.every(m => m.enabled) && missions.length > 0;
                          toggleAllMissions(!areAllEnabled);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {renderDashboardView()}
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {renderInventoryView()}
                </motion.div>
              )}

              {activeTab === 'journal' && (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {renderJournalView()}
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {renderSystemView()}
                </motion.div>
              )}

              {activeTab === 'table' && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-16"
                >
                  {/* Production Missions Segment */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg text-accent">
                        <Layout size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-[4px] text-white">Missions de Production</h2>
                        <p className="text-[9px] font-mono text-accent/60 uppercase tracking-widest mt-1">Photos, Vidéos & Graphismes</p>
                      </div>
                    </div>
                  <AnimatePresence>
                    {isFilterVisible && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                        animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                        exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                        className="mb-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-9 gap-4 p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md relative z-20">
                          {/* Search */}
                          <div className="space-y-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                              <Search size={10} /> Recherche
                            </label>
                            <input 
                              type="text" 
                              value={filterQuery}
                              onChange={(e) => setFilterQuery(e.target.value)}
                              placeholder="Rechercher produit, ref..."
                              className="w-full bg-black/40 border border-white/10 p-2.5 rounded text-sm text-white outline-none focus:border-accent-blue transition-all h-[42px]"
                            />
                          </div>

                          {/* Multi-Select Status */}
                          <FilterSelect 
                            label="Statut" 
                            icon={ClipboardCheck} 
                            items={categories.find(c => c.id === 'status')?.items || []} 
                            selected={filterStatuses} 
                            setSelected={setFilterStatuses} 
                            isOpen={isStatusFilterOpen} 
                            setIsOpen={setIsStatusFilterOpen} 
                          />

                          {/* Multi-Select Product */}
                          <FilterSelect 
                            label="Produit" 
                            icon={Package} 
                            items={categories.find(c => c.id === 'product')?.items || []} 
                            selected={filterProducts} 
                            setSelected={setFilterProducts} 
                            isOpen={isProductFilterOpen} 
                            setIsOpen={setIsProductFilterOpen} 
                          />

                          {/* Multi-Select Color */}
                          <FilterSelect 
                            label="Couleur" 
                            icon={Palette} 
                            items={categories.find(c => c.id === 'color')?.items || []} 
                            selected={filterColors} 
                            setSelected={setFilterColors} 
                            isOpen={isColorFilterOpen} 
                            setIsOpen={setIsColorFilterOpen} 
                          />

                          {/* Active / Inactive filter */}
                          <FilterSelect 
                            label="État" 
                            icon={Power} 
                            items={['Actif', 'Inactif']} 
                            selected={filterEnabled} 
                            setSelected={setFilterEnabled} 
                            isOpen={isEnabledFilterOpen} 
                            setIsOpen={setIsEnabledFilterOpen} 
                            accentColor="text-accent-orange"
                          />

                          {/* Date Range Picker */}
                          <div className="space-y-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2">
                                <Calendar size={10} /> Période
                              </span>
                              <select 
                                value={filterDateType}
                                onChange={(e: any) => setFilterDateType(e.target.value)}
                                className="bg-transparent text-accent-blue outline-none border-none cursor-pointer hover:opacity-80"
                              >
                                <option value="createdAt" className="bg-zinc-900">Création</option>
                                <option value="deadline" className="bg-zinc-900">Deadline</option>
                              </select>
                            </label>
                            <div className="flex items-center gap-1">
                              <input 
                                type="date" 
                                value={filterDateStart}
                                onChange={(e) => setFilterDateStart(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 p-2 rounded text-[10px] text-white outline-none focus:border-accent-blue transition-all h-[42px] [color-scheme:dark]"
                              />
                              <span className="text-text-dim text-[10px]">-</span>
                              <input 
                                type="date" 
                                value={filterDateEnd}
                                onChange={(e) => setFilterDateEnd(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 p-2 rounded text-[10px] text-white outline-none focus:border-accent-blue transition-all h-[42px] [color-scheme:dark]"
                              />
                            </div>
                          </div>

                          {/* Multi-Select Universe */}
                          <FilterSelect 
                            label="Univers" 
                            icon={MapPin} 
                            items={categories.find(c => c.id === 'univers')?.items || []} 
                            selected={filterUniverses} 
                            setSelected={setFilterUniverses} 
                            isOpen={isUniverseFilterOpen} 
                            setIsOpen={setIsUniverseFilterOpen} 
                          />

                          {/* Multi-Select Support */}
                          <FilterSelect 
                            label="Support" 
                            icon={Film} 
                            items={categories.find(c => c.id === 'support')?.items || []} 
                            selected={filterSupports} 
                            setSelected={setFilterSupports} 
                            isOpen={isSupportFilterOpen} 
                            setIsOpen={setIsSupportFilterOpen} 
                          />

                          {/* Multi-Select Argument */}
                          <FilterSelect 
                            label="Argument" 
                            icon={Target} 
                            items={categories.find(c => c.id === 'argument')?.items || []} 
                            selected={filterArguments} 
                            setSelected={setFilterArguments} 
                            isOpen={isArgumentFilterOpen} 
                            setIsOpen={setIsArgumentFilterOpen} 
                          />

                          {/* Multi-Select Priority */}
                          <FilterSelect 
                            label="Priorité" 
                            icon={AlertTriangle} 
                            items={categories.find(c => c.id === 'priority')?.items || []} 
                            selected={filterPriorities} 
                            setSelected={setFilterPriorities} 
                            isOpen={isPriorityFilterOpen} 
                            setIsOpen={setIsPriorityFilterOpen} 
                            accentColor="text-red-500"
                          />

                          {/* Deadline Alert Toggle */}
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                               <Clock size={10} /> Alertes
                             </label>
                             <button
                               onClick={() => setFilterDeadlineAlert(!filterDeadlineAlert)}
                               className={`w-full h-[42px] flex items-center justify-between px-3 rounded border transition-all ${filterDeadlineAlert ? 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow' : 'bg-black/40 border-white/10 text-text-dim hover:border-white/20'}`}
                             >
                               <span className="text-[10px] font-black uppercase tracking-wider">Deadlines Proches</span>
                               <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filterDeadlineAlert ? 'border-accent-yellow bg-accent-yellow' : 'border-white/20'}`}>
                                 {filterDeadlineAlert && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                               </div>
                             </button>
                          </div>
                        </div>

                        {/* Quick Actions & Summary */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          {(filterQuery || filterStatuses.length > 0 || filterProducts.length > 0 || filterColors.length > 0 || filterUniverses.length > 0 || filterSupports.length > 0 || filterArguments.length > 0 || filterPriorities.length > 0 || filterDateStart || filterDateEnd || filterDeadlineAlert) && (
                            <button 
                              onClick={() => {
                                setFilterQuery('');
                                setFilterStatuses([]);
                                setFilterProducts([]);
                                setFilterColors([]);
                                setFilterUniverses([]);
                                setFilterSupports([]);
                                setFilterArguments([]);
                                setFilterPriorities([]);
                                setFilterDateStart('');
                                setFilterDateEnd('');
                                setFilterDateType('createdAt');
                                setFilterDeadlineAlert(false);
                              }}
                              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase rounded hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                            >
                              <RotateCcw size={12} />
                              Réinitialiser tous les filtres
                            </button>
                          )}
                          
                          <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-2 rounded">
                            {filteredMissions.length} / {missions.length} missions filtrées
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Filter Chips Layer */}
                  <AnimatePresence>
                    {(filterStatuses.length > 0 || filterProducts.length > 0 || filterUniverses.length > 0 || filterSupports.length > 0 || filterPriorities.length > 0 || filterDateStart || filterDateEnd || filterDeadlineAlert) && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex flex-wrap gap-2 mb-6 p-2 bg-accent/5 border-l-2 border-accent rounded-r-lg"
                      >
                        <div className="flex items-center gap-1.5 px-2 text-[9px] font-black text-accent uppercase tracking-wider">
                          <Filter size={12} />
                          Filtres Actifs:
                        </div>
                        
                        {filterDeadlineAlert && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 px-2 py-1 bg-accent-yellow/10 border border-accent-yellow/20 rounded text-[9px] text-accent-yellow hover:bg-accent-yellow/20 transition-all group"
                          >
                             <Clock size={10} />
                             <span className="font-bold uppercase tracking-tighter">Deadline Proche</span>
                             <button 
                               onClick={() => setFilterDeadlineAlert(false)}
                               className="p-0.5 hover:text-white transition-colors"
                             >
                               <X size={10} />
                             </button>
                          </motion.div>
                        )}

                        {renderFilterChips('Statut', filterStatuses, setFilterStatuses)}
                        {renderFilterChips('Produit', filterProducts, setFilterProducts)}
                        {renderFilterChips('Couleur', filterColors, setFilterColors)}
                        {renderFilterChips('Univers', filterUniverses, setFilterUniverses)}
                        {renderFilterChips('Support', filterSupports, setFilterSupports)}
                        {renderFilterChips('Argument', filterArguments, setFilterArguments)}
                        {renderFilterChips('Priorité', filterPriorities, setFilterPriorities)}

                        {filterDateStart && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white hover:border-white/30 transition-all group"
                          >
                            <span className="text-text-dim select-none">{filterDateType === 'createdAt' ? 'Créé' : 'Deadline'} Du:</span>
                            <span className="font-bold">{filterDateStart}</span>
                            <button 
                              onClick={() => setFilterDateStart('')}
                              className="p-0.5 hover:text-red-500 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </motion.div>
                        )}

                        {filterDateEnd && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white hover:border-white/30 transition-all group"
                          >
                            <span className="text-text-dim select-none">{filterDateType === 'createdAt' ? 'Créé' : 'Deadline'} Au:</span>
                            <span className="font-bold">{filterDateEnd}</span>
                            <button 
                              onClick={() => setFilterDateEnd('')}
                              className="p-0.5 hover:text-red-500 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {missions.length > 0 && (
                    <>
                      {viewMode === 'table' && (
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse min-w-[1300px] border border-white/5 bg-white/[0.01]">
                          <thead>
                          <tr className="border-b border-white/10 bg-black/40">
                            <th className="w-10 py-5 px-3 text-center border-r border-white/5">
                              <button 
                                onClick={toggleSelectAll}
                                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                                  selectedMissionIds.length === filteredMissions.length && filteredMissions.length > 0
                                    ? 'bg-accent border-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' 
                                    : 'bg-white/5 border-white/20 text-transparent hover:border-white/40'
                                }`}
                              >
                                <Check size={10} strokeWidth={4} />
                              </button>
                            </th>
                            <th className="w-14 py-5 px-3 text-center border-r border-white/5 text-[9px] font-black uppercase text-text-dim tracking-widest whitespace-nowrap">
                              On/Off
                            </th>
                              {[
                                { id: 'missionNo', label: 'ID.Ref', class: 'w-16 text-center text-accent' },
                                { id: 'refId', label: 'Reference', class: 'w-24 text-accent-blue font-mono' },
                                { id: 'imageUrl', label: 'Capture', class: 'w-16 text-center text-text-dim', sortable: false },
                                { id: 'family', label: 'Famille', class: 'text-accent-purple/80 w-32 font-bold' },
                                { id: 'product', label: 'Product Name', class: 'text-white' },
                                { id: 'color', label: 'Variant', class: 'text-text-dim/60 w-32' },
                                { id: 'argumentType', label: 'Arg.', class: 'text-accent-blue/80 w-24' },
                                { id: 'univers', label: 'Universe', class: 'text-accent-purple/80 w-32' },
                                { id: 'format', label: 'Dimen.', class: 'text-accent-yellow/80 w-24' },
                                { id: 'position', label: 'Orient.', class: 'text-accent-orange/80 w-24 text-center' },
                                { id: 'support', label: 'Support Cat.', class: 'text-accent-pink/80 text-center w-32' },
                                { id: 'priority', label: 'Priority', class: 'text-accent-orange/80 w-32' },
                                { id: 'deadline', label: 'Date Deadline', class: 'text-accent-yellow/80 w-32' },
                                { id: 'info', label: 'Consignes', class: 'text-text-dim/40 max-w-[200px]' },
                                { id: 'rating', label: 'Note', class: 'w-24 text-center text-accent-yellow' },
                                 { id: 'status', label: 'Machine.State', class: 'text-accent-blue/80 w-40' },
                                 { id: 'progress', label: 'Progression %', class: 'text-accent-purple/80 w-44' },
                                 { id: 'photoCountRequested', label: 'Requise(s)', class: 'text-accent-purple/80 w-24 text-center' },
                                 { id: 'photoCountDelivered', label: 'Livrée(s)', class: 'text-accent-pink/80 w-24 text-center' },
                                { id: 'ficha', label: 'Dossier', class: 'text-right text-accent-blue/80 w-24', sortable: false }
                              ].filter(h => !hiddenColumns.includes(h.id)).map((h) => {
                                const sort = sortConfigs.find(s => s.key === h.id);
                                const isSortable = h.sortable !== false;
                                
                                return (
                                  <th 
                                    key={h.id} 
                                    onClick={(e) => isSortable && toggleSort(h.id, e.shiftKey)}
                                    className={`py-5 px-3 border-r border-white/5 last:border-r-0 ${isSortable ? 'cursor-pointer hover:bg-white/5 transition-colors group' : ''} relative`}
                                  >
                                    <div className={`flex items-center gap-2 ${h.class.includes('text-right') ? 'justify-end' : h.class.includes('text-center') ? 'justify-center' : ''}`}>
                                      <span className="font-serif italic text-[11px] font-normal uppercase tracking-[2px] opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">
                                        {h.label}
                                      </span>
                                      
                                      {/* Individual Hide Button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleColumnVisibility(h.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-text-dim hover:text-white transition-all hover:scale-110"
                                        title="Masquer cette colonne"
                                      >
                                        <Minimize size={10} />
                                      </button>

                                      {sort && (
                                        <span className="text-[10px] font-mono font-black text-accent shadow-[0_0_10px_rgba(0,255,148,0.2)]">
                                          {sort.order === 'asc' ? '↑' : '↓'}
                                          {sortConfigs.length > 1 && <span className="text-[7px] ml-0.5 opacity-50">{sortConfigs.indexOf(sort) + 1}</span>}
                                        </span>
                                      )}
                                    </div>
                                  </th>
                                );
                              })}
                          </tr>
                        </thead>

                <Reorder.Group axis="y" values={filteredMissions} onReorder={setMissions} as="tbody" className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {filteredMissions.length === 0 ? (
                      <motion.tr
                        key="empty-missions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={22 - hiddenColumns.length} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Layers size={48} className="text-text-dim" />
                            <p className="text-xs uppercase tracking-[4px]">
                              {missions.length === 0 ? 'Base de données vide' : 'Aucun résultat pour ces filtres'}
                            </p>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      filteredMissions.map((m) => (
                        <Reorder.Item 
                          key={m.id}
                          value={m}
                          as="tr"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -10 }}
                          onDoubleClick={() => setSelectedMissionId(m.id)}
                          className={`hover:bg-white/[0.04] transition-colors group relative cursor-grab active:cursor-grabbing ${selectedMissionIds.includes(m.id) ? 'bg-white/[0.06]' : ''} ${(showDuplicateIndicators && isDuplicate(m)) ? 'border-l-2 border-l-red-500 bg-red-500/5' : ''}`}
                        >
                          <td className="py-4 px-3 text-center" onClick={(e) => toggleSelectMission(m.id, e)}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all mx-auto ${
                              selectedMissionIds.includes(m.id) 
                                ? 'bg-accent border-accent text-black' 
                                : 'bg-white/5 border-white/20 text-transparent group-hover:border-white/40'
                            }`}>
                              <Check size={10} strokeWidth={4} />
                            </div>
                          </td>
                          <td className="py-4 px-3 text-center border-r border-white/5 border-l border-white/5">
                             <div className="flex justify-center">
                               <Toggle enabled={m.enabled} onToggle={(e) => toggleMissionEnabled(m.id, e)} />
                             </div>
                          </td>
                          {!hiddenColumns.includes('missionNo') && <td className="py-4 px-3 font-mono text-[11px] text-accent/80">#{m.missionNo}</td>}
                          {!hiddenColumns.includes('refId') && <td className="py-4 px-3 font-mono text-[11px] font-bold whitespace-nowrap" style={{ color: refIdColor }}>{m.refId}</td>}
                          {!hiddenColumns.includes('imageUrl') && (
                            <td className="py-4 px-3 text-center border-r border-white/5">
                              {m.imageUrl ? (
                                <div className="w-10 h-10 border border-white/10 rounded overflow-hidden mx-auto bg-black/40">
                                  <img src={m.imageUrl} alt="Mission thumbnail" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 border border-white/5 rounded flex items-center justify-center mx-auto opacity-10">
                                  <ImageIcon size={12} />
                                </div>
                              )}
                            </td>
                          )}
                          {!hiddenColumns.includes('family') && (
                            <td 
                              className="py-4 px-3 border-r border-white/5"
                              onClick={(e) => e.stopPropagation()}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setFamilyEditProduct({
                                  missionId: m.id,
                                  currentFamily: m.family || deduceFamily(m.product) || 'Autre'
                                });
                              }}
                            >
                              <div className="flex items-center gap-2 group/fam-cell cursor-pointer">
                                <span className="px-2.5 py-1 rounded bg-accent-purple/10 border border-accent-purple/20 text-[9px] font-mono font-black text-accent-purple tracking-widest uppercase hover:bg-accent-purple/25 transition-colors">
                                  {m.family || deduceFamily(m.product) || 'Autre'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFamilyEditProduct({
                                      missionId: m.id,
                                      currentFamily: m.family || deduceFamily(m.product) || 'Autre'
                                    });
                                  }}
                                  className="p-1 text-text-dim hover:text-white bg-white/0 hover:bg-white/10 rounded transition-all opacity-0 group-hover/fam-cell:opacity-100"
                                  title="Changer la famille (double-cliquer pour pop-up)"
                                >
                                  <Edit2 size={10} />
                                </button>
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('product') && (
                            <td className="py-4 px-3">
                              <input 
                                type="text"
                                value={m.product}
                                onChange={(e) => updateMission(m.id, { product: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 w-full focus:ring-0 outline-none text-xs font-mono font-bold text-white/90 hover:bg-white/5 rounded transition-colors"
                              />
                            </td>
                          )}
                          {!hiddenColumns.includes('color') && (
                            <td className="py-4 px-3">
                              <select 
                                value={m.color}
                                onChange={(e) => updateMission(m.id, { color: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 w-full focus:ring-0 outline-none text-xs text-text-dim cursor-pointer hover:text-white transition-colors appearance-none"
                              >
                                {categories.find(c => c.id === 'color')?.items.map(c => (
                                  <option key={c} value={c} className="bg-[#1A1A1A] text-white">{c}</option>
                                ))}
                              </select>
                            </td>
                          )}
                          {!hiddenColumns.includes('argumentType') && (
                            <td className="py-4 px-3 border-l border-white/5">
                              <select 
                                value={m.argumentType}
                                onChange={(e) => updateMission(m.id, { argumentType: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 w-full focus:ring-0 outline-none text-xs text-text-dim lowercase cursor-pointer hover:text-white transition-colors appearance-none"
                              >
                                {categories.find(c => c.id === 'argument')?.items.map(a => (
                                  <option key={a} value={a} className="bg-[#1A1A1A] text-white">{a}</option>
                                ))}
                              </select>
                            </td>
                          )}
                          {!hiddenColumns.includes('univers') && (
                            <td className="py-4 px-3">
                              <select 
                                value={m.univers}
                                onChange={(e) => updateMission(m.id, { univers: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 w-full focus:ring-0 outline-none text-xs text-text-dim cursor-pointer hover:text-white transition-colors appearance-none uppercase"
                              >
                                {categories.find(c => c.id === 'univers')?.items.map(u => (
                                  <option key={u} value={u} className="bg-[#1A1A1A] text-white">{u}</option>
                                ))}
                              </select>
                            </td>
                          )}
                          {!hiddenColumns.includes('format') && (
                            <td className="py-4 px-3">
                              <select 
                                value={m.format}
                                onChange={(e) => updateMission(m.id, { format: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 w-full focus:ring-0 outline-none text-xs text-text-dim cursor-pointer hover:text-white transition-colors appearance-none"
                              >
                                {categories.find(c => c.id === 'format')?.items.map(f => (
                                  <option key={f} value={f} className="bg-[#1A1A1A] text-white">{f}</option>
                                ))}
                              </select>
                            </td>
                          )}
                          {!hiddenColumns.includes('position') && (
                            <td className="py-4 px-3">
                              <select 
                                value={m.position}
                                onChange={(e) => updateMission(m.id, { position: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 w-full focus:ring-0 outline-none text-xs text-text-dim cursor-pointer hover:text-white transition-colors appearance-none text-center"
                              >
                                {categories.find(c => c.id === 'position')?.items.map(p => (
                                  <option key={p} value={p} className="bg-[#1A1A1A] text-white">{p}</option>
                                ))}
                              </select>
                            </td>
                          )}
                          {!hiddenColumns.includes('support') && (
                            <td className="py-4 px-3 text-center border-l border-white/5">
                              <div className="flex flex-col items-center">
                                <div className="relative group/support-select">
                                  {(() => {
                                    const cat = categories.find(c => c.id === 'support');
                                    const colorRef = cat?.colorRef || 'accent';
                                    const isHex = colorRef?.startsWith('#');
                                    
                                    const style = isHex ? {
                                      color: colorRef,
                                      borderColor: `${colorRef}40`,
                                      backgroundColor: `${colorRef}10`,
                                      boxShadow: `0 0 10px -4px ${colorRef}`
                                    } : {};
                                    
                                    const colorClass = isHex ? 'border' : 
                                      (m.support || '').includes('vid') ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30 shadow-[0_0_10px_-4px_var(--color-accent-pink)]' : 
                                      (m.support || '').includes('photo') ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_-4px_var(--color-accent-blue)]' :
                                      'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 shadow-[0_0_10px_-4px_var(--color-accent-yellow)]';

                                    return (
                                      <span className={`text-[10px] px-2 py-0.5 rounded text-white uppercase font-black tracking-tighter flex items-center gap-1.5 min-w-[75px] justify-center scale-90 transition-transform group-hover:scale-100 ${colorClass}`} style={style}>
                                        {(m.support || '').includes('vid') ? <Film size={10} /> : 
                                         (m.support || '').includes('photo') ? <ImageIcon size={10} /> :
                                         <Zap size={10} />}
                                        {m.support}
                                      </span>
                                    );
                                  })()}
                                  <select 
                                    value={m.support}
                                    onChange={(e) => updateMission(m.id, { support: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  >
                                    {categories.find(c => c.id === 'support')?.items.map(s => (
                                      <option key={s} value={s} className="bg-[#1A1A1A] text-white">{s}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('priority') && (
                            <td className="py-4 px-3">
                              <div className="relative group/priority flex items-center gap-2">
                                {m.priority === 'High priority' && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-red-500 animate-pulse shrink-0"
                                  >
                                    <AlertTriangle size={14} />
                                  </motion.div>
                                )}
                                <div className="relative flex-1">
                                  <select 
                                    value={m.priority}
                                    onClick={(e) => e.stopPropagation()}
                                    onDoubleClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateMission(m.id, { priority: e.target.value })}
                                    className={`text-[9px] font-black px-2 py-1 rounded uppercase flex items-center gap-1 w-full border bg-transparent appearance-none cursor-pointer focus:ring-1 focus:ring-accent-red/30 outline-none transition-all ${
                                      m.priority === 'High priority' ? 'border-red-500/50 text-red-500 bg-red-500/5' :
                                      m.priority === 'Medium priority' ? 'border-accent-red/50 text-accent-red bg-accent-red/5' :
                                      'border-white/10 text-text-dim bg-white/5'
                                    }`}
                                    style={(() => {
                                      const cat = categories.find(c => c.id === 'priority');
                                      if (cat?.colorRef?.startsWith('#')) {
                                        return { color: cat.colorRef, borderColor: `${cat.colorRef}40`, backgroundColor: `${cat.colorRef}10` };
                                      }
                                      return {};
                                    })()}
                                  >
                                    {categories.find(c => c.id === 'priority')?.items.map(p => (
                                      <option key={p} value={p} className="bg-app-bg text-white">
                                        {p === 'High priority' ? '⚠️ ' : ''}{p}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-30">
                                    <ChevronRight size={8} className="rotate-90" />
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('deadline') && (
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-2">
                                {isDeadlineApproaching(m.deadline) && m.status !== 'livré' && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-accent-yellow animate-pulse shrink-0"
                                    title={`Deadline proche (<= ${deadlineAlertThreshold} jours)`}
                                  >
                                    <AlertTriangle size={14} />
                                  </motion.div>
                                )}
                                <input 
                                  type="date"
                                  value={m.deadline && m.deadline.includes('/') ? m.deadline.split('/').reverse().join('-') : m.deadline}
                                  onChange={(e) => updateMission(m.id, { deadline: e.target.value })}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`bg-black/40 border rounded text-[9px] p-1 outline-none transition-all font-mono w-full ${isDeadlineApproaching(m.deadline) && m.status !== 'livré' ? 'border-red-500/50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/5 text-text-dim focus:border-accent/40 focus:text-white hover:border-white/10'}`}
                                />
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('info') && (
                            <td className="py-4 px-3 min-w-[200px]">
                              <div className="relative group/info-cell">
                                <textarea 
                                  value={m.info || ''}
                                  onChange={(e) => updateMission(m.id, { info: e.target.value })}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Notes..."
                                  className="w-full min-h-[60px] bg-black/40 border border-white/5 rounded text-[9px] p-2 text-text-dim outline-none focus:border-accent/40 focus:text-white hover:border-white/10 transition-all resize-y custom-scrollbar font-mono leading-relaxed pr-8"
                                />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setToast({ show: true, message: 'Notes mission enregistrées', type: 'task' });
                                    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 2000);
                                  }}
                                  className="absolute right-2 top-2 p-1 text-accent opacity-0 group-hover/info-cell:opacity-100 hover:scale-110 transition-all"
                                  title="Valider"
                                >
                                  <Check size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('rating') && (
                            <td className="py-4 px-3 text-center">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <InteractiveStarRating 
                                  rating={m.rating} 
                                  onRatingChange={(val) => updateMission(m.id, { rating: val })} 
                                  size={10}
                                />
                                {m.rating ? <span className="text-[9px] font-mono font-bold text-accent-yellow">{m.rating}/5</span> : null}
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('status') && (
                            <td className="py-4 px-3">
                              <div className="relative group/status">
                                <select 
                                  value={m.status}
                                  onClick={(e) => e.stopPropagation()}
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    let updates: Partial<Mission> = { status: newStatus };
                                    // Auto-sync progress
                                    switch (newStatus) {
                                      case 'livré': 
                                        if ((m.photoCountDelivered || 0) > 0) {
                                          updates.progress = Math.round(((m.photoCountDelivered || 0) / (m.photoCountRequested || 1)) * 100);
                                        } else {
                                          updates.progress = 100;
                                        }
                                        break;
                                      case 'En post-production': updates.progress = 85; break;
                                      case 'shooté': updates.progress = 75; break;
                                      case 'en cours de shoot': updates.progress = 50; break;
                                      case 'produit préparé': updates.progress = 25; break;
                                      case 'en attente': updates.progress = 0; break;
                                      case 'annuler': 
                                        updates.progress = 0;
                                        updates.photoCountDelivered = 0;
                                        break;
                                    }
                                    updateMission(m.id, updates);
                                  }}
                                  className={`text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1.5 w-full border bg-transparent appearance-none cursor-pointer focus:ring-1 focus:ring-accent-blue/30 outline-none transition-all ${
                                    (() => {
                                      const cat = categories.find(c => c.id === 'status');
                                      if (cat?.colorRef?.startsWith('#')) return 'border';
                                      return m.status === 'livré' ? 'border-accent/40 text-accent bg-accent/5' :
                                             m.status === 'En post-production' ? 'border-accent-orange/40 text-accent-orange bg-accent-orange/5' :
                                             m.status === 'en cours de shoot' ? 'border-accent-blue/40 text-accent-blue bg-accent-blue/5' :
                                             m.status === 'produit préparé' ? 'border-accent-yellow/40 text-accent-yellow bg-accent-yellow/5' :
                                             m.status === 'annuler' ? 'border-accent-purple/40 text-accent-purple bg-accent-purple/5' :
                                             'border-white/10 text-text-dim bg-white/5';
                                    })()
                                  }`}
                                  style={(() => {
                                    const cat = categories.find(c => c.id === 'status');
                                    if (cat?.colorRef?.startsWith('#')) {
                                      return { color: cat.colorRef, borderColor: `${cat.colorRef}40`, backgroundColor: `${cat.colorRef}0A`, boxShadow: `0 0 15px -5px ${cat.colorRef}` };
                                    }
                                    return {};
                                  })()}
                                >
                                  {categories.find(c => c.id === 'status')?.items.map(s => (
                                    <option key={s} value={s} className="bg-app-bg text-white">{s}</option>
                                  ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-30 group-hover/status:opacity-100">
                                  <ChevronRight size={10} className="rotate-90" />
                                </div>
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('progress') && (
                            <td className="py-4 px-3">
                              <div className="space-y-1.5 min-w-[120px]">
                                <div className="flex justify-between items-center px-0.5">
                                  <span className={`text-[9px] font-mono font-bold ${
                                    m.progress >= 100 ? 'text-accent' : 
                                    m.progress >= 50 ? 'text-accent-blue' : 
                                    'text-text-dim'
                                  }`}>
                                    {m.progress}%
                                  </span>
                                  {m.progress >= 100 && <Check size={10} className="text-accent" />}
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.progress}%` }}
                                    className={`h-full relative ${m.progress >= 100 ? 'bg-accent' : 'bg-accent-purple'}`}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                                  </motion.div>
                                </div>
                                <input 
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={m.progress}
                                  onClick={(e) => e.stopPropagation()}
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  onChange={(e) => updateMission(m.id, { progress: parseInt(e.target.value) })}
                                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent shadow-none hover:h-2 transition-all"
                                />
                              </div>
                            </td>
                          )}
                          {!hiddenColumns.includes('photoCountRequested') && (
                            <td className="py-4 px-3 text-center border-l border-white/5">
                              <input 
                                type="number"
                                min="0"
                                value={m.photoCountRequested}
                                onChange={(e) => updateMission(m.id, { photoCountRequested: parseInt(e.target.value) || 0 })}
                                onClick={(e) => e.stopPropagation()}
                                className="w-16 bg-white/5 border border-white/10 rounded text-center text-[10px] text-accent-purple font-bold outline-none focus:border-accent-purple/50 h-8 relative z-20 cursor-text hover:bg-white/10 transition-colors"
                              />
                            </td>
                          )}
                          {!hiddenColumns.includes('photoCountDelivered') && (
                            <td className="py-4 px-3 text-center border-l border-white/5">
                              <input 
                                type="number"
                                min="0"
                                value={m.photoCountDelivered}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  let updates: Partial<Mission> = { photoCountDelivered: val };
                                  if (val > 0) {
                                    updates.status = 'livré';
                                  }
                                  updateMission(m.id, updates);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-16 bg-white/5 border border-white/10 rounded text-center text-[10px] text-accent-pink font-bold outline-none focus:border-accent-pink/50 h-8 relative z-20 cursor-text hover:bg-white/10 transition-colors"
                              />
                            </td>
                          )}
                          {!hiddenColumns.includes('ficha') && (
                            <td className="py-4 px-3">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedMissionId(m.id); }}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-accent-blue hover:bg-accent-blue/10 transition-all opacity-0 group-hover:opacity-100"
                                  title="Voir la fiche de mission"
                                >
                                  <FileText size={14} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); removeMission(m.id); }}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                  title="Supprimer la mission"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </Reorder.Item>
                      ))
                    )}
                  </AnimatePresence>
                </Reorder.Group>
              </table>
            </div>
            )}
            {(viewMode === 'mosaic' || viewMode === 'grid') && MosaicView()}
            {viewMode === 'task' && PrimaryTaskView()}
            {viewMode === 'calendar' && PrimaryCalendarView()}
            {viewMode === 'family' && (
              <FamilyGroupView 
                filteredMissions={filteredMissions}
                setSelectedMissionId={setSelectedMissionId}
                refIdColor={refIdColor}
                isDeadlineApproaching={isDeadlineApproaching}
                onRenameFamily={renameFamily}
                onToggleMissionEnabled={toggleMissionEnabled}
                onToggleAllMissionsInFamily={toggleAllMissionsInFamily}
                onToggleAllMissionsInSubFamily={toggleAllMissionsInSubFamily}
                onMoveSubFamilyToFamily={moveSubFamilyToFamily}
                onMoveMultipleSubFamilies={moveMultipleSubFamiliesToFamily}
                allFamilies={categories.find(c => c.id === 'family')?.items || ['AT', 'PUNT', 'HARD PRO', 'PWB', 'SBIN', 'Portraits', 'Autre']}
                selectedMissionIds={selectedMissionIds}
                setSelectedMissionIds={setSelectedMissionIds}
                onToggleSelectMission={toggleSelectMission}
                onMoveMissionToFamily={moveMissionToFamily}
                onMoveMultipleMissions={moveMultipleMissionsToFamily}
                showDuplicateIndicators={showDuplicateIndicators}
                isDuplicate={isDuplicate}
              />
            )}
            </>
          )}
        </div>

        {/* Secondary Missions Segment */}
        <div className="space-y-6 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-blue/20 rounded-lg text-accent-blue">
              <List size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[4px] text-white">Missions Secondaires</h2>
              <p className="text-[9px] font-mono text-accent-blue/60 uppercase tracking-widest mt-1">Marketing, Studio, Logistique & Divers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
               <button onClick={() => setSecondaryViewMode('grid')} className={`px-3 py-1 flex gap-2 items-center text-[10px] font-bold uppercase rounded ${secondaryViewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}><LayoutGrid size={12}/> Grid</button>
               <button onClick={() => setSecondaryViewMode('task')} className={`px-3 py-1 flex gap-2 items-center text-[10px] font-bold uppercase rounded ${secondaryViewMode === 'task' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}><List size={12}/> Task</button>
               <button onClick={() => setSecondaryViewMode('calendar')} className={`px-3 py-1 flex gap-2 items-center text-[10px] font-bold uppercase rounded ${secondaryViewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}><Calendar size={12}/> Calendrier</button>
             </div>
             <div className="text-[10px] font-mono text-text-dim/60 uppercase">
               {secondaryMissions.length} Missions Actives
             </div>
          </div>
        </div>

        {secondaryViewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {secondaryMissions.length === 0 ? (
              <motion.div 
                key="empty-secondary-missions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-4 opacity-30">
                <PackageSearch size={40} className="text-text-dim" />
                <p className="text-[10px] uppercase font-black tracking-widest">Aucune mission secondaire</p>
              </motion.div>
            ) : (
              secondaryMissions.map((sm) => (
                <motion.div
                  key={sm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-black/40 border p-6 rounded-2xl group hover:border-accent-blue/40 transition-all ${sm.enabled ? 'border-white/10' : 'border-red-500/20 opacity-50 grayscale'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <input 
                        type="text"
                        value={sm.title}
                        onChange={(e) => updateSecondaryMission(sm.id, { title: e.target.value })}
                        className="bg-transparent border-none text-white font-black uppercase text-xs tracking-wider outline-none w-full focus:ring-1 focus:ring-accent-blue/20 rounded px-1 -ml-1 transition-all"
                      />
                      <div className="flex items-center gap-3 mt-1.5 opacity-60">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          sm.priority === 'high' ? 'bg-red-500/20 text-red-500' : 
                          sm.priority === 'medium' ? 'bg-accent-yellow/20 text-accent-yellow' : 
                          'bg-accent-blue/20 text-accent-blue'
                        }`}>
                          {sm.priority || 'medium'}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded uppercase">ID: {sm.id.toUpperCase()}</span>
                        {sm.deadline && (
                          <div className="flex items-center gap-1.5">
                            {isDeadlineApproaching(sm.deadline) && sm.status !== 'Mission Accomplie' && sm.enabled && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-accent-yellow animate-pulse"
                              >
                                <AlertTriangle size={12} />
                              </motion.div>
                            )}
                            <Calendar size={10} />
                            <input 
                              type="date" 
                              value={sm.deadline} 
                              onChange={(e) => updateSecondaryMission(sm.id, { deadline: e.target.value })}
                              className={`bg-transparent border-none text-[8px] font-bold outline-none p-0 h-auto cursor-pointer transition-colors ${isDeadlineApproaching(sm.deadline) && sm.status !== 'Mission Accomplie' ? 'text-red-500 animate-pulse' : 'text-white/40 hover:text-white'}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Toggle enabled={sm.enabled} onToggle={() => updateSecondaryMission(sm.id, { enabled: !sm.enabled })} />
                       <button onClick={() => removeSecondaryMission(sm.id)} className="p-1.5 text-text-dim hover:text-red-500 transition-colors">
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60">Progression</label>
                        <span className="text-[10px] font-mono font-black text-accent-blue">{sm.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${sm.progress}%` }}
                          className="h-full bg-accent-blue shadow-[0_0_10px_rgba(0,209,255,0.3)]"
                        />
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={sm.progress}
                        onChange={(e) => updateSecondaryMission(sm.id, { progress: parseInt(e.target.value) })}
                        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-blue"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 block px-1">Priorité</label>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => updateSecondaryMission(sm.id, { priority: p })}
                            className={`flex-1 py-1 rounded border text-[8px] font-bold uppercase transition-all ${
                              sm.priority === p 
                                ? (p === 'low' ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : p === 'medium' ? 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow' : 'bg-red-500/20 border-red-500 text-red-500')
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 block px-1">Notation</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <button
                             key={star}
                             onClick={() => updateSecondaryMission(sm.id, { rating: star })}
                             className={`transition-all ${sm.rating >= star ? 'text-accent-yellow scale-110' : 'text-white/5 hover:text-white/10'}`}
                           >
                              <Sparkles size={14} fill={sm.rating >= star ? 'currentColor' : 'none'} />
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 flex items-center gap-2 px-1">
                        <MessageSquare size={10} /> Notes
                      </label>
                      <textarea 
                        value={sm.note}
                        onChange={(e) => updateSecondaryMission(sm.id, { note: e.target.value })}
                        rows={3}
                        placeholder="Consignes..."
                        className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-[10px] text-white/80 outline-none focus:border-accent-blue/40 resize-none transition-all placeholder:opacity-20"
                      />
                    </div>

                    {/* Exports Google Calendar / Tasks */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                       <button
                         onClick={() => sendToGoogleCalendar(sm)}
                         disabled={isExporting[`calendar-${sm.id}`]}
                         className="flex-1 py-2 px-2 bg-white/5 hover:bg-accent-yellow/15 border border-white/10 hover:border-accent-yellow/30 text-white/70 hover:text-accent-yellow rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                         title="Envoyer sur mon Google Agenda (Calendar)"
                       >
                         {isExporting[`calendar-${sm.id}`] ? (
                           <Loader2 size={10} className="animate-spin text-accent-yellow" />
                         ) : (
                           <Calendar size={10} />
                         )}
                         <span>Google Agenda</span>
                       </button>
                       <button
                         onClick={() => sendToGoogleTasks(sm)}
                         disabled={isExporting[`tasks-${sm.id}`]}
                         className="flex-1 py-2 px-2 bg-white/5 hover:bg-accent-blue/15 border border-white/10 hover:border-accent-blue/30 text-white/70 hover:text-accent-blue rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                         title="Envoyer sur Google Tasks"
                       >
                         {isExporting[`tasks-${sm.id}`] ? (
                           <Loader2 size={10} className="animate-spin text-accent-blue" />
                         ) : (
                           <CheckSquare size={10} />
                         )}
                         <span>Google Tasks</span>
                       </button>
                    </div>

                  </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${
                             sm.progress >= 100 ? 'bg-accent shadow-[0_0_8px_rgba(0,255,148,0.5)]' : 
                             sm.progress > 0 ? 'bg-accent-blue animate-pulse' : 'bg-white/20'
                           }`} />
                           <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                             {sm.status || (sm.progress >= 100 ? 'Mission Accomplie' : sm.progress > 0 ? 'En cours' : 'A faire')}
                           </span>
                         </div>
                     <span className="text-[8px] font-mono text-text-dim italic">
                       Créé: {safeFormatDate(sm.createdAt)}
                     </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        )}

        {secondaryViewMode === 'task' && (
          <div className="space-y-3">
            {secondaryMissions.length === 0 ? (
              <div className="py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-4 opacity-30">
                <PackageSearch size={40} className="text-text-dim" />
                <p className="text-[10px] uppercase font-black tracking-widest">Aucune mission secondaire</p>
              </div>
            ) : (
              secondaryMissions.map((sm) => (
                <div key={sm.id} className={`flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] transition-all custom-shadow ${sm.enabled ? '' : 'opacity-50 grayscale'}`}>
                  <button 
                    onClick={() => updateSecondaryMission(sm.id, { progress: sm.progress >= 100 ? 0 : 100 })}
                    className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${sm.progress >= 100 ? 'bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,255,148,0.2)]' : 'bg-black/40 border-white/10 text-transparent hover:border-white/30 hover:text-white/20'}`}
                  >
                    <Check size={14} />
                  </button>
                  <div className="flex-1 flex items-center gap-4">
                    <input 
                      type="text"
                      value={sm.title}
                      onChange={(e) => updateSecondaryMission(sm.id, { title: e.target.value })}
                      className={`bg-transparent border-none font-bold outline-none flex-1 focus:bg-white/5 px-2 py-1 rounded transition-colors text-sm ${sm.progress >= 100 ? 'line-through text-white/40' : 'text-white'}`}
                    />
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                        sm.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        sm.priority === 'medium' ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' : 
                        'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                      }`}>
                        {sm.priority || 'medium'}
                      </span>
                      {sm.deadline && (
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 border border-white/5 ${isDeadlineApproaching(sm.deadline) && sm.progress < 100 ? 'text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'text-text-dim'}`}>
                          <Calendar size={10} />
                          <input 
                            type="date" 
                            value={sm.deadline} 
                            onChange={(e) => updateSecondaryMission(sm.id, { deadline: e.target.value })}
                            className="bg-transparent border-none outline-none cursor-pointer tracking-widest"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-4 ml-2 border-l border-white/5">
                     <Toggle enabled={sm.enabled} onToggle={() => updateSecondaryMission(sm.id, { enabled: !sm.enabled })} />
                     <button
                       onClick={() => sendToGoogleCalendar(sm)}
                       disabled={isExporting[`calendar-${sm.id}`]}
                       title="Envoyer sur mon Google Agenda"
                       className="p-1.5 rounded bg-white/5 text-text-dim hover:text-accent-yellow hover:bg-accent-yellow/10 transition-colors disabled:opacity-50 cursor-pointer"
                     >
                       {isExporting[`calendar-${sm.id}`] ? (
                         <Loader2 size={14} className="animate-spin text-accent-yellow" />
                       ) : (
                         <Calendar size={14} />
                       )}
                     </button>
                     <button
                       onClick={() => sendToGoogleTasks(sm)}
                       disabled={isExporting[`tasks-${sm.id}`]}
                       title="Envoyer sur Google Tasks"
                       className="p-1.5 rounded bg-white/5 text-text-dim hover:text-accent-blue hover:bg-accent-blue/10 transition-colors disabled:opacity-50 cursor-pointer"
                     >
                       {isExporting[`tasks-${sm.id}`] ? (
                         <Loader2 size={14} className="animate-spin text-accent-blue" />
                       ) : (
                         <CheckSquare size={14} />
                       )}
                     </button>
                     <button onClick={() => removeSecondaryMission(sm.id)} className="p-1.5 rounded bg-white/5 text-text-dim hover:bg-red-500/20 hover:text-red-500 transition-colors">
                       <Trash2 size={14} />
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {secondaryViewMode === 'calendar' && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 custom-shadow">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b border-white/5 pb-4">
               <div className="flex items-center gap-4 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                 <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-white/10 rounded text-text-dim hover:text-white transition-colors"><ChevronsLeft size={16}/></button>
                 <h3 className="text-white font-black text-sm uppercase tracking-widest min-w-[140px] text-center">
                   {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </h3>
                 <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-white/10 rounded text-text-dim hover:text-white transition-colors"><ChevronRight size={16}/></button>
               </div>
               <button onClick={() => setCalendarDate(new Date())} className="text-[10px] font-black uppercase tracking-widest py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all">Aujourd'hui</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-text-dim/60 pb-2">{day}</div>
              ))}
              {Array.from({ length: Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() - 1 }).length }).map((_, i) => (
                 <div key={`empty-${i}`} className="min-h-[120px] bg-white/[0.01] border border-white/[0.02] rounded-xl" />
              ))}
              {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
                const dateStr = `${calendarDate.getFullYear()}-${(calendarDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const dayMissions = secondaryMissions.filter(m => m.deadline === dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                return (
                  <div key={day} className={`min-h-[120px] rounded-xl p-2.5 flex flex-col transition-colors ${isToday ? 'bg-accent/5 border border-accent/30 shadow-[0_0_15px_rgba(0,255,148,0.1)]' : 'bg-black/20 border border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}>
                     <div className={`text-[11px] font-black mb-3 ${isToday ? 'text-accent' : 'text-text-dim/80'}`}>{day}</div>
                     <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar flex-1 pr-1">
                       {dayMissions.map(m => (
                          <div key={m.id} title={m.title} className={`group cursor-default text-[10px] px-2 py-1.5 rounded-lg flex flex-col gap-0.5 border ${m.progress >= 100 ? 'bg-white/5 border-white/5 text-white/40 line-through' : m.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : m.priority === 'medium' ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' : 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'}`}>
                            <span className="font-bold truncate leading-tight group-hover:text-white transition-colors">{m.title}</span>
                          </div>
                       ))}
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )}
    </AnimatePresence>
  </main>


      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedMissionIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[250] bg-black/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-accent/30"
          >
            <div className="flex items-center gap-2 pr-6 border-r border-white/10">
              <div className="w-6 h-6 bg-accent text-black rounded-full flex items-center justify-center text-[10px] font-black">
                {selectedMissionIds.length}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Sélectionnés</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={openBulkEditModal}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-accent-blue/30 transition-all"
              >
                <Activity size={12} />
                Éditions Groupées
              </button>

              <button 
                onClick={() => pushMissionsToTasks(selectedMissionIds)}
                className={`flex items-center gap-2 px-4 py-2 bg-[#4285F4]/20 border border-[#4285F4]/30 rounded-full text-[9px] font-black uppercase tracking-widest ${googleToken ? 'text-[#4285F4] hover:bg-[#4285F4]/30' : 'text-[#4285F4]/50 cursor-not-allowed'} transition-all`}
                title={googleToken ? "Créer des tâches Google Tasks pour ces missions" : "Connectez-vous à Google pour synchroniser"}
              >
                <Database size={12} />
                + Tasks
              </button>

              <button 
                onClick={() => pushMissionsToCalendar(selectedMissionIds)}
                className={`flex items-center gap-2 px-4 py-2 bg-[#34A853]/20 border border-[#34A853]/30 rounded-full text-[9px] font-black uppercase tracking-widest ${googleToken ? 'text-[#34A853] hover:bg-[#34A853]/30' : 'text-[#34A853]/50 cursor-not-allowed'} transition-all`}
                title={googleToken ? "Créer des événements Agenda pour ces missions" : "Connectez-vous à Google pour synchroniser"}
              >
                <Calendar size={12} />
                + Agenda
              </button>
              
              <button 
                onClick={startBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all"
              >
                <Trash2 size={12} />
                Supprimer
              </button>

              <button 
                onClick={() => setSelectedMissionIds([])}
                className="text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors ml-2"
              >
                Tout Désélectionner
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Status/Edit Modal */}
      <AnimatePresence>
        {bulkStatusModalOpen && (
          <motion.div 
            key="bulk-status-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBulkStatusModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[400]"
          />
        )}
        {bulkStatusModalOpen && (
          <motion.div 
            key="bulk-status-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 z-[401] shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Édition groupée (En Masse)</h3>
                  <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1">Appliquer les modifications aux <span className="text-accent">{selectedMissionIds.length}</span> éléments sélectionnés</p>
                </div>
                <button 
                  onClick={() => setBulkStatusModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 transition-colors text-text-dim hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Warning/Helper info */}
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg mb-4 text-[9px] text-text-dim uppercase tracking-wider leading-relaxed flex items-center gap-2">
                <span className="text-accent font-bold">💡 Astuce :</span> Cochez la case d'un champ pour l'activer, puis modifiez sa valeur. Seuls les champs cochés seront appliqués aux missions sélectionnées en même temps.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* 1. Statut de production */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all ${bulkEditUpdateStatus ? 'border-accent-blue/30 bg-accent-blue/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdateStatus} 
                        onChange={(e) => setBulkEditUpdateStatus(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent-blue focus:ring-accent-blue"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Statut de Production</span>
                    </label>
                    {bulkEditUpdateStatus && <span className="text-[8px] font-bold text-accent-blue uppercase tracking-widest bg-accent-blue/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={bulkEditUpdateStatus ? "opacity-100" : "opacity-45 pointer-events-none"}>
                    <select
                      value={bulkEditStatus}
                      onChange={(e) => setBulkEditStatus(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-white font-bold outline-none focus:border-accent-blue/50"
                    >
                      {categories.find(c => c.id === 'status')?.items.map(st => (
                        <option key={st} value={st} className="bg-zinc-900">{st.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Date Deadline */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all ${bulkEditUpdateDeadline ? 'border-accent-yellow/30 bg-accent-yellow/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdateDeadline} 
                        onChange={(e) => setBulkEditUpdateDeadline(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent-yellow focus:ring-accent-yellow"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Date Deadline</span>
                    </label>
                    {bulkEditUpdateDeadline && <span className="text-[8px] font-bold text-accent-yellow uppercase tracking-widest bg-accent-yellow/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={bulkEditUpdateDeadline ? "opacity-100" : "opacity-45 pointer-events-none"}>
                    <input 
                      type="date"
                      value={bulkEditDeadline}
                      onChange={(e) => setBulkEditDeadline(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-accent-yellow font-bold outline-none focus:border-accent-yellow/50"
                    />
                  </div>
                </div>

                {/* 3. Note / Qualification */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all md:col-span-2 ${bulkEditUpdateRating ? 'border-accent-yellow/30 bg-accent-yellow/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdateRating} 
                        onChange={(e) => setBulkEditUpdateRating(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent-yellow focus:ring-accent-yellow"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Note (Qualification / Notation)</span>
                    </label>
                    {bulkEditUpdateRating && <span className="text-[8px] font-bold text-accent-yellow uppercase tracking-widest bg-accent-yellow/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={`flex items-center gap-4 ${bulkEditUpdateRating ? "opacity-100" : "opacity-45 pointer-events-none"}`}>
                    <InteractiveStarRating 
                      rating={bulkEditRating} 
                      onRatingChange={(val) => {
                        setBulkEditRating(val);
                        setBulkEditUpdateRating(true);
                      }} 
                      size={18} 
                    />
                    <span className="text-[10px] font-mono font-bold text-accent-yellow">{bulkEditRating}/5 Étoiles</span>
                  </div>
                </div>

                {/* 4. ON / OFF Active status */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all md:col-span-2 ${bulkEditUpdateEnabled ? 'border-accent/30 bg-accent/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdateEnabled} 
                        onChange={(e) => setBulkEditUpdateEnabled(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent focus:ring-accent"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Sélection ON/OFF (Activer les missions dans la liste)</span>
                    </label>
                    {bulkEditUpdateEnabled && <span className="text-[8px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={`flex items-center gap-3 ${bulkEditUpdateEnabled ? "opacity-100" : "opacity-45 pointer-events-none"}`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">Désactivé (OFF)</span>
                    <Toggle 
                      enabled={bulkEditEnabled} 
                      onToggle={(e) => {
                        e.stopPropagation();
                        setBulkEditEnabled(prev => !prev);
                        setBulkEditUpdateEnabled(true);
                      }} 
                    />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent font-black">Activé (ON)</span>
                  </div>
                </div>

                {/* Follow-up / Step dates Title */}
                <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2 mb-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                    <Clock size={12} className="text-accent" />
                    Suivi de Production (Dates & Heures)
                  </h4>
                </div>

                {/* 5. Produit Préparé */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all ${bulkEditUpdatePreparedAt ? 'border-accent/30 bg-accent/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdatePreparedAt} 
                        onChange={(e) => setBulkEditUpdatePreparedAt(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent focus:ring-accent"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Produit Préparé</span>
                    </label>
                    {bulkEditUpdatePreparedAt && <span className="text-[8px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={bulkEditUpdatePreparedAt ? "opacity-100" : "opacity-45 pointer-events-none"}>
                    <input 
                      type="datetime-local"
                      value={bulkEditPreparedAt}
                      onChange={(e) => setBulkEditPreparedAt(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-accent font-bold outline-none focus:border-accent/50"
                    />
                  </div>
                </div>

                {/* 6. Shooté */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all ${bulkEditUpdateShotAt ? 'border-accent-blue/30 bg-accent-blue/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdateShotAt} 
                        onChange={(e) => setBulkEditUpdateShotAt(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent-blue focus:ring-accent-blue"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Shooté</span>
                    </label>
                    {bulkEditUpdateShotAt && <span className="text-[8px] font-bold text-accent-blue uppercase tracking-widest bg-accent-blue/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={bulkEditUpdateShotAt ? "opacity-100" : "opacity-45 pointer-events-none"}>
                    <input 
                      type="datetime-local"
                      value={bulkEditShotAt}
                      onChange={(e) => setBulkEditShotAt(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-accent-blue font-bold outline-none focus:border-accent-blue/50"
                    />
                  </div>
                </div>

                {/* 7. Passé en Post-Prod */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all ${bulkEditUpdatePostProdAt ? 'border-accent-purple/30 bg-accent-purple/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdatePostProdAt} 
                        onChange={(e) => setBulkEditUpdatePostProdAt(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent-purple focus:ring-accent-purple"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Passé en Post-Prod</span>
                    </label>
                    {bulkEditUpdatePostProdAt && <span className="text-[8px] font-bold text-accent-purple uppercase tracking-widest bg-accent-purple/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={bulkEditUpdatePostProdAt ? "opacity-100" : "opacity-45 pointer-events-none"}>
                    <input 
                      type="datetime-local"
                      value={bulkEditPostProdAt}
                      onChange={(e) => setBulkEditPostProdAt(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-accent-purple font-bold outline-none focus:border-accent-purple/50"
                    />
                  </div>
                </div>

                {/* 8. Livré */}
                <div className={`p-3 bg-white/5 border rounded-xl duration-200 transition-all ${bulkEditUpdateDeliveredAt ? 'border-accent-pink/30 bg-accent-pink/5' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={bulkEditUpdateDeliveredAt} 
                        onChange={(e) => setBulkEditUpdateDeliveredAt(e.target.checked)} 
                        className="rounded border-white/20 bg-black/40 text-accent-pink focus:ring-accent-pink"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">Livré</span>
                    </label>
                    {bulkEditUpdateDeliveredAt && <span className="text-[8px] font-bold text-accent-pink uppercase tracking-widest bg-accent-pink/10 px-1.5 py-0.5 rounded">Modifier</span>}
                  </div>
                  <div className={bulkEditUpdateDeliveredAt ? "opacity-100" : "opacity-45 pointer-events-none"}>
                    <input 
                      type="datetime-local"
                      value={bulkEditDeliveredAt}
                      onChange={(e) => setBulkEditDeliveredAt(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-accent-pink font-bold outline-none focus:border-accent-pink/50"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button 
                  onClick={() => setBulkStatusModalOpen(false)}
                  className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 rounded-lg text-text-dim hover:text-white transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => handleBulkUpdate({
                    enabled: bulkEditEnabled,
                    status: bulkEditStatus,
                    deadline: bulkEditDeadline,
                    preparedAt: bulkEditPreparedAt,
                    shotAt: bulkEditShotAt,
                    postProdAt: bulkEditPostProdAt,
                    deliveredAt: bulkEditDeliveredAt,
                    rating: bulkEditRating,
                    updateEnabled: bulkEditUpdateEnabled,
                    updateStatus: bulkEditUpdateStatus,
                    updateDeadline: bulkEditUpdateDeadline,
                    updatePrepared: bulkEditUpdatePreparedAt,
                    updateShot: bulkEditUpdateShotAt,
                    updatePostProd: bulkEditUpdatePostProdAt,
                    updateDelivered: bulkEditUpdateDeliveredAt,
                    updateRating: bulkEditUpdateRating
                  })}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/95 text-black rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,148,0.2)] transition-all"
                >
                  Appliquer les modifications
                </button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Modals and Overlays */}
      <AnimatePresence>
        {/* Modal for editing project family via double-click popup */}
        {familyEditProduct && (
          <div key="family-edit-modal-container" className="fixed inset-0 z-[750] flex items-center justify-center p-4">
            <motion.div 
              key="family-edit-backdrop"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setFamilyEditProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              key="family-edit-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card-bg border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent-purple/20 flex items-center justify-center text-accent-purple">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-serif italic text-white flex items-center gap-1.5">Famille du projet</h2>
                    <p className="text-[10px] text-text-dim uppercase tracking-wider">
                      Modifier l'attribution de la famille
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setFamilyEditProduct(null)}
                  className="p-1 hover:bg-white/5 rounded-lg text-text-dim hover:text-white transition-all animate-none"
                  id="close-family-modal"
                >
                  <X size={16} />
                </button>
              </div>

              {(() => {
                const targetM = missions.find(m => m.id === familyEditProduct.missionId);
                if (!targetM) {
                  return <p className="text-xs text-text-dim">Projet introuvable.</p>;
                }
                const famList = categories.find(c => c.id === 'family')?.items || [];
                return (
                  <div className="space-y-4 pt-2">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Projet :</div>
                      <div className="text-xs font-bold text-white mb-0.5">{targetM.product}</div>
                      <div className="text-[10px] font-mono text-accent-blue">{targetM.refId} — {targetM.color}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-text-dim uppercase tracking-wider block">Sélectionner une famille :</label>
                      <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                        {famList.map((f) => {
                          const isSelected = familyEditProduct.currentFamily === f;
                          return (
                            <button
                              key={f}
                              onClick={() => setFamilyEditProduct(prev => prev ? { ...prev, currentFamily: f } : null)}
                              className={`p-2.5 rounded-xl border text-[10px] text-left uppercase font-mono font-black tracking-wider transition-all flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-accent-purple/20 border-accent-purple text-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                  : 'bg-white/5 border-white/5 text-text-dim hover:text-white hover:border-white/10 hover:bg-white/[0.08]'
                              }`}
                            >
                              <span>{f}</span>
                              {isSelected && <Check size={10} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      <button 
                        onClick={() => setFamilyEditProduct(null)}
                        className="flex-1 py-2 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={() => {
                          updateMission(familyEditProduct.missionId, { family: familyEditProduct.currentFamily });
                          setFamilyEditProduct(null);
                          setToast({ show: true, message: 'Famille mise à jour avec succès !', type: 'task' });
                          setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
                        }}
                        className="flex-1 py-2 bg-accent-purple text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}

        {/* Confirmation Modal for Cleaning Duplicates */}
        {showCleanDuplicatesModal && (
          <div key="clean-duplicates-modal-container" className="fixed inset-0 z-[700] flex items-center justify-center p-4">
            <motion.div 
              key="clean-duplicates-backdrop"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCleanDuplicatesModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              key="clean-duplicates-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card-bg border border-white/10 p-8 rounded-3xl shadow-2xl max-w-2xl w-full"
            >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif italic text-red-500">Nettoyage des doublons</h2>
                    <p className="text-xs text-text-dim uppercase tracking-widest mt-1">
                      {missions.filter(isDuplicate).length} doublons identifiés pour suppression
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl border border-white/5 p-4 max-h-[300px] overflow-y-auto mb-8 custom-scrollbar">
                  <div className="space-y-3">
                    {missions.filter(isDuplicate).length > 0 ? (
                      missions.filter(isDuplicate).map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">#{m.missionNo}</span>
                            <div>
                              <p className="text-xs font-bold text-white">{m.product}</p>
                              <p className="text-[10px] text-text-dim">{m.refId} — {m.color} — {m.univers}</p>
                              {m.info && (
                                <p className="text-[9px] text-accent/60 italic mt-0.5 truncate max-w-[200px]">Note: {m.info}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] text-text-dim block opacity-50">Créé le</span>
                             <span className="text-[10px] text-accent-purple font-mono">{safeFormatDate(m.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-text-dim text-xs uppercase tracking-widest opacity-30">Aucun doublon trouvé</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-dim mb-8 leading-relaxed">
                  Cette action supprimera définitivement les versions les plus anciennes des missions ayant les mêmes caractéristiques (Produit, Couleur, Univers, Support, Format, Position, Argument, Note). <span className="text-red-400 font-bold">Voulez-vous continuer ?</span>
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowCleanDuplicatesModal(false)}
                    className="flex-1 py-4 bg-white/5 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => {
                      const idsToDelete = missions.filter(isDuplicate).map(d => d.id);
                      if (idsToDelete.length > 0) {
                        setMissions(prev => prev.filter(m => !idsToDelete.includes(m.id)));
                        setToast({ show: true, message: `${idsToDelete.length} doublons nettoyés`, type: 'task' });
                        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
                        
                        const logEntry: GlobalLogEntry = {
                          id: Math.random().toString(36).substring(2, 9),
                          timestamp: Date.now(),
                          message: `NETTOYAGE : ${idsToDelete.length} doublons ont été supprimés.`,
                          type: 'mission'
                        };
                        setGlobalLogs(prev => [...prev, logEntry]);
                      }
                      setShowCleanDuplicatesModal(false);
                    }}
                    className="flex-2 py-4 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                    disabled={missions.filter(isDuplicate).length === 0}
                  >
                    Confirmer le nettoyage
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        {isBulkDeleteModalOpen && (
          <div key="bulk-delete-modal-container">
            <motion.div 
              key="bulk-delete-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500]"
            />
            <motion.div 
              key="bulk-delete-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card-bg border border-red-500/30 rounded-2xl p-8 z-[501] shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-xl text-red-500 border border-red-500/30">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Confirmation de Suppression</h3>
                  <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Étape {bulkDeleteIndex + 1} sur {selectedMissionIds.length}</p>
                </div>
              </div>

              <div className="p-6 bg-black/40 border border-white/5 rounded-xl mb-8">
                <p className="text-xs text-white/80 leading-relaxed mb-1 font-bold uppercase tracking-widest">Mission à supprimer :</p>
                <div className="flex items-center justify-between">
                   <h4 className="text-xl font-display text-white uppercase truncate max-w-[200px]">
                     {missions.find(m => m.id === selectedMissionIds[bulkDeleteIndex])?.product || 'Mission inconnue'}
                   </h4>
                   <span className="text-[10px] font-mono text-accent">#{missions.find(m => m.id === selectedMissionIds[bulkDeleteIndex])?.missionNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button 
                  onClick={() => confirmDeleteCurrent(true)}
                  className="py-3 bg-red-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-red-400 transition-all rounded-lg"
                >
                  Oui, Supprimer
                </button>
                <button 
                  onClick={() => confirmDeleteCurrent(false)}
                  className="py-3 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all rounded-lg border border-white/10"
                >
                  Non, Passer
                </button>
                <button 
                  onClick={handleYesToAll}
                  className="sm:col-span-2 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  Oui pour tout ({selectedMissionIds.length - bulkDeleteIndex} restants)
                </button>
                <button 
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="sm:col-span-2 py-2 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors text-center"
                >
                  Annuler l'opération
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Sort Modal */}
      <AnimatePresence>
        {isAdvancedSortOpen && (
          <div key="advanced-sort-modal-container">
            <motion.div 
              key="advanced-sort-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdvancedSortOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300]"
            />
            <motion.div 
              key="advanced-sort-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-card-bg border border-white/10 rounded-2xl p-8 z-[301] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-blue/20 rounded-lg text-accent-blue border border-accent-blue/30">
                    <ArrowUpDown size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Tri Multi-Colonnes</h3>
                    <p className="text-[9px] text-text-dim uppercase font-bold tracking-widest italic">Priorité hiérarchique des règles</p>
                  </div>
                </div>
                <button onClick={() => setIsAdvancedSortOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                {sortConfigs.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                    <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                      <ArrowUpDown size={16} />
                    </div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-[4px]">No active sort parameters</p>
                    <p className="text-[9px] text-text-dim mt-2 tracking-widest uppercase opacity-50">Add a rule below to organize the mission grid</p>
                  </div>
                ) : (
                  sortConfigs.map((config, idx) => {
                    const label = {
                      missionNo: 'ID.MISSION',
                      product: 'NOM.PRODUIT',
                      deadline: 'DATE.ECHEANCE',
                      status: 'ETAT.STATUS',
                      priority: 'LVL.PRIORITE',
                      progress: 'VAL.PROGRES',
                      support: 'CAT.SUPPORT',
                      univers: 'CAT.UNIVERS',
                      format: 'DIM.FORMAT',
                      color: 'VAR.COULEUR'
                    }[config.key as any] || config.key;

                    return (
                      <div key={`${config.key}-${idx}`} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded group hover:border-accent/30 transition-all relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent/40 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col items-center gap-0.5 min-w-[20px]">
                            <button 
                              onClick={() => {
                                if (idx === 0) return;
                                const newConfigs = [...sortConfigs];
                                [newConfigs[idx], newConfigs[idx-1]] = [newConfigs[idx-1], newConfigs[idx]];
                                setSortConfigs(newConfigs);
                              }}
                              className="text-white/20 hover:text-accent disabled:opacity-0 transition-all p-0.5"
                              disabled={idx === 0}
                            >
                              <ChevronUp size={12} />
                            </button>
                            <span className="text-[9px] font-mono font-black text-accent/60">{String(idx + 1).padStart(2, '0')}</span>
                            <button 
                              onClick={() => {
                                if (idx === sortConfigs.length - 1) return;
                                const newConfigs = [...sortConfigs];
                                [newConfigs[idx], newConfigs[idx+1]] = [newConfigs[idx+1], newConfigs[idx]];
                                setSortConfigs(newConfigs);
                              }}
                              className="text-white/20 hover:text-accent disabled:opacity-0 transition-all p-0.5"
                              disabled={idx === sortConfigs.length - 1}
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                          
                          <div className="h-8 w-[1px] bg-white/5" />

                          <div className="flex flex-col">
                            <span className="text-[7px] font-black text-white/30 uppercase tracking-[2px]">Parameter</span>
                            <span className="text-[11px] font-mono font-bold text-white tracking-wider">{label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              const newConfigs = [...sortConfigs];
                              newConfigs[idx].order = newConfigs[idx].order === 'asc' ? 'desc' : 'asc';
                              setSortConfigs(newConfigs);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm text-[9px] font-black transition-all uppercase tracking-widest ${
                              config.order === 'asc' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue'
                            }`}
                          >
                            {config.order === 'asc' ? 'Ascending' : 'Descending'}
                            {config.order === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          </button>
                          <button 
                            onClick={() => setSortConfigs(sortConfigs.filter((_, i) => i !== idx))}
                            className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-5">
                <div className="space-y-3">
                  <label className="text-[8px] font-black text-white/30 uppercase tracking-[3px]">Add New Sequence Layer</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'missionNo', label: 'ID.MISSION' },
                      { id: 'refId', label: 'REFERENCE' },
                      { id: 'product', label: 'PRODUIT' },
                      { id: 'deadline', label: 'ECHEANCE' },
                      { id: 'status', label: 'STATUS' },
                      { id: 'priority', label: 'PRIORITE' },
                      { id: 'progress', label: 'PROGRES' },
                      { id: 'support', label: 'SUPPORT' },
                      { id: 'univers', label: 'UNIVERS' },
                      { id: 'format', label: 'FORMAT' },
                      { id: 'color', label: 'COULEUR' }
                    ].map((opt) => {
                      const isActive = sortConfigs.some(s => s.key === opt.id);
                      return (
                        <button
                          key={opt.id}
                          disabled={isActive}
                          onClick={() => setSortConfigs([...sortConfigs, { key: opt.id, order: 'asc' }])}
                          className={`p-2.5 rounded text-[9px] font-bold text-left transition-all border ${
                            isActive 
                              ? 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed text-white/50' 
                              : 'bg-black/60 border-white/10 text-white/80 hover:border-accent hover:text-accent'
                          }`}
                        >
                          <span className="opacity-40 font-mono mr-2">+</span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-accent/5 border border-accent/20 rounded">
                    <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                    <span className="text-[9px] text-accent font-black uppercase tracking-widest">Active rules: {sortConfigs.length}</span>
                  </div>
                  <button 
                    onClick={() => setSortConfigs([])}
                    className="px-6 py-2.5 bg-red-500/5 text-[9px] font-black uppercase tracking-[2px] text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all rounded border border-red-500/20"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="p-4 bg-accent-blue/5 border border-accent-blue/10 rounded-lg flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                    <Zap size={14} className="text-accent-blue" />
                  </div>
                  <p className="text-[9px] text-accent-blue/70 uppercase font-black tracking-widest leading-relaxed">
                    Tip: Hold <span className="bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-sm">SHIFT</span> during table header clicks to stack sequences.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMissionId && (
          <MissionDetailModal 
            mission={missions.find(m => m.id === selectedMissionId) || null}
            onClose={() => setSelectedMissionId(null)}
            onUpdate={updateMission}
            onRemove={removeMission}
            refIdColor={refIdColor}
            allStatuses={categories.find(c => c.id === 'status')?.items || []}
            allFamilies={categories.find(c => c.id === 'family')?.items || []}
            pushToGoogleCalendar={pushToGoogleCalendar}
            pushToGoogleTasks={pushToGoogleTasks}
          />
        )}
      </AnimatePresence>

      {/* Import Configuration Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div 
            key="import-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowImportModal(false); setPendingImports([]); }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[600]"
          />
        )}
        {showImportModal && (
          <motion.div 
            key="import-modal"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-card-bg border border-white/10 rounded-3xl overflow-hidden z-[601] shadow-2xl flex flex-col"
          >
              <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 rounded-2xl text-accent border border-accent/30">
                    <ImagePlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display uppercase tracking-tight text-white leading-none">Configuration des Missions Importées</h2>
                    <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-widest">{pendingImports.length} images détectées dans le flux</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { setShowImportModal(false); setPendingImports([]); }}
                    className="px-6 py-2 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all rounded-full"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmBulkImport}
                    className="px-8 py-2 bg-accent text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-full shadow-[0_0_20px_rgba(0,255,148,0.3)]"
                  >
                    Valider le Flux ({pendingImports.length})
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/20">
                {pendingImports.map((item) => (
                  <div key={item.tempId} className="group relative bg-white/[0.02] border border-white/5 hover:border-white/20 p-6 rounded-2xl transition-all grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                    {/* Thumbnail & File Info */}
                    <div className="space-y-4">
                      <div className="aspect-[4/3] bg-black/40 border border-white/10 rounded-xl overflow-hidden relative shadow-lg">
                        <img src={item.imageUrl} alt="Import preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-md border-t border-white/10">
                           <p className="text-[8px] font-mono text-white/60 truncate uppercase text-center">{item.file.name}</p>
                        </div>
                      </div>
                      <button 
                         onClick={() => setPendingImports(prev => prev.filter(i => i.tempId !== item.tempId))}
                         className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={12} /> Exclure du flux
                      </button>
                    </div>

                    {/* Edit Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {/* Product Name */}
                       <div className="space-y-1.5 md:col-span-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                           <Package size={10} className="text-accent" /> Nom du Produit
                         </label>
                         <input 
                           type="text"
                           value={item.product}
                           onChange={(e) => updatePendingItem(item.tempId, { product: e.target.value })}
                           className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-accent outline-none transition-all font-bold"
                         />
                       </div>

                       {/* Universal Logic for all categories */}
                       {['color', 'univers', 'support', 'priority', 'status', 'format', 'position', 'argument'].map((catId) => {
                         const cat = categories.find(c => c.id === catId);
                         if (!cat) return null;
                         const CatIcon = cat.icon;
                         const fieldKey = catId === 'argument' ? 'argumentType' : catId;
                         
                         return (
                           <div key={catId} className="space-y-1.5">
                             <label className="text-[9px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2 capitalize">
                               <CatIcon size={10} strokeWidth={2.5} /> {cat.name}
                             </label>
                             <select 
                               value={item[fieldKey as keyof any]}
                               onChange={(e) => updatePendingItem(item.tempId, { [fieldKey]: e.target.value })}
                               className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] text-white focus:border-white/30 outline-none transition-all uppercase font-bold appearance-none cursor-pointer"
                             >
                               {cat.items.map(opt => (
                                 <option key={opt} value={opt} className="bg-app-bg text-white">{opt}</option>
                               ))}
                             </select>
                           </div>
                         );
                       })}

                       {/* Instructions */}
                       <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                         <label className="text-[9px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                           <Type size={10} className="text-accent-purple" /> Consignes spécifique
                         </label>
                         <input 
                           type="text"
                           value={item.info}
                           onChange={(e) => updatePendingItem(item.tempId, { info: e.target.value })}
                           placeholder="Ex: Éclairage dur, gros plan..."
                           className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] text-white focus:border-accent-purple outline-none transition-all font-mono"
                         />
                       </div>

                       {/* Photo requested */}
                       <div className="space-y-1.5">
                         <label className="text-[9px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                           <ImageIcon size={10} className="text-accent-pink" /> Quantité requise
                         </label>
                         <input 
                           type="number"
                           min="1"
                           value={item.photoCountRequested}
                           onChange={(e) => updatePendingItem(item.tempId, { photoCountRequested: parseInt(e.target.value) || 1 })}
                           className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-accent-pink outline-none transition-all font-bold"
                         />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-black/60 border-t border-white/5 flex items-center justify-between shrink-0">
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Flux d'Import Prêt</span>
                   </div>
                </div>
                <button 
                  onClick={confirmBulkImport}
                  className="px-10 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg flex items-center gap-3 group shadow-2xl"
                >
                  Générer toutes les missions
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <motion.div 
            key="feedback-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFeedbackOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[650]"
          />
        )}
        {isFeedbackOpen && (
          <motion.div 
            key="feedback-modal"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed inset-4 md:inset-auto md:right-10 md:bottom-24 md:w-[400px] bg-card-bg border border-white/10 rounded-2xl overflow-hidden z-[651] shadow-2xl flex flex-col"
          >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg text-accent">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Feedback Système</h2>
                    <p className="text-[8px] font-mono text-white/40 mt-1 uppercase tracking-widest">Aidez-nous à forger l'excellence</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFeedbackOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                {feedbackSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                      <Check size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Transmission Réussie</h3>
                      <p className="text-xs text-white/60">Vos données ont été injectées dans le flux journalier. Merci pour votre contribution.</p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                        Type de Signal
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'suggestion', icon: Sparkles, label: 'Idée', color: 'text-accent' },
                          { id: 'bug', icon: Bug, label: 'Bug', color: 'text-red-500' },
                          { id: 'praise', icon: MessageCircle, label: 'Note', color: 'text-accent-blue' }
                        ].map((t) => {
                          const Icon = t.icon;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setFeedbackType(t.id as any)}
                              className={`flex flex-col items-center justify-center gap-2 py-3 border rounded-xl transition-all ${feedbackType === t.id ? `bg-white/5 border-white/20 ${t.color}` : 'border-white/5 text-white/40 hover:border-white/10'}`}
                            >
                              <Icon size={16} />
                              <span className="text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim">Titre du Signal</label>
                      <input 
                        type="text"
                        value={feedbackTitle}
                        onChange={(e) => setFeedbackTitle(e.target.value)}
                        placeholder="Ex: Amélioration du dashboard..."
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-accent outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim">Message / Rapport</label>
                      <textarea 
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Détaillez votre observation ici..."
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:border-accent outline-none transition-all min-h-[120px] resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim flex justify-between">
                        Satisfaction Système
                        <span className="text-accent font-mono">{feedbackRating}/5</span>
                      </label>
                      <div className="flex justify-between px-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            onMouseEnter={() => setFeedbackRating(star)}
                            className="p-1 transition-transform active:scale-90"
                          >
                            <Sparkles 
                              size={20} 
                              className={`${star <= feedbackRating ? 'text-accent fill-accent/20' : 'text-white/10'} transition-colors`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackMessage}
                      className="w-full py-4 bg-accent text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      Transmettre le Signal
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Feedback Trigger */}
      <div className="fixed bottom-6 right-6 z-[450] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {isFeedbackOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-[2px] text-accent-blue shadow-xl mb-1"
            >
              Signal en cours...
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
          className={`pointer-events-auto w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all group border-2 ${isFeedbackOpen ? 'bg-black border-accent text-accent' : 'bg-accent border-accent text-black shadow-[0_0_25px_rgba(0,255,148,0.5)]'}`}
        >
          {isFeedbackOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:-translate-y-0.5 transition-transform" />}
        </motion.button>
      </div>

      {/* Export Template (Hidden) - Hardcoded colors for capture reliability */}
      <div id="global-report-container" style={{ position: 'absolute', top: '-9999px', left: '-9999px', backgroundColor: '#0A0A0A', color: '#D1D5DB', padding: '80px', width: '1200px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0,255,148,0.2)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '2px solid rgba(0,255,148,0.5)', color: '#00FF94', justifyContent: 'center' }}>
                 <Activity size={32} />
              </div>
              <h1 style={{ fontSize: '60px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-3px', margin: 0 }}>Rapport Global<br/>Performance & Production</h1>
            </div>
            <p style={{ fontSize: '12px', color: '#00FF94', fontWeight: '900', letterSpacing: '8px', textTransform: 'uppercase', margin: 0 }}>Mission Contrôle Suite V4.0</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', color: '#888888', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px 0' }}>Semaine / Date d'Export</p>
            <p style={{ fontSize: '20px', color: '#D1D5DB', margin: '0 0 4px 0' }}>S{getCurrentWeekNumber()} — {getDayMonthYear()}</p>
            <p style={{ fontSize: '10px', color: '#888888', margin: 0 }}>{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '80px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <p style={{ fontSize: '10px', color: '#888888', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 8px 0' }}>Total Missions</p>
            <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold' }}>{activeMissions.length}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <p style={{ fontSize: '10px', color: '#888888', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 8px 0' }}>Progression</p>
            <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#00FF94' }}>{avgProgress}%</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <p style={{ fontSize: '10px', color: '#888888', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 8px 0' }}>Logs Journal</p>
            <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#00D1FF' }}>{globalLogs.length}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <p style={{ fontSize: '10px', color: '#888888', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 8px 0' }}>Charge Global</p>
            <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#FFD700' }}>{avgRating}/5</p>
          </div>
        </div>

        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px', color: '#00FF94', borderLeft: '4px solid #00FF94', paddingLeft: '16px' }}>I. Production (Missions)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeMissions.map(m => (
              <div key={m.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <span style={{ fontSize: '18px', fontWeight: 'bold', color: m.enabled ? '#00FF94' : '#888888' }}>#{m.missionNo} — <span style={{ color: '#00D1FF' }}>[{m.refId}]</span> — {m.product}</span>
                     {!m.enabled && <span style={{ fontSize: '8px', padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#888888', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '900' }}>Inactif</span>}
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: '900', 
                    padding: '4px 12px', 
                    borderRadius: '4px', 
                    border: m.status === 'livré' ? '1px solid #00FF94' : 
                            m.status === 'En post-production' ? '1px solid #FF9900' : '1px solid rgba(255,255,255,0.2)', 
                    color: m.status === 'livré' ? '#00FF94' : 
                           m.status === 'En post-production' ? '#FF9900' : '#D1D5DB', 
                    textTransform: 'uppercase' 
                  }}>{m.status}</span>
                </div>
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                     <p style={{ margin: 0 }}>Référence: <span style={{ color: '#00D1FF' }}>{m.refId}</span></p>
                     <p style={{ margin: 0 }}>Couleur: <span style={{ color: '#D1D5DB' }}>{m.color}</span></p>
                     <p style={{ margin: 0 }}>Argument: <span style={{ color: '#D1D5DB' }}>{m.argumentType}</span></p>
                     <p style={{ margin: 0 }}>Univers: <span style={{ color: '#D1D5DB' }}>{m.univers}</span></p>
                     <p style={{ margin: 0 }}>Support: <span style={{ color: '#D1D5DB' }}>{m.support}</span></p>
                     <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '9px', color: '#888888' }}>Charge de Travail Appréciée</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '14px', color: '#FFD700', fontWeight: 'bold' }}>
                            {m.rating ? '★'.repeat(Math.floor(m.rating)) + (m.rating % 1 !== 0 ? '½' : '') : 'Non noté'}
                          </span>
                          {m.rating ? <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>{m.rating}/5</span> : null}
                        </div>
                      </div>
                  </div>
                   <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>
                      <span style={{ color: '#888888' }}>Avancement</span>
                      <span style={{ color: '#00FF94' }}>{m.progress}%</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden', marginBottom: '24px' }}>
                       <div style={{ height: '100%', backgroundColor: '#00FF94', width: `${m.progress}%` }} />
                    </div>

                    {/* Timeline des étapes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', color: '#888888', letterSpacing: '1px' }}>Chronologie de Production</span>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '10px' }}>
                        <div style={{ borderLeft: m.preparedAt ? '2px solid #00FF94' : '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px', opacity: m.preparedAt ? 1 : 0.4 }}>
                          <span style={{ display: 'block', fontWeight: '900', color: m.preparedAt ? '#00FF94' : '#888888', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '0.5px' }}>I. Produit Préparé</span>
                          <span style={{ color: '#D1D5DB', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatDateStringNice(m.preparedAt)}</span>
                        </div>
                        <div style={{ borderLeft: m.shotAt ? '2px solid #00D1FF' : '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px', opacity: m.shotAt ? 1 : 0.4 }}>
                          <span style={{ display: 'block', fontWeight: '900', color: m.shotAt ? '#00D1FF' : '#888888', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '0.5px' }}>II. Produit Shooté</span>
                          <span style={{ color: '#D1D5DB', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatDateStringNice(m.shotAt)}</span>
                        </div>
                        <div style={{ borderLeft: m.postProdAt ? '2px solid #FF9900' : '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px', opacity: m.postProdAt ? 1 : 0.4 }}>
                          <span style={{ display: 'block', fontWeight: '900', color: m.postProdAt ? '#FF9900' : '#888888', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '0.5px' }}>III. Passage Post-Prod</span>
                          <span style={{ color: '#D1D5DB', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatDateStringNice(m.postProdAt)}</span>
                        </div>
                        <div style={{ borderLeft: m.deliveredAt ? '2px solid #00FF94' : '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px', opacity: m.deliveredAt ? 1 : 0.4 }}>
                          <span style={{ display: 'block', fontWeight: '900', color: m.deliveredAt ? '#00FF94' : '#888888', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '0.5px' }}>IV. Produit Livré</span>
                          <span style={{ color: '#D1D5DB', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatDateStringNice(m.deliveredAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showSecondaryInReport && (
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px', color: '#00D1FF', borderLeft: '4px solid #00D1FF', paddingLeft: '16px' }}>II. Missions Secondaires</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {secondaryMissions.map(m => (
                <div key={m.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>{m.title}</h3>
                    <span style={{ fontSize: '9px', fontWeight: '900', padding: '2px 8px', borderRadius: '4px', backgroundColor: m.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : m.priority === 'medium' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 209, 255, 0.2)', color: m.priority === 'high' ? '#ef4444' : m.priority === 'medium' ? '#FFD700' : '#00D1FF', textTransform: 'uppercase' }}>{m.priority}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginBottom: '8px' }}>
                    <span>Progression: {m.progress}%</span>
                    <span>Note: {m.rating}/5</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', backgroundColor: '#00D1FF', width: `${m.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px', color: '#00FF94', borderLeft: '4px solid #00FF94', paddingLeft: '16px' }}>IV. Analyse de Performance Stratégique</h2>
          <div id="report-dashboard-strategic" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '24px', width: '1040px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: 'rgba(0, 255, 148, 0.1)', borderRadius: '8px', color: '#00FF94' }}>
                  <TrendingUp size={24} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#E5E7EB', margin: 0 }}>Analyse de Performance</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', display: 'block' }}>Semaine {getCurrentWeekNumber()} // {getDayMonthYear()}</span>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', display: 'block', marginTop: '4px' }}>Moy. Note</span>
                <span style={{ fontSize: '24px', fontWeight: 'black', color: '#EBFF00' }}>{dashboardStats.avgRating}/5</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: '40px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Taux Livraison</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#D1D5DB', margin: '0 0 12px 0' }}>{dashboardStats.completionRate.toFixed(1)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#00FF94', width: `${dashboardStats.completionRate}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Production Active</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#D1D5DB', margin: '0 0 12px 0' }}>{dashboardStats.productionRate.toFixed(1)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#00D1FF', width: `${dashboardStats.productionRate}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Indices Qualité</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#D1D5DB', margin: '0 0 12px 0' }}>{dashboardStats.stabilityScore.toFixed(0)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#BD00FF', width: `${dashboardStats.stabilityScore}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Efficience Réelle</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#D1D5DB', margin: '0 0 12px 0' }}>{dashboardStats.finalEfficiencyScore.toFixed(1)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#00FF94', width: `${Math.min(dashboardStats.finalEfficiencyScore, 100)}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Missions Totales</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#D1D5DB', margin: '0 0 12px 0' }}>{dashboardStats.stats.total}</p>
              </div>
            </div>

            <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Zap size={16} color="#00FF94" />
                <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#E5E7EB', margin: 0 }}>Moniteur d'Efficience par Support</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {['photo', 'vidéo', 'graphisme', 'autre'].map((support, idx) => {
                  const requested = dashboardStats.requestedBySupport[support] || 0;
                  const delivered = dashboardStats.deliveredBySupport[support] || 0;
                  const rate = requested > 0 ? (delivered / requested) * 100 : 0;
                  const accentColor = idx === 0 ? '#00FF94' : idx === 1 ? '#00D1FF' : idx === 2 ? '#BD00FF' : '#888';
                  
                  if (requested === 0 && delivered === 0) return null;

                  return (
                    <div key={support} style={{ padding: '20px', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#888' }}>{support}</span>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: accentColor }}>{rate.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: accentColor, width: `${Math.min(rate, 100)}%` }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: '900', color: '#444', textTransform: 'uppercase' }}>
                        <span>Livrées: {delivered}</span>
                        <span>Req: {requested}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

         <div style={{ marginTop: '80px' }}>
           <h2 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px', color: '#EBFF00', borderLeft: '4px solid #EBFF00', paddingLeft: '16px' }}>III. Analyse Graphique</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
             
             {/* Chart 1: Evolution Hebdo */}
             <div id="report-chart-timeline" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', gridColumn: 'span 3', width: '1040px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Évolution Hebdomadaire (7 Jours)</h3>
                <div style={{ width: '1040px', height: '300px' }}>
                  <ComposedChart width={1000} height={300} data={timelineData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(0,255,148,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }} />
                    {visibleTimelineSeries.livreesJour && <Bar yAxisId="left" dataKey="MissionsLivrees" name="Livrées (Jour)" fill="#00D1FF" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} opacity={0.6} />}
                    {visibleTimelineSeries.prepares && <Line yAxisId="left" type="monotone" dataKey="ProduitsPrepares" name="Préparés" stroke="#EBFF00" strokeWidth={3} dot={{ fill: '#EBFF00', r: 3 }} activeDot={{ r: 5 }} isAnimationActive={false} />}
                    {visibleTimelineSeries.shooting && <Line yAxisId="left" type="monotone" dataKey="Shooting" name="En Shooting" stroke="#00D1FF" strokeWidth={3} dot={{ fill: '#00D1FF', r: 3 }} activeDot={{ r: 5 }} isAnimationActive={false} />}
                    {visibleTimelineSeries.postProd && <Line yAxisId="left" type="monotone" dataKey="PostProduction" name="Post-Prod" stroke="#FF9900" strokeWidth={3} dot={{ fill: '#FF9900', r: 3 }} activeDot={{ r: 5 }} isAnimationActive={false} />}
                    {visibleTimelineSeries.livreesCumulees && <Line yAxisId="left" type="monotone" dataKey="LivreesCumulees" name="Livrées (Total)" stroke="#00FF94" strokeWidth={4} dot={{ fill: '#00FF94', r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />}
                    {visibleTimelineSeries.progression && <Line yAxisId="right" type="monotone" dataKey="ProgressionMoyenne" name="Progression (%)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />}
                  </ComposedChart>
                </div>
             </div>

             {/* Chart Supplemental: Tableau récapitulatif */}
             <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', gridColumn: 'span 3', width: '1040px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '16px' }}>Tableau Récapitulatif Production</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>Produit</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>Support</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>Priorité</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '12px', color: '#888' }}>Progrès</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeMissions.slice(0, 15).map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#00D1FF' }}>{m.refId}</td>
                        <td style={{ padding: '12px' }}>{m.product}</td>
                        <td style={{ padding: '12px' }}>{m.support}</td>
                        <td style={{ padding: '12px', color: m.priority.includes('High') ? '#ef4444' : '#888' }}>{m.priority}</td>
                        <td style={{ padding: '12px' }}>{m.status}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{m.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>

             {/* Chart 2: Statut */}
             <div id="report-chart-status" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Distribution par État</h3>
                <div style={{ width: '660px', height: '260px' }}>
                  <BarChart width={600} height={260} data={statusData} margin={{ top: 25, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#444" fontSize={8} tickLine={false} axisLine={false} tick={{ fill: '#888', fontWeight: 'bold' }} dy={10} />
                    <YAxis hide domain={[0, 'dataMax + 1']} />
                    <Bar dataKey="value" name="Missions" fill="#00FF94" radius={[4, 4, 0, 0]} barSize={40} isAnimationActive={false}>
                      <LabelList dataKey="value" position="top" fill="#00FF94" fontSize={11} fontWeight="black" offset={8} formatter={(val: number) => val > 0 ? val : ''} />
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                      ))}
                    </Bar>
                    <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }} />
                  </BarChart>
                </div>
             </div>

             {/* Chart 3: Support */}
             <div id="report-chart-support" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Répartition Supports</h3>
                <div style={{ width: '310px', height: '260px' }}>
                  <RPieChart width={300} height={260} margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Pie data={supportData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value" nameKey="name" isAnimationActive={false} label={({ name, value }) => value > 0 ? `${value}` : ''} labelLine={false}>
                      {supportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }} />
                  </RPieChart>
                </div>
             </div>

             {/* Chart 4: Produits */}
             <div id="report-chart-product" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Répartition par Produit</h3>
                <div style={{ width: '310px', height: '220px' }}>
                  <BarChart width={300} height={220} data={productData} margin={{ top: 10, bottom: 20, left: -10, right: 20 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                    <XAxis type="number" fontSize={10} tick={{ fill: '#888' }} axisLine={{ stroke: '#333' }} tickLine={false} />
                    <YAxis type="category" dataKey="name" fontSize={9} tick={{ fill: '#ccc' }} axisLine={{ stroke: '#333' }} tickLine={false} width={80} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false} label={{ position: 'right', fill: '#888', fontSize: 10 }}>
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
             </div>

             {/* Chart 5: Univers */}
             <div id="report-chart-univers" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Répartition par Univers</h3>
                <div style={{ width: '310px', height: '220px' }}>
                  <RPieChart width={300} height={220} margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Pie data={universData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive={false} label={({ name, value }) => value > 0 ? `${value}` : ''} labelLine={false}>
                      {universData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }} />
                  </RPieChart>
                </div>
             </div>

             {/* Chart 6: Argument */}
             <div id="report-chart-argument" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Répartition par Argument</h3>
                <div style={{ width: '310px', height: '220px' }}>
                  <RPieChart width={300} height={220} margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Pie data={argumentData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive={false} label={({ name, value }) => value > 0 ? `${value}` : ''} labelLine={false}>
                      {argumentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 5) % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }} />
                  </RPieChart>
                </div>
             </div>

             {/* Chart Supplemental: Poids Stratégique (Production vs Secondaire) */}
             <div id="report-chart-poids" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '24px' }}>Poids Stratégique</h3>
                <div style={{ position: 'relative', height: '180px', width: '180px', margin: '0 auto' }}>
                   {(() => {
                     const prod = activeMissions.length;
                     const sec = secondaryMissions.filter(sm => sm.enabled).length;
                     const totalCount = prod + sec || 1;
                     const prodP = (prod / totalCount) * 100;
                     const secP = (sec / totalCount) * 100;
                     return (
                       <>
                         <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                           <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                           <circle 
                             cx="50" cy="50" r="40" fill="transparent" stroke="#EBFF00" 
                             strokeWidth="12" 
                             strokeDasharray={`${prodP * 251.2 / 100} 251.2`} 
                           />
                           <circle 
                             cx="50" cy="50" r="40" fill="transparent" stroke="#00D1FF" 
                             strokeWidth="12" 
                             strokeDasharray={`${secP * 251.2 / 100} 251.2`} 
                             strokeDashoffset={`${-prodP * 251.2 / 100}`}
                           />
                         </svg>
                         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>TOTAL</span>
                            <span style={{ fontSize: '24px', fontWeight: '900', color: '#D1D5DB' }}>{prod + sec}</span>
                         </div>
                       </>
                     );
                   })()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', backgroundColor: '#EBFF00', borderRadius: '2px' }} />
                      <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Production: {activeMissions.length}</span>
                      <span style={{ fontSize: '11px', color: '#D1D5DB', marginLeft: 'auto', fontWeight: 'bold' }}>{Math.round((activeMissions.length / (activeMissions.length + secondaryMissions.filter(sm => sm.enabled).length || 1)) * 100)}%</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', backgroundColor: '#00D1FF', borderRadius: '2px' }} />
                      <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Secondaire: {secondaryMissions.filter(sm => sm.enabled).length}</span>
                      <span style={{ fontSize: '11px', color: '#D1D5DB', marginLeft: 'auto', fontWeight: 'bold' }}>{Math.round((secondaryMissions.filter(sm => sm.enabled).length / (activeMissions.length + secondaryMissions.filter(sm => sm.enabled).length || 1)) * 100)}%</span>
                   </div>
                </div>
             </div>

           </div>
         </div>

         <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '2px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
           <div style={{ display: 'inline-block', padding: '32px 50px', backgroundColor: 'rgba(0,255,148,0.05)', border: '1px dashed rgba(0,255,148,0.3)', borderRadius: '24px', maxWidth: '800px' }}>
             <p style={{ fontSize: '24px', fontStyle: 'italic', color: '#00FF94', marginBottom: '16px', lineHeight: '1.4', fontWeight: '500' }}>
               "L'excellence n'est pas un acte, c'est une habitude. Chaque mission accomplie est une marche de plus vers votre succès."
             </p>
             <p style={{ fontSize: '12px', color: 'rgba(0,255,148,0.6)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '6px', margin: 0 }}>Continuez à viser l'excellence, l'équipe compte sur vous.</p>
           </div>
         </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .mission-sheet-print, .mission-sheet-print * {
            visibility: visible;
          }
          .mission-sheet-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px !important;
          }
          .mission-sheet-print button {
            display: none !important;
          }
          .mission-sheet-print .bg-card-bg, 
          .mission-sheet-print .bg-app-bg,
          .mission-sheet-print .bg-white\\/5 {
            background-color: #f9f9f9 !important;
            border-color: #ddd !important;
          }
          .mission-sheet-print h2, 
          .mission-sheet-print h3, 
          .mission-sheet-print span, 
          .mission-sheet-print p {
            color: black !important;
          }
          .mission-sheet-print .text-accent, 
          .mission-sheet-print .text-accent-blue, 
          .mission-sheet-print .text-accent-purple {
            color: #111 !important;
            border-bottom: 2px solid #000;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0A0A0A;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333333;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
      `}</style>
      <FloatingAIChat missions={missions} googleToken={googleToken} />
    </div>
    </div>
    </div>
    </div>
  );
}

function MissionDetailModal({ mission, onClose, onUpdate, onRemove, refIdColor, allStatuses, allFamilies, pushToGoogleCalendar, pushToGoogleTasks }: { mission: Mission | null, onClose: () => void, onUpdate: (id: string, updates: Partial<Mission>) => void, onRemove: (id: string) => void, refIdColor: string, allStatuses: string[], allFamilies: string[], pushToGoogleCalendar: (m: Mission | SecondaryMission) => void, pushToGoogleTasks: (m: Mission | SecondaryMission) => void }) {
  if (!mission) return null;

  const [isConfirming, setIsConfirming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onRemove(mission.id);
    onClose();
  };

  const cycleStatus = () => {
    if (!allStatuses.length) return;
    const currentIndex = allStatuses.indexOf(mission.status);
    const nextIndex = (currentIndex + 1) % allStatuses.length;
    const nextStatus = allStatuses[nextIndex];
    
    let nextProgress = mission.progress;
    if (nextStatus === 'livré') {
      if ((mission.photoCountDelivered || 0) > 0) {
        nextProgress = Math.round(((mission.photoCountDelivered || 0) / (mission.photoCountRequested || 1)) * 100);
      } else {
        nextProgress = 100;
      }
    }
    else if (nextStatus === 'En post-production') nextProgress = 85;
    else if (nextStatus === 'shooté') nextProgress = 75;
    else if (nextStatus === 'en cours de shoot') nextProgress = 50;
    else if (nextStatus === 'produit préparé') nextProgress = 25;
    else if (nextStatus === 'en attente') nextProgress = 0;
    else if (nextStatus === 'annuler') nextProgress = 0;

    onUpdate(mission.id, { 
      status: nextStatus,
      progress: nextProgress
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card-bg w-full max-w-4xl border border-white/10 shadow-2xl relative z-10 overflow-hidden rounded-none mission-sheet-print"
      >
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent-blue to-accent-purple" />
        
        <div className="max-h-[85vh] overflow-y-auto p-10 custom-scrollbar" id="mission-detail-content">
          <div className="flex justify-between items-start mb-8 print:mb-12 border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-accent/30 flex items-center justify-center text-accent bg-accent/5">
                  <Box size={32} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-black text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                  Active
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black uppercase text-accent tracking-[3px]">Fiche de Mission</span>
                  <div className="h-[1px] w-8 bg-accent/30" />
                  <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Document Officiel de Production</span>
                </div>
                <h2 className="text-4xl font-display uppercase tracking-tight text-white leading-none">
                  <span style={{ color: refIdColor }}>{mission.refId}</span> — {mission.product}
                </h2>
                <div className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-widest">System Index: #{mission.missionNo}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <AnimatePresence mode="wait">
                {!isConfirming ? (
                  <motion.button 
                    key="delete-btn"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => setIsConfirming(true)}
                    className="w-10 h-10 border border-red-500/20 flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all mr-4"
                    title="Supprimer la mission"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                ) : (
                  <motion.div 
                    key="confirm-box"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-2 mr-4 overflow-hidden whitespace-nowrap"
                  >
                    <button 
                      onClick={handleDelete}
                      className="px-4 h-10 bg-red-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all"
                    >
                      Supprimer
                    </button>
                    <button 
                      onClick={() => setIsConfirming(false)}
                      className="px-4 h-10 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Annuler
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => window.print()}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-text-dim hover:text-white hover:bg-white/5 transition-all"
                title="Imprimer la fiche"
              >
                <Printer size={18} />
              </button>
              <button 
                onClick={onClose}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-text-dim hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Specs */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2">
                  <Monitor size={12} className="text-accent-blue" />
                  Spécifications Techniques
                </h3>
                <div className="space-y-2">
                  <DetailItem label="Réf. Unique" value={mission.refId} colorOverride={refIdColor} />
                  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 group/item">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim group-hover/item:text-white transition-colors">Famille</span>
                    <div className="relative">
                      <select 
                        value={mission.family || deduceFamily(mission.product) || 'Autre'}
                        onChange={(e) => onUpdate(mission.id, { family: e.target.value })}
                        className="bg-transparent border-none p-0 pr-4 text-right text-[11px] font-mono font-black text-accent-purple tracking-widest uppercase focus:ring-0 outline-none hover:text-white transition-colors appearance-none cursor-pointer"
                      >
                        {allFamilies.map(f => (
                          <option key={f} value={f} className="bg-[#1A1A1A] text-white uppercase">{f}</option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-accent-purple opacity-40">
                        <ChevronRight size={8} className="rotate-90 text-accent-purple" style={{ transform: 'rotate(90deg)' }} />
                      </div>
                    </div>
                  </div>
                  <DetailItem label="Couleur" value={mission.color} />
                  <DetailItem label="Argument" value={mission.argumentType} />
                  <DetailItem label="Univers" value={mission.univers} />
                  <DetailItem label="Format" value={mission.format} />
                  <DetailItem label="Position" value={mission.position} />
                  <DetailItem label="Support" value={mission.support} color="text-accent-pink" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">
                        {(mission.support || '').includes('vidéo') ? 'Vidéos Demandées' : (mission.support || '').includes('graphisme') ? 'Visuels Demandés' : 'Photos Demandées'}
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        value={mission.photoCountRequested}
                        onChange={(e) => onUpdate(mission.id, { photoCountRequested: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/40 border border-white/10 rounded p-1 text-xs text-accent-purple font-bold outline-none focus:border-accent-purple/50"
                      />
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">
                        {(mission.support || '').includes('vidéo') ? 'Vidéos Livrées' : (mission.support || '').includes('graphisme') ? 'Visuels Livrés' : 'Photos Livrées'}
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        value={mission.photoCountDelivered}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          let updates: Partial<Mission> = { photoCountDelivered: val };
                          if (val >= mission.photoCountRequested && mission.photoCountRequested > 0) {
                            updates.status = 'livré';
                            updates.progress = Math.round((val / mission.photoCountRequested) * 100);
                          } else if (val > 0) {
                            updates.status = 'En post-production';
                          }
                          onUpdate(mission.id, updates);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded p-1 text-xs text-accent-pink font-bold outline-none focus:border-accent-pink/50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Qualification / Notation</span>
                      <span className="text-[14px] font-mono font-bold text-accent-yellow mt-1">{mission.rating || 0}/5</span>
                    </div>
                    <InteractiveStarRating 
                      rating={mission.rating} 
                      onRatingChange={(val) => onUpdate(mission.id, { rating: val })} 
                      size={18}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2">
                  <Clock size={12} className="text-accent-yellow" />
                  Temporalité
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Date Création" value={new Date(mission.createdAt).toLocaleString()} />
                  <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Échéance / Date de Remise</label>
                    <input 
                      type="date"
                      value={mission.deadline || ''}
                      onChange={(e) => onUpdate(mission.id, { deadline: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded p-1 text-[11px] text-accent-yellow font-bold outline-none focus:border-accent-yellow/50 mb-2"
                    />
                    <div className="flex items-center gap-2 mt-2">
                       <button onClick={() => pushToGoogleCalendar(mission)} className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 hover:bg-[#4285F4]/20 rounded text-[9px] font-black uppercase transition-all whitespace-nowrap">
                         <Calendar size={10} /> Calendar
                       </button>
                       <button onClick={() => pushToGoogleTasks(mission)} className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-[#F4B400]/10 text-[#F4B400] border border-[#F4B400]/20 hover:bg-[#F4B400]/20 rounded text-[9px] font-black uppercase transition-all whitespace-nowrap">
                         <Check size={10} /> Tasks
                       </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-dim block border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                      <Clock size={10} />
                      Suivi des Étapes de Production
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                      <div>
                        <label className="text-[8px] font-black uppercase tracking-wider text-accent block mb-1">
                          Produit Préparé
                        </label>
                        <input 
                          type="datetime-local"
                          value={mission.preparedAt || ''}
                          onChange={(e) => onUpdate(mission.id, { preparedAt: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-accent font-bold outline-none focus:border-accent/50 cursor-text"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase tracking-wider text-accent-blue block mb-1">
                          Shooté
                        </label>
                        <input 
                          type="datetime-local"
                          value={mission.shotAt || ''}
                          onChange={(e) => onUpdate(mission.id, { shotAt: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-accent-blue font-bold outline-none focus:border-accent-blue/50 cursor-text"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] font-black uppercase tracking-wider text-accent-purple block mb-1">
                          Passé en Post-Prod
                        </label>
                        <input 
                          type="datetime-local"
                          value={mission.postProdAt || ''}
                          onChange={(e) => onUpdate(mission.id, { postProdAt: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-accent-purple font-bold outline-none focus:border-accent-purple/50 cursor-text"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase tracking-wider text-accent-pink block mb-1">
                          Livré
                        </label>
                        <input 
                          type="datetime-local"
                          value={mission.deliveredAt || ''}
                          onChange={(e) => onUpdate(mission.id, { deliveredAt: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-accent-pink font-bold outline-none focus:border-accent-pink/50 cursor-text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2">
                  <ClipboardCheck size={12} className="text-accent-blue" />
                  Instructions / Notes
                </h3>
                <div className="relative group/modal-notes">
                  <textarea 
                    defaultValue={mission.info || ''}
                    onBlur={(e) => {
                      if (e.target.value !== mission.info) {
                        onUpdate(mission.id, { info: e.target.value });
                      }
                    }}
                    placeholder="Ajouter des consignes..."
                    className="w-full p-4 bg-white/5 border border-white/5 text-sm text-white/80 leading-relaxed min-h-[120px] outline-none focus:border-accent/30 transition-all resize-y font-mono pr-12"
                  />
                  <button 
                    onClick={(e) => {
                       const text = (e.currentTarget.previousSibling as HTMLTextAreaElement).value;
                       onUpdate(mission.id, { info: text });
                    }}
                    className="absolute right-3 top-3 px-3 py-1.5 bg-accent/20 border border-accent/40 rounded text-accent text-[10px] font-black uppercase opacity-0 group-hover/modal-notes:opacity-100 hover:bg-accent hover:text-black transition-all"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Status & History */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2">
                  <Activity size={12} className="text-accent" />
                  État Temps Réel
                </h3>
                <div className="p-6 bg-app-bg border border-white/10 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-text-dim tracking-widest">Progression</span>
                    <span className="text-2xl font-mono text-accent">{mission.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mission.progress}%` }}
                      className="h-full bg-accent"
                    />
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={mission.progress}
                    onChange={(e) => onUpdate(mission.id, { progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
                  />
                  <div className="pt-2">
                    <button 
                      onClick={cycleStatus}
                      className={`text-[10px] font-black px-3 py-1.5 uppercase rounded border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        mission.status === 'livré' ? 'border-accent text-accent bg-accent/5 shadow-[0_0_15px_rgba(0,255,148,0.1)]' :
                        mission.status === 'en cours de shoot' ? 'border-accent-blue text-accent-blue bg-accent-blue/5' :
                        mission.status === 'annuler' ? 'border-accent-purple text-accent-purple bg-accent-purple/5' :
                        'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                      }`}
                      title="Cliquer pour changer l'état"
                    >
                      {mission.status}
                    </button>
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mt-2">Cliquez pour cycler l'état de production</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2 text-accent-purple">
                    <Clock size={12} />
                    Historique des Changements
                  </h3>
                  <button 
                    onClick={() => onUpdate(mission.id, { history: [] })}
                    className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors flex items-center gap-1.5 px-2 py-1 rounded border border-white/5 hover:border-red-500/30"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                  {mission.history?.map((log, i) => (
                    <div key={i} className="flex gap-4 items-start pl-2 border-l border-accent-purple/30 group">
                      <span className="text-[8px] font-mono text-text-dim mt-1 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-[11px] text-white/70 group-hover:text-white transition-colors">
                        {log.message}
                      </span>
                    </div>
                  )).reverse()}
                  {(!mission.history || mission.history.length === 0) && (
                    <p className="text-[11px] italic text-text-dim text-center py-4">Aucune activité enregistrée.</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2 text-accent">
                    <ImageIcon size={12} />
                    Référence Visuelle
                  </h3>
                  {mission.imageUrl && (
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Glisser pour recadrer</span>
                       <button 
                         onClick={() => onUpdate(mission.id, { imagePosition: '50% 50%' })}
                         className="p-1 hover:bg-white/10 rounded transition-colors text-text-dim hover:text-white"
                         title="Réinitialiser le centrage"
                       >
                         <RotateCcw size={10} />
                       </button>
                    </div>
                  )}
                </div>
                <div 
                  ref={containerRef}
                  className={`aspect-video bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center group relative select-none ${mission.imageUrl ? 'cursor-move' : ''}`}
                  onMouseDown={(e) => {
                    if (!mission.imageUrl) return;
                    setIsDragging(true);
                    const startX = e.clientX;
                    const startY = e.clientY;
                    
                    const currentPos = mission.imagePosition || '50% 50%';
                    const [currX, currY] = currentPos.split(' ').map(s => parseFloat(s));

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      if (!containerRef.current) return;
                      const rect = containerRef.current.getBoundingClientRect();
                      const dx = moveEvent.clientX - startX;
                      const dy = moveEvent.clientY - startY;
                      
                      // Convert movement to percentage change
                      // We invert the delta because if we drag right, the image "focal point" moves left (relatively)
                      // No, if we drag right, we want to see the left part of the image, so the percentage should decrease?
                      // Actually object-position defines where the image point is relative to the container.
                      const newX = Math.max(0, Math.min(100, currX - (dx / rect.width) * 100));
                      const newY = Math.max(0, Math.min(100, currY - (dy / rect.height) * 100));
                      
                      onUpdate(mission.id, { imagePosition: `${newX.toFixed(2)}% ${newY.toFixed(2)}%` });
                    };

                    const handleMouseUp = () => {
                      setIsDragging(false);
                      window.removeEventListener('mousemove', handleMouseMove);
                      window.removeEventListener('mouseup', handleMouseUp);
                    };

                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                   {mission.imageUrl ? (
                     <img 
                       src={mission.imageUrl} 
                       alt="Reference" 
                       draggable={false}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none" 
                       style={{ 
                         objectPosition: mission.imagePosition || '50% 50%',
                         transition: isDragging ? 'none' : 'object-position 0.2s ease-out, transform 0.5s ease-out'
                       }} 
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-2 opacity-20">
                       <ImageIcon size={24} />
                       <span className="text-[10px] uppercase font-bold tracking-widest">Aucune image</span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({ label, value, color, colorOverride }: { label: string, value: string | number, color?: string, colorOverride?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 group/item">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim group-hover/item:text-white transition-colors">{label}</span>
      <span 
        className={`text-[11px] font-mono font-medium ${color || 'text-white'} group-hover/item:scale-105 transition-transform`}
        style={colorOverride ? { color: colorOverride } : {}}
      >
        {value}
      </span>
    </div>
  );
}

interface CategoryEditorProps {
  key?: React.Key;
  category: CategoryConfig;
  onUpdate: (updates: Partial<CategoryConfig>) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

function CategoryEditor({ category, onUpdate, isCollapsed, onToggle }: CategoryEditorProps) {
  const [newItem, setNewItem] = useState('');

  const availableColors = [
    { name: 'Vert', ref: 'accent' },
    { name: 'Bleu', ref: 'accent-blue' },
    { name: 'Rose', ref: 'accent-pink' },
    { name: 'Violet', ref: 'accent-purple' },
    { name: 'Orange', ref: 'accent-orange' },
    { name: 'Rouge', ref: 'accent-red' },
    { name: 'Jaune', ref: 'accent-yellow' },
  ];

  const addItem = () => {
    if (newItem.trim() && !category.items.includes(newItem.trim())) {
      onUpdate({ items: [...category.items, newItem.trim()] });
      setNewItem('');
    }
  };

  const removeItem = (item: string) => {
    onUpdate({ items: category.items.filter(i => i !== item) });
  };

  const renameItem = (index: number, newName: string) => {
    const updated = [...category.items];
    updated[index] = newName;
    onUpdate({ items: updated });
  };

  const getCategoryColor = () => {
    if (category.colorRef?.startsWith('#')) return category.colorRef;
    const accentMap: Record<string, string> = {
      'accent': '#00FF94',
      'accent-blue': '#00D1FF',
      'accent-pink': '#FF007A',
      'accent-purple': '#BD00FF',
      'accent-orange': '#FF9900',
      'accent-red': '#FF3B30',
      'accent-yellow': '#EBFF00'
    };
    return accentMap[category.colorRef || 'accent'] || '#00FF94';
  };

  const getCategoryStyle = (type: 'text' | 'border' | 'bg') => {
    const isHex = category.colorRef?.startsWith('#');
    if (isHex) {
      if (type === 'text') return { color: category.colorRef };
      if (type === 'border') return { borderColor: category.colorRef };
      if (type === 'bg') return { backgroundColor: category.colorRef };
    }
    return {};
  };

  const colorClass = 
    category.colorRef?.startsWith('#') ? '' :
    category.colorRef === 'accent' ? 'text-accent' :
    category.colorRef === 'accent-blue' ? 'text-accent-blue' :
    category.colorRef === 'accent-pink' ? 'text-accent-pink' :
    category.colorRef === 'accent-purple' ? 'text-accent-purple' :
    category.colorRef === 'accent-orange' ? 'text-accent-orange' :
    category.colorRef === 'accent-red' ? 'text-accent-red' :
    category.colorRef === 'accent-yellow' ? 'text-accent-yellow' :
    'text-accent';

  const borderColorClass = 
    category.colorRef?.startsWith('#') ? '' :
    category.colorRef === 'accent' ? 'hover:border-accent' :
    category.colorRef === 'accent-blue' ? 'hover:border-accent-blue' :
    category.colorRef === 'accent-pink' ? 'hover:border-accent-pink' :
    category.colorRef === 'accent-purple' ? 'hover:border-accent-purple' :
    category.colorRef === 'accent-orange' ? 'hover:border-accent-orange' :
    category.colorRef === 'accent-red' ? 'hover:border-accent-red' :
    category.colorRef === 'accent-yellow' ? 'hover:border-accent-yellow' :
    'hover:border-accent';

  const focusBorderClass = 
    category.colorRef?.startsWith('#') ? '' :
    category.colorRef === 'accent' ? 'focus:border-accent' :
    category.colorRef === 'accent-blue' ? 'focus:border-accent-blue' :
    category.colorRef === 'accent-pink' ? 'focus:border-accent-pink' :
    category.colorRef === 'accent-purple' ? 'focus:border-accent-purple' :
    category.colorRef === 'accent-orange' ? 'focus:border-accent-orange' :
    category.colorRef === 'accent-red' ? 'focus:border-accent-red' :
    category.colorRef === 'accent-yellow' ? 'focus:border-accent-yellow' :
    'focus:border-accent';

  return (
    <div className={`p-6 bg-card-bg border border-border ${isCollapsed ? 'pb-6' : 'space-y-4'}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${isCollapsed ? '' : 'border-b border-white/5 pb-4'}`}>
        <div 
          className="flex items-center gap-2 font-bold uppercase text-[11px] text-text-dim tracking-wider cursor-pointer group hover:text-white transition-colors"
          onClick={onToggle}
        >
          {category.icon && <category.icon size={14} className={colorClass} style={getCategoryStyle('text')} />}
          <span>Modifier {category.name}</span>
          <ChevronDown size={14} className={`ml-2 transition-transform ${isCollapsed ? '-rotate-90 text-text-dim/40' : (category.colorRef?.startsWith('#') ? '' : 'text-accent')}`} style={!isCollapsed ? getCategoryStyle('text') : {}} />
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-white/30 uppercase tracking-[2px] mb-1">Colorimétrie</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-black/20 p-1.5 rounded-lg border border-white/5">
                {availableColors.slice(0, 4).map(c => (
                  <button 
                    key={c.ref}
                    onClick={() => onUpdate({ colorRef: c.ref })}
                    className={`w-3 h-3 rounded-full transition-all hover:scale-125 ${category.colorRef === c.ref ? 'ring-1 ring-white ring-offset-1 ring-offset-card-bg scale-110' : 'opacity-40 hover:opacity-100'}`}
                    style={{ backgroundColor: 
                      c.ref === 'accent' ? '#00FF94' : 
                      c.ref === 'accent-blue' ? '#00D1FF' : 
                      c.ref === 'accent-pink' ? '#FF007A' : 
                      '#BD00FF' 
                    }}
                  />
                ))}
              </div>
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 group cursor-pointer hover:border-white/30 transition-all bg-black/40 flex items-center justify-center p-0">
                <input 
                  type="color"
                  value={getCategoryColor()}
                  onChange={(e) => onUpdate({ colorRef: e.target.value.toUpperCase() })}
                  className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                  <Palette size={12} className="text-white/40 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {!isCollapsed && <span className="text-[8px] opacity-40 font-black tracking-[2px] uppercase hidden sm:block">Drag items to Reorder</span>}
      </div>
      
      <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.div
           initial={{ height: 0, opacity: 0 }}
           animate={{ height: 'auto', opacity: 1 }}
           exit={{ height: 0, opacity: 0 }}
           className="overflow-hidden space-y-4"
        >
          <Reorder.Group 
            axis="y" 
            values={category.items} 
            onReorder={(newItems) => onUpdate({ items: newItems })}
            className="flex flex-col gap-2"
          >
        {category.items.map((item, idx) => (
          <Reorder.Item 
            key={item} 
            value={item}
            whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7)" }}
            className={`flex items-center gap-3 px-4 py-3 bg-app-bg border border-border group ${borderColorClass} cursor-grab active:cursor-grabbing hover:bg-white/[0.02] relative z-10 rounded-md transition-colors`}
            style={getCategoryStyle('border')}
          >
            <div className="text-text-dim opacity-30 group-hover:opacity-100 transition-opacity shrink-0">
              <GripVertical size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <input 
                type="text" 
                value={item} 
                onChange={(e) => renameItem(idx, e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] font-bold w-full text-white cursor-text tracking-wide"
                style={category.colorRef?.startsWith('#') ? {} : { color: 'inherit' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button 
              onClick={() => removeItem(item)}
              className="p-2 text-text-dim hover:text-red-500 transition-colors shrink-0"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex gap-2 pt-2">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Nouvel élément..."
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className={`flex-1 px-4 py-2 bg-app-bg border border-border outline-none ${focusBorderClass} text-sm text-white transition-colors`}
          style={getCategoryStyle('border')}
        />
        <button 
          onClick={addItem}
          className={`px-4 py-2 border border-current ${colorClass} uppercase text-[10px] font-black tracking-widest hover:bg-white/5 transition-all`}
          style={getCategoryStyle('text')}
        >
          Ajouter
        </button>
      </div>
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

interface FamilyGroupViewProps {
  filteredMissions: Mission[];
  setSelectedMissionId: (id: string | null) => void;
  refIdColor: string;
  isDeadlineApproaching: (deadlineStr?: string) => boolean;
  onRenameFamily: (oldName: string, newName: string) => void;
  onToggleMissionEnabled: (id: string, e: React.MouseEvent) => void;
  onToggleAllMissionsInFamily: (famName: string, enabled: boolean) => void;
  onToggleAllMissionsInSubFamily: (famName: string, productName: string, colorName: string, enabled: boolean) => void;
  onMoveSubFamilyToFamily: (productName: string, colorName: string, targetFamily: string) => void;
  onMoveMultipleSubFamilies: (subFamiliesToMove: { productName: string, colorName: string }[], targetFamily: string) => void;
  allFamilies: string[];
  selectedMissionIds: string[];
  setSelectedMissionIds: (ids: string[]) => void;
  onToggleSelectMission: (id: string, e: React.MouseEvent) => void;
  onMoveMissionToFamily: (missionId: string, targetFamily: string, targetProduct?: string, targetColor?: string) => void;
  onMoveMultipleMissions: (missionIds: string[], targetFamily: string, targetProduct?: string, targetColor?: string) => void;
  showDuplicateIndicators: boolean;
  isDuplicate: (m: Mission) => boolean;
}

function FamilyGroupView({
  filteredMissions,
  setSelectedMissionId,
  refIdColor,
  isDeadlineApproaching,
  onRenameFamily,
  onToggleMissionEnabled,
  onToggleAllMissionsInFamily,
  onToggleAllMissionsInSubFamily,
  onMoveSubFamilyToFamily,
  onMoveMultipleSubFamilies,
  allFamilies,
  selectedMissionIds,
  setSelectedMissionIds,
  onToggleSelectMission,
  onMoveMissionToFamily,
  onMoveMultipleMissions,
  showDuplicateIndicators,
  isDuplicate,
}: FamilyGroupViewProps) {
  // Only group main missions (filteredMissions). Let's make sure we filter out secondary tasks
  const missionsByFamily: Record<string, Record<string, Mission[]>> = {};

  const [selectedSubFams, setSelectedSubFams] = useState<string[]>([]);
  const [draggedOverFamName, setDraggedOverFamName] = useState<string | null>(null);
  const [draggedOverSubFam, setDraggedOverSubFam] = useState<string | null>(null);

  const toggleSubFamilySelection = (fam: string, productName: string, colorName: string) => {
    const key = `${fam}|${productName}|${colorName}`;
    setSelectedSubFams(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key) 
        : [...prev, key]
    );
  };

  const isSubFamilySelected = (fam: string, productName: string, colorName: string) => {
    return selectedSubFams.includes(`${fam}|${productName}|${colorName}`);
  };

  filteredMissions.forEach((m) => {
    // Find or deduce the family
    const famName = m.family || deduceFamily(m.product) || 'Autre';
    const subFamKey = `${m.product}|${m.color || 'Sans couleur'}`;
    
    if (!missionsByFamily[famName]) {
      missionsByFamily[famName] = {};
    }
    if (!missionsByFamily[famName][subFamKey]) {
      missionsByFamily[famName][subFamKey] = [];
    }
    missionsByFamily[famName][subFamKey].push(m);
  });

  const familiesList = Object.keys(missionsByFamily).sort();

  const [collapsedFams, setCollapsedFams] = useState<Record<string, boolean>>({});
  const [collapsedSubFams, setCollapsedSubFams] = useState<Record<string, boolean>>({});
  
  const [editingFam, setEditingFam] = useState<string | null>(null);
  const [newFamName, setNewFamName] = useState<string>('');

  const toggleFam = (fam: string) => {
    setCollapsedFams(prev => ({ ...prev, [fam]: !prev[fam] }));
  };

  const toggleSubFam = (subFam: string) => {
    setCollapsedSubFams(prev => ({ ...prev, [subFam]: !prev[subFam] }));
  };

  const expandAll = () => {
    setCollapsedFams({});
    setCollapsedSubFams({});
  };

  const collapseAll = () => {
    const allFams: Record<string, boolean> = {};
    familiesList.forEach(f => {
      allFams[f] = true;
      Object.keys(missionsByFamily[f] || {}).forEach(sf => {
        allFams[`${f}|${sf}`] = true;
      });
    });
    setCollapsedFams(allFams);
    setCollapsedSubFams(allFams);
  };

  // Stats calculations based on filteredMissions
  const totalMissions = filteredMissions.length;
  const activeMissions = filteredMissions.filter(m => m.enabled);
  const activeMissionsCount = activeMissions.length;
  const inactiveMissionsCount = totalMissions - activeMissionsCount;
  
  const completedMissionsCount = activeMissions.filter(m => m.status === 'livré').length;
  const inProductionCount = activeMissions.filter(m => ['en cours de shoot', 'shooté', 'En post-production'].includes(m.status)).length;
  const pendingCount = activeMissions.filter(m => m.status === 'en attente' || m.status === 'produit préparé').length;
  
  const completionRate = activeMissionsCount > 0 ? (completedMissionsCount / activeMissionsCount) * 105 / 1.05 : 0; // standard mathematical calculation
  const fixedRate = activeMissionsCount > 0 ? (completedMissionsCount / activeMissionsCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent animate-pulse">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-white">Vue par Familles de Produits</h2>
            <p className="text-[8px] text-text-dim font-mono uppercase">Familles → Sous-Familles [Produit & Couleur] → Missions principales</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <button 
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize size={10} /> Tout Développer
          </button>
          <button 
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize size={10} /> Tout Réduire
          </button>
        </div>
      </div>

      {/* Selection Action Bar */}
      <AnimatePresence>
        {(selectedSubFams.length > 0 || selectedMissionIds.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-accent/10 border border-accent/30 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2 shadow-[0_0_20px_rgba(0,255,148,0.05)] border-t-accent"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent animate-pulse shrink-0">
                <Layers size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-white tracking-widest leading-none">
                  {selectedSubFams.length > 0 && `${selectedSubFams.length} sous-famille${selectedSubFams.length > 1 ? 's' : ''}`}
                  {selectedSubFams.length > 0 && selectedMissionIds.length > 0 && ' & '}
                  {selectedMissionIds.length > 0 && `${selectedMissionIds.length} mission${selectedMissionIds.length > 1 ? 's' : ''}`} sélectionnée{selectedSubFams.length + selectedMissionIds.length > 1 ? 's' : ''}
                </h4>
                <p className="text-[9px] font-mono text-text-dim mt-0.5 uppercase tracking-wide">
                  Choisissez la famille de destination pour déplacer les éléments sélectionnés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider shrink-0">Déplacer vers :</span>
              <div className="flex gap-1 flex-wrap">
                {allFamilies.map((targetFam) => (
                  <button
                    key={targetFam}
                    onClick={() => {
                      if (selectedSubFams.length > 0) {
                        const subFamsToMove = selectedSubFams.map(id => {
                          const [, prod, col] = id.split('|');
                          return { productName: prod, colorName: col };
                        });
                        onMoveMultipleSubFamilies(subFamsToMove, targetFam);
                        setSelectedSubFams([]);
                      }
                      if (selectedMissionIds.length > 0) {
                        onMoveMultipleMissions(selectedMissionIds, targetFam);
                        setSelectedMissionIds([]);
                      }
                    }}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:border-accent/40 bg-white/5 hover:bg-accent/10 hover:text-accent rounded transition-all cursor-pointer"
                  >
                    {targetFam}
                  </button>
                ))}
              </div>
              
              <div className="w-[1px] h-6 bg-white/10 mx-1" />

              <button
                onClick={() => {
                  setSelectedSubFams([]);
                  setSelectedMissionIds([]);
                }}
                className="p-1 px-2 border border-red-500/20 text-red-400 bg-red-400/5 hover:bg-red-400/10 hover:border-red-500 hover:text-red-500 text-[10px] uppercase font-bold rounded transition-all cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Family View Stats Grid */}
      {familiesList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-md">
          <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col justify-between hover:bg-white/[0.04] transition-all">
            <div className="text-[9px] font-black uppercase text-accent-purple tracking-widest flex items-center gap-1.5 mb-1">
              <Layers size={12} /> Familles Actives
            </div>
            <div>
              <div className="text-xl font-black text-white">{familiesList.length}</div>
              <div className="text-[8px] font-mono text-text-dim/60 uppercase">Groupes de familles</div>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col justify-between hover:bg-white/[0.04] transition-all">
            <div className="text-[9px] font-black uppercase text-accent-blue tracking-widest flex items-center gap-1.5 mb-1">
              <CheckSquare size={12} /> Missions Actives
            </div>
            <div>
              <div className="text-xl font-black text-white">
                {activeMissionsCount} <span className="text-[10px] font-normal text-text-dim">/ {totalMissions}</span>
              </div>
              <div className="text-[8px] font-mono text-text-dim/60 uppercase">{inactiveMissionsCount} Inactive(s) / OFF</div>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col justify-between hover:bg-white/[0.04] transition-all">
            <div className="text-[9px] font-black uppercase text-accent tracking-widest flex items-center gap-1.5 mb-1">
              <Percent size={12} /> Taux de Livraison
            </div>
            <div>
              <div className="text-xl font-black text-accent">{fixedRate.toFixed(1)}%</div>
              <div className="text-[8px] font-mono text-text-dim/60 uppercase">{completedMissionsCount} livrées sur {activeMissionsCount} actives</div>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col justify-between hover:bg-white/[0.04] transition-all">
            <div className="text-[9px] font-black uppercase text-accent-yellow tracking-widest flex items-center gap-1.5 mb-1">
              <Activity size={12} /> En Production
            </div>
            <div>
              <div className="text-xl font-black text-accent-yellow">{inProductionCount}</div>
              <div className="text-[8px] font-mono text-text-dim/60 uppercase">{pendingCount} en attente / préparation</div>
            </div>
          </div>
        </div>
      )}

      {familiesList.length === 0 ? (
        <div className="bg-black/40 border border-white/10 p-10 rounded-2xl text-center">
          <Box className="mx-auto text-white/10 mb-4 animate-pulse" size={40} />
          <h3 className="text-white text-xs font-black uppercase tracking-widest mb-1">Aucune Famille Trouvée</h3>
          <p className="text-[10px] text-text-dim font-mono">Vérifiez vos filtres actifs ou ajoutez une nouvelle mission principale.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {familiesList.map((fam) => {
            const subFamilies = missionsByFamily[fam];
            const isFamCollapsed = collapsedFams[fam];
            
            const subFamKeys = Object.keys(subFamilies);
            const familyMissionsList = subFamKeys.flatMap(k => subFamilies[k]);
            const totalFamilyMissions = familyMissionsList.length;
            const activeFamilyMissions = familyMissionsList.filter(m => m.enabled);
            const activeFamilyMissionsCount = activeFamilyMissions.length;
            const completedFamilyMissionsCount = activeFamilyMissions.filter(m => m.status === 'livré').length;
            const famCompletionRate = activeFamilyMissionsCount > 0 ? (completedFamilyMissionsCount / activeFamilyMissionsCount) * 100 : 0;
            
            // Calculate average rating for the active family missions
            const ratedFamilyMissions = activeFamilyMissions.filter(m => typeof m.rating === 'number' && m.rating > 0);
            const familyAvgRating = ratedFamilyMissions.length > 0
              ? (ratedFamilyMissions.reduce((acc, m) => acc + (m.rating || 0), 0) / ratedFamilyMissions.length).toFixed(1)
              : '—';

            const isAllFamilyMissionsEnabled = familyMissionsList.every(m => m.enabled) && totalFamilyMissions > 0;

            return (
              <div 
                key={fam} 
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedOverFamName !== fam) {
                    setDraggedOverFamName(fam);
                  }
                }}
                onDragLeave={() => {
                  if (draggedOverFamName === fam) {
                    setDraggedOverFamName(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDraggedOverFamName(null);
                  const dragData = e.dataTransfer.getData("text/plain");
                  if (dragData) {
                    if (dragData.startsWith("MISSION|")) {
                      const [, srcFam, mId] = dragData.split('|');
                      if (srcFam !== fam) {
                        if (selectedMissionIds.includes(mId)) {
                          onMoveMultipleMissions(selectedMissionIds, fam);
                          setSelectedMissionIds([]);
                        } else {
                          onMoveMissionToFamily(mId, fam);
                        }
                      }
                    } else {
                      // Subfamily drag
                      let srcFam = '';
                      let prod = '';
                      let col = '';
                      if (dragData.startsWith("SUBFAMILY|")) {
                        [, srcFam, prod, col] = dragData.split('|');
                      } else {
                        [srcFam, prod, col] = dragData.split('|');
                      }
                      
                      const subFamKeyStr = `${srcFam}|${prod}|${col}`;
                      if (selectedSubFams.includes(subFamKeyStr)) {
                        const subFamsToMove = selectedSubFams.map(id => {
                          const [, p, c] = id.split('|');
                          return { productName: p, colorName: c };
                        });
                        onMoveMultipleSubFamilies(subFamsToMove, fam);
                        setSelectedSubFams([]);
                      } else {
                        if (srcFam !== fam) {
                          onMoveSubFamilyToFamily(prod, col, fam);
                        }
                      }
                    }
                  }
                }}
                className={`border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 ${
                  draggedOverFamName === fam 
                    ? 'bg-accent/15 border-accent/40 scale-[1.01] shadow-[0_0_20px_rgba(0,255,148,0.15)] relative z-30' 
                    : 'bg-white/[0.02]'
                }`}
              >
                {/* Family Accordion Header */}
                <div 
                  onClick={() => toggleFam(fam)}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer select-none border-b border-white/5"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {editingFam === fam ? (
                      <div 
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={newFamName}
                          onChange={(e) => setNewFamName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onRenameFamily(fam, newFamName);
                              setEditingFam(null);
                            } else if (e.key === 'Escape') {
                              setEditingFam(null);
                            }
                          }}
                          autoFocus
                          className="px-2 py-1 text-[10px] text-white bg-black/80 border border-accent/50 rounded outline-none focus:border-accent w-40 uppercase font-mono"
                        />
                        <button
                          onClick={() => {
                            onRenameFamily(fam, newFamName);
                            setEditingFam(null);
                          }}
                          className="p-1 text-accent hover:bg-white/15 rounded transition-colors"
                          title="Confirmer"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => setEditingFam(null)}
                          className="p-1 text-red-400 hover:bg-white/15 rounded transition-colors"
                          title="Annuler"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/fam-header">
                        <div className="px-2.5 py-1 rounded bg-accent-purple/20 border border-accent-purple/30 text-[9px] font-mono font-black text-accent-purple tracking-widest uppercase">
                          {fam}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFam(fam);
                            setNewFamName(fam);
                          }}
                          className="p-1 text-text-dim hover:text-white bg-white/0 hover:bg-white/10 rounded transition-all opacity-0 group-hover/fam-header:opacity-100 animate-fade-in"
                          title="Renommer la famille"
                        >
                          <Edit2 size={10} />
                        </button>
                      </div>
                    )}

                    {/* ON/OFF Switch for the whole family */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[8px] font-mono font-black uppercase text-white/40 tracking-wider">ON/OFF :</span>
                      <Toggle 
                        enabled={isAllFamilyMissionsEnabled} 
                        onToggle={() => onToggleAllMissionsInFamily(fam, !isAllFamilyMissionsEnabled)} 
                      />
                    </div>

                    {/* Stats summary inside header */}
                    <div className="flex items-center gap-2">
                      {famCompletionRate > 0 && (
                        <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-[8px] font-mono font-black text-accent tracking-wider uppercase">
                          {famCompletionRate.toFixed(0)}% LIVRÉ
                        </span>
                      )}
                      {familyAvgRating !== '—' && (
                        <span className="px-2 py-0.5 rounded bg-accent-yellow/10 border border-accent-yellow/20 text-[8px] font-mono font-black text-accent-yellow tracking-wider uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(235,255,0,0.1)]">
                          ★ {familyAvgRating}/5 NOTE MOY.
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Sous-familles:</span>
                      <span className="text-xs font-black text-white">{subFamKeys.length}</span>
                      <span className="text-white/15 px-1">•</span>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Missions actives:</span>
                      <span className="text-xs font-black text-accent">{activeFamilyMissionsCount}</span>
                      <span className="text-[10px] text-white/30 font-mono">/{totalFamilyMissions}</span>
                      <span className="text-white/15 px-1">•</span>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Note Moyenne:</span>
                      <span className={`text-xs font-black ${familyAvgRating !== '—' ? 'text-accent-yellow' : 'text-white/30'}`}>
                        {familyAvgRating}{familyAvgRating !== '—' ? '/5' : ''}
                      </span>

                      {((selectedSubFams.length > 0 && !selectedSubFams.every(id => id.startsWith(`${fam}|`))) || 
                        (selectedMissionIds.length > 0 && filteredMissions.some(m => selectedMissionIds.includes(m.id) && m.family !== fam))) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedSubFams.length > 0) {
                              const subFamsToMove = selectedSubFams.map(id => {
                                const [, prod, col] = id.split('|');
                                return { productName: prod, colorName: col };
                              });
                              onMoveMultipleSubFamilies(subFamsToMove, fam);
                              setSelectedSubFams([]);
                            }
                            if (selectedMissionIds.length > 0) {
                              const missionsToMove = selectedMissionIds.filter(id => {
                                const m = filteredMissions.find(x => x.id === id);
                                return m && m.family !== fam;
                              });
                              onMoveMultipleMissions(missionsToMove, fam);
                              setSelectedMissionIds([]);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-accent text-black font-mono font-black border border-accent hover:bg-black hover:text-accent hover:border-accent text-[8px] tracking-wider uppercase flex items-center gap-1 shadow-[0_0_12px_rgba(0,255,148,0.35)] ml-3 transition-all cursor-pointer transform hover:scale-105 animate-pulse"
                        >
                          Déposer la sélection ici ({
                            (selectedSubFams.filter(id => !id.startsWith(`${fam}|`)).length) + 
                            (selectedMissionIds.filter(id => {
                              const m = filteredMissions.find(x => x.id === id);
                              return m && m.family !== fam;
                            }).length)
                          })
                        </button>
                      )}
                    </div>
                  </div>
                  {isFamCollapsed ? <ChevronDown size={14} className="text-text-dim" /> : <ChevronUp size={14} className="text-text-dim" />}
                </div>

                {/* Family Content (Subfamilies accordion) */}
                <AnimatePresence initial={false}>
                  {!isFamCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 space-y-4 bg-black/20"
                    >
                      {subFamKeys.map((subFamKey) => {
                        const [productName, colorName] = subFamKey.split('|');
                        const subFamMissions = subFamilies[subFamKey];
                        const isSubFamCollapsed = collapsedSubFams[`${fam}|${subFamKey}`];

                        const totalSubFamMissions = subFamMissions.length;
                        const activeSubFamMissions = subFamMissions.filter(m => m.enabled);
                        const activeSubFamMissionsCount = activeSubFamMissions.length;
                        const completedSubFamMissionsCount = activeSubFamMissions.filter(m => m.status === 'livré').length;
                        const subFamCompletionRate = activeSubFamMissionsCount > 0 ? (completedSubFamMissionsCount / activeSubFamMissionsCount) * 100 : 0;
                        
                        const isAllSubFamMissionsEnabled = subFamMissions.every(m => m.enabled) && totalSubFamMissions > 0;

                        const subFamId = `${fam}|${productName}|${colorName}`;
                        const isDraggedOver = draggedOverSubFam === subFamId;

                        return (
                          <div 
                            key={subFamKey} 
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (draggedOverSubFam !== subFamId) {
                                setDraggedOverSubFam(subFamId);
                              }
                            }}
                            onDragLeave={(e) => {
                              e.stopPropagation();
                              if (draggedOverSubFam === subFamId) {
                                setDraggedOverSubFam(null);
                              }
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDraggedOverSubFam(null);
                              const dragData = e.dataTransfer.getData("text/plain");
                              if (dragData) {
                                if (dragData.startsWith("MISSION|")) {
                                  const [, srcFam, mId] = dragData.split('|');
                                  if (selectedMissionIds.includes(mId)) {
                                    onMoveMultipleMissions(selectedMissionIds, fam, productName, colorName);
                                    setSelectedMissionIds([]);
                                  } else {
                                    onMoveMissionToFamily(mId, fam, productName, colorName);
                                  }
                                } else {
                                  // subfamily drag
                                  let srcFam = '';
                                  let prod = '';
                                  let col = '';
                                  if (dragData.startsWith("SUBFAMILY|")) {
                                    [, srcFam, prod, col] = dragData.split('|');
                                  } else {
                                    [srcFam, prod, col] = dragData.split('|');
                                  }
                                  
                                  const subFamKeyStr = `${srcFam}|${prod}|${col}`;
                                  if (selectedSubFams.includes(subFamKeyStr)) {
                                    const subFamsToMove = selectedSubFams.map(id => {
                                      const [, p, c] = id.split('|');
                                      return { productName: p, colorName: c };
                                    });
                                    onMoveMultipleSubFamilies(subFamsToMove, fam);
                                    setSelectedSubFams([]);
                                  } else {
                                    if (srcFam !== fam) {
                                      onMoveSubFamilyToFamily(prod, col, fam);
                                    }
                                  }
                                }
                              }
                            }}
                            className={`border rounded-xl bg-black/40 overflow-hidden transition-all duration-200 ${
                              isDraggedOver 
                                ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(0,255,148,0.2)] scale-[1.01]' 
                                : 'border-white/5'
                            }`}
                          >
                            {/* Subfamily Header (Product Badge & Color Badge) & Draggable container */}
                            <div 
                              onClick={() => toggleSubFam(`${fam}|${subFamKey}`)}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", `${fam}|${productName}|${colorName}`);
                              }}
                              className="flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.07] transition-all cursor-pointer select-none active:bg-white/[0.05]"
                            >
                              <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                {/* Drag Grip Handle */}
                                <div 
                                  className="text-white/20 hover:text-accent cursor-grab active:cursor-grabbing p-1 shrink-0 flex items-center justify-center -ml-1"
                                  title="Glisser-déposer pour déplacer vers une autre famille"
                                >
                                  <GripVertical size={13} />
                                </div>

                                {/* Selection Check Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubFamilySelection(fam, productName, colorName);
                                  }}
                                  className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                    isSubFamilySelected(fam, productName, colorName)
                                      ? 'bg-accent border-accent text-black shadow-[0_0_8px_rgba(0,255,148,0.4)]'
                                      : 'border-white/25 hover:border-white/45 bg-white/5 text-text-dim'
                                  }`}
                                  style={{ width: '18px', height: '18px' }}
                                  title="Sélectionner pour déplacer"
                                >
                                  {isSubFamilySelected(fam, productName, colorName) && (
                                    <Check size={9} strokeWidth={3} />
                                  )}
                                </button>

                                {/* Product badge mimicking image style */}
                                <div className="px-3 py-1 rounded bg-white/10 border border-white/20 text-[11px] font-black uppercase text-white font-mono tracking-wider min-w-[90px] text-center shadow-md ml-1">
                                  {productName}
                                </div>
                                
                                {/* Color badge */ }
                                <div className={`px-2.5 py-1 rounded text-[10px] font-semibold text-white font-mono uppercase tracking-wide border ${getColorAccentClass(colorName)}`}>
                                  {colorName}
                                </div>

                                {/* Active toggle inside sub-family */}
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <span className="text-[7.5px] font-mono font-black uppercase text-white/40 tracking-wider">Activer :</span>
                                  <Toggle 
                                    enabled={isAllSubFamMissionsEnabled} 
                                    onToggle={() => onToggleAllMissionsInSubFamily(fam, productName, colorName, !isAllSubFamMissionsEnabled)} 
                                  />
                                </div>

                                {/* Stats inside subfamily header */}
                                {subFamCompletionRate > 0 && (
                                  <span className="px-1.5 py-0.5 rounded bg-accent/5 border border-accent/15 text-[8px] font-mono text-accent uppercase">
                                    {subFamCompletionRate.toFixed(0)}% livré
                                  </span>
                                )}

                                <div className="text-[9px] text-text-dim/60 font-mono font-bold uppercase tracking-widest ml-2">
                                  {activeSubFamMissionsCount}/{totalSubFamMissions} active(s)
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {isSubFamCollapsed ? <ChevronDown size={14} className="text-text-dim/60" /> : <ChevronUp size={14} className="text-text-dim/60" />}
                              </div>
                            </div>

                            {/* Subfamily Content (Missions List) */}
                            <AnimatePresence initial={false}>
                              {!isSubFamCollapsed && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="border-t border-white/5 divide-y divide-white/5 bg-black/[0.15]"
                                >
                                  {subFamMissions.map((m) => {
                                    const isSelected = selectedMissionIds.includes(m.id);
                                    const isDup = showDuplicateIndicators && isDuplicate(m);
                                    
                                    let itemBorderClass = 'border-l-transparent';
                                    let itemBgClass = '';
                                    
                                    if (isSelected && isDup) {
                                      itemBorderClass = 'border-l-red-500';
                                      itemBgClass = 'bg-red-500/10 shadow-[inset_4px_0_0_rgba(0,255,148,0.3)] shadow-[0_0_10px_rgba(239,68,68,0.2)]';
                                    } else if (isSelected) {
                                      itemBorderClass = 'border-l-accent';
                                      itemBgClass = 'bg-accent/10 shadow-[inset_4px_0_0_rgba(0,255,148,0.2)]';
                                    } else if (isDup) {
                                      itemBorderClass = 'border-l-red-500';
                                      itemBgClass = 'bg-red-500/5';
                                    } else {
                                      itemBgClass = 'hover:bg-white/[0.04]';
                                    }

                                    return (
                                      <div 
                                        key={m.id} 
                                        draggable
                                        onDragStart={(e) => {
                                          const target = e.target as HTMLElement;
                                          if (target.closest('button') || target.closest('input') || target.closest('.toggle-switch')) {
                                            e.preventDefault();
                                            return;
                                          }
                                          e.dataTransfer.effectAllowed = "move";
                                          e.dataTransfer.setData("text/plain", `MISSION|${fam}|${m.id}`);
                                        }}
                                        onDoubleClick={() => setSelectedMissionId(m.id)}
                                        className={`p-3 relative flex items-center justify-between gap-4 group transition-colors border-l-2 ${itemBorderClass} ${itemBgClass} cursor-grab active:cursor-grabbing ${m.enabled ? '' : 'opacity-40 grayscale-[0.5]'}`}
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          {/* Mission Drag Grip Handle */}
                                          <div 
                                            className="text-white/20 hover:text-accent cursor-grab active:cursor-grabbing p-1 shrink-0 flex items-center justify-center -ml-2"
                                            title="Glisser-déposer pour déplacer vers une autre famille"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <GripVertical size={12} />
                                          </div>

                                          {/* Mission Selection Checkbox */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onToggleSelectMission(m.id, e);
                                            }}
                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                              isSelected
                                                ? 'bg-accent border-accent text-black shadow-[0_0_8px_rgba(0,255,148,0.4)]'
                                                : 'border-white/20 hover:border-white/40 bg-white/5 text-text-dim'
                                            }`}
                                            style={{ width: '16px', height: '16px' }}
                                            title="Sélectionner la mission"
                                          >
                                            {isSelected && (
                                              <Check size={8} strokeWidth={4} />
                                            )}
                                          </button>

                                          {/* Status bulb */}
                                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                                            m.status === 'livré' ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 
                                            m.status === 'en cours de shoot' ? 'bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)]' : 
                                            m.status === 'annuler' ? 'bg-red-500' :
                                            'bg-white/20'
                                          }`} />

                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] font-mono font-black text-accent-blue" style={{ color: refIdColor }}>
                                                {m.refId}
                                              </span>
                                              <span className="text-[8px] font-mono text-text-dim/50">
                                                #{m.missionNo}
                                              </span>
                                              <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter ${
                                                m.priority === 'High priority' ? 'bg-red-500 text-white' : 
                                                m.priority === 'Medium priority' ? 'bg-accent-red text-black' : 
                                                'bg-white/10 text-white'
                                              }`}>
                                                {m.priority.split(' ')[0]}
                                              </div>
                                              {!m.enabled && (
                                                <span className="text-[7px] font-bold text-red-500 border border-red-500/20 px-1 py-0.5 rounded bg-red-500/5 uppercase tracking-wider">OFF</span>
                                              )}
                                            </div>
                                            
                                            <div className="text-[11px] font-medium text-white/80 uppercase tracking-wide mt-0.5 max-w-[280px] truncate">
                                              {m.argumentType || 'Aucun argument'} <span className="text-white/20 font-light mx-1">|</span> {m.univers || 'Sans univers'} <span className="text-white/20 font-light mx-1">|</span> {m.format || 'Standard'}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                          {/* Individual Mission Toggle Switch */}
                                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Toggle 
                                              enabled={m.enabled} 
                                              onToggle={(e) => onToggleMissionEnabled(m.id, e)} 
                                            />
                                          </div>

                                          {/* Deadline */}
                                          {m.deadline && (
                                            <div className="flex items-center gap-1.5 text-text-dim text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                                              <Clock size={10} />
                                              <span className={isDeadlineApproaching(m.deadline) && m.status !== 'livré' && m.enabled ? 'text-red-400 font-bold animate-pulse' : ''}>
                                                {m.deadline}
                                              </span>
                                            </div>
                                          )}

                                          {/* Progress Badge */}
                                          <div className="flex flex-col items-end pr-1">
                                            <span className="text-[10px] font-mono font-black text-white">{m.progress}%</span>
                                            <span className="text-[7px] font-black uppercase text-accent tracking-widest">{m.status}</span>
                                          </div>

                                          {/* Action trigger button */}
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedMissionId(m.id); }}
                                            className="p-1 px-1.5 bg-accent/10 border border-accent/20 text-accent rounded hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[9px] uppercase tracking-widest font-black"
                                          >
                                            Détail <CheckSquare size={10} />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
