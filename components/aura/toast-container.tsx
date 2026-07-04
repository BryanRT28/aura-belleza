'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContainerProps {
  messages?: ToastMessage[];
  onRemove?: (id: string) => void;
}

export function ToastContainer({ messages = [], onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <Toast
            key={msg.id}
            message={msg}
            onRemove={() => onRemove?.(msg.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastProps {
  message: ToastMessage;
  onRemove?: () => void;
}

export function Toast({ message, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove?.();
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message, onRemove]);

  const icon =
    message.type === 'success' ? (
      <CheckCircle size={20} className="text-green-500" />
    ) : message.type === 'error' ? (
      <AlertCircle size={20} className="text-red-500" />
    ) : null;

  const bgColor =
    message.type === 'success'
      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-700'
      : message.type === 'error'
        ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-700'
        : 'bg-card border-border';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: -100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: -100 }}
      transition={{ duration: 0.3 }}
      className={`${bgColor} border rounded-2xl p-4 flex items-center gap-3 shadow-lg pointer-events-auto max-w-sm`}
    >
      {icon}
      <p className="text-sm font-medium text-foreground flex-1">{message.text}</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
}

// Hook for using toast notifications
let toastCounter = 0;

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${++toastCounter}`;
    setMessages((prev) => [...prev, { id, text, type, duration: 3000 }]);
  };

  const removeToast = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return { messages, addToast, removeToast };
}
