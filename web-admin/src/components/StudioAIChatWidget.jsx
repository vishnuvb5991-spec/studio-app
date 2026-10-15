import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Camera, RefreshCw } from 'lucide-react';
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
                    text: "I'm having a slight connection moment. Please call our studio directly at **+91 0000000000** or try again in a moment!",
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

    const formatMessageText = (text) => {
        if (!text) return '';
        const lines = text.split('\n');
        return lines.map((line, idx) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={idx} style={{ minHeight: line === '' ? '8px' : 'auto', margin: '3px 0', lineHeight: 1.5 }}>
                    {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                                <strong key={pIdx} style={{ fontWeight: 600, color: '#fef3c7' }}>
                                    {part.slice(2, -2)}
                                </strong>
                            );
                        }
                        return part;
                    })}
                </div>
            );
        });
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
            {/* ─── Floating Pill Launcher Button ─── */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '13px 20px',
                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '14px',
                        borderRadius: '50px',
                        border: '1px solid rgba(253, 230, 138, 0.4)',
                        boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 14px 28px -5px rgba(217, 119, 6, 0.65)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(217, 119, 6, 0.5)';
                    }}
                    aria-label="Open Studio AI Assistant"
                >
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Camera size={19} color="#ffffff" />
                        <Sparkles size={11} color="#fde68a" style={{ position: 'absolute', top: -4, right: -4 }} />
                    </div>
                    <span style={{ letterSpacing: '0.2px' }}>Ask Studio AI</span>
                    <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#34d399',
                        boxShadow: '0 0 8px #34d399'
                    }} />
                </button>
            )}

            {/* ─── Chat Window Card ─── */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    maxWidth: 'calc(100vw - 32px)',
                    height: '540px',
                    maxHeight: 'calc(100vh - 100px)',
                    backgroundColor: '#090d16',
                    border: '1px solid rgba(217, 119, 6, 0.35)',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(217, 119, 6, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'linear-gradient(135deg, #111827 0%, #1c1917 100%)',
                        borderBottom: '1px solid rgba(217, 119, 6, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                                position: 'relative'
                            }}>
                                <Camera size={19} color="#090d16" />
                                <span style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: '#10b981',
                                    border: '2px solid #111827',
                                    borderRadius: '50%'
                                }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#fef3c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Balan Studios AI
                                    <Sparkles size={13} color="#f59e0b" />
                                </h3>
                                <p style={{ margin: 0, fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }} />
                                    Online • 09:00 AM - 08:30 PM
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                                onClick={() => setMessages([messages[0]])}
                                title="Restart chat"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#9ca3af',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <RefreshCw size={15} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#9ca3af',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        backgroundColor: '#090d16'
                    }}>
                        {messages.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isUser ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '85%',
                                        padding: '11px 15px',
                                        fontSize: '13px',
                                        lineHeight: 1.5,
                                        borderRadius: '16px',
                                        borderTopRightRadius: isUser ? '2px' : '16px',
                                        borderTopLeftRadius: !isUser ? '2px' : '16px',
                                        background: isUser
                                            ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                                            : '#171e2e',
                                        color: isUser ? '#ffffff' : '#e2e8f0',
                                        border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                                        boxShadow: isUser ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none'
                                    }}>
                                        {formatMessageText(msg.text)}
                                    </div>
                                    <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                                        {msg.timestamp}
                                    </span>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div style={{
                                    backgroundColor: '#171e2e',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '16px',
                                    borderTopLeftRadius: '2px',
                                    padding: '12px 18px',
                                    display: 'flex',
                                    gap: '5px'
                                }}>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 1s infinite' }} />
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 1s infinite 0.2s' }} />
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 1s infinite 0.4s' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    {messages.length <= 2 && (
                        <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#0e1422',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                        }}>
                            {QUICK_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(prompt.query)}
                                    style={{
                                        fontSize: '11px',
                                        padding: '5px 10px',
                                        backgroundColor: '#1a2234',
                                        color: '#cbd5e1',
                                        border: '1px solid rgba(217, 119, 6, 0.3)',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(217, 119, 6, 0.2)';
                                        e.currentTarget.style.color = '#fef3c7';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1a2234';
                                        e.currentTarget.style.color = '#cbd5e1';
                                    }}
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <div style={{
                        padding: '12px 14px',
                        backgroundColor: '#0c101c',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about wedding packages, prices..."
                            style={{
                                flex: 1,
                                backgroundColor: '#141c2c',
                                color: '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '12px',
                                padding: '10px 14px',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            style={{
                                padding: '10px 13px',
                                background: !input.trim() || isLoading ? '#374151' : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: !input.trim() || isLoading ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Send size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
