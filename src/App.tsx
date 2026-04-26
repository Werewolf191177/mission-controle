/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  Target,
  Maximize,
  Minimize,
  ChevronsLeft,
  Layers,
  Film,
  Zap,
  Rocket,
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
  Search,
  FilterX,
  Printer,
  FileText,
  GripVertical,
  Loader2,
  ZapOff,
  Globe,
  LayoutGrid,
  List,
  RefreshCw,
  ArrowRight,
  Power,
  MessageSquare,
  Bug,
  MessageCircle,
  Megaphone,
  Database,
  Activity,
  Box,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RPieChart, Pie, Cell, AreaChart, Area, LabelList 
} from 'recharts';

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
  deadline?: string;
  createdAt: number;
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
          <>
            <div 
              className="fixed inset-0 z-[60] bg-transparent cursor-default" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }} 
            />
            <motion.div
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
                const isSelected = selected.includes(s);
                return (
                  <div 
                    key={s}
                    onClick={() => {
                      setSelected((prev: string[]) => 
                        isSelected ? prev.filter(item => item !== s) : [...prev, s]
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isRefreshingScore, setIsRefreshingScore] = useState(false);

  const [isMiddleTierVisible, setIsMiddleTierVisible] = useState(true);

  const handleRefreshScore = () => {
    setIsRefreshingScore(true);
    setTimeout(() => setIsRefreshingScore(false), 1000);
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
      items: ['photo', 'video', 'graphisme'],
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
      items: ['en attente', 'produit preparé', 'en cour de shoot', 'déja shooter', 'livré', 'annuler'],
      icon: ClipboardCheck,
      displayType: 'buttons',
      colorRef: 'accent'
    }
  ]);

  // State for missions
  const [missions, setMissions] = useState<Mission[]>([]);
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
  const [selectedSupport, setSelectedSupport] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [photoRequested, setPhotoRequested] = useState(1);
  const [info, setInfo] = useState('');
  
  // Pending Imports State for Modal
  const [pendingImports, setPendingImports] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  // Duplicate detection
  const isDuplicate = useCallback((m: Mission) => {
    return missions.some(other => 
      other.id !== m.id && 
      other.refId === m.refId && 
      other.product === m.product &&
      other.color === m.color &&
      other.univers === m.univers
    );
  }, [missions]);

  // Support-based dynamic logic
  useEffect(() => {
    if (selectedSupport === 'video') {
      if (selectedFormat !== '16/9' && selectedFormat !== '9/16') {
        setSelectedFormat('16/9');
      }
    } else if (selectedSupport === 'graphisme') {
      setSelectedFormat('standard');
    }
  }, [selectedSupport]);

  // Global Logs State
  const [globalLogs, setGlobalLogs] = useState<GlobalLogEntry[]>([]);
  const [manualLog, setManualLog] = useState('');

  // UI State
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'calendar' | 'task' }>({ show: false, message: '', type: 'calendar' });
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'dashboard' | 'journal' | 'system'>('table');
  const [viewMode, setViewMode] = useState<'table' | 'mosaic'>('table');
  const [isAdvancedSortOpen, setIsAdvancedSortOpen] = useState(false);
  
  // Selection & Bulk Actions
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteIndex, setBulkDeleteIndex] = useState(0);
  
  // Header Style State
  const [headerBgImage, setHeaderBgImage] = useState<string | null>(null);
  const [headerBgOpacity, setHeaderBgOpacity] = useState(0.2);
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
  
  // Advanced Sort State
  const [sortConfigs, setSortConfigs] = useState<{ key: string; order: 'asc' | 'desc' }[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [collapsedSettingsSections, setCollapsedSettingsSections] = useState<string[]>([]);
  
  // Journal State
  const [systemDataJson, setSystemDataJson] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  
  // AI Agent Config State
  const [aiInstructions, setAiInstructions] = useState('Analyse mon flux de production, détecte les goulots d\'étranglement et propose des optimisations basées sur les priorités et les délais.');
  const [systemSubTab, setSystemSubTab] = useState<'branding' | 'data' | 'ai'>('branding');
  
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
        const savedSortConfigs = localStorage.getItem('sortConfigs');
        const savedViewMode = localStorage.getItem('viewMode');
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
        if (savedCounter) {
          const val = safeParse(savedCounter);
          if (val !== null) setMissionCounter(val);
        }
        if (savedRefPrefix) setRefPrefix(savedRefPrefix);
        if (savedRefCounter) {
          const val = safeParse(savedRefCounter);
          if (val !== null) setRefCounter(val);
        }
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
        if (savedAiInstructions) setAiInstructions(savedAiInstructions);
        if (savedSortConfigs) {
          const val = safeParse(savedSortConfigs);
          if (val !== null) setSortConfigs(val);
        }
        if (savedViewMode) setViewMode(savedViewMode as any);
        
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
        
        if (savedCategories) {
          const parsed = safeParse(savedCategories);
          if (parsed && Array.isArray(parsed)) {
            const restored = parsed.map((cat: any) => {
              const original = categories.find(c => c.id === cat.id);
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
      
      reportElement.style.display = 'block';
      reportElement.style.position = 'relative';
      reportElement.style.top = '0';
      reportElement.style.left = '0';
      reportElement.style.width = '1200px'; 

      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0A0A0A',
        logging: false,
        onclone: (clonedDoc) => {
          // The template already uses hardcoded hex colors to avoid oklch issues.
          // We just ensure the element is visible in the clone.
          const el = clonedDoc.getElementById('global-report-container');
          if (el) el.style.display = 'block';
        }
      });

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
      
      const link = document.createElement('a');
      link.download = `MissionControle_Rapport_Global_${dateStr}_${timeStr}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      setToast({
        show: true,
        message: 'Rapport Global JPEG généré ! (Production + Performance)',
        type: 'task'
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);

      // Restore
      reportElement.style.display = originalStyle;
      reportElement.style.position = originalPosition;
      reportElement.style.top = originalTop;
      reportElement.style.left = originalLeft;
      reportElement.style.width = '';
    } catch (err) {
      console.error('Capture error:', err);
      alert('Erreur lors de la capture image.');
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
      if (data.missionCounter) setMissionCounter(data.missionCounter);
      if (data.refPrefix) setRefPrefix(data.refPrefix);
      if (data.refCounter) setRefCounter(data.refCounter);
      if (data.refIdColor) setRefIdColor(data.refIdColor);
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
      localStorage.setItem('missionCounter', JSON.stringify(data.missionCounter || 1));
      if (data.refPrefix) localStorage.setItem('refPrefix', data.refPrefix);
      if (data.refCounter) localStorage.setItem('refCounter', data.refCounter.toString());
      if (data.refIdColor) localStorage.setItem('refIdColor', data.refIdColor);
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
      alert('Erreur : Format de données invalide. Assurez-vous de coller le JSON complet fourni par le bouton COPIER.');
      return false;
    }
  };

  const importSystemData = () => {
    processImport(systemDataJson);
  };

  const exportSystemData = () => {
    const data = {
      missions,
      missionCounter,
      refPrefix,
      refCounter,
      refIdColor,
      waveOpacity,
      headerBgImage,
      headerBgOpacity,
      globalLogs,
      categories: categories.map(({ icon, ...rest }) => rest)
    };
    const json = JSON.stringify(data, null, 2);
    setSystemDataJson(json);
    navigator.clipboard.writeText(json);
    setToast({
      show: true,
      message: 'Données copiées. Prêtes à être injectées ailleurs.',
      type: 'task'
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const performSave = useCallback(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
    localStorage.setItem('missionCounter', JSON.stringify(missionCounter));
    localStorage.setItem('refPrefix', refPrefix);
    localStorage.setItem('refCounter', JSON.stringify(refCounter));
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
    localStorage.setItem('aiInstructions', aiInstructions);
    localStorage.setItem('sortConfigs', JSON.stringify(sortConfigs));
    localStorage.setItem('viewMode', viewMode);
    localStorage.setItem('collapsedCategories', JSON.stringify(collapsedCategories));
    localStorage.setItem('collapsedSettingsSections', JSON.stringify(collapsedSettingsSections));
    const categoriesToSave = categories.map(({ icon, ...rest }) => rest);
    localStorage.setItem('categories', JSON.stringify(categoriesToSave));
  }, [missions, missionCounter, refPrefix, refCounter, categories, headerBgImage, headerBgOpacity, globalLogs, waveColor, waveOpacity, waveType, appFont, appFontSize, appTextColor, appTextCase, appFontWeight, navActiveColor, suiteSubtitleColor, copyBtnColor, saveBtnColor, missionTitleColor, refIdColor, sortConfigs, viewMode, collapsedCategories, collapsedSettingsSections, aiInstructions]);

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

    const missionData = filteredMissions.map(m => {
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

    const workbook = XLSX.utils.book_new();
    
    // Add Mission Sheet
    const missionSheet = XLSX.utils.aoa_to_sheet([missionHeaders, ...missionData]);
    XLSX.utils.book_append_sheet(workbook, missionSheet, "Production (Missions)");
    
    // Add Journal Sheet
    const journalSheet = XLSX.utils.aoa_to_sheet([journalHeaders, ...journalData]);
    XLSX.utils.book_append_sheet(workbook, journalSheet, "Performance (Journal)");
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    XLSX.writeFile(workbook, `Mission_Controle_Rapport_Global_${dateStr}_${timeStr}.xlsx`);

    setToast({ show: true, message: 'Rapport Global généré ! (Production + Performance)', type: 'task' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // Auto-save logic
  useEffect(() => {
    const interval = setInterval(() => {
      performSave();
      console.log('[SYSTEM] Auto-save completed at ' + new Date().toLocaleTimeString());
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, [performSave]);

  // Initialize selections with first items if available
  useEffect(() => {
    if (!selectedProduct && categories[0].items.length > 0) setSelectedProduct(categories[0].items[0]);
    if (!selectedColor && categories[1].items.length > 0) setSelectedColor(categories[1].items[0]);
    if (!selectedArgument && categories[2].items.length > 0) setSelectedArgument(categories[2].items[0]);
    if (!selectedUnivers && categories[3].items.length > 0) setSelectedUnivers(categories[3].items[0]);
    if (!selectedFormat && categories[4].items.length > 0) setSelectedFormat(categories[4].items[0]);
    if (!selectedPosition && categories[5].items.length > 0) setSelectedPosition(categories[5].items[0]);
    if (!selectedSupport && categories[6].items.length > 0) setSelectedSupport(categories[6].items[0]);
    if (!selectedPriority && categories[7].items.length > 0) setSelectedPriority(categories[7].items[0]);
    if (!selectedStatus && categories[8].items.length > 0) setSelectedStatus(categories[8].items[0]);
  }, [categories]);

  const getInitialProgress = (status: string) => {
    switch (status) {
      case 'livré': return 100;
      case 'déja shooter': return 75;
      case 'en cour de shoot': return 50;
      case 'produit preparé': return 25;
      default: return 0;
    }
  };

  const addMission = useCallback(() => {
    if (!selectedProduct) return;

    const dateRegex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/;
    const noteDate = info.match(dateRegex);
    const finalDate = selectedDate || (noteDate ? noteDate[0] : '');

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
      support: selectedSupport,
      priority: selectedPriority,
      status: selectedStatus,
      progress: getInitialProgress(selectedStatus),
      photoCountRequested: photoRequested,
      photoCountDelivered: 0,
      rating: selectedRating,
      info,
      imageUrl: selectedImage || undefined,
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

  const cleanupDuplicates = () => {
    const seen = new Set();
    const cleanMissions = missions.filter(m => {
      // Comparison key excluding refId and missionNo
      const key = `${m.product}-${m.color}-${m.univers}-${m.support}-${m.format}-${m.position}-${m.argumentType}-${m.info}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const removedCount = missions.length - cleanMissions.length;
    if (removedCount > 0) {
      setMissions(cleanMissions);
      setToast({ show: true, message: `${removedCount} doublons supprimés !`, type: 'task' });
    } else {
      setToast({ show: true, message: "Aucun doublon trouvé.", type: 'task' });
    }
    setTimeout(() => setToast({ show: false, message: '', type: 'task' }), 3000);
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
      const changeDescriptions = technicalChanges.map(f => `${String(f).toUpperCase()} ("${missionBefore[f] || 'Ø'}" → "${updates[f]}")`);
      logsToAdd.push({ 
        id: logId + '-edit', 
        timestamp, 
        message: `ÉDITION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] - Modif : ${changeDescriptions.join(' | ')}`, 
        type: 'mission' 
      });
    }

    if (updates.status && updates.status !== missionBefore.status) {
      logsToAdd.push({ 
        id: logId + '-status', 
        timestamp, 
        message: `MISE À JOUR : Mission #${missionBefore.missionNo} (${missionBefore.product}) -> "${updates.status}".`, 
        type: 'mission' 
      });
    }

    if (updates.info !== undefined && updates.info !== missionBefore.info) {
      logsToAdd.push({ 
        id: logId + '-instr', 
        timestamp, 
        message: `INSTRUCTION : Mission #${missionBefore.missionNo} [${missionBefore.refId}] - Notes : "${updates.info}"`, 
        type: 'instruction' 
      });
    }

    if (logsToAdd.length > 0) {
      // Combine all changes into a single combined log message for "no combined writings" rule
      const combinedMsg = logsToAdd.map(l => l.message).join(' | ');
      const mainType = logsToAdd.some(l => l.type === 'instruction') ? 'instruction' : 'mission';
      
      setGlobalLogs(prev => {
        const lastLog = prev[prev.length - 1];
        if (lastLog && lastLog.message === combinedMsg && timestamp - lastLog.timestamp < 500) return prev;
        return [...prev, { id: logId + '-combined', timestamp, message: combinedMsg, type: mainType }];
      });
    }

    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        let history = m.history ? [...m.history] : [];
        if (updates.status && updates.status !== m.status) {
          history.push({ timestamp: Date.now(), message: `STATUT : ${m.status} -> ${updates.status}` });
        }
        if (updates.progress !== undefined && updates.progress !== m.progress) {
           // We only log significant progress changes or the first one to avoid spam
           if (Math.abs(updates.progress - m.progress) >= 25 || updates.progress === 100 || updates.progress === 0) {
             history.push({ timestamp: Date.now(), message: `Progression mise à jour à ${updates.progress}%` });
           }
        }
        if (updates.priority && updates.priority !== m.priority) {
          history.push({ timestamp: Date.now(), message: `Priorité changée à "${updates.priority}"` });
        }
        if (updates.info !== undefined && updates.info !== m.info) {
          history.push({ timestamp: Date.now(), message: `Notes : "${updates.info}"` });
        }

        const updated = { ...m, ...updates, history };
        
        // Photos drive progress
        if (updates.photoCountRequested !== undefined || updates.photoCountDelivered !== undefined) {
          const req = updated.photoCountRequested || 1;
          const del = updated.photoCountDelivered || 0;
          updated.progress = Math.round((del / req) * 100);
        }
        
        // Sync progress if status changes manually
        if (updates.status) {
          switch (updates.status) {
            case 'livré': updated.progress = 100; break;
            case 'déja shooter': updated.progress = 75; break;
            case 'en cour de shoot': updated.progress = 50; break;
            case 'produit preparé': updated.progress = 25; break;
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
      message: manualLog,
      type: 'manual'
    };
    setGlobalLogs(prev => [...prev, logEntry]);
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
    const prompt = `
[MISSION CONTROL OPERATIONAL TELEMETRY]
CONTEXTE : Application de gestion de missions tactiques.
DATE : ${new Date().toLocaleString()}
AGENT CIBLE : Gemini Surveillance Agent

INSTRUCTION : ${aiInstructions}

--- DONNÉES DE CONFIGURATION ---
Séquenceur : ${refPrefix}-${refCounter}
Identité Visuelle : Font=${appFont}, Color=${appTextColor}, HeaderAsset=${headerBgImage ? 'PRESENT' : 'DEFAULT'}
Nombre de Missions : ${missions.length}
Log Stream Size : ${globalLogs.length} entrées

--- RÉSUMÉ DES MISSIONS ---
${missions.map(m => `- #${m.missionNo} [${m.refId}] ${m.enabled ? '(ACTIF)' : '(INACTIF)'}: ${m.product} | Status: ${m.status} | Progress: ${m.progress}%`).join('\n')}

--- DERNIERS LOGS SYSTÈME ---
${globalLogs.slice(-10).map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.type.toUpperCase()}: ${l.message}`).join('\n')}

Veuillez générer un rapport synthétique avec 3 indicateurs clés (KPI) et une conclusion stratégique.
`;

    navigator.clipboard.writeText(prompt.trim());
    setCopiedAiPrompt(true);
    setTimeout(() => setCopiedAiPrompt(false), 2000);
  };


  const updateCategory = (catId: string, updates: Partial<CategoryConfig>) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...updates } : c));
  };

  const avgProgress = missions.length > 0 
    ? Math.round(missions.reduce((acc, m) => acc + m.progress, 0) / missions.length) 
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

  const avgRating = missions.length > 0
    ? (missions.reduce((acc, m) => acc + (m.rating || 0), 0) / missions.length).toFixed(1)
    : '0.0';

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'journal') {
      // Small timeout to ensure DOM catchup for AnimatePresence
      const timer = setTimeout(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [globalLogs, activeTab]);

  // New sub-components for Dashboard and Journal
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
    
    // Map properly to CSS variables or direct hex
    const getGradientColor = () => {
      if (color.startsWith('#')) return color;
      if (color === 'text-accent') return 'var(--color-accent)';
      if (color === 'text-accent-blue') return 'var(--color-accent-blue)';
      if (color === 'text-accent-purple') return 'var(--color-accent-purple)';
      if (color === 'text-accent-orange') return 'var(--color-accent-orange)';
      if (color === 'text-accent-pink') return 'var(--color-accent-pink)';
      if (color === 'text-accent-red') return 'var(--color-accent-red)';
      if (color === 'text-accent-yellow') return 'var(--color-accent-yellow)';
      return 'currentColor';
    };

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
              className={`absolute top-0 left-0 w-full h-full ${!color.startsWith('#') ? color : ''} opacity-30`}
              style={color.startsWith('#') ? { color } : {}}
              animate={{
                x: [-1200, 0],
              }}
              transition={{
                duration: type === 'tech' ? 7 : 14,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <path d={path} fill="currentColor" />
            </motion.svg>
          </div>
          <div 
            className={`flex-1 w-full ${!color.startsWith('#') ? color.replace('text-', 'bg-') : ''}`}
            style={color.startsWith('#') ? { backgroundColor: color } : {}}
          />
        </motion.div>
      </div>
    );
  };

  const MosaicView = () => {
    const allStatuses = categories.find(c => c.id === 'status')?.items || [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredMissions.map((m, idx) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`cursor-pointer bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/40 transition-all shadow-xl flex flex-col relative ${
              selectedMissionIds.includes(m.id) ? 'ring-2 ring-accent border-accent' : ''
            }`}
            onClick={(e) => {
              if (e.shiftKey) {
                toggleSelectMission(m.id, e);
              } else {
                setSelectedMissionId(m.id);
              }
            }}
          >
            {/* Image/Placeholder */}
            <div className="h-40 bg-white/5 relative overflow-hidden">
               {m.imageUrl ? (
                <img src={m.imageUrl} alt={m.product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
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
              <div className="absolute top-2 right-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSelectMission(m.id, e); }}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    selectedMissionIds.includes(m.id) ? 'bg-accent border-accent text-black' : 'bg-black/60 border-white/20 text-transparent opacity-0 group-hover:opacity-100'
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
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles 
                        key={star} 
                        size={8} 
                        className={m.rating! >= star ? 'text-accent-yellow fill-accent-yellow' : m.rating! >= star - 0.5 ? 'text-accent-yellow fill-accent-yellow opacity-50' : 'hidden'} 
                      />
                    ))}
                  </div>
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
                      m.status === 'en cour de shoot' ? 'text-accent-blue' : 
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
                  <span className={m.progress === 100 ? 'text-accent' : 'text-white'}>{m.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${m.progress === 100 ? 'bg-accent' : 'bg-accent-blue'}`}
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
                  <Clock size={10} className="text-text-dim" />
                  <span className="text-[8px] font-mono font-bold text-text-dim">{m.deadline || '-'}</span>
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedMissionId(m.id); }}
                    className="p-1.5 bg-accent-blue/10 text-accent-blue rounded hover:bg-accent-blue/20 transition-all border border-accent-blue/20"
                  >
                    <Maximize size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeMission(m.id); }}
                    className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-all border border-red-500/20"
                  >
                    <Trash2 size={12} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  const renderDashboardView = () => {
    const stats = {
      total: missions.length,
      completed: missions.filter(m => m.status === 'livré').length,
      inProduction: missions.filter(m => ['en cour de shoot', 'déja shooter'].includes(m.status)).length,
      pending: missions.filter(m => m.status === 'en attente' || m.status === 'produit preparé').length,
      urgent: missions.filter(m => m.priority === 'High priority' && m.status !== 'livré').length,
      bugs: missions.filter(m => m.status === 'livré' && m.progress < 100).length,
    };

    const requestedBySupport = missions.reduce((acc: any, m) => {
      acc[m.support] = (acc[m.support] || 0) + (m.photoCountRequested || 1);
      return acc;
    }, {});

    const deliveredBySupport = missions.reduce((acc: any, m) => {
      acc[m.support] = (acc[m.support] || 0) + (m.photoCountDelivered || 0);
      return acc;
    }, {});

    const totalRequested = Object.values(requestedBySupport).reduce((a, b) => (a as any) + (b as any), 0) as number;
    const totalDelivered = Object.values(deliveredBySupport).reduce((a, b) => (a as any) + (b as any), 0) as number;

    const photoRate = (requestedBySupport['photo'] || 0) > 0 ? ((deliveredBySupport['photo'] || 0) / (requestedBySupport['photo'] || 1)) * 100 : 0;
    const videoRate = (requestedBySupport['video'] || 0) > 0 ? ((deliveredBySupport['video'] || 0) / (requestedBySupport['video'] || 1)) * 100 : 0;
    const graphicRate = (requestedBySupport['graphisme'] || 0) > 0 ? ((deliveredBySupport['graphisme'] || 0) / (requestedBySupport['graphisme'] || 1)) * 100 : 0;

    const involvedSupports = [
      requestedBySupport['photo'] > 0 ? photoRate : null,
      requestedBySupport['video'] > 0 ? videoRate : null,
      requestedBySupport['graphisme'] > 0 ? graphicRate : null
    ].filter(v => v !== null) as number[];

    const finalEfficiencyScore = involvedSupports.length > 0 
      ? involvedSupports.reduce((a, b) => a + b, 0) / involvedSupports.length 
      : (totalRequested > 0 ? (totalDelivered / totalRequested) * 100 : 0);

    const bugRate = missions.length > 0 ? (stats.bugs / missions.length) * 100 : 0;
    const stabilityScore = 100 - bugRate;

    // Calculate Distribution data with all possible categories for stability
    const allStatuses = categories.find(c => c.id === 'status')?.items || [];
    const statusCounts = missions.reduce((acc: any, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = allStatuses.map(status => ({
      name: status,
      value: statusCounts[status] || 0
    }));

    const COLORS = ['#00FF94', '#00D1FF', '#BD00FF', '#FF9900', '#FF007A', '#FF3B30', '#EBFF00'];

    const duplicateGroups = missions.reduce((acc: Mission[][], m) => {
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

    const allSupports = categories.find(c => c.id === 'support')?.items || [];
    const supportCounts = missions.reduce((acc: any, m) => {
      acc[m.support] = (acc[m.support] || 0) + 1;
      return acc;
    }, {});

    const supportData = allSupports.map(support => ({
      name: support,
      value: supportCounts[support] || 0
    }));

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

    const ChartCard = ({ title, subtitle, children, delay = 0, className = "" }: any) => (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className={`bg-black/40 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col ${className}`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-white">{title}</h4>
            <p className="text-[8px] font-mono text-accent/60 uppercase tracking-widest mt-0.5">{subtitle}</p>
          </div>
          <Activity size={14} className="text-white/20" />
        </div>
        <div className="flex-1 min-h-[150px]">
          {children}
        </div>
      </motion.div>
    );

    const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    const productionRate = stats.total > 0 ? (stats.inProduction / stats.total) * 100 : 0;

    return (
      <div className="space-y-6 mb-12">
        {/* Bilan Stratégique Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-8 bg-gradient-to-br from-accent/10 via-black/40 to-black/60 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={120} className="text-accent" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/20 rounded-lg text-accent">
                  <TrendingUp size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[4px] text-white">Bilan de Progrès Stratégique</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Taux de Livraison</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-black text-white italic">{completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${completionRate}%` }} className="h-full bg-accent shadow-[0_0_10px_rgba(0,255,148,0.3)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">En Production active</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-black text-white italic">{productionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${productionRate}%` }} className="h-full bg-accent-blue shadow-[0_0_10px_rgba(0,209,255,0.3)]" />
                  </div>
                </div>
                <div className="space-y-2">
                   <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Efficience Brute</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-display font-black text-white italic">{finalEfficiencyScore.toFixed(1)}</span>
                     <span className="text-xs font-mono text-accent">pts</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${finalEfficiencyScore}%` }} className="h-full bg-accent-purple shadow-[0_0_10px_rgba(189,0,255,0.3)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
               <p className="text-[10px] text-text-dim/60 font-medium italic">
                 {finalEfficiencyScore > 80 ? "Séquenceur en haute performance. Flux optimal détecté." : "Reprise de cadence recommandée sur les supports critiques."}
               </p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-accent">Analyse IA Live</span>
               </div>
            </div>
          </motion.div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all group">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Urgences</span>
                <span className={`text-4xl font-black font-mono transition-colors ${stats.urgent > 0 ? 'text-red-500' : 'text-white/20'}`}>{stats.urgent}</span>
                <AlertTriangle size={16} className={stats.urgent > 0 ? 'text-red-500 animate-pulse' : 'text-white/10'} />
             </div>
             <div className="p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-accent-blue/30 transition-all group">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Bilan Qualité</span>
                <span className="text-4xl font-black font-mono text-white italic">{stabilityScore.toFixed(0)}%</span>
                <Zap size={16} className="text-accent-blue" />
             </div>
             <div className="p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-accent-purple/30 transition-all group">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Moy. Note</span>
                <span className="text-4xl font-black font-mono text-white">{avgRating}</span>
                <Sparkles size={16} className="text-accent-yellow" />
             </div>
             <div className="p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-green-500/30 transition-all group">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Total Flux</span>
                <span className="text-4xl font-black font-mono text-white">{stats.total}</span>
                <Layers size={16} className="text-white/40" />
             </div>
          </div>
        </div>

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

        {/* Efficiency & Motivation (Moved to Top) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-accent/20 via-black/40 to-black/60 border border-accent/20 p-8 rounded-2xl relative overflow-hidden group shadow-2xl flex items-center justify-between"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[4px] text-accent">Efficiency Score</h4>
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Calculé sur Livrables (Photos/Vidéo/Graphisme)</p>
                  </div>
                  <button 
                    onClick={handleRefreshScore}
                    className={`p-2 rounded-lg bg-white/5 border border-white/10 text-accent hover:bg-accent/10 transition-all ${isRefreshingScore ? 'animate-spin' : ''}`}
                    title="Rafraîchir le score"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className={`text-6xl font-display font-black text-white italic ${isRefreshingScore ? 'animate-pulse' : ''}`}>{finalEfficiencyScore.toFixed(1)}</span>
                  <span className="text-xl font-mono text-accent">%</span>
                </div>
                <div className={`grid grid-cols-3 gap-2 ${isRefreshingScore ? 'animate-pulse' : ''}`}>
                   <div className="flex flex-col">
                     <span className="text-[7px] font-black uppercase text-text-dim">Photos</span>
                     <span className="text-[10px] font-mono font-bold text-accent">{photoRate.toFixed(0)}%</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[7px] font-black uppercase text-text-dim">Vidéos</span>
                     <span className="text-[10px] font-mono font-bold text-accent-blue">{videoRate.toFixed(0)}%</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[7px] font-black uppercase text-text-dim">Graphisme</span>
                     <span className="text-[10px] font-mono font-bold text-accent-purple">{graphicRate.toFixed(0)}%</span>
                   </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-[8px] font-black text-accent uppercase tracking-tighter animate-pulse">Alpha Performance</div>
                  <span className="text-[10px] text-white/50 font-bold italic">
                    {finalEfficiencyScore === 0 ? "C'est le désert total là, on s'y met ?" :
                     finalEfficiencyScore < 30 ? "On démarre doucement, faut passer la seconde." :
                     finalEfficiencyScore < 70 ? "Pas mal, on est dans le rythme." :
                     finalEfficiencyScore < 100 ? "Ça commence à ressembler à quelque chose !" :
                     finalEfficiencyScore === 100 ? "Objectif atteint, c'est propre." :
                     "Incroyable, t'es en surrégime ! Continue comme ça."}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block relative z-10 pr-4">
                 <div className="w-24 h-24 rounded-full border-4 border-accent/20 flex items-center justify-center p-2 relative">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <TrendingUp size={32} className="text-accent" />
                 </div>
              </div>
           </motion.div>

           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 border border-white/10 p-8 rounded-2xl relative overflow-hidden group shadow-xl flex flex-col justify-center"
           >
              <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[3px] text-white">Global Impact</h4>
                    <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest mt-0.5">Visibilité Internationale du Dashboard</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">Missions Livrées</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-accent-blue" 
                          initial={{ width: 0 }}
                          animate={{ width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{stats.completed}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">File d'Attente</span>
                    <div className="flex items-center gap-2">
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-accent-purple" 
                          initial={{ width: 0 }}
                          animate={{ width: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : 0 }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                       </div>
                       <span className="text-xs font-mono font-bold text-white">{stats.pending}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">In Shoot Velocity</span>
                    <div className="flex items-center gap-2">
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-accent" 
                          initial={{ width: 0 }}
                          animate={{ width: stats.total > 0 ? `${(stats.inProduction / stats.total) * 100}%` : 0 }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        />
                       </div>
                       <span className="text-xs font-mono font-bold text-white">{stats.inProduction}</span>
                    </div>
                  </div>
                </div>
              </div>
           </motion.div>
        </div>

        {/* Top Tier: Critical Intel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Missions Actives" value={stats.total} subValue={`+${stats.total > 0 ? 1 : 0}`} icon={Layers} color="text-white" delay={0.3} />
          <StatCard label="Progression Flux" value={`${avgProgress}%`} icon={TrendingUp} color="text-accent-purple" delay={0.4} />
          <StatCard label={filterSupports.length === 1 && filterSupports[0] === 'video' ? "Séquences Demandées" : filterSupports.length === 1 && filterSupports[0] === 'graphisme' ? "Visuels Demandés" : "Photos Demandées"} value={totalRequested} subValue="Total (Unités)" icon={Package} color="text-accent-blue" delay={0.5} breakdown={requestedBySupport} />
          <StatCard label={filterSupports.length === 1 && filterSupports[0] === 'video' ? "Séquences Livrées" : filterSupports.length === 1 && filterSupports[0] === 'graphisme' ? "Visuels Livrés" : "Photos Livrées"} value={totalDelivered} subValue={`${((totalDelivered / (totalRequested || 1)) * 100).toFixed(1)}% Ratio`} icon={Zap} color="text-accent" delay={0.6} breakdown={deliveredBySupport} />
          <StatCard label="Moyenne Notation" value={`${avgRating}/5`} subValue="Flux Satisfaction" icon={Sparkles} color="text-accent-yellow" delay={0.7} />
          <StatCard label="Alerte Haute Priorité" value={stats.urgent} icon={AlertTriangle} color={stats.urgent > 0 ? "text-accent-red" : "text-text-dim"} delay={0.8} />
        </div>

        {/* Middle Tier: Data Deep Dive */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-accent" />
                <h3 className="text-[10px] font-black uppercase tracking-[3px] text-white/60">Analyse de Distribution</h3>
             </div>
             <button 
               onClick={() => setIsMiddleTierVisible(!isMiddleTierVisible)}
               className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all"
             >
               {isMiddleTierVisible ? (
                 <>
                   <Minimize size={10} />
                   Rétracter les Graphiques
                 </>
               ) : (
                 <>
                   <Maximize size={10} />
                   Afficher les Graphiques
                 </>
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
                  <ChartCard title="Distribution par État" subtitle="Data Flow Analysis" className="lg:col-span-2" delay={0.1}>
                    <ResponsiveContainer width="100%" height={260}>
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
                  </ChartCard>

                  {/* Support Split */}
                  <ChartCard title="Répartition Supports" subtitle="Asset Allocation" delay={0.2}>
                    <ResponsiveContainer width="100%" height={260}>
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
                    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
                      {supportData.map((s, i) => (
                        <div key={s.name} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                          <span className="text-[8px] font-bold text-text-dim truncate max-w-[60px]">{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </ChartCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                        <>
                          <Check size={20} className="animate-bounce" />
                          <span className="uppercase tracking-widest text-[13px]">Prompt Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy size={20} className="group-hover:translate-x-1 transition-transform" />
                          <span className="uppercase tracking-[4px] text-[13px]">Injecter dans Gemini</span>
                        </>
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
                      <span className="text-[9px] font-mono text-white/20">v2.4.0</span>
                    </div>
                    <textarea 
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      placeholder="Comment l'IA doit-elle traiter vos données ?"
                      className="w-full h-[300px] bg-black/60 border border-white/10 p-6 rounded-2xl text-xs text-white outline-none focus:border-accent hover:border-white/20 transition-all font-mono leading-relaxed shadow-inner"
                    />
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Bilan de Progrès IA</h5>
                      <p className="text-[10px] text-text-dim leading-relaxed italic">
                        "Actuellement : {missions.length} missions suivies. Taux de complétion global : {avgProgress}%. 
                        {stats.urgent > 0 ? ` Alerte : ${stats.urgent} missions critiques en attente.` : ' Flux opérationnel nominal.'}"
                      </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-white/40 block">Effets de Vague</label>
                      <div className="grid grid-cols-2 gap-4">
                         {(['liquid', 'organic'] as const).map(t => (
                           <button key={t} onClick={() => setWaveType(t)} className={`py-4 text-[10px] font-black uppercase rounded-xl border transition-all ${waveType === t ? 'bg-accent text-black border-accent' : 'bg-black/40 text-text-dim border-white/10'}`}>
                             {t}
                           </button>
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
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">Palette Chromatique</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-white/40">Navigation Accent</label>
                        <input type="color" value={navActiveColor} onChange={(e) => setNavActiveColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-wide text-white/40">Title Accent</label>
                        <input type="color" value={missionTitleColor} onChange={(e) => setMissionTitleColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
                     </div>
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
                        placeholder="Coller le flux JSON pour restauration immédiate..."
                        className="w-full h-48 bg-black/80 border border-white/10 p-6 rounded-2xl text-xs text-accent-blue font-mono outline-none focus:border-accent-blue transition-all resize-none shadow-inner custom-scrollbar"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <button 
                        onClick={exportSystemData}
                        className="py-5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[3px] text-white hover:bg-white/10 transition-all rounded-2xl flex items-center justify-center gap-3"
                      >
                        <Copy size={16} /> Exporter JSON
                      </button>
                      <button 
                         onClick={downloadFullExport}
                         className="py-5 bg-accent-blue/10 border border-accent-blue/20 text-[9px] font-black uppercase tracking-[3px] text-accent-blue hover:bg-accent-blue hover:text-black transition-all rounded-2xl flex items-center justify-center gap-3"
                      >
                         <Download size={16} /> Rapport Complet
                      </button>
                      <button 
                        onClick={importSystemData}
                        disabled={!systemDataJson.trim()}
                        className="py-5 bg-accent/10 border border-accent/20 text-[9px] font-black uppercase tracking-[3px] text-accent hover:bg-accent hover:text-black transition-all rounded-2xl flex items-center justify-center gap-3 disabled:opacity-20"
                      >
                        <Zap size={16} /> Importer le Flux
                      </button>
                      <button 
                         onClick={resetJournal}
                         className="py-5 bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase tracking-[3px] text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl flex items-center justify-center gap-3"
                      >
                         <RotateCcw size={16} /> Reset Journal
                      </button>
                   </div>
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl h-fit">
                    <CategoryEditor 
                      category={cat} 
                      onUpdate={(updates) => updateCategory(cat.id, updates)}
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
      
      <div className="h-[450px] overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar bg-[rgba(10,10,10,0.4)] relative">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {globalLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 gap-6 py-20">
            <Loader2 size={48} className="animate-spin text-accent" />
            <p className="uppercase tracking-[10px] text-[10px] font-black text-white">Initializing Télémétrie System.log...</p>
          </div>
        ) : (
          <div className="space-y-1 relative z-10">
            {globalLogs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 p-3 border-b border-white/[0.03] hover:bg-white/[0.02] group transition-colors cursor-default`}
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
                  <p className={`text-[13px] font-medium leading-relaxed tracking-wide ${
                    log.type === 'manual' ? 'text-accent shadow-[0_0_10px_rgba(0,255,148,0.1)]' : 
                    log.type === 'instruction' ? 'text-accent-purple font-bold' :
                    log.type === 'mission' ? 'text-[#00D1FF]' : 
                    'text-white'
                  }`}>
                    {log.message}
                  </p>
                </div>
                
                <div className="opacity-0 group-hover:opacity-10 transition-opacity">
                  <span className="text-[9px] font-mono text-white uppercase">ID:{log.id}</span>
                </div>
              </motion.div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10 bg-black/60 relative">
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
              placeholder="Saisir rapport manuel d'opération (Enter pour valider)..."
              className="w-full bg-black/40 border border-white/10 pl-12 pr-4 py-4 rounded text-[13px] text-white placeholder:text-white/20 outline-none focus:border-accent/40 hover:bg-black/60 transition-all font-mono"
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
          case 'livré': progress = 100; break;
          case 'déja shooter': progress = 75; break;
          case 'en cour de shoot': progress = 50; break;
          case 'produit preparé': progress = 25; break;
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
    return selected.map(val => (
      <motion.div 
        key={`${label}-${val}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
    const matchesQuery = m.product.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         m.info.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         m.refId.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         m.missionNo.toString().includes(filterQuery);
    const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(m.status);
    const matchesProduct = filterProducts.length === 0 || filterProducts.includes(m.product);
    const matchesUniverse = filterUniverses.length === 0 || filterUniverses.includes(m.univers);
    const matchesSupport = filterSupports.length === 0 || filterSupports.includes(m.support);
    const matchesColor = filterColors.length === 0 || filterColors.includes(m.color);
    const matchesArgument = filterArguments.length === 0 || filterArguments.includes(m.argumentType);
    const matchesPriority = filterPriorities.length === 0 || filterPriorities.includes(m.priority);
    const matchesEnabled = filterEnabled.length === 0 || (
      (filterEnabled.includes('Actif') && m.enabled) ||
      (filterEnabled.includes('Inactif') && !m.enabled)
    );
    
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

    return matchesQuery && matchesStatus && matchesProduct && matchesUniverse && matchesSupport && matchesColor && matchesArgument && matchesPriority && matchesEnabled && matchesDate;
  }).sort((a, b) => {
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
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-4 bg-black/90 border-2 border-accent px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(0,255,148,0.3)] backdrop-blur-md"
          >
            <div className={`p-2 rounded-lg ${toast.type === 'calendar' ? 'bg-accent/20 text-accent' : 'bg-accent-blue/20 text-accent-blue'}`}>
              {toast.type === 'calendar' ? <Calendar size={20} /> : <Sparkles size={20} />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Système de Planification</span>
              <span className="text-sm font-bold text-white">{toast.message}</span>
            </div>
            <div className="w-10 h-10 border-r border-white/10 ml-2" />
            <div className="flex items-center gap-1 text-accent font-black text-xs animate-pulse">
              <Sparkles size={14} />
              SYNC
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        
        {/* Header */}
        <header className="px-10 py-10 flex justify-between items-center border-b border-white/5 relative overflow-hidden group bg-black/40 backdrop-blur-sm">
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
          <WaveEffect progress={avgProgress} color={waveColor} type={waveType} opacity={waveOpacity} />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10"></div>
          
          <div className="title-group relative z-10 flex items-center gap-6">
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
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:border-accent hover:text-accent transition-all active:scale-95 group relative shadow-2xl"
            >
              <Menu size={20} />
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
                fixed lg:static inset-y-0 left-0 w-full max-w-[450px] bg-[#0A0A0A] border-r border-border p-10 space-y-8 overflow-y-auto custom-scrollbar z-[110] transition-transform duration-500 lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}>
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
              const isCollapsed = collapsedCategories.includes(cat.id);
              const activeColor = 
                cat.colorRef === 'accent' ? 'text-accent border-accent bg-accent/5 shadow-[0_0_15px_-5px_var(--color-accent)]' :
                cat.colorRef === 'accent-blue' ? 'text-accent-blue border-accent-blue bg-accent-blue/5 shadow-[0_0_15px_-5px_var(--color-accent-blue)]' :
                cat.colorRef === 'accent-pink' ? 'text-accent-pink border-accent-pink bg-accent-pink/5 shadow-[0_0_15px_-5px_var(--color-accent-pink)]' :
                cat.colorRef === 'accent-purple' ? 'text-accent-purple border-accent-purple bg-accent-purple/5 shadow-[0_0_15px_-5px_var(--color-accent-purple)]' :
                cat.colorRef === 'accent-orange' ? 'text-accent-orange border-accent-orange bg-accent-orange/5 shadow-[0_0_15px_-5px_var(--color-accent-orange)]' :
                cat.colorRef === 'accent-red' ? 'text-accent-red border-accent-red bg-accent-red/5 shadow-[0_0_15px_-5px_var(--color-accent-red)]' :
                cat.colorRef === 'accent-yellow' ? 'text-accent-yellow border-accent-yellow bg-accent-yellow/5 shadow-[0_0_15px_-5px_var(--color-accent-yellow)]' :
                'text-accent border-accent bg-accent/5';

              const iconColor = 
                cat.colorRef === 'accent' ? 'text-accent' :
                cat.colorRef === 'accent-blue' ? 'text-accent-blue' :
                cat.colorRef === 'accent-pink' ? 'text-accent-pink' :
                cat.colorRef === 'accent-purple' ? 'text-accent-purple' :
                cat.colorRef === 'accent-orange' ? 'text-accent-orange' :
                cat.colorRef === 'accent-red' ? 'text-accent-red' :
                cat.colorRef === 'accent-yellow' ? 'text-accent-yellow' :
                'text-accent';

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
                      <cat.icon size={12} className={iconColor} />
                      {cat.name}
                    </label>
                    <motion.div
                      animate={{ rotate: isCollapsed ? -90 : 0 }}
                      className="text-text-dim/40 group-hover:text-accent transition-colors"
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
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
                                <>
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
                                  {cat.items
                                    .filter(item => item.toLowerCase().includes(selectedProduct.toLowerCase()))
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
                                  {cat.items.filter(item => item.toLowerCase().includes(selectedProduct.toLowerCase())).length === 0 && (
                                    <div className="px-4 py-3 text-[10px] text-white/30 italic">Aucun résultat</div>
                                  )}
                                </motion.div>
                              </>
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
                         {cat.items.map(item => (
                           <option key={item} value={item}>{item}</option>
                         ))}
                       </select>
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim group-focus-within:text-accent">
                         <ChevronRight size={14} className="rotate-90" />
                       </div>
                     </div>
                  ) : (
                    <div className={`grid gap-2 grid-cols-2`}>
                      {cat.items.map((item) => {
                        const isSelected = 
                          (cat.id === 'argument' && selectedArgument === item) ||
                          (cat.id === 'univers' && selectedUnivers === item) ||
                          (cat.id === 'format' && selectedFormat === item) ||
                          (cat.id === 'position' && selectedPosition === item) ||
                          (cat.id === 'support' && selectedSupport === item) ||
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
                              if (cat.id === 'support') setSelectedSupport(item);
                              if (cat.id === 'priority') setSelectedPriority(item);
                              if (cat.id === 'status') setSelectedStatus(item);
                            }}
                            className={`text-left p-2.5 rounded-md text-[11px] font-medium transition-all active:scale-95 border lowercase ${
                              isSelected
                                ? activeColor
                                : 'bg-card-bg border-border text-text-dim hover:border-slate-500 hover:text-white'
                            }`}
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
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                  {selectedSupport === 'video' ? <Film size={10} className="text-accent-purple" /> : <ImageIcon size={10} className="text-accent-purple" />}
                  {selectedSupport === 'video' ? 'Séquences Vidéo' : selectedSupport === 'graphisme' ? 'Visuels Graphiques' : 'Photos Requises'}
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
                  <>
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 scale-90 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </>
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
          <main className="p-10 bg-[#0F0F0F] overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full -z-10"></div>

            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col">
                  <h2 className="font-display text-4xl uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-purple animate-srgb">
                    {activeTab === 'table' ? 'Rapport de Production' : activeTab === 'dashboard' ? 'Tableau de Bord' : activeTab === 'journal' ? 'Journal de Bord' : 'Configuration Système'}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-text-dim">
                      Console Centrale / {activeTab.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto overflow-y-hidden custom-scrollbar max-w-full">
                  {[
                    { id: 'table', label: 'Rapport', icon: Activity },
                    { id: 'dashboard', label: 'Monitor', icon: BarChart3 },
                    { id: 'journal', label: 'Journal', icon: Clock },
                    { id: 'system', label: 'Système', icon: Settings }
                  ].map((tab) => (
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
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm shadow-2xl">
                    <div className="px-2 border-r border-white/10 hidden lg:block">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-dim/60">Synchro Flux</span>
                    </div>
                    <button 
                      onClick={() => document.getElementById('bulk-image-upload')?.click()}
                      className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-black active:scale-95 transition-all rounded shadow-md group"
                      title="Importer plusieurs images d'un coup"
                    >
                      <ImagePlus size={10} className="group-hover:scale-110 transition-transform" />
                      IMPORTER IMAGES
                    </button>
                    <button 
                      onClick={cleanupDuplicates}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white active:scale-95 transition-all rounded shadow-md"
                      title="Supprimer les missions en doublon"
                    >
                      <Trash2 size={10} />
                      NETTOYER DOUBLONS
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
                </div>
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

                    <button 
                      onClick={() => setHiddenColumns([])}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                        hiddenColumns.length === 0 
                          ? 'bg-accent text-black border-accent' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10 shadow-[0_0_15px_rgba(0,255,148,0.2)]'
                      }`}
                      title="Afficher toutes les colonnes"
                    >
                      <Maximize size={12} />
                      Vue Complète
                    </button>

                    <button 
                      onClick={() => {
                        const toHide = [
                          'imageUrl', 'color', 'argumentType', 'format', 'position', 'support', 
                          'priority'
                        ];
                        setHiddenColumns(toHide);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                        hiddenColumns.length >= 8 && hiddenColumns.length < 14
                          ? 'bg-accent-blue text-black border-accent-blue shadow-[0_0_15px_rgba(0,209,255,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                      title="Mode Compact (Masquer les détails)"
                    >
                      <Minimize size={12} />
                      Vue Compacte
                    </button>

                    <button 
                      onClick={() => {
                        const toHide = [
                          'missionNo', 'imageUrl', 'color', 'argumentType', 'univers', 'format', 
                          'position', 'support', 'priority', 'deadline', 'info', 'rating', 'progress'
                        ];
                        setHiddenColumns(toHide);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                        hiddenColumns.length >= 14
                          ? 'bg-accent-red text-white border-accent-red shadow-[0_0_15px_rgba(255,61,0,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                      title="Vue Minimale (Tout rétracter)"
                    >
                      <ChevronsLeft size={12} />
                      Tout Rétracter
                    </button>
                    
                    {hiddenColumns.length > 0 && (
                      <button 
                        onClick={() => setHiddenColumns([])}
                        className="flex items-center gap-1.5 px-2 py-1 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[8px] font-black uppercase tracking-widest rounded hover:bg-accent-purple hover:text-white transition-all ml-2"
                      >
                        <RotateCcw size={10} />
                        Restaurer ({hiddenColumns.length})
                      </button>
                    )}

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
                >
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
                          <div className="space-y-2 lg:col-span-2 xl:col-span-1">
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
                            label="État (Actif/Inactif)" 
                            icon={Power} 
                            items={['Actif', 'Inactif']} 
                            selected={filterEnabled} 
                            setSelected={setFilterEnabled} 
                            isOpen={isEnabledFilterOpen} 
                            setIsOpen={setIsEnabledFilterOpen} 
                            accentColor="text-accent-orange"
                          />

                          {/* Date Range Picker */}
                          <div className="space-y-2 lg:col-span-2 xl:col-span-2 2xl:col-span-1">
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
                        </div>

                        {/* Quick Actions & Summary */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          {(filterQuery || filterStatuses.length > 0 || filterProducts.length > 0 || filterColors.length > 0 || filterUniverses.length > 0 || filterSupports.length > 0 || filterArguments.length > 0 || filterPriorities.length > 0 || filterDateStart || filterDateEnd) && (
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
                    {(filterStatuses.length > 0 || filterProducts.length > 0 || filterUniverses.length > 0 || filterSupports.length > 0 || filterPriorities.length > 0 || filterDateStart || filterDateEnd) && (
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
                                          setHiddenColumns(prev => [...prev, h.id]);
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

                <tbody className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {filteredMissions.length === 0 ? (
                      <tr>
                        <td colSpan={1 + 18 - hiddenColumns.length} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Layers size={48} className="text-text-dim" />
                            <p className="text-xs uppercase tracking-[4px]">
                              {missions.length === 0 ? 'Base de données vide' : 'Aucun résultat pour ces filtres'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredMissions.map((m) => (
                        <motion.tr 
                          key={m.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -10 }}
                          onClick={() => setSelectedMissionId(m.id)}
                          className={`hover:bg-white/[0.04] transition-colors group relative cursor-pointer ${selectedMissionIds.includes(m.id) ? 'bg-white/[0.06]' : ''} ${isDuplicate(m) ? 'border-l-2 border-l-red-500 bg-red-500/5' : ''}`}
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
                          {!hiddenColumns.includes('product') && <td className="py-4 px-3 font-mono text-xs font-bold text-white/90">{m.product}</td>}
                          {!hiddenColumns.includes('color') && <td className="py-4 px-3 text-xs text-text-dim">{m.color}</td>}
                          {!hiddenColumns.includes('argumentType') && <td className="py-4 px-3 text-xs text-text-dim lowercase border-l border-white/5">{m.argumentType}</td>}
                          {!hiddenColumns.includes('univers') && <td className="py-4 px-3 text-xs text-text-dim">{m.univers}</td>}
                          {!hiddenColumns.includes('format') && <td className="py-4 px-3 text-xs text-text-dim">{m.format}</td>}
                          {!hiddenColumns.includes('position') && <td className="py-4 px-3 text-xs text-text-dim">{m.position}</td>}
                          {!hiddenColumns.includes('support') && (
                            <td className="py-4 px-3 text-center border-l border-white/5">
                              <div className="flex flex-col items-center">
                                <span className={`text-[10px] px-2 py-0.5 rounded text-white uppercase font-black tracking-tighter flex items-center gap-1.5 min-w-[75px] justify-center scale-90 transition-transform group-hover:scale-100 ${
                                  m.support === 'video' ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30 shadow-[0_0_10px_-4px_var(--color-accent-pink)]' : 
                                  m.support === 'photo' ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_-4px_var(--color-accent-blue)]' :
                                  'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 shadow-[0_0_10px_-4px_var(--color-accent-yellow)]'
                                }`}>
                                  {m.support === 'video' ? <Film size={10} /> : 
                                   m.support === 'photo' ? <ImageIcon size={10} /> :
                                   <Zap size={10} />}
                                  {m.support}
                                </span>
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
                              <input 
                                type="date"
                                value={m.deadline && m.deadline.includes('/') ? m.deadline.split('/').reverse().join('-') : m.deadline}
                                onChange={(e) => updateMission(m.id, { deadline: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-black/40 border border-white/5 rounded text-[9px] p-1 text-text-dim outline-none focus:border-accent/40 focus:text-white hover:border-white/10 transition-all font-mono w-full"
                              />
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
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Sparkles 
                                      key={star} 
                                      size={10} 
                                      className={m.rating! >= star ? 'text-accent-yellow fill-accent-yellow' : m.rating! >= star - 0.5 ? 'text-accent-yellow fill-accent-yellow opacity-50' : 'text-white/5'} 
                                    />
                                  ))}
                                </div>
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
                                      case 'livré': updates.progress = 100; break;
                                      case 'déja shooter': updates.progress = 75; break;
                                      case 'en cour de shoot': updates.progress = 50; break;
                                      case 'produit preparé': updates.progress = 25; break;
                                      case 'en attente': updates.progress = 0; break;
                                      case 'annuler': 
                                        updates.progress = 0;
                                        updates.photoCountDelivered = 0;
                                        break;
                                    }
                                    updateMission(m.id, updates);
                                  }}
                                  className={`text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1.5 w-full border bg-transparent appearance-none cursor-pointer focus:ring-1 focus:ring-accent-blue/30 outline-none transition-all ${
                                    m.status === 'livré' ? 'border-accent/40 text-accent bg-accent/5' :
                                    m.status === 'en cour de shoot' ? 'border-accent-blue/40 text-accent-blue bg-accent-blue/5' :
                                    m.status === 'produit preparé' ? 'border-accent-yellow/40 text-accent-yellow bg-accent-yellow/5' :
                                    m.status === 'annuler' ? 'border-accent-purple/40 text-accent-purple bg-accent-purple/5' :
                                    'border-white/10 text-text-dim bg-white/5'
                                  }`}
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
                                    m.progress === 100 ? 'text-accent' : 
                                    m.progress >= 50 ? 'text-accent-blue' : 
                                    'text-text-dim'
                                  }`}>
                                    {m.progress}%
                                  </span>
                                  {m.progress === 100 && <Check size={10} className="text-accent" />}
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
                                  step="5"
                                  value={m.progress}
                                  onClick={(e) => e.stopPropagation()}
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  onChange={(e) => updateMission(m.id, { progress: parseInt(e.target.value) })}
                                  className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent transition-all hover:h-1.5 focus:h-1.5"
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
                                onChange={(e) => updateMission(m.id, { photoCountDelivered: parseInt(e.target.value) || 0 })}
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
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            ) : (
              <MosaicView />
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </main>
</div>
</div>
</div>


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
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBulkStatusModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[400]"
            />
            <motion.div 
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
          </>
        )}
      </AnimatePresence>

      {/* Bulk Delete Confirm Modal */}
      <AnimatePresence>
        {isBulkDeleteModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500]"
            />
            <motion.div 
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
          </>
        )}
      </AnimatePresence>

      {/* Advanced Sort Modal */}
      <AnimatePresence>
        {isAdvancedSortOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdvancedSortOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300]"
            />
            <motion.div 
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
          </>
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
          />
        )}
      </AnimatePresence>

      {/* Import Configuration Modal */}
      <AnimatePresence>
        {showImportModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowImportModal(false); setPendingImports([]); }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[600]"
            />
            <motion.div 
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
          </>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[650]"
            />
            <motion.div 
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
          </>
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
            <p style={{ fontSize: '10px', fontWeight: '900', color: '#888888', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px 0' }}>Date d'Export</p>
            <p style={{ fontSize: '20px', color: '#FFFFFF', margin: '0 0 16px 0' }}>{new Date().toLocaleString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '80px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <p style={{ fontSize: '10px', color: '#888888', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 8px 0' }}>Total Missions</p>
            <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold' }}>{missions.length}</p>
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
            {missions.map(m => (
              <div key={m.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', opacity: m.enabled ? 1 : 0.6 }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <span style={{ fontSize: '18px', fontWeight: 'bold', color: m.enabled ? '#00FF94' : '#888888' }}>#{m.missionNo} — {m.product}</span>
                     {!m.enabled && <span style={{ fontSize: '8px', padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#888888', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '900' }}>Inactif</span>}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '900', padding: '4px 12px', borderRadius: '4px', border: m.status === 'livré' ? '1px solid #00FF94' : '1px solid rgba(255,255,255,0.2)', color: m.status === 'livré' ? '#00FF94' : '#FFFFFF', textTransform: 'uppercase' }}>{m.status}</span>
                </div>
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
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

        <div>
           <h2 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px', color: '#00D1FF', borderLeft: '4px solid #00D1FF', paddingLeft: '16px' }}>II. Performance (Journal de Bord)</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {globalLogs.slice().reverse().slice(0, 50).map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: '20px', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ minWidth: '140px', fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ 
                          fontSize: '8px', 
                          fontWeight: 'black', 
                          textTransform: 'uppercase', 
                          padding: '2px 8px', 
                          border: '1px solid',
                          borderColor: log.type === 'manual' ? '#00FF94' : log.type === 'instruction' ? '#A855F7' : '#00D1FF',
                          color: log.type === 'manual' ? '#00FF94' : log.type === 'instruction' ? '#A855F7' : '#00D1FF',
                          backgroundColor: 'rgba(255,255,255,0.05)'
                        }}>
                          {log.type}
                        </span>
                     </div>
                     <p style={{ margin: 0, fontSize: '12px', color: log.type === 'instruction' ? '#A855F7' : '#FFFFFF', fontWeight: log.type === 'instruction' ? 'bold' : 'normal' }}>
                       {log.message}
                     </p>
                  </div>
                </div>
              ))}
              {globalLogs.length > 50 && (
                <p style={{ fontSize: '10px', color: '#888888', fontStyle: 'italic', marginTop: '16px' }}>... + {globalLogs.length - 50} autres entrées (limitées à 50 pour l'export JPEG)</p>
              )}
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
    </div>
  );
}

function MissionDetailModal({ mission, onClose, onUpdate, onRemove, refIdColor, allStatuses }: { mission: Mission | null, onClose: () => void, onUpdate: (id: string, updates: Partial<Mission>) => void, onRemove: (id: string) => void, refIdColor: string, allStatuses: string[] }) {
  if (!mission) return null;

  const [isConfirming, setIsConfirming] = useState(false);

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
    if (nextStatus === 'livré') nextProgress = 100;
    if (nextStatus === 'annuler') nextProgress = 0;

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
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Photos Demandées</label>
                      <input 
                        type="number" 
                        min="0"
                        value={mission.photoCountRequested}
                        onChange={(e) => onUpdate(mission.id, { photoCountRequested: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/40 border border-white/10 rounded p-1 text-xs text-accent-purple font-bold outline-none focus:border-accent-purple/50"
                      />
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Photos Livrées</label>
                      <input 
                        type="number" 
                        min="0"
                        value={mission.photoCountDelivered}
                        onChange={(e) => onUpdate(mission.id, { photoCountDelivered: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/40 border border-white/10 rounded p-1 text-xs text-accent-pink font-bold outline-none focus:border-accent-pink/50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Qualification / Notation</span>
                      <span className="text-[14px] font-mono font-bold text-accent-yellow mt-1">{mission.rating || 0}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className="relative flex items-center h-6 w-6">
                          <button 
                            onClick={() => {
                              const newVal = star - 0.5;
                              onUpdate(mission.id, { rating: mission.rating === newVal ? 0 : newVal });
                            }}
                            className="absolute left-0 w-1/2 h-full z-10 cursor-pointer"
                          />
                          <button 
                            onClick={() => {
                              onUpdate(mission.id, { rating: mission.rating === star ? 0 : star });
                            }}
                            className="absolute right-0 w-1/2 h-full z-10 cursor-pointer"
                          />
                          <Sparkles 
                            size={16} 
                            fill={mission.rating && mission.rating >= star ? 'currentColor' : 'none'} 
                            className={`transition-all ${mission.rating && mission.rating >= star ? 'text-accent-yellow' : mission.rating && mission.rating >= star - 0.5 ? 'text-accent-yellow opacity-50' : 'text-white/10 hover:text-white/30'}`}
                          />
                        </div>
                      ))}
                    </div>
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
                      className="w-full bg-black/40 border border-white/10 rounded p-1 text-[11px] text-accent-yellow font-bold outline-none focus:border-accent-yellow/50"
                    />
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
                  <div className="pt-2">
                    <button 
                      onClick={cycleStatus}
                      className={`text-[10px] font-black px-3 py-1.5 uppercase rounded border transition-all hover:scale-105 active:scale-95 ${
                        mission.status === 'livré' ? 'border-accent text-accent bg-accent/5 shadow-[0_0_15px_rgba(0,255,148,0.1)]' :
                        mission.status === 'en cour de shoot' ? 'border-accent-blue text-accent-blue bg-accent-blue/5' :
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
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2 text-accent-purple">
                  <Clock size={12} />
                  Historique des Changements
                </h3>
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
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2 text-accent">
                  <ImageIcon size={12} />
                  Référence Visuelle
                </h3>
                <div className="aspect-video bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center group relative">
                   {mission.imageUrl ? (
                     <img src={mission.imageUrl} alt="Reference" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
}

function CategoryEditor({ category, onUpdate }: CategoryEditorProps) {
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

  const colorClass = 
    category.colorRef === 'accent' ? 'text-accent' :
    category.colorRef === 'accent-blue' ? 'text-accent-blue' :
    category.colorRef === 'accent-pink' ? 'text-accent-pink' :
    category.colorRef === 'accent-purple' ? 'text-accent-purple' :
    category.colorRef === 'accent-orange' ? 'text-accent-orange' :
    category.colorRef === 'accent-red' ? 'text-accent-red' :
    category.colorRef === 'accent-yellow' ? 'text-accent-yellow' :
    'text-accent';

  const borderColorClass = 
    category.colorRef === 'accent' ? 'hover:border-accent' :
    category.colorRef === 'accent-blue' ? 'hover:border-accent-blue' :
    category.colorRef === 'accent-pink' ? 'hover:border-accent-pink' :
    category.colorRef === 'accent-purple' ? 'hover:border-accent-purple' :
    category.colorRef === 'accent-orange' ? 'hover:border-accent-orange' :
    category.colorRef === 'accent-red' ? 'hover:border-accent-red' :
    category.colorRef === 'accent-yellow' ? 'hover:border-accent-yellow' :
    'hover:border-accent';

  const focusBorderClass = 
    category.colorRef === 'accent' ? 'focus:border-accent' :
    category.colorRef === 'accent-blue' ? 'focus:border-accent-blue' :
    category.colorRef === 'accent-pink' ? 'focus:border-accent-pink' :
    category.colorRef === 'accent-purple' ? 'focus:border-accent-purple' :
    category.colorRef === 'accent-orange' ? 'focus:border-accent-orange' :
    category.colorRef === 'accent-red' ? 'focus:border-accent-red' :
    category.colorRef === 'accent-yellow' ? 'focus:border-accent-yellow' :
    'focus:border-accent';

  return (
    <div className="p-6 bg-card-bg border border-border space-y-4">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 font-bold uppercase text-[11px] text-text-dim tracking-wider">
          <category.icon size={14} className={colorClass} />
          <span>Modifier {category.name}</span>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg border border-white/5">
          {availableColors.map((color) => (
            <button
              key={color.ref}
              onClick={() => onUpdate({ colorRef: color.ref })}
              title={color.name}
              className={`w-4 h-4 rounded-full transition-all hover:scale-125 ${
                color.ref === 'accent' ? 'bg-accent' :
                color.ref === 'accent-blue' ? 'bg-accent-blue' :
                color.ref === 'accent-pink' ? 'bg-accent-pink' :
                color.ref === 'accent-purple' ? 'bg-accent-purple' :
                color.ref === 'accent-orange' ? 'bg-accent-orange' :
                color.ref === 'accent-red' ? 'bg-accent-red' :
                'bg-accent-yellow'
              } ${category.colorRef === color.ref ? 'ring-2 ring-white ring-offset-2 ring-offset-card-bg' : 'opacity-40 hover:opacity-100'}`}
            />
          ))}
        </div>
        
        <span className="text-[8px] opacity-40 font-black tracking-[2px] uppercase">Drag items to Reorder</span>
      </div>
      
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
            className={`flex items-center gap-3 px-4 py-3 bg-app-bg border border-border group ${borderColorClass} cursor-grab active:cursor-grabbing hover:bg-white/[0.02] relative z-10 rounded-md`}
          >
            <div className="text-text-dim opacity-30 group-hover:opacity-100 transition-opacity shrink-0">
              <GripVertical size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <input 
                type="text" 
                value={item} 
                onChange={(e) => renameItem(idx, e.target.value)}
                className={`bg-transparent border-none outline-none text-[13px] font-bold w-full text-white focus:${colorClass} cursor-text tracking-wide`}
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
          className={`flex-1 px-4 py-2 bg-app-bg border border-border outline-none ${focusBorderClass} text-sm text-white`}
        />
        <button 
          onClick={addItem}
          className={`px-4 py-2 border border-current ${colorClass} uppercase text-[10px] font-black tracking-widest hover:bg-white/5 transition-all`}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
