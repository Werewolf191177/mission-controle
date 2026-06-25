import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Calendar, CheckSquare, Trash2, Loader2, Sparkles, Clock, 
  MessageSquare, Star, CheckCircle, AlertTriangle 
} from 'lucide-react';

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

interface SecondaryMissionDetailModalProps {
  mission: SecondaryMission | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<SecondaryMission>) => void;
  onRemove: (id: string) => void;
  sendToGoogleCalendar: (sm: SecondaryMission) => Promise<void>;
  sendToGoogleTasks: (sm: SecondaryMission) => Promise<void>;
  isExporting: Record<string, boolean>;
  googleToken: any;
}

export default function SecondaryMissionDetailModal({
  mission,
  onClose,
  onUpdate,
  onRemove,
  sendToGoogleCalendar,
  sendToGoogleTasks,
  isExporting,
  googleToken
}: SecondaryMissionDetailModalProps) {
  if (!mission) return null;

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(mission.title);
  const [note, setNote] = useState(mission.note);
  const [deadline, setDeadline] = useState(mission.deadline || '');
  const [priority, setPriority] = useState<"low" | "medium" | "high">(mission.priority);
  const [progress, setProgress] = useState(mission.progress);
  const [rating, setRating] = useState(mission.rating);

  const handleSave = () => {
    onUpdate(mission.id, {
      title,
      note,
      deadline: deadline || undefined,
      priority,
      progress,
      rating,
      status: progress >= 100 ? 'Mission Accomplie' : progress > 0 ? 'En cours' : 'A faire'
    });
    onClose();
  };

  const handleDelete = () => {
    onRemove(mission.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-[#111115] w-full max-w-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden rounded-xl"
      >
        {/* Header line decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink" />
        
        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
                <CheckSquare size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-accent-blue tracking-[3px]">Mission Secondaire</span>
                <h2 className="text-xl font-serif italic text-white mt-1 leading-tight max-w-[400px] truncate">{mission.title}</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title editing */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Titre de la Mission</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-lg text-sm text-white outline-none focus:border-accent-blue transition-all"
                placeholder="Entrez le titre..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Priority */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Priorité</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-3 px-1 border rounded-lg text-[9px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                        priority === p
                          ? p === 'high'
                            ? 'bg-red-500/15 border-red-500/40 text-red-400'
                            : p === 'medium'
                            ? 'bg-accent-yellow/15 border border-accent-yellow/40 text-accent-yellow'
                            : 'bg-accent-blue/15 border border-accent-blue/40 text-accent-blue'
                          : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {p === 'high' ? 'Haute' : p === 'medium' ? 'Moyenne' : 'Basse'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                  <Clock size={12} className="text-accent-blue" />
                  Echéance (Deadline)
                </label>
                <input 
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-3.5 rounded-lg text-sm text-white outline-none focus:border-accent-blue transition-all h-[46px]"
                />
              </div>
            </div>

            {/* Notes & Detailed Instructions */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim flex items-center gap-2">
                <MessageSquare size={12} className="text-accent-blue" />
                Notes & Consignes
              </label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Précisez les instructions détaillées pour cette mission secondaire..."
                rows={4}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-lg text-sm text-white outline-none focus:border-accent-blue transition-all resize-none"
              />
            </div>

            {/* Slider Progress */}
            <div className="space-y-3 bg-white/[0.02] border border-white/5 p-5 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Progression de l'Objectif</span>
                <span className="text-sm font-black text-accent-blue font-mono">{progress}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-[8px] font-black uppercase tracking-wider text-white/30 font-mono">
                <span>0%</span>
                <span>En Cours</span>
                <span>Terminée (100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Notation */}
              <div className="space-y-2 bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 mb-1">Intérêt (Notation)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-all hover:scale-125 ${rating >= star ? 'text-accent-yellow' : 'text-white/10 hover:text-white/30'}`}
                    >
                      <Star size={20} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-white/40 ml-2">({rating}/5)</span>
                </div>
              </div>

              {/* Google Workspace Synchronisations */}
              <div className="space-y-2 bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 flex items-center justify-between">
                  <span>Export Google Workspace</span>
                  {!googleToken && (
                    <span className="text-[8px] text-[#4285F4]/90 font-mono font-medium lowercase bg-[#4285F4]/10 border border-[#4285F4]/20 px-1.5 py-0.5 rounded">
                      non connecté
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    disabled={!googleToken || isExporting[`calendar-${mission.id}`]}
                    onClick={() => sendToGoogleCalendar({ ...mission, title, note, deadline, priority, progress, rating })}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-white/5 hover:bg-accent-yellow/10 border border-white/10 hover:border-accent-yellow/30 text-white/70 hover:text-accent-yellow rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isExporting[`calendar-${mission.id}`] ? (
                      <Loader2 size={12} className="animate-spin text-accent-yellow" />
                    ) : (
                      <Calendar size={12} />
                    )}
                    Agenda
                  </button>
                  <button
                    type="button"
                    disabled={!googleToken || isExporting[`tasks-${mission.id}`]}
                    onClick={() => sendToGoogleTasks({ ...mission, title, note, deadline, priority, progress, rating })}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-white/5 hover:bg-accent-blue/10 border border-white/10 hover:border-accent-blue/30 text-white/70 hover:text-accent-blue rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isExporting[`tasks-${mission.id}`] ? (
                      <Loader2 size={12} className="animate-spin text-accent-blue" />
                    ) : (
                      <CheckSquare size={12} />
                    )}
                    Tasks
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-white/5">
              {isConfirmingDelete ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                    <AlertTriangle size={14} /> Supprimer définitivement ?
                  </span>
                  <button
                    onClick={handleDelete}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg transition-all"
                  >
                    Oui, Supprimer
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold uppercase rounded-lg transition-all"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  Supprimer
                </button>
              )}
              
              <div className="flex-1" />

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial py-3 px-6 bg-gradient-to-r from-accent-blue to-accent-purple text-black rounded-lg text-xs font-extrabold uppercase tracking-wider hover:brightness-110 shadow-[0_4px_15px_rgba(0,209,255,0.2)] hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  Enregistrer
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
