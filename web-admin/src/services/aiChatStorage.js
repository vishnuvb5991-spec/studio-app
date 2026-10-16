import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'studio_ai_inquiries_cache';

// Helper: Extract potential phone number from text
export function extractContactDetails(messages = []) {
    let phone = null;
    let email = null;

    const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{9}\b/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    for (const msg of messages) {
        if (msg.role === 'user' && msg.text) {
            if (!phone) {
                const pMatch = msg.text.match(phoneRegex);
                if (pMatch) phone = pMatch[0].replace(/[\s-]/g, '');
            }
            if (!email) {
                const eMatch = msg.text.match(emailRegex);
                if (eMatch) email = eMatch[0];
            }
        }
    }

    return { phone, email };
}

// Generate or retrieve persistent session ID for the visitor
export function getOrCreateSessionId() {
    try {
        let sid = sessionStorage.getItem('studio_ai_session_id');
        if (!sid) {
            sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
            sessionStorage.setItem('studio_ai_session_id', sid);
        }
        return sid;
    } catch {
        return 'session_' + Date.now();
    }
}

// Save conversation turn to both Firestore and local storage backup
export async function logConversationTurn(sessionId, updatedMessages, language = 'en') {
    if (!sessionId || !Array.isArray(updatedMessages) || updatedMessages.length === 0) return;

    const { phone, email } = extractContactDetails(updatedMessages);
    const lastUserMessage = [...updatedMessages].reverse().find(m => m.role === 'user')?.text || '';

    const inquiryRecord = {
        sessionId,
        language,
        leadPhone: phone,
        leadEmail: email,
        lastQuery: lastUserMessage,
        messageCount: updatedMessages.length,
        updatedAt: new Date().toISOString(),
        messages: updatedMessages.map(m => ({
            role: m.role,
            text: m.text,
            timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
    };

    // 1. Update localStorage cache so the owner dashboard always has instant access
    try {
        const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        cached[sessionId] = inquiryRecord;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studio_ai_inquiry_update', { detail: inquiryRecord }));
        }
    } catch (err) {
        console.warn('[AI Storage] Local cache error:', err);
    }

    // 2. Sync to Firebase Firestore if online
    if (db) {
        try {
            const docRef = doc(db, 'studio_ai_inquiries', sessionId);
            await setDoc(docRef, inquiryRecord, { merge: true });
        } catch (firestoreErr) {
            console.warn('[AI Storage] Firestore sync error (using local backup):', firestoreErr.message);
        }
    }
}

// Fetch all AI inquiries for the Studio Owner Dashboard
export async function fetchAllAIInquiries() {
    const inquiriesMap = {};

    // 1. Load from localStorage cache
    try {
        const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        Object.assign(inquiriesMap, local);
    } catch (e) {
        // ignore
    }

    // 2. Fetch from Firebase Firestore
    if (db) {
        try {
            const colRef = collection(db, 'studio_ai_inquiries');
            const q = query(colRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            snapshot.forEach(docSnap => {
                inquiriesMap[docSnap.id] = { ...docSnap.data(), sessionId: docSnap.id };
            });
        } catch (firestoreErr) {
            console.warn('[AI Storage] Could not fetch from Firestore, falling back to local cache:', firestoreErr.message);
        }
    }

    const list = Object.values(inquiriesMap);
    list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    return list;
}
