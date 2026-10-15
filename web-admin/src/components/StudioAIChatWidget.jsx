import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Camera, Clock, MapPin, Calendar, RefreshCw, ChevronDown } from 'lucide-react';
import { sendChatMessage } from '../services/aiAssistantService';

const QUICK_PROMPTS = [
    { label: "💍 Wedding Packages", query: "Can you explain the wedding photography packages and pricing?" },
    { label: "🖼️ Photo Restoration", query: "How does old photo restoration work and how much does it cost?" },
    { label: "📅 Book a Date", query: "I would like to check availability and book a date for our event." },
    { label: "🕒 Timings & Location", query: "What are your studio working hours and location in Kerala?" }
];

export default function StudioAIChatWidget({ onOpenBookingModal }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Hello! Welcome to **Balan Studios**. ✨\n\nI am your 24/7 AI concierge. Ask me anything about our **wedding packages**, **cinematic films**, **heritage photo restoration**, or **booking a date**!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, messages, isLoading]);

    const handleSend = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query || isLoading) return;

        const userMsg = {
            role: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInput('');
        setIsLoading(true);

        try {
            const replyText = await sendChatMessage(query, updatedHistory);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    text: replyText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    text: "I'm having a slight connection moment. Please call our studio directly at **+91 0000000000** or try again in a few seconds!",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Render markdown-like bold text easily
    const formatMessageText = (text) => {
        if (!text) return '';
        const lines = text.split('\n');
        return lines.map((line, idx) => {
            // Replace **bold** with <strong>
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={idx} className={line === '' ? 'h-2' : 'my-0.5'}>
                    {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className="font-semibold text-amber-200">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* ─── Chat Floating Trigger Button ─── */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-semibold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/40 hover:shadow-amber-500/25 cursor-pointer"
                    aria-label="Open Studio AI Assistant"
                >
                    <div className="relative">
                        <Camera className="w-5 h-5 text-slate-950" />
                        <Sparkles className="w-3 h-3 text-white absolute -top-1 -right-1.5 animate-pulse" />
                    </div>
                    <span className="text-sm tracking-wide font-bold">Ask Studio AI</span>
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                </button>
            )}

            {/* ─── Chat Window Modal / Popup ─── */}
            {isOpen && (
                <div className="flex flex-col w-[380px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-100px)] bg-slate-950/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-b border-amber-500/20">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-md">
                                <Camera className="w-5 h-5 text-slate-950" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-amber-100 flex items-center gap-1.5">
                                    Balan Studios Assistant
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                </h3>
                                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Online • 09:00 AM - 08:30 PM
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setMessages([messages[0]])}
                                title="Reset conversation"
                                className="p-1.5 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-800/60 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close"
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
                        {messages.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                                            isUser
                                                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                                                : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-none shadow-inner'
                                        }`}
                                    >
                                        {formatMessageText(msg.text)}
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                                        {msg.timestamp}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex items-start">
                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    {messages.length <= 2 && (
                        <div className="px-3 py-2 bg-slate-900/40 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                            {QUICK_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(prompt.query)}
                                    className="text-[11px] px-2.5 py-1 bg-slate-800/70 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700/60 hover:border-amber-500/40 rounded-full transition-all text-left"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about wedding packages, pricing..."
                            className="flex-1 bg-slate-950/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 rounded-xl transition-all cursor-pointer"
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
