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
  Send
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { toJpeg } from 'html-to-image';
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

const WaveEffect = ({ progress, color, type, opacity }: { progress: number, color: string, type: 'liquid' | 'organic' | 'tech', opacity?: number }) => {
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
  
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: opacity !== undefined ? opacity : 0.3 }}>
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-[150%] flex flex-col"
        animate={{ y: `${100 - (progress > 100 ? 100 : progress) * 0.9}%` }}
        transition={{ type: 'spring', damping: 30, stiffness: 45 }}
      >
        <div className="relative w-full h-[150px]">
          <motion.svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className={`absolute top-0 left-0 w-full h-full ${!color.startsWith('#') ? color : ''}`}
            style={color.startsWith('#') ? { color } : {}}
            animate={{
              x: [0, -1200],
            }}
            transition={{
              duration: type === 'tech' ? 5 : 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <path d={path} fill="currentColor" />
          </motion.svg>
          <motion.svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className={`absolute top-0 left-0 w-full h-full opacity-40 ${!color.startsWith('#') ? color : ''}`}
            style={color.startsWith('#') ? { color } : {}}
            animate={{
              x: [-1200, 0],
            }}
            transition={{
              duration: type === 'tech' ? 8 : 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <path d={path} fill="currentColor" />
          </motion.svg>
        </div>
        <div className={`flex-1 w-full ${!color.startsWith('#') ? color : ''}`} style={color.startsWith('#') ? { backgroundColor: color } : { backgroundColor: 'currentColor' }} />
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

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const currentHistory = [...messages];
    
    setMessages([...currentHistory, { role: 'user', text: currentInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const customKey = localStorage.getItem('gemini_custom_api_key');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (customKey) {
        headers['x-gemini-api-key'] = customKey;
      }
      const res = await fetch('https://mission-controle.onrender.com/api/chat', {
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
            className="w-[350px] bg-card-bg border border-white/10 shadow-2xl flex flex-col rounded-2xl overflow-hidden cursor-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-white text-sm font-bold leading-tight">Agent IA Studio</h3>
                <span className="text-[10px] text-accent font-mono">En ligne</span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[300px] max-h-[400px]" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="text-center text-text-dim text-xs mt-10">
                  <Bot size={24} className="mx-auto mb-2 opacity-50" />
                  <p>Bonjour ! Je suis l'Agent IA.</p>
                  <p>Comment puis-je vous aider ?</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] rounded-xl p-3 text-sm flex flex-col ${msg.role === 'user' ? 'bg-accent/20 text-white ml-auto border border-accent/20' : 'bg-white/5 text-white/90 mr-auto border border-white/10'}`}>
                  {msg.text}
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
                placeholder="Posez votre question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent transition-colors"
                autoFocus
              />
              <button 
                onClick={sendMessage}
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
        className="w-14 h-14 bg-gradient-to-tr from-accent to-accent-blue rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:scale-110 active:scale-95 transition-all cursor-move"
        title="Discuter avec l'Agent IA (Déplaçable)"
      >
        <Bot size={24} />
      </button>
    </motion.div>
  );
};

export default function App() {
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

  // State for categories
  const [categories, setCategories] = useState<CategoryConfig[]>([
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
  const [secondaryMissions, setSecondaryMissions] = useState<SecondaryMission[]>([]);
  const [sidebarTab, setSidebarTab] = useState<'production' | 'secondary'>('production');
  const [filterDuplicates, setFilterDuplicates] = useState(false);
  const [showDuplicateIndicators, setShowDuplicateIndicators] = useState(true);
  const [showCleanDuplicatesModal, setShowCleanDuplicatesModal] = useState(false);
  const [missionCounter, setMissionCounter] = useState(1);
  const [refPrefix, setRefPrefix] = useState('NK');
  const [refCounter, setRefCounter] = useState(882);
  
  // Form State
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
  const [activeTab, setActiveTab] = useState<'table' | 'dashboard' | 'journal' | 'system'>('table');
  const [viewMode, setViewMode] = useState<'table' | 'mosaic' | 'grid'>('table');
  const [isAdvancedSortOpen, setIsAdvancedSortOpen] = useState(false);
  
  // Selection & Bulk Actions
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteIndex, setBulkDeleteIndex] = useState(0);
  
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
  
  const [compactHiddenColumns, setCompactHiddenColumns] = useState<string[]>(['imageUrl', 'color', 'argumentType', 'format', 'position', 'support', 'priority']);
  const [minimalHiddenColumns, setMinimalHiddenColumns] = useState<string[]>(['missionNo', 'imageUrl', 'color', 'argumentType', 'univers', 'format', 'position', 'support', 'priority', 'deadline', 'info', 'rating', 'progress', 'photoCountRequested', 'photoCountDelivered', 'status', 'product']);
  
  const [manualHiddenColumns, setManualHiddenColumns] = useState<string[]>([]);
  
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
  
  // Journal State
  const [systemDataJson, setSystemDataJson] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

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
      missions,
      secondaryMissions,
      missionCounter,
      refPrefix,
      refCounter,
      headerBgColor,
      refIdColor,
      accentColor,
      accentBlueColor,
      accentPurpleColor,
      accentOrangeColor,
      accentPinkColor,
      accentRedColor,
      accentYellowColor,
      waveOpacity,
      headerBgImage,
      headerBgOpacity,
      globalLogs,
      categories: categories.map(({ icon, ...rest }) => rest)
    };
    return JSON.stringify(data, null, 2);
  }, [missions, secondaryMissions, missionCounter, refPrefix, refCounter, headerBgColor, refIdColor, accentColor, accentBlueColor, accentPurpleColor, accentOrangeColor, accentPinkColor, accentRedColor, accentYellowColor, waveOpacity, headerBgImage, headerBgOpacity, globalLogs, categories]);

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
        if (savedHeaderBgColor) setHeaderBgColor(savedHeaderBgColor);
        
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
            const restored = parsed.map((cat: any) => {
              const original = categories.find(c => c.id === cat.id);
              // Migration: ensures "En post-production" is present in the status items if missing
              if (cat.id === 'status' && !cat.items.includes('En post-production')) {
                const newItems = [...cat.items];
                const index = newItems.indexOf('livré');
                if (index !== -1) {
                  newItems.splice(index, 0, 'En post-production');
                } else {
                  newItems.push('En post-production');
                }
                return { ...cat, items: newItems, icon: original?.icon || ClipboardCheck };
              }
              return { ...cat, icon: original?.icon || Package };
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

      const dataUrl = await toJpeg(reportElement, {
        quality: 0.9,
        backgroundColor: '#0A0A0A',
        style: {
          display: 'block',
          visibility: 'visible',
        }
      });

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

      const dataUrl = await toJpeg(element, {
        quality: options.quality || 0.95,
        backgroundColor: '#0A0A0A',
        pixelRatio: options.pixelRatio || 2,
        width: width,
        height: height,
        style: {
          transform: 'none',
          transition: 'none'
        }
      });

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
      if (data.missionCounter) setMissionCounter(data.missionCounter);
      if (data.refPrefix) setRefPrefix(data.refPrefix);
      if (data.refCounter) setRefCounter(data.refCounter);
      if (data.headerBgColor) setHeaderBgColor(data.headerBgColor);
      if (data.refIdColor) setRefIdColor(data.refIdColor);
      if (data.accentColor) setAccentColor(data.accentColor);
      if (data.accentBlueColor) setAccentBlueColor(data.accentBlueColor);
      if (data.accentPurpleColor) setAccentPurpleColor(data.accentPurpleColor);
      if (data.accentOrangeColor) setAccentOrangeColor(data.accentOrangeColor);
      if (data.accentPinkColor) setAccentPinkColor(data.accentPinkColor);
      if (data.accentRedColor) setAccentRedColor(data.accentRedColor);
      if (data.accentYellowColor) setAccentYellowColor(data.accentYellowColor);
      if (data.waveOpacity !== undefined) setWaveOpacity(data.waveOpacity);
      if (data.headerBgImage) setHeaderBgImage(data.headerBgImage);
      if (data.headerBgOpacity !== undefined) setHeaderBgOpacity(data.headerBgOpacity);
      if (data.globalLogs) setGlobalLogs(data.globalLogs);
      if (data.categories) {
        const restored = data.categories.map((cat: any) => {
          const original = categories.find(c => c.id === cat.id);
          return { ...cat, icon: original?.icon || Package };
        });
        setCategories(restored);
      }

      // Force save to localStorage
      localStorage.setItem('missions', JSON.stringify(data.missions || []));
      localStorage.setItem('secondaryMissions', JSON.stringify(data.secondaryMissions || []));
      localStorage.setItem('missionCounter', JSON.stringify(data.missionCounter || 1));
      if (data.refPrefix) localStorage.setItem('refPrefix', data.refPrefix);
      if (data.refCounter) localStorage.setItem('refCounter', data.refCounter.toString());
      if (data.headerBgColor) localStorage.setItem('headerBgColor', data.headerBgColor);
      if (data.refIdColor) localStorage.setItem('refIdColor', data.refIdColor);
      if (data.accentColor) localStorage.setItem('accentColor', data.accentColor);
      if (data.accentBlueColor) localStorage.setItem('accentBlueColor', data.accentBlueColor);
      if (data.accentPurpleColor) localStorage.setItem('accentPurpleColor', data.accentPurpleColor);
      if (data.accentOrangeColor) localStorage.setItem('accentOrangeColor', data.accentOrangeColor);
      if (data.accentPinkColor) localStorage.setItem('accentPinkColor', data.accentPinkColor);
      if (data.accentRedColor) localStorage.setItem('accentRedColor', data.accentRedColor);
      if (data.accentYellowColor) localStorage.setItem('accentYellowColor', data.accentYellowColor);
      if (data.waveOpacity !== undefined) localStorage.setItem('waveOpacity', data.waveOpacity.toString());
      if (data.headerBgImage) localStorage.setItem('headerBgImage', data.headerBgImage);
      if (data.headerBgOpacity !== undefined) localStorage.setItem('headerBgOpacity', data.headerBgOpacity.toString());
      if (data.globalLogs) localStorage.setItem('globalLogs', JSON.stringify(data.globalLogs));
      const catsToSave = (data.categories || []).map(({ icon, ...rest }: any) => rest);
      localStorage.setItem('categories', JSON.stringify(catsToSave));

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
  }, [missions, secondaryMissions, headerBgColor, autoExportEnabled, autoExportInterval, scheduledExportEnabled, scheduledExportDays, scheduledExportTime, missionCounter, refPrefix, refCounter, categories, headerBgImage, headerBgOpacity, globalLogs, waveColor, waveOpacity, waveType, appFont, appFontSize, appTextColor, appTextCase, appFontWeight, navActiveColor, suiteSubtitleColor, copyBtnColor, saveBtnColor, missionTitleColor, refIdColor, accentColor, accentBlueColor, accentPurpleColor, accentOrangeColor, accentPinkColor, accentRedColor, accentYellowColor, sortConfigs, viewMode, tableViewState, manualHiddenColumns, compactHiddenColumns, minimalHiddenColumns, collapsedCategories, collapsedSettingsSections, collapsedMosaicGroups, aiInstructions, deadlineAlertThreshold, globalDeadline]);

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
      'Deadline', 'Statut', 'Progression %', 'Notation (Flux)', 'Efficience Individualisée (%)', 'Efficience Globale Actuelle'
    ];
    
    const globalEfficiency = (Math.max(0, (missions.reduce((acc, m) => acc + m.progress, 0) / (missions.length || 1)) - (missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length * 1.5))).toFixed(1);

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
        globalEfficiency
      ];
    });

    const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');
    
    navigator.clipboard.writeText(tsvContent).then(() => {
      setToast({ show: true, message: 'Données copiées pour Excel', type: 'task' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    });
  };

  const downloadFullExport = () => {
    // 1. Mission Data Sheet
    const missionHeaders = [
      'Mission #', 'Ref ID', 'Date Entrée', 'Heure Entrée', 'Activé', 'Produit', 'Couleur', 'Argument', 
      'Univers', 'Format', 'Position', 'Support', 'Photos Demandées', 'Photos Délivrées', 'Priorité', 
      'Deadline', 'Statut', 'Progression %', 'Notation (Flux)', 'Efficience Individualisée (%)', 'Efficience Globale Actuelle', 'Notes / Infos'
    ];
    
    const globalEfficiency = (Math.max(0, (missions.reduce((acc, m) => acc + m.progress, 0) / (missions.length || 1)) - (missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length * 1.5))).toFixed(1);

    const missionData = missions.map(m => {
      const individualEfficiency = (Math.max(0, m.progress - (m.priority === 'High priority' ? 10 : 0))).toFixed(1);
      const createdDate = new Date(m.createdAt);
      return [
        m.missionNo, m.refId, createdDate.toLocaleDateString(), createdDate.toLocaleTimeString(), m.enabled ? 'OUI' : 'NON', m.product, m.color, m.argumentType,
        m.univers, m.format, m.position, m.support, m.photoCountRequested,
        m.photoCountDelivered, m.priority, m.deadline || '-', m.status,
        m.progress, m.rating || 0, individualEfficiency, globalEfficiency, m.info || '-'
      ];
    });

    // 2. Journal Data Sheet
    const journalHeaders = ['Date', 'Heure', 'Type', 'Message', 'ID Log'];
    const journalData = globalLogs.map(log => {
      const date = new Date(log.timestamp);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour12: false }),
        log.type.toUpperCase(),
        log.message,
        log.id
      ];
    });

    // 3. Secondary Mission Data Sheet
    const secondaryHeaders = ['ID', 'Titre', 'Priorité', 'Status', 'Avancement %', 'Notation', 'Date Création', 'Deadline', 'Note/Info'];
    const secondaryData = secondaryMissions.map(sm => {
      const createdDate = new Date(sm.createdAt);
      return [
        sm.id, sm.title, sm.priority, sm.status, sm.progress, sm.rating,
        createdDate.toLocaleDateString(), sm.deadline || '-', sm.note || '-'
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
  };
  
  downloadFullExportRef.current = downloadFullExport;

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
      'Deadline', 'Statut', 'Progression %', 'Notation', 'Efficience Individualisée (%)', 'Efficience Globale Actuelle', 'Notes / Infos'
    ];
    const globalEfficiency = (Math.max(0, (missions.reduce((acc, m) => acc + m.progress, 0) / (missions.length || 1)) - (missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length * 1.5))).toFixed(1);
    const missionData = missions.map(m => {
      const individualEfficiency = (Math.max(0, m.progress - (m.priority === 'High priority' ? 10 : 0))).toFixed(1);
      const createdDate = new Date(m.createdAt);
      return [
        m.missionNo, m.refId, createdDate.toLocaleDateString(), createdDate.toLocaleTimeString(), m.enabled ? 'OUI' : 'NON', m.product, m.color, m.argumentType,
        m.univers, m.format, m.position, m.support, m.photoCountRequested,
        m.photoCountDelivered, m.priority, m.deadline || '-', m.status,
        m.progress, m.rating || 0, individualEfficiency, globalEfficiency, m.info || '-'
      ];
    });

    // 2. Journal Data Sheet
    const journalHeaders = ['Date', 'Heure', 'Type', 'Message', 'ID Log'];
    const journalData = globalLogs.map(log => {
      const date = new Date(log.timestamp);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour12: false }),
        log.type.toUpperCase(),
        log.message,
        log.id
      ];
    });

    // 3. Secondary Mission Data Sheet
    const secondaryHeaders = ['ID', 'Titre', 'Priorité', 'Status', 'Avancement %', 'Notation', 'Date Création', 'Deadline', 'Note/Info'];
    const secondaryData = secondaryMissions.map(sm => {
      const createdDate = new Date(sm.createdAt);
      return [
        sm.id, sm.title, sm.priority, sm.status, sm.progress, sm.rating,
        createdDate.toLocaleDateString(), sm.deadline || '-', sm.note || '-'
      ];
    });

    try {
      setToast({ show: true, message: 'Export vers Google Sheets...', type: 'task' });
      const now = new Date();
      const title = `Mission_Controle_Rapport_Global_${now.toISOString().split('T')[0]}_${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
      
      const res = await fetch('/api/sheets/export', {
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

  const pushToGoogleCalendar = async (mission: Mission | SecondaryMission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Connectez Workspace d\'abord !', type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }
    if (!mission.deadline) {
      setToast({ show: true, message: 'Pas de deadline définie !', type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }
    try {
      setToast({ show: true, message: 'Création de l\'évent...', type: 'task' });
      const summary = 'missionNo' in mission ? `[Mission] ${mission.refId} - ${mission.product}` : `[Secondaire] ${mission.title}`;
      const description = 'info' in mission ? (mission.info || '') : ('note' in mission ? (mission.note || '') : '');
      const res = await fetch('/api/calendar/event', {
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
      if (data.eventLink) {
         setToast({ show: true, message: 'Ajouté au calendrier !', type: 'task' });
         window.open(data.eventLink, '_blank');
      }
    } catch (err: any) {
      setToast({ show: true, message: err.message, type: 'alert' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const pushToGoogleTasks = async (mission: Mission | SecondaryMission) => {
    if (!googleToken) {
      setToast({ show: true, message: 'Connectez Workspace d\'abord !', type: 'alert' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }
    try {
      setToast({ show: true, message: 'Création de la tâche...', type: 'task' });
      const title = 'missionNo' in mission ? `Mission: ${mission.refId} - ${mission.product}` : `Secondaire: ${mission.title}`;
      const notes = 'info' in mission ? (mission.info || '') : ('note' in mission ? (mission.note || '') : '');
      const res = await fetch('/api/tasks/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleToken,
          title,
          notes,
          due: mission.deadline || undefined
        })
      });
      const data = await res.json();
      if (data.task) {
         setToast({ show: true, message: 'Ajouté à Google Tasks !', type: 'task' });
      }
    } catch (err: any) {
      setToast({ show: true, message: err.message, type: 'alert' });
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
    
    if (!selectedProduct && categories[0]?.items?.length > 0) setSelectedProduct(categories[0].items[0]);
    if (!selectedColor && categories[1]?.items?.length > 0) setSelectedColor(categories[1].items[0]);
    if (!selectedArgument && categories[2]?.items?.length > 0) setSelectedArgument(categories[2].items[0]);
    if (!selectedUnivers && categories[3]?.items?.length > 0) setSelectedUnivers(categories[3].items[0]);
    if (!selectedFormat && categories[4]?.items?.length > 0) setSelectedFormat(categories[4].items[0]);
    if (!selectedPosition && categories[5]?.items?.length > 0) setSelectedPosition(categories[5].items[0]);
    if (selectedSupport.length === 0 && categories[6]?.items?.length > 0) setSelectedSupport([categories[6].items[0]]);
    if (!selectedPriority && categories[7]?.items?.length > 0) setSelectedPriority(categories[7].items[0]);
    if (!selectedStatus && categories[8]?.items?.length > 0) setSelectedStatus(categories[8].items[0]);
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

    setMissions(prev => [newMission, ...prev]);
    
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
  }, [missionCounter, refCounter, refPrefix, selectedProduct, selectedColor, selectedArgument, selectedUnivers, selectedFormat, selectedPosition, selectedSupport, selectedPriority, selectedStatus, selectedRating, info, selectedDate, selectedImage, photoRequested]);

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
              break;
            case 'En post-production': updated.progress = 85; break;
            case 'shooté': updated.progress = 75; break;
            case 'en cours de shoot': updated.progress = 50; break;
            case 'produit préparé': updated.progress = 25; break;
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

    // Excel headers
    const headers = ['N° Mission', 'Ref ID', 'Activé', 'Date Entrée', 'Heure Entrée', 'Produit', 'Couleur', 'Type Argument', 'Univers', 'Format', 'Position', 'Support', 'Priorité', 'Échéance', 'Statut', 'Photos Demandées', 'Photos Délivrées', 'Progression', 'Notes / Infos'];
    const rows = missions.map(m => {
      const createdDate = new Date(m.createdAt);
      return [
        m.missionNo, m.refId, m.enabled ? 'OUI' : 'NON', createdDate.toLocaleDateString(), createdDate.toLocaleTimeString(), m.product, m.color, m.argumentType, 
        m.univers, m.format, m.position, m.support, m.priority, m.deadline || '-', m.status, 
        m.photoCountRequested, m.photoCountDelivered,
        `${m.progress}%`, m.info || '-'
      ];
    });
    
    const tsv = [headers, ...rows].map(row => row.join('\t')).join('\n');

    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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
        ? secondaryMissionsFiltered.reduce((acc, m) => acc + m.progress, 0) / secondaryMissionsFiltered.length
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
    ? Math.round(activeMissions.reduce((acc, m) => acc + m.progress, 0) / activeMissions.length) 
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
          
          <div className="flex gap-2">
            <button 
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Maximize size={10} /> Tout Développer
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
                            {/* Image/Placeholder */}
                            <div className="h-40 bg-white/5 relative overflow-hidden">
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
                              <div className="absolute top-2 left-2 flex gap-1">
                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                   m.priority === 'High priority' ? 'bg-red-500 text-white' : 
                                   m.priority === 'Medium priority' ? 'bg-accent-red text-black' : 
                                   'bg-white/10 text-text-dim'
                                }`}>
                                  {m.priority.split(' ')[0]}
                                </div>
                              </div>
                              <div className="absolute top-2 right-2 flex gap-1.5 items-center">
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
  // Calculate data series for charts
  const statusCounts = missions.reduce((acc: any, m) => {
    if (m.status) acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#00FF94', '#00D1FF', '#BD00FF', '#FF9900', '#FF007A', '#FF3B30', '#EBFF00'];

  const supportCounts = missions.reduce((acc: any, m) => {
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

  const productCounts = missions.reduce((acc: any, m) => {
    if (m.product) acc[m.product] = (acc[m.product] || 0) + 1;
    return acc;
  }, {});
  const productData = Object.entries(productCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  const universCounts = missions.reduce((acc: any, m) => {
    if (m.univers) acc[m.univers] = (acc[m.univers] || 0) + 1;
    return acc;
  }, {});
  const universData = Object.entries(universCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  const argumentCounts = missions.reduce((acc: any, m) => {
    if (m.argumentType) acc[m.argumentType] = (acc[m.argumentType] || 0) + 1;
    return acc;
  }, {});
  const argumentData = Object.entries(argumentCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateString: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
    };
  });

  const timelineData = last7Days.map(dayInfo => {
    const dayStart = new Date(dayInfo.dateString).getTime();
    const dayEnd = dayStart + 86400000;
    
    // Filter currently active missions to count deliveries for this specific day
    const deliveredCount = activeMissions.filter(m => {
      if (m.status !== 'livré') return false;
      
      // Check if it was delivered on this particular day by looking at history or updatedAt
      const becameDeliveredThisDay = (m.history || []).some(h => 
        h.timestamp >= dayStart && 
        h.timestamp < dayEnd && 
        (h.message.includes('-> livré') || h.message.includes('-> "livré"'))
      );
      
      // Fallback: if no history match but updatedAt is this day and status is currently livré
      const updatedThisDay = m.updatedAt && m.updatedAt >= dayStart && m.updatedAt < dayEnd;
      
      return becameDeliveredThisDay || updatedThisDay;
    }).length;

    const missionsAtDay = activeMissions.filter(m => m.createdAt < dayEnd);
    
    const calculateHistoricalProgress = (m: Mission) => {
       const relevantHistory = (m.history || []).filter(h => h.timestamp < dayEnd && h.message.includes('Progression'));
       if (relevantHistory.length > 0) {
          const lastMsg = relevantHistory[relevantHistory.length - 1].message;
          const match = lastMsg.match(/(\d+)%/);
          if (match) return parseInt(match[1]);
       }
       return m.createdAt < dayEnd ? (m.createdAt > dayStart ? 0 : m.progress) : 0; 
    };

    const totalProgress = missionsAtDay.reduce((acc, m) => acc + calculateHistoricalProgress(m), 0);
    const avgProgDay = missionsAtDay.length > 0 ? totalProgress / missionsAtDay.length : 0;

    return {
      name: dayInfo.label,
      MissionsLivrees: deliveredCount,
      ProgressionMoyenne: Math.round(avgProgDay)
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
                <div className="flex items-center gap-4 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(0,209,255,0.5)]" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Livrables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,255,148,0.5)]" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Progression</span>
                  </div>
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
                 <Bar yAxisId="left" dataKey="MissionsLivrees" fill="var(--color-accent-blue)" radius={[2, 2, 0, 0]} maxBarSize={30} opacity={0.8} />
                 <Line yAxisId="right" type="monotone" dataKey="ProgressionMoyenne" stroke="var(--color-accent)" strokeWidth={4} dot={{ fill: '#0A0A0A', stroke: 'var(--color-accent)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: 'var(--color-accent)' }} />
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
                              const prod = missions.length;
                              const sec = secondaryMissions.length;
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
                               <span className="text-white">{missions.length} units</span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]" />
                                  <span className="text-text-dim">Secondaire</span>
                               </div>
                               <span className="text-white">{secondaryMissions.length} units</span>
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
                          <span className="ml-2 text-[8px] opacity-40 font-mono tracking-widest uppercase">{m.status}</span>
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
                        "Actuellement : {missions.length} missions suivies. Taux de complétion global : {avgProgress}%. 
                        {missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length > 0 ? ` Alerte : ${missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length} missions critiques en attente.` : ' Flux opérationnel nominal.'}"
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
                          value={waveColor.startsWith('#') ? waveColor : '#00FF94'}
                          onChange={(e) => setWaveColor(e.target.value)}
                          className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border-none p-0"
                        />
                        <div className="flex-1 flex gap-2">
                          {['text-accent', 'text-accent-blue', 'text-accent-purple'].map(c => (
                            <button 
                              key={c}
                              onClick={() => setWaveColor(c)}
                              className={`w-8 h-8 rounded-lg border transition-all ${waveColor === c ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                              style={{ 
                                backgroundColor: c === 'text-accent' ? '#00FF94' : 
                                               c === 'text-accent-blue' ? '#00D1FF' : 
                                               '#BF7AF0',
                                color: c === 'text-accent' ? '#00FF94' : 
                                       c === 'text-accent-blue' ? '#00D1FF' : 
                                       '#BF7AF0'
                              }}
                            />
                          ))}
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
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 group-hover:text-white transition-colors">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
    setBulkStatusModalOpen(false);
    setSelectedMissionIds([]);
    setToast({ show: true, message: `${selectedMissionIds.length} missions mises à jour`, type: 'task' });
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
          {WaveEffect({ progress: avgProgress, color: waveColor, type: waveType, opacity: waveOpacity })}
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
                  if (collapsedCategories.length === categories.length) {
                    setCollapsedCategories([]);
                  } else {
                    setCollapsedCategories(categories.map(c => c.id));
                  }
                }}
                className="text-[9px] font-black uppercase text-accent hover:text-white transition-colors flex items-center gap-2"
              >
                {collapsedCategories.length === categories.length ? <Maximize size={10} /> : <Minimize size={10} />}
                {collapsedCategories.length === categories.length ? 'Tout Développer' : 'Tout Rétracter'}
              </button>
            </div>
            
            {/* Selection Categories */}
            {categories.map((cat) => {
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
                        className={`${cat.id === 'product' && isProductDropdownOpen ? 'overflow-visible' : 'overflow-hidden'} space-y-3`}
                      >
                        {cat.id === 'product' ? (
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
                                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('table');
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'table' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <List size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Liste</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewMode('grid');
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-accent text-black font-black' : 'text-text-dim hover:text-white'}`}
                                  >
                                    <LayoutGrid size={10} />
                                    <span className="text-[8px] uppercase tracking-widest">Grille</span>
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
                        className={`p-1.5 rounded transition-all ${viewMode === 'mosaic' ? 'bg-accent text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'text-text-dim hover:text-white'}`}
                        title="Mode Mosaïque (Grille)"
                      >
                        <LayoutGrid size={14} />
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
                    viewMode === 'table' ? (
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
                        <td colSpan={21 - hiddenColumns.length} className="py-24 text-center">
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
                            <td className="py-4 px-3 text-center">
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
            ) : (
              MosaicView()
            )
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
          <div className="text-[10px] font-mono text-text-dim/60 uppercase">
            {secondaryMissions.length} Missions Actives
          </div>
        </div>

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
                  </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${sm.progress >= 100 ? 'bg-accent shadow-[0_0_8px_rgba(0,255,148,0.5)]' : 'bg-accent-blue animate-pulse'}`} />
                           <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                             {sm.progress >= 100 ? 'Mission Accomplie' : 'Mission en Cours'}
                           </span>
                         </div>
                     <span className="text-[8px] font-mono text-text-dim italic">
                       Créé: {new Date(sm.createdAt).toLocaleDateString()}
                     </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
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
                onClick={() => setBulkStatusModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-accent-blue/30 transition-all"
              >
                <Activity size={12} />
                Changer Statut
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

      {/* Bulk Status Modal */}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card-bg border border-white/10 rounded-2xl p-8 z-[401] shadow-2xl"
          >
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Mise à jour groupée</h3>
              <p className="text-[10px] text-text-dim uppercase font-bold mb-4 tracking-widest">Appliquer le statut aux {selectedMissionIds.length} éléments :</p>
              
              <div className="grid grid-cols-1 gap-2">
                {categories.find(c => c.id === 'status')?.items.map(status => (
                  <button
                    key={status}
                    onClick={() => handleBulkStatusUpdate(status)}
                    className="w-full text-left px-4 py-3 bg-white/5 border border-white/5 rounded-lg hover:border-accent hover:bg-accent/5 text-[10px] font-black uppercase tracking-widest text-white transition-all transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setBulkStatusModalOpen(false)}
                className="w-full mt-6 py-3 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors"
              >
                Annuler
              </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Modals and Overlays */}
      <AnimatePresence>
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
                             <span className="text-[10px] text-accent-purple font-mono">{new Date(m.createdAt).toLocaleDateString()}</span>
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
      <div id="global-report-container" style={{ position: 'fixed', top: '-9999px', left: '-9999px', backgroundColor: '#0A0A0A', color: '#FFFFFF', padding: '80px', width: '1200px', display: 'none', fontFamily: 'sans-serif' }}>
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
            <p style={{ fontSize: '20px', color: '#FFFFFF', margin: '0 0 4px 0' }}>S{getCurrentWeekNumber()} — {getDayMonthYear()}</p>
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
                           m.status === 'En post-production' ? '#FF9900' : '#FFFFFF', 
                    textTransform: 'uppercase' 
                  }}>{m.status}</span>
                </div>
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                     <p style={{ margin: 0 }}>Référence: <span style={{ color: '#00D1FF' }}>{m.refId}</span></p>
                     <p style={{ margin: 0 }}>Couleur: <span style={{ color: '#FFFFFF' }}>{m.color}</span></p>
                     <p style={{ margin: 0 }}>Argument: <span style={{ color: '#FFFFFF' }}>{m.argumentType}</span></p>
                     <p style={{ margin: 0 }}>Univers: <span style={{ color: '#FFFFFF' }}>{m.univers}</span></p>
                     <p style={{ margin: 0 }}>Support: <span style={{ color: '#FFFFFF' }}>{m.support}</span></p>
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
                    <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                       <div style={{ height: '100%', backgroundColor: '#00FF94', width: `${m.progress}%` }} />
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
                <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#FFFFFF', margin: 0 }}>Analyse de Performance</h3>
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
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#FFFFFF', margin: '0 0 12px 0' }}>{dashboardStats.completionRate.toFixed(1)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#00FF94', width: `${dashboardStats.completionRate}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Production Active</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#FFFFFF', margin: '0 0 12px 0' }}>{dashboardStats.productionRate.toFixed(1)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#00D1FF', width: `${dashboardStats.productionRate}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Indices Qualité</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#FFFFFF', margin: '0 0 12px 0' }}>{dashboardStats.stabilityScore.toFixed(0)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#BD00FF', width: `${dashboardStats.stabilityScore}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Efficience Réelle</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#FFFFFF', margin: '0 0 12px 0' }}>{dashboardStats.finalEfficiencyScore.toFixed(1)}%</p>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#00FF94', width: `${Math.min(dashboardStats.finalEfficiencyScore, 100)}%` }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Missions Totales</p>
                <p style={{ fontSize: '32px', fontWeight: 'black', color: '#FFFFFF', margin: '0 0 12px 0' }}>{dashboardStats.stats.total}</p>
              </div>
            </div>

            <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Zap size={16} color="#00FF94" />
                <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#FFFFFF', margin: 0 }}>Moniteur d'Efficience par Support</h4>
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
                    <Bar yAxisId="left" dataKey="MissionsLivrees" name="Missions Livrées" fill="#00D1FF" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
                    <Line yAxisId="right" type="monotone" dataKey="ProgressionMoyenne" name="Progression Moyenne" stroke="#00FF94" strokeWidth={3} dot={{ fill: '#00FF94', r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
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
                     const prod = missions.length;
                     const sec = secondaryMissions.length;
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
                            <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{prod + sec}</span>
                         </div>
                       </>
                     );
                   })()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', backgroundColor: '#EBFF00', borderRadius: '2px' }} />
                      <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Production: {missions.length}</span>
                      <span style={{ fontSize: '11px', color: '#fff', marginLeft: 'auto', fontWeight: 'bold' }}>{Math.round((missions.length / (missions.length + secondaryMissions.length || 1)) * 100)}%</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', backgroundColor: '#00D1FF', borderRadius: '2px' }} />
                      <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Secondaire: {secondaryMissions.length}</span>
                      <span style={{ fontSize: '11px', color: '#fff', marginLeft: 'auto', fontWeight: 'bold' }}>{Math.round((secondaryMissions.length / (missions.length + secondaryMissions.length || 1)) * 100)}%</span>
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

function MissionDetailModal({ mission, onClose, onUpdate, onRemove, refIdColor, allStatuses, pushToGoogleCalendar, pushToGoogleTasks }: { mission: Mission | null, onClose: () => void, onUpdate: (id: string, updates: Partial<Mission>) => void, onRemove: (id: string) => void, refIdColor: string, allStatuses: string[], pushToGoogleCalendar: (m: Mission | SecondaryMission) => void, pushToGoogleTasks: (m: Mission | SecondaryMission) => void }) {
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
