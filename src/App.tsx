/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Copy, 
  Check, 
  ChevronRight,
  MapPin,
  X,
  Palette,
  Activity,
  Package,
  Target,
  Maximize,
  Layers,
  Film,
  Zap,
  Rocket,
  ClipboardCheck,
  Sparkles,
  Monitor,
  Smartphone,
  Square,
  Box,
  Image as ImageIcon,
  Clock,
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Bell,
  AlertCircle,
  AlertTriangle,
  Upload,
  Save,
  Download,
  Filter,
  Search,
  FilterX,
  Printer,
  FileText,
  GripVertical,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  type: 'info' | 'success' | 'alert' | 'manual';
  missionNo?: number;
  product?: string;
}

interface Mission {
  id: string;
  missionNo: number;
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
  info: string;
  imageUrl?: string;
  deadline?: string;
  createdAt: number;
  history: MissionLog[];
}

export default function App() {
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
      items: ['en attente', 'produit preparé', 'en cour de shoot', 'déja shooter', 'livré'],
      icon: ClipboardCheck,
      displayType: 'buttons',
      colorRef: 'accent'
    }
  ]);

  // State for missions
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionCounter, setMissionCounter] = useState(1);
  
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
  const [info, setInfo] = useState('');

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'calendar' | 'task' }>({ show: false, message: '', type: 'calendar' });
  
  // Filter state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Journal State
  const [globalLogs, setGlobalLogs] = useState<GlobalLogEntry[]>([]);
  const [activeView, setActiveView] = useState<'missions' | 'journal'>('missions');
  const [manualLog, setManualLog] = useState('');

  // Persistence logic
  useEffect(() => {
    const savedMissions = localStorage.getItem('missions');
    const savedCounter = localStorage.getItem('missionCounter');
    const savedCategories = localStorage.getItem('categories');
    const savedLogs = localStorage.getItem('globalLogs');
    
    if (savedMissions) setMissions(JSON.parse(savedMissions));
    if (savedCounter) setMissionCounter(JSON.parse(savedCounter));
    if (savedLogs) setGlobalLogs(JSON.parse(savedLogs));
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      // Need to restore icon component since icons aren't serializable
      const restored = parsed.map((cat: any) => {
        const original = categories.find(c => c.id === cat.id);
        return { ...cat, icon: original?.icon || Package };
      });
      setCategories(restored);
    }
  }, []);

  const performSave = useCallback(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
    localStorage.setItem('missionCounter', JSON.stringify(missionCounter));
    localStorage.setItem('globalLogs', JSON.stringify(globalLogs));
    const categoriesToSave = categories.map(({ icon, ...rest }) => rest);
    localStorage.setItem('categories', JSON.stringify(categoriesToSave));
  }, [missions, missionCounter, categories, globalLogs]);

  const saveToLocalStorage = () => {
    performSave();
    setToast({
      show: true,
      message: 'Données sauvegardées avec succès !',
      type: 'task'
    });
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

  const addMission = useCallback(() => {
    if (!selectedProduct) return;

    const getInitialProgress = (status: string) => {
      switch (status) {
        case 'livré': return 100;
        case 'déja shooter': return 75;
        case 'en cour de shoot': return 50;
        case 'produit preparé': return 25;
        default: return 0;
      }
    };

    const dateRegex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/;
    const noteDate = info.match(dateRegex);
    const finalDate = selectedDate || (noteDate ? noteDate[0] : '');

    const newMission: Mission = {
      id: Math.random().toString(36).substring(2, 9),
      missionNo: missionCounter,
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
      info,
      imageUrl: selectedImage || undefined,
      deadline: finalDate,
      createdAt: Date.now(),
      history: [
        { timestamp: Date.now(), message: 'Mission créée' }
      ]
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
    
    // Add to global log
    const logEntry: GlobalLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: `Nouvelle mission #${missionCounter} créée pour ${selectedProduct}`,
      type: 'success',
      missionNo: missionCounter,
      product: selectedProduct
    };
    setGlobalLogs(prev => [logEntry, ...prev]);

    setMissionCounter(prev => prev + 1);
    setInfo('');
    setSelectedDate('');
    setSelectedImage(null);
  }, [missionCounter, selectedProduct, selectedColor, selectedArgument, selectedUnivers, selectedFormat, selectedPosition, selectedSupport, selectedPriority, selectedStatus, info, selectedDate, selectedImage]);

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
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMission = (id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        let history = m.history ? [...m.history] : [];
        if (updates.status && updates.status !== m.status) {
          history.push({ timestamp: Date.now(), message: `Statut changé de "${m.status}" à "${updates.status}"` });
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

        const updated = { ...m, ...updates, history };
        
        // Add to global log if significant change
        if (updates.status || updates.priority) {
          const logEntry: GlobalLogEntry = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            message: updates.status 
              ? `Mission #${m.missionNo} : Statut changé à "${updates.status}"`
              : `Mission #${m.missionNo} : Priorité changée à "${updates.priority}"`,
            type: updates.priority === 'High priority' ? 'alert' : 'info',
            missionNo: m.missionNo,
            product: m.product
          };
          setGlobalLogs(prev => [logEntry, ...prev]);
        }

        // Sync progress if status changes manually
        if (updates.status) {
          switch (updates.status) {
            case 'livré': updated.progress = 100; break;
            case 'déja shooter': updated.progress = 75; break;
            case 'en cour de shoot': updated.progress = 50; break;
            case 'produit preparé': updated.progress = 25; break;
            case 'en attente': updated.progress = 0; break;
          }
        }
        return updated;
      }
      return m;
    }));
  };

  const removeMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      const logEntry: GlobalLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        message: `Mission #${mission.missionNo} supprimée de la base de données`,
        type: 'alert',
        missionNo: mission.missionNo,
        product: mission.product
      };
      setGlobalLogs(prev => [logEntry, ...prev]);
    }
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  const addManualLog = () => {
    if (!manualLog.trim()) return;
    const logEntry: GlobalLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      message: manualLog,
      type: 'manual'
    };
    setGlobalLogs(prev => [logEntry, ...prev]);
    setManualLog('');
  };

  const copyToExcel = async () => {
    if (missions.length === 0) return;

    // Excel headers
    const headers = ['N° Mission', 'Produit', 'Couleur', 'Type Argument', 'Univers', 'Format', 'Position', 'Support', 'Priorité', 'Échéance', 'Statut', 'Progression', 'Infos'];
    const rows = missions.map(m => [
      m.missionNo, m.product, m.color, m.argumentType, m.univers, 
      m.format, m.position, m.support, m.priority, m.deadline || '-', m.status, `${m.progress}%`, m.info
    ]);
    
    const tsv = [headers, ...rows].map(row => row.join('\t')).join('\n');

    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const generateGlobalReportPDF = async () => {
    const reportElement = document.getElementById('global-report-container');
    if (!reportElement) return;

    try {
      setIsGeneratingReport(true);
      // Temporarily set width for capture to ensure desktop-like layout
      const originalStyle = reportElement.style.display;
      reportElement.style.display = 'block';
      reportElement.style.width = '1200px';

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0A0A0A',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      const date = new Date().toISOString().split('T')[0];
      pdf.save(`Rapport_Production_Global_${date}.pdf`);

      reportElement.style.display = originalStyle;
      reportElement.style.width = '';
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const updateCategory = (catId: string, updates: Partial<CategoryConfig>) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...updates } : c));
  };

  const avgProgress = missions.length > 0 
    ? Math.round(missions.reduce((acc, m) => acc + m.progress, 0) / missions.length) 
    : 0;

  const filteredMissions = activeView === 'missions' ? missions.filter(m => {
    const matchesQuery = m.product.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         m.info.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         m.missionNo.toString().includes(filterQuery);
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || m.priority === filterPriority;
    return matchesQuery && matchesStatus && matchesPriority;
  }) : [];

  return (
    <div className="min-h-screen bg-app-bg text-white font-sans flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-black/90 border-2 border-accent px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(0,255,148,0.3)] backdrop-blur-md"
          >
            <div className={`p-2 rounded-lg ${toast.type === 'calendar' ? 'bg-accent/20 text-accent' : 'bg-accent-blue/20 text-accent-blue'}`}>
              {toast.type === 'calendar' ? <Calendar size={20} /> : <Bell size={20} />}
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
        <header className="px-10 py-8 flex justify-between items-end border-b border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent via-accent-purple to-accent-pink opacity-50 shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
          <div className="title-group relative z-10">
            <h1 className="font-display text-5xl leading-[0.9] uppercase tracking-[-2px] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 group-hover:animate-srgb transition-all duration-700">
              MISSION<br />CONTRÔLE
            </h1>
            <p className="text-[12px] text-accent font-bold mt-2 uppercase tracking-[2px] flex items-center gap-2">
              <Sparkles size={12} className="animate-pulse" />
              Advanced Production Suite v3.0
            </p>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-11 h-11 border border-border rounded-lg flex items-center justify-center hover:bg-card-bg hover:border-accent-blue hover:text-accent-blue transition-all active:scale-95 relative z-10"
            title="Paramètres"
          >
            <Settings size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] flex-1 overflow-hidden">
          
          {/* Main Input Form */}
          <aside className="p-10 border-r border-border space-y-8 overflow-y-auto custom-scrollbar">
            
            {/* Selection Categories */}
            {categories.map((cat) => {
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
                <div key={cat.id} className="flex flex-col gap-3">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-text-dim flex items-center gap-2">
                    <cat.icon size={12} className={iconColor} />
                    {cat.name}
                  </label>
                  
                  {cat.displayType === 'select' ? (
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
                </div>
              );
            })}

            <div className="flex flex-col gap-2 pt-4">
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
              <textarea 
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                placeholder="Instructions (utilisez /calendar ou /task pour planifier)"
                rows={2}
                className="w-full bg-card-bg border border-border p-3 rounded-md text-white outline-none focus:border-accent transition-all text-sm resize-none"
              />
              {info.startsWith('/') && (
                <div className="text-[9px] font-bold text-accent animate-pulse uppercase tracking-wider">
                  Commande détectée : {info.split(' ')[0]}
                </div>
              )}
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
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">Sauvegarder le rapport</span>
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

          {/* Table Section */}
          <main className="p-10 bg-[#0F0F0F] overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full -z-10"></div>

            <div className="flex flex-col gap-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                    <button 
                      onClick={() => setActiveView('missions')}
                      className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeView === 'missions' ? 'bg-accent text-black' : 'text-text-dim hover:text-white'
                      }`}
                    >
                      <Layers size={12} />
                      Production
                    </button>
                    <button 
                      onClick={() => setActiveView('journal')}
                      className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeView === 'journal' ? 'bg-accent-purple text-white' : 'text-text-dim hover:text-white'
                      }`}
                    >
                      <ClipboardCheck size={12} />
                      Journal de Bord
                      {globalLogs.length > 0 && (
                        <span className="bg-accent-purple/30 text-white px-1 rounded-full text-[8px]">{globalLogs.length}</span>
                      )}
                    </button>
                  </div>
                  
                  <div className="h-4 w-[1px] bg-white/10 mx-2" />

                  <h2 className="font-display text-2xl uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-accent-blue animate-srgb">
                    {activeView === 'missions' ? 'Rapport de Production' : 'Journal de Suivi'}
                  </h2>
                </div>
                
                <div className="flex items-center gap-4">
                  {activeView === 'missions' && (
                    <>
                      <button 
                        onClick={saveToLocalStorage}
                        className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent/20 transition-all border-dashed"
                        title="Sauvegarder le rapport localement"
                      >
                        <Save size={12} />
                        Sauvegarder
                      </button>
                      <button 
                        onClick={generateGlobalReportPDF}
                        disabled={isGeneratingReport}
                        className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/30 rounded text-accent-blue text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue/20 transition-all border-dashed disabled:opacity-50"
                        title="Exporter le rapport complet en PDF"
                      >
                        {isGeneratingReport ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        {isGeneratingReport ? 'Export...' : 'Rapport PDF'}
                      </button>
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
                    </>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-[11px] text-text-dim uppercase tracking-wider font-bold">
                        {missions.length} mission(s) active(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/5 border border-accent/20 rounded-full ring-1 ring-accent/10">
                      <Save size={10} className="text-accent animate-pulse" />
                      <span className="text-[9px] text-accent/80 uppercase font-black tracking-tighter">Auto-Save Activé</span>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isFilterVisible && activeView === 'missions' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                          <Search size={10} /> Recherche
                        </label>
                        <input 
                          type="text" 
                          value={filterQuery}
                          onChange={(e) => setFilterQuery(e.target.value)}
                          placeholder="Rechercher produit, info..."
                          className="w-full bg-black/40 border border-white/10 p-2.5 rounded text-sm text-white outline-none focus:border-accent-blue transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                          <ClipboardCheck size={10} /> Statut
                        </label>
                        <select 
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-2.5 rounded text-sm text-white outline-none focus:border-accent-blue transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">Tous les statuts</option>
                          {categories.find(c => c.id === 'status')?.items.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                          <AlertTriangle size={10} className="text-red-500" /> Priorité
                        </label>
                        <select 
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-2.5 rounded text-sm text-white outline-none focus:border-accent-blue transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">Toutes les priorités</option>
                          {categories.find(c => c.id === 'priority')?.items.map(p => (
                            <option key={p} value={p} className="bg-app-bg text-white">
                              {p === 'High priority' ? '⚠️ ' : ''}{p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeView === 'missions' && missions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Global Progress */}
                  <div className="bg-card-bg border border-border p-6 space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BarChart3 size={64} />
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-1">Avancement Global</p>
                        <h3 className="text-4xl font-display uppercase tracking-[-1px] animate-srgb">
                          {avgProgress}%
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-1">Total Tâches</p>
                        <p className="text-xl font-mono">{missions.length}</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 relative overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${avgProgress}%` }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent via-accent-blue to-accent-purple shadow-[0_0_15px_rgba(0,255,148,0.3)]"
                      />
                    </div>
                  </div>

                  {/* Performance Oscillations (Replaces Support Distribution) */}
                  <div className="bg-card-bg border border-border p-6 space-y-4 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Activity size={64} />
                    </div>
                    <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-3">Oscillations de Performance</p>
                    <div className="flex items-end gap-[2px] h-12 relative z-10">
                      {Array.from({ length: 40 }).map((_, i) => {
                        // Wave calculation
                        const amplitude = 20 + (avgProgress / 100) * 80;
                        const frequency = 0.2;
                        const h = amplitude * Math.abs(Math.sin(i * frequency));
                        
                        return (
                          <motion.div 
                            key={i}
                            initial={{ height: 2 }}
                            animate={avgProgress > 0 ? { 
                              height: [`${h * 0.5}%`, `${h}%`, `${h * 0.5}%`],
                              opacity: [0.3, 0.8, 0.3]
                            } : { height: '4%', opacity: 0.2 }}
                            transition={{ 
                              duration: Math.max(0.5, 3 - (avgProgress / 100) * 2.5), 
                              repeat: Infinity, 
                              delay: i * 0.05,
                              ease: "easeInOut"
                            }}
                            className="flex-1 bg-accent-purple"
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-text-dim/50">
                      <span>Signal.In</span>
                      <span className="text-accent-purple animate-pulse">Processing...</span>
                      <span>Signal.Out</span>
                    </div>
                  </div>

                  {/* Efficiency / Speed */}
                  <div className="bg-card-bg border border-border p-6 space-y-4 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={64} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-1">Efficacité</p>
                        <h3 className="text-2xl font-display uppercase tracking-[-1px] text-white">
                          {avgProgress > 80 ? 'Maximisée' : avgProgress > 40 ? 'Optimisée' : avgProgress > 0 ? 'En Progression' : 'En Attente'}
                        </h3>
                      </div>
                      <div className="py-1 px-3 bg-accent/10 border border-accent/20 rounded text-accent text-[10px] font-black uppercase tracking-tighter">
                        {avgProgress}% Power
                      </div>
                    </div>
                    <div className="flex gap-1 h-8 items-end">
                      {[40, 70, 45, 90, 65, 80, 55, 100].map((v, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 4 }}
                          animate={avgProgress > 0 ? { height: `${v}%` } : { height: '10%' }}
                          transition={avgProgress > 0 ? { 
                            repeat: Infinity, 
                            duration: Math.max(0.3, 2 - (avgProgress / 100) * 1.7), 
                            repeatType: 'reverse', 
                            delay: i * 0.1 
                          } : {}}
                          className={`flex-1 ${i % 2 === 0 ? 'bg-accent' : 'bg-accent-blue'} ${avgProgress > 0 ? 'opacity-40' : 'opacity-10'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              {activeView === 'missions' ? (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse min-w-[1300px]">
                <thead>
                  <tr className="border-b-2 border-border/50">
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent text-center w-12">N°</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-text-dim text-center w-16">Image</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-text-dim">Produit</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-text-dim">Couleur</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-blue">Argument</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-purple">Univers</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-yellow">Format</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-orange">Pos.</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-pink text-center w-28">Support</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-orange w-32">Priorité</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-yellow w-32">Échéance</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-text-dim max-w-[200px]">Notes</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-blue w-40">Statut</th>
                    <th className="text-left py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-purple w-40">Progression</th>
                    <th className="text-right py-4 px-3 text-[9px] font-bold uppercase tracking-wider text-accent-blue w-24">Fiche</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {filteredMissions.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-24 text-center">
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
                          className="hover:bg-white/[0.04] transition-colors group relative cursor-pointer"
                        >
                          <td className="py-4 px-3 font-mono text-[11px] text-accent/80">#{m.missionNo}</td>
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
                          <td className="py-4 px-3 font-mono text-xs font-bold text-white/90">{m.product}</td>
                          <td className="py-4 px-3 text-xs text-text-dim">{m.color}</td>
                          <td className="py-4 px-3 text-xs text-text-dim lowercase border-l border-white/5">{m.argumentType}</td>
                          <td className="py-4 px-3 text-xs text-text-dim">{m.univers}</td>
                          <td className="py-4 px-3 text-xs text-text-dim">{m.format}</td>
                          <td className="py-4 px-3 text-xs text-text-dim">{m.position}</td>
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
                          <td className="py-4 px-3 text-[10px] font-bold text-accent-yellow uppercase tracking-tighter">
                            {m.deadline || '-'}
                            {(m.info.includes('/calendar') || m.info.includes('/task')) && (
                              <div className="text-[8px] bg-accent/20 text-accent px-1 rounded mt-1 inline-block border border-accent/30">
                                planned
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-3 text-[10px] text-text-dim max-w-[200px] truncate" title={m.info}>
                            {m.info || <span className="opacity-20">-</span>}
                          </td>
                          <td className="py-4 px-3">
                            <div className="relative group/status">
                              <select 
                                value={m.status}
                                onChange={(e) => updateMission(m.id, { status: e.target.value })}
                                className={`text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1.5 w-full border bg-transparent appearance-none cursor-pointer focus:ring-1 focus:ring-accent-blue/30 outline-none transition-all ${
                                  m.status === 'livré' ? 'border-accent/40 text-accent bg-accent/5' :
                                  m.status === 'en cour de shoot' ? 'border-accent-blue/40 text-accent-blue bg-accent-blue/5' :
                                  m.status === 'produit preparé' ? 'border-accent-yellow/40 text-accent-yellow bg-accent-yellow/5' :
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
                              <input 
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={m.progress}
                                onChange={(e) => updateMission(m.id, { progress: parseInt(e.target.value) })}
                                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent transition-all hover:h-1.5 focus:h-1.5"
                              />
                            </div>
                          </td>
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
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <JournalView 
              logs={globalLogs} 
              onAddManualLog={addManualLog} 
              manualLog={manualLog} 
              setManualLog={setManualLog} 
            />
          )}
        </div>
          </main>
        </div>
      </div>

      {/* Settings Modal - Styled to match Bold theme */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsSettingsOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-app-bg w-full max-w-2xl rounded-none border border-border shadow-2xl relative z-10"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-accent flex items-center justify-center text-accent">
                      <Settings size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display uppercase tracking-tight">System.Config</h2>
                      <p className="text-[10px] text-text-dim uppercase tracking-[2px] font-bold">Personnaliser les listes</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-2 text-text-dim hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                  {categories.map((cat) => (
                    <CategoryEditor 
                      key={cat.id} 
                      category={cat} 
                      onUpdate={(updates) => updateCategory(cat.id, updates)}
                    />
                  ))}
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={saveToLocalStorage}
                    className="flex-1 py-4 bg-accent/20 border border-accent text-accent uppercase font-black tracking-widest text-sm hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Sauvegarder
                  </button>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white uppercase font-black tracking-widest text-sm hover:bg-white/10 transition-all"
                  >
                    Fermer
                  </button>
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
          />
        )}
      </AnimatePresence>

      {/* Hidden Global Report Template */}
      <div id="global-report-container" className="fixed top-[-9999px] left-[-9999px] bg-app-bg text-white p-20 font-sans" style={{ display: 'none' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-16 border-b-2 border-white/10 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent/20 flex items-center justify-center border-2 border-accent/50 text-accent">
                 <Box size={32} />
              </div>
              <h1 className="text-6xl font-display uppercase tracking-[-3px] leading-tight">Production<br/>Report</h1>
            </div>
            <p className="text-[12px] text-accent font-black tracking-[8px] uppercase">Advanced Production Suite V3.0</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Date d'Export</p>
            <p className="text-xl font-mono text-white mb-4">{new Date().toLocaleString()}</p>
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded uppercase text-[10px] font-black tracking-widest">
              Rapport d'Activité Global
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-8 mb-20">
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-2">Total Missions</p>
            <p className="text-4xl font-display text-white">{missions.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-2">Progression Moyenne</p>
            <p className="text-4xl font-display text-accent">{avgProgress}%</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-2">Missions Terminées</p>
            <p className="text-4xl font-display text-accent-blue">{missions.filter(m => m.status === 'livré').length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[10px] text-text-dim uppercase font-black tracking-widest mb-2">Logs Enregistrés</p>
            <p className="text-4xl font-display text-accent-purple">{globalLogs.length}</p>
          </div>
        </div>

        {/* Missions Detailed List */}
        <div className="mb-20">
          <h2 className="text-2xl font-display uppercase tracking-tight text-accent-blue mb-8 border-l-4 border-accent-blue pl-4">Liste des Missions Détaillée</h2>
          <div className="space-y-6">
            {missions.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 overflow-hidden">
                <div className="bg-white/10 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-white/10 to-transparent">
                  <span className="text-lg font-mono font-bold text-accent">#{m.missionNo} — {m.product}</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded border ${
                    m.status === 'livré' ? 'border-accent text-accent bg-accent/5' : 'border-white/20 text-white/50'
                  } uppercase`}>{m.status}</span>
                </div>
                  <div className="p-6 grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 text-[10px] uppercase font-bold text-text-dim tracking-wider">
                        <span>Couleur: <span className="text-white ml-2">{m.color}</span></span>
                        <span>Argument: <span className="text-white ml-2">{m.argumentType}</span></span>
                        <span className="mt-2">Univers: <span className="text-white ml-2">{m.univers}</span></span>
                        <span className="mt-2">Format: <span className="text-white ml-2">{m.format}</span></span>
                        <span className="mt-2">Position: <span className="text-white ml-2">{m.position}</span></span>
                        <span className="mt-2">Support: <span className="text-white ml-2">{m.support}</span></span>
                        <span className="mt-2">Date: <span className="text-white ml-2">{m.date}</span></span>
                        <span className="mt-2 text-red-500">Priorité: <span className="font-black ml-2">{m.priority}</span></span>
                      </div>
                      <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase text-accent-blue tracking-widest mb-2">Observations & Instructions Détaillées</p>
                        <p className="text-sm text-white/80 italic leading-relaxed bg-black/20 p-4 border-l-2 border-accent-blue/30 whitespace-pre-wrap">
                          {m.info || 'Aucune observation spécifique.'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase font-black mb-1">
                        <span className="text-text-dim">Avancement</span>
                        <span className="text-accent">{m.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                         <div className="h-full bg-accent" style={{ width: `${m.progress}%` }} />
                      </div>
                      
                      <p className="text-[10px] font-black uppercase text-accent-purple tracking-widest mb-3">Historique Complet</p>
                      <div className="space-y-2">
                         {m.history?.map((log, i) => (
                           <div key={i} className="flex gap-4 text-[10px] border-l border-white/10 pl-3">
                             <span className="text-text-dim font-mono">{new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                             <span className="text-white/70">{log.message}</span>
                           </div>
                         )).reverse()}
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Log */}
        <div>
          <h2 className="text-2xl font-display uppercase tracking-tight text-accent-purple mb-8 border-l-4 border-accent-purple pl-4">Journal de Production (Logs Globaux)</h2>
          <div className="space-y-2">
            {globalLogs.map((log, i) => (
              <div key={log.id} className="flex gap-10 py-3 border-b border-white/5 items-center group">
                <span className="text-[10px] font-mono text-text-dim w-32 shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  log.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  log.type === 'success' ? 'bg-accent' :
                  log.type === 'manual' ? 'bg-accent-blue' : 'bg-accent-purple'
                }`} />
                <span className="text-[11px] text-white/90">
                  {log.message}
                </span>
                {log.product && (
                  <span className="ml-auto text-[9px] font-bold text-accent-blue uppercase tracking-tighter opacity-50">
                    {log.product}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-40 border-t border-white/10 pt-10 text-center flex flex-col items-center gap-4">
          <p className="text-[10px] text-text-dim uppercase font-black tracking-[10px] mb-2">Fin du Rapport Documentaire Officiel</p>
          <div className="flex items-center gap-2">
            <Box size={16} className="text-accent opacity-30" />
            <div className="h-[1px] w-20 bg-white/10" />
            <div className="text-[8px] font-mono text-white/20">Generated by MISSION CONTRÔLE SYSTEM</div>
            <div className="h-[1px] w-20 bg-white/10" />
            <Sparkles size={16} className="text-accent opacity-30" />
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

        /* Fix for html2canvas oklab/oklch error - Force HEX/RGB inside export containers */
        #global-report-container, #mission-detail-content,
        #global-report-container *, #mission-detail-content * {
          --tw-bg-opacity: 1 !important;
          --tw-text-opacity: 1 !important;
          --tw-border-opacity: 1 !important;
        }

        #global-report-container .bg-white\\/5, #mission-detail-content .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
        #global-report-container .bg-white\\/10, #mission-detail-content .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
        #global-report-container .bg-accent\\/20, #mission-detail-content .bg-accent\\/20 { background-color: rgba(0, 255, 148, 0.2) !important; }
        #global-report-container .bg-accent\\/5, #mission-detail-content .bg-accent\\/5 { background-color: rgba(0, 255, 148, 0.05) !important; }
        #global-report-container .bg-accent-blue\\/10, #mission-detail-content .bg-accent-blue\\/10 { background-color: rgba(0, 209, 255, 0.1) !important; }
        #global-report-container .bg-black\\/20, #mission-detail-content .bg-black\\/20 { background-color: rgba(0, 0, 0, 0.2) !important; }
        
        #global-report-container .text-accent, #mission-detail-content .text-accent { color: #00FF94 !important; }
        #global-report-container .text-accent-blue, #mission-detail-content .text-accent-blue { color: #00D1FF !important; }
        #global-report-container .text-accent-purple, #mission-detail-content .text-accent-purple { color: #BD00FF !important; }
        #global-report-container .text-accent-pink, #mission-detail-content .text-accent-pink { color: #FF007A !important; }
        #global-report-container .text-red-500, #mission-detail-content .text-red-500 { color: #FF3B30 !important; }
        #global-report-container .text-text-dim, #mission-detail-content .text-text-dim { color: #888888 !important; }
        
        #global-report-container .border-white\\/10, #mission-detail-content .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
        #global-report-container .border-white\\/5, #mission-detail-content .border-white\\/5 { border-color: rgba(255, 255, 255, 0.05) !important; }
        #global-report-container .border-accent\\/50, #mission-detail-content .border-accent\\/50 { border-color: rgba(0, 255, 148, 0.5) !important; }
        #global-report-container .border-accent-blue\\/30, #mission-detail-content .border-accent-blue\\/30 { border-color: rgba(0, 209, 255, 0.3) !important; }
      `}</style>
    </div>
  );
}

function MissionDetailModal({ mission, onClose }: { mission: Mission | null, onClose: () => void }) {
  if (!mission) return null;

  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async (download = true): Promise<string | null> => {
    const element = document.getElementById('mission-detail-content');
    if (!element) return null;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1A1A1A',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      const fileName = `Mission_${mission.missionNo}_${mission.product.replace(/\s+/g, '_')}.pdf`;
      
      if (download) {
        pdf.save(fileName);
      }
      
      return pdf.output('datauristring');
    } catch (error) {
      console.error('PDF generation error:', error);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                  N°{mission.missionNo} — {mission.product}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button 
                onClick={() => generatePDF()}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 h-10 bg-accent/10 border border-accent/30 text-accent rounded text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {isExporting ? 'Génération...' : 'Exporter PDF'}
              </button>
              
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
                  <DetailItem label="Couleur" value={mission.color} />
                  <DetailItem label="Argument" value={mission.argumentType} />
                  <DetailItem label="Univers" value={mission.univers} />
                  <DetailItem label="Format" value={mission.format} />
                  <DetailItem label="Position" value={mission.position} />
                  <DetailItem label="Support" value={mission.support} color="text-accent-pink" />
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2">
                  <Clock size={12} className="text-accent-yellow" />
                  Temporalité
                </h3>
                <div className="space-y-2">
                  <DetailItem label="Date Création" value={new Date(mission.createdAt).toLocaleString()} />
                  <DetailItem label="Échéance" value={mission.deadline || 'Non définie'} color="text-accent-yellow" />
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-text-dim mb-4 flex items-center gap-2">
                  <ClipboardCheck size={12} className="text-accent-blue" />
                  Instructions
                </h3>
                <div className="p-4 bg-white/5 border border-white/5 text-sm text-white/80 italic leading-relaxed min-h-[80px]">
                  {mission.info || 'Aucune consigne spécifique.'}
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
                    <span className={`text-[10px] font-black px-3 py-1 uppercase rounded border ${
                      mission.status === 'livré' ? 'border-accent text-accent' :
                      mission.status === 'en cour de shoot' ? 'border-accent-blue text-accent-blue' :
                      'border-white/20 text-white/50'
                    }`}>
                      {mission.status}
                    </span>
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

function DetailItem({ label, value, color }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 group/item">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim group-hover/item:text-white transition-colors">{label}</span>
      <span className={`text-[11px] font-mono font-medium ${color || 'text-white'} group-hover/item:scale-105 transition-transform`}>{value}</span>
    </div>
  );
}

function JournalView({ logs, onAddManualLog, manualLog, setManualLog }: { 
  logs: GlobalLogEntry[], 
  onAddManualLog: () => void, 
  manualLog: string, 
  setManualLog: (val: string) => void 
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md shadow-2xl"
      >
         <h3 className="text-[11px] font-black uppercase tracking-widest text-accent-purple mb-4 flex items-center gap-2">
           <Plus size={14} /> Ajouter une note au journal
         </h3>
         <div className="flex flex-col gap-4">
           <textarea 
             value={manualLog}
             onChange={(e) => setManualLog(e.target.value)}
             placeholder="Saisissez une observation, un incident technique ou une mise à jour d'équipe..."
             className="w-full bg-black/40 border border-white/10 p-4 rounded text-sm text-white outline-none focus:border-accent-purple transition-all resize-none h-24 font-medium"
           />
           <button 
             onClick={onAddManualLog}
             disabled={!manualLog.trim()}
             className="px-6 py-3 bg-accent-purple text-white font-black uppercase text-[10px] tracking-widest rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 self-end disabled:opacity-30 disabled:grayscale"
           >
             <Rocket size={14} /> Enregistrer l'entrée
           </button>
         </div>
      </motion.div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-xl">
            <ClipboardCheck size={40} className="mx-auto text-white/10 mb-4" />
            <span className="text-text-dim text-[10px] uppercase font-black tracking-[4px] opacity-40">Journal de Bord Vide</span>
          </div>
        ) : (
          logs.map((log, idx) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 border-l-4 rounded-r-xl bg-white/[0.03] hover:bg-white/[0.05] transition-all border-white/10 flex justify-between items-start group shadow-lg ${
                log.type === 'success' ? 'border-l-accent' :
                log.type === 'alert' ? 'border-l-red-500' :
                log.type === 'manual' ? 'border-l-accent-purple' :
                'border-l-accent-blue'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-text-dim bg-white/5 px-2 py-0.5 rounded italic">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-tighter ${
                    log.type === 'success' ? 'bg-accent/20 text-accent' :
                    log.type === 'alert' ? 'bg-red-500/20 text-red-500' :
                    log.type === 'manual' ? 'bg-accent-purple/20 text-accent-purple' :
                    'bg-accent-blue/20 text-accent-blue'
                  }`}>
                    {log.type}
                  </span>
                  {log.missionNo && (
                    <span className="text-[10px] font-display font-black text-white/30 tracking-tight">MISSION #{log.missionNo}</span>
                  )}
                </div>
                <p className="text-[13px] text-white/80 leading-relaxed font-medium group-hover:text-white transition-colors">{log.message}</p>
                {log.product && (
                  <div className="text-[9px] text-accent-blue font-black uppercase tracking-widest flex items-center gap-1.5 mt-1 border-t border-white/5 pt-1.5 w-fit">
                    <Package size={8} /> {log.product}
                  </div>
                )}
              </div>
              <div className="text-[10px] font-mono text-text-dim self-start opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap ml-4">
                {new Date(log.timestamp).toLocaleDateString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
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
