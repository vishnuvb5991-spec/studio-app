import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Camera, RefreshCw, Languages } from 'lucide-react';
import { sendChatMessage } from '../services/aiAssistantService';

const I18N = {
    en: {
        title: "Balan Studios AI",
        status: "Online • 09:00 AM - 08:30 PM",
        welcome: "Hello! Welcome to **Balan Studios**. ✨\n\nI am your 24/7 AI concierge. Ask me anything about our **wedding packages**, **personal portfolios**, **photo restoration**, or **booking a date**!",
        placeholder: "Ask about wedding packages, prices...",
        error: "I'm having a slight connection moment. Please call our studio directly at **+91 0000000000** or try again in a moment!",
        prompts: [
            { label: "💍 Wedding Packages", query: "Can you explain the wedding photography packages and pricing?" },
            { label: "📸 Personal Portfolio", query: "What are your Personal Portfolio and Model Shoot packages and prices?" },
            { label: "🖼️ Photo Restoration", query: "How does old photo restoration work and how much does it cost?" },
            { label: "📅 Book a Date", query: "I would like to check availability and book a date for our shoot." },
            { label: "🕒 Studio Timings", query: "What are your studio working hours and location in Kerala?" }
        ]
    },
    ml: {
        title: "ബാലൻ സ്റ്റുഡിയോസ് AI",
        status: "ലഭ്യമാണ് • 09:00 AM - 08:30 PM",
        welcome: "നമസ്കാരം! **ബാലൻ സ്റ്റുഡിയോസിലേക്ക്** സ്വാഗതം. ✨\n\nഞങ്ങളുടെ **വെഡ്ഡിംഗ് പാക്കേജുകൾ**, **മോഡൽ & പേഴ്സണൽ പോർട്ട്ഫോളിയോ**, **പഴയ ഫോട്ടോ റീസ്റ്റോറേഷൻ**, അല്ലെങ്കിൽ **ഡേറ്റ് ബുക്കിംഗ്** എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് എന്തും ചോദിക്കാം!",
        placeholder: "വെഡ്ഡിംഗ് പാക്കേജ്, ഫോട്ടോ റീസ്റ്റോറേഷൻ എന്നിവ ചോദിക്കൂ...",
        error: "കണക്ഷനിൽ ഒരു തടസ്സം നേരിടുന്നു. ദയവായി ഞങ്ങളുടെ സ്റ്റുഡിയോയുമായി **+91 0000000000** എന്ന നമ്പറിൽ ബന്ധപ്പെടുക അല്ലെങ്കിൽ അൽപം കഴിഞ്ഞ് ശ്രമിക്കുക!",
        prompts: [
            { label: "💍 വെഡ്ഡിംഗ് പാക്കേജുകൾ", query: "വെഡ്ഡിംഗ് ഫോട്ടോഗ്രഫി പാക്കേജുകളെയും നിരക്കുകളെയും കുറിച്ച് വിശദീകരിക്കാമോ?" },
            { label: "📸 പേഴ്സണൽ പോർട്ട്ഫോളിയോ", query: "മോഡൽ ഷൂട്ട്, പേഴ്സണൽ പോർട്ട്ഫോളിയോ പാക്കേജുകളുടെ വിവരങ്ങൾ എന്തൊക്കെയാണ്?" },
            { label: "🖼️ ഫോട്ടോ റീസ്റ്റോറേഷൻ", query: "പഴയതും കേടുവന്നതുമായ ഫോട്ടോകൾ എങ്ങനെയാണ് റീസ്റ്റോർ ചെയ്യുന്നത്? നിരക്ക് എത്രയാണ്?" },
            { label: "📅 ഡേറ്റ് ബുക്ക് ചെയ്യാൻ", query: "ഒരു ഇവന്റിനായി ഡേറ്റ് ലഭ്യമാണോ എന്ന് അറിയാനും ബുക്ക് ചെയ്യാനും ആഗ്രഹിക്കുന്നു." },
            { label: "🕒 സമയം & സ്ഥലം", query: "സ്റ്റുഡിയോയുടെ സമയവും കേരളത്തിലെ ലൊക്കേഷനും പറയാമോ?" }
        ]
    }
};

export default function StudioAIChatWidget({ onOpenBookingModal }) {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('studio_ai_lang') || 'en';
        } catch {
            return 'en';
        }
    });

    const currentI18n = I18N[language] || I18N.en;

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: currentI18n.welcome,
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

    // Handle switching language
    const handleLanguageChange = (newLang) => {
        if (newLang === language) return;
        setLanguage(newLang);
        try {
            localStorage.setItem('studio_ai_lang', newLang);
        } catch (e) {
            // ignore localStorage quota errors
        }

        // If conversation has only the welcome message, swap to new language welcome
        if (messages.length <= 1) {
            setMessages([
                {
                    role: 'assistant',
                    text: I18N[newLang].welcome,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    };

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
            const replyText = await sendChatMessage(query, updatedHistory, language);
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
                    text: currentI18n.error,
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
                <div key={idx} style={{ minHeight: line === '' ? '8px' : 'auto', margin: '3px 0', lineHeight: 1.6 }}>
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
                    <span style={{ letterSpacing: '0.2px' }}>
                        {language === 'ml' ? 'സ്റ്റുഡിയോ AI' : 'Ask Studio AI'}
                    </span>
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
                    width: '390px',
                    maxWidth: 'calc(100vw - 32px)',
                    height: '560px',
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
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #111827 0%, #1c1917 100%)',
                        borderBottom: '1px solid rgba(217, 119, 6, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                                position: 'relative'
                            }}>
                                <Camera size={18} color="#090d16" />
                                <span style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: '9px',
                                    height: '9px',
                                    backgroundColor: '#10b981',
                                    border: '2px solid #111827',
                                    borderRadius: '50%'
                                }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#fef3c7', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {currentI18n.title}
                                    <Sparkles size={12} color="#f59e0b" />
                                </h3>
                                <p style={{ margin: 0, fontSize: '10.5px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#34d399' }} />
                                    {currentI18n.status}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* Language Segmented Toggle */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '12px',
                                padding: '2px',
                                border: '1px solid rgba(217, 119, 6, 0.3)'
                            }}>
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    style={{
                                        background: language === 'en' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
                                        color: language === 'en' ? '#ffffff' : '#9ca3af',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '3px 8px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}
                                    title="English"
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('ml')}
                                    style={{
                                        background: language === 'ml' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
                                        color: language === 'ml' ? '#ffffff' : '#9ca3af',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '3px 8px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}
                                    title="മലയാളം"
                                >
                                    മലയാളം
                                </button>
                            </div>

                            <button
                                onClick={() => setMessages([{ role: 'assistant', text: currentI18n.welcome, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])}
                                title="Restart chat"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#9ca3af',
                                    padding: '5px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <RefreshCw size={14} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#9ca3af',
                                    padding: '5px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '14px',
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
                                        maxWidth: '86%',
                                        padding: '11px 15px',
                                        fontSize: '13px',
                                        lineHeight: 1.55,
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
                            {currentI18n.prompts.map((prompt, idx) => (
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
                            placeholder={currentI18n.placeholder}
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
