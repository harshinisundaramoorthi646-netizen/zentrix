import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: { text: string; type: 'success' | 'error' | 'info' } | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#54E38E] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#FF7A8A] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#38E8FF] flex-shrink-0" />,
  };

  const borders = {
    success: 'border-[#54E38E]/40 shadow-[0_0_20px_rgba(84,227,142,0.2)]',
    error: 'border-[#FF7A8A]/40 shadow-[0_0_20px_rgba(255,122,138,0.2)]',
    info: 'border-[#38E8FF]/40 shadow-[0_0_20px_rgba(56,232,255,0.2)]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl bg-[#111722] border ${borders[message.type]} text-white text-sm flex items-center gap-3 shadow-2xl max-w-md backdrop-blur-xl`}>
        {icons[message.type]}
        <div className="flex-1 font-medium">{message.text}</div>
        {onClose && (
          <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
