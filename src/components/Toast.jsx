import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-5 right-5 z-50 animate-slideDown max-w-sm w-full px-4">
      <div className={`
        flex items-center gap-3 p-4 rounded-2xl border-2 shadow-modal-custom backdrop-blur-md text-xs font-bold
        ${isSuccess 
          ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500' 
          : 'bg-primary/95 text-darkText border-olive'
        }
      `}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-darkText flex-shrink-0" />
        )}
        <div className="flex-1">{toast.message}</div>
      </div>
    </div>
  );
};
