'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { AlertCircle, AlertTriangle, Info, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GlobalAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const { data: configData } = useQuery({
    queryKey: ['public-config'],
    queryFn: () => api.get('/public/config'),
    refetchInterval: 60000, // Poll every minute
  });

  const config = configData?.data;

  // Persistence: don't show again if dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('dismissed-alert');
    if (dismissed === config?.updatedAt) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [config]);

  if (!config?.globalAlertActive || !isVisible) return null;

  const stylesMap = {
    INFO: {
      bg: 'bg-blue-600',
      icon: Info,
      text: 'text-blue-50',
      label: 'Update'
    },
    WARNING: {
      bg: 'bg-amber-500',
      icon: AlertTriangle,
      text: 'text-amber-50',
      label: 'Notice'
    },
    EMERGENCY: {
      bg: 'bg-red-600',
      icon: Zap,
      text: 'text-red-50',
      label: 'Emergency SOS'
    }
  };

  const styles = stylesMap[config.globalAlertType as 'INFO' | 'WARNING' | 'EMERGENCY'] || stylesMap.INFO;

  const Icon = styles.icon;

  return (
    <div className={`relative z-[100] ${styles.bg} ${styles.text} py-3 px-4 shadow-2xl animate-in slide-in-from-top duration-500`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 animate-pulse">
            {Icon && <Icon size={16} className="text-white" />}
          </div>
          <div className="min-w-0">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-80 italic">
               System Pulse: {styles.label}
             </p>
             <h4 className="text-sm font-black italic uppercase tracking-tight truncate leading-none">
               {config.globalAlertTitle}: <span className="font-bold normal-case opacity-90 tracking-normal ml-2">{config.globalAlertMessage}</span>
             </h4>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setIsVisible(false);
            sessionStorage.setItem('dismissed-alert', config.updatedAt);
          }}
          className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
