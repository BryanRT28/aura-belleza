'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAura } from '@/context/AuraContext';
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialGreeting =
  '👋 ¡Hola! Soy Aura. ¿Sobre qué tratamiento o procedimiento te gustaría consultar?';

const quickResponses = [
  'Rinoplastia',
  'Botox',
  'Lifting',
  'Implantes',
];

let messageCounter = 0;

export function AuraAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-msg',
      text: initialGreeting,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { selectedTreatment } = useAura();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [isOpen])

  const sendMessageToAI = async (message: string, history: Message[],) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          selectedTreatment,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error del servidor');
      }

      const botMessage: Message = {
        id: `msg-bot-${++messageCounter}`,
        text: data.reply ?? 'No pude generar una respuesta.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error(error);

      const botMessage: Message = {
        id: `msg-bot-${++messageCounter}`,
        text:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al contactar con Aura AI.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-user-${++messageCounter}`,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');

    await sendMessageToAI(input, newHistory);
  };

  const handleQuickResponse = async (treatment: string) => {
    const userMessage: Message = {
      id: `msg-user-${++messageCounter}`,
      text: treatment,
      sender: 'user',
      timestamp: new Date(),
    };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    await sendMessageToAI(
      `Explícame el tratamiento ${treatment}`,
      newHistory,
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-[420px] h-[650px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-t-3xl flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <img
                    src="/aura-avatar.png"
                    alt="Aura"
                    className="w-11 h-11 rounded-full border-2 border-white"
                />

                <div>
                  <h3 className="font-semibold text-lg">
                    Aura
                  </h3>
                  <p className="text-xs opacity-90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    En línea
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-background">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${
                    msg.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <img
                      src="/aura-avatar.png"
                      alt="Aura"
                      className="w-9 h-9 rounded-full shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-3xl text-sm leading-6 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-secondary rounded-bl-md'
                    }`}
                  >
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-end gap-2"
                >
                  <img
                    src="/aura-avatar.png"
                    alt="Aura"
                    className="w-9 h-9 rounded-full"
                  />
                  <div className="bg-secondary px-4 py-3 rounded-3xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t border-border space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Tratamientos populares:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickResponses.map((treatment) => (
                    <motion.button
                      key={treatment}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickResponse(treatment)}
                      className="text-xs bg-secondary/50 text-foreground px-3 py-2 rounded-2xl hover:bg-secondary transition-colors"
                    >
                      {treatment}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border bg-card p-4 flex gap-3">
              <input
                disabled={isLoading}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <motion.button
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${
                          isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:scale-105'
                }`}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
