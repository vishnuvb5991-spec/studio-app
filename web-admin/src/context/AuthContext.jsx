import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { auth as firebaseAuth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../services/firebase';

const AuthContext = createContext(null);

// ── Environment-driven configuration ────────────────────────────────────────
// All sensitive values come from .env.production (gitignored).
// See web-admin/.env.example for the template.
const OWNER_PIN      = import.meta.env.VITE_OWNER_PIN          || '0000';
const OWNER_PHONE    = import.meta.env.VITE_STUDIO_PHONE        || '+91 0000000000';
const STUDIO_EMAIL   = import.meta.env.VITE_STUDIO_EMAIL        || 'admin@studio.com';
const SESSION_KEY    = import.meta.env.VITE_OWNER_SESSION_KEY   || 'studio-owner-session';
const DEMO_CUST_EMAIL = import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || 'demo@example.com';

// Owner emails allowed to sign in (comma-separated in env)
const OWNER_EMAILS   = (import.meta.env.VITE_OWNER_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

// Accepted owner passwords (comma-separated in env, first one is primary)
const OWNER_PASSWORDS = (import.meta.env.VITE_OWNER_PASSWORDS || '').split(',').map(p => p.trim()).filter(Boolean);
// ─────────────────────────────────────────────────────────────────────────────


// Helper for desktop push notifications
const sendBrowserNotification = (title, body) => {
    try {
        if (typeof Notification !== 'undefined') {
            if (Notification.permission === 'granted') {
                new Notification(title, {
                    body,
                    icon: '/favicon.ico'
                });
            } else if (Notification.permission === 'default') {
                Notification.requestPermission().then(perm => {
                    if (perm === 'granted') {
                        new Notification(title, {
                            body,
                            icon: '/favicon.ico'
                        });
                    }
                });
            }
        }
    } catch (e) {
        console.warn('Browser notification failed:', e);
    }
};

// Record notification to local storage and broadcast to listeners
export const recordNotification = (notif) => {
    try {
        const fullNotif = {
            id: notif.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            received_at: notif.received_at || new Date().toLocaleString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            timestamp: notif.timestamp || new Date().toISOString(),
            unread: notif.unread !== undefined ? notif.unread : true,
            ...notif
        };

        const existing = JSON.parse(localStorage.getItem('studio_admin_notifications') || '[]');
        const updated = [fullNotif, ...existing.filter(n => n.id !== fullNotif.id)].slice(0, 60);
        localStorage.setItem('studio_admin_notifications', JSON.stringify(updated));

        // Dispatch real-time DOM event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studio_notification_update', { detail: fullNotif }));
        }

        // Pop desktop notification
        sendBrowserNotification(fullNotif.title || '🚨 Balan Studios Alert', fullNotif.message || '');
        return fullNotif;
    } catch (e) {
        console.error('Error recording notification:', e);
        return notif;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('owner'); // 'owner' | 'customer'

    useEffect(() => {
        // Initial session check
        const storedUser = localStorage.getItem('current_user') || localStorage.getItem('demo_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.user_type === 'studio_owner' || parsed.id === 'owner-preetha') {
                    parsed.first_name = 'Balan';
                    parsed.last_name = '';
                    localStorage.setItem('current_user', JSON.stringify(parsed));
                }
                setUser(parsed);
                setViewMode(parsed.user_type === 'customer' ? 'customer' : 'owner');
            } catch (e) {}
        }

        // Supabase session check if online
        try {
            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
                if (session?.user) {
                    fetchUserProfile(session.user);
                } else {
                    setLoading(false);
                }
            }).catch(() => {
                setLoading(false);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                if (session?.user) {
                    await fetchUserProfile(session.user);
                }
                setLoading(false);
            });

            return () => subscription?.unsubscribe();
        } catch {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async (authUser) => {
        try {
            const isOwner = OWNER_EMAILS.includes(authUser.email?.toLowerCase()) ||
                            authUser.email?.includes('owner');

            const finalUser = {
                id: authUser.id,
                email: authUser.email,
                first_name: isOwner ? 'Studio' : (authUser.email?.split('@')[0] || 'Client'),
                last_name: isOwner ? 'Owner' : '',
                phone: isOwner ? OWNER_PHONE : '',
                user_type: isOwner ? 'studio_owner' : 'customer',
                is_superuser: isOwner,
            };

            setUser(finalUser);
            setViewMode(isOwner ? 'owner' : 'customer');
            localStorage.setItem('current_user', JSON.stringify(finalUser));
        } catch (err) {
            console.error('Error fetching Supabase profile:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper: list of approved customer emails
    const getApprovedCustomers = () => {
        try {
            return JSON.parse(localStorage.getItem('studio_approved_customers') || '[]');
        } catch {
            return [];
        }
    };

    // Helper: list of pending customer access requests
    const getAccessRequests = () => {
        try {
            return JSON.parse(localStorage.getItem('studio_access_requests') || '[]');
        } catch {
            return [];
        }
    };

    // Customer requests access with permission approval required
    const requestAccess = async ({ firstName, lastName, email, phone, eventType, message }) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        if (!cleanEmail) {
            return { success: false, error: 'Email is required' };
        }

        const newRequest = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            firstName: firstName || '',
            lastName: lastName || '',
            email: cleanEmail,
            phone: phone || '',
            eventType: eventType || 'Wedding Photography',
            message: message || '',
            requestedAt: new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            status: 'pending' // 'pending' | 'approved' | 'declined'
        };

        // Save into requests list
        try {
            const existingRequests = getAccessRequests();
            const filtered = existingRequests.filter(r => r.email !== cleanEmail);
            localStorage.setItem('studio_access_requests', JSON.stringify([newRequest, ...filtered]));
        } catch (e) {
            console.error('Error saving access request:', e);
        }

        // Notify Studio Owner immediately!
        recordNotification({
            id: `notif_${newRequest.id}`,
            type: 'access_request',
            title: '📋 New Customer Access Request',
            message: `${newRequest.firstName} ${newRequest.lastName} (${cleanEmail}, ${newRequest.phone}) has requested portal access for ${newRequest.eventType}. Owner permission required.`,
            client: `${newRequest.firstName} ${newRequest.lastName}`,
            email: cleanEmail,
            phone: newRequest.phone,
            event_type: newRequest.eventType,
            status: 'pending_approval',
            unread: true,
            requestId: newRequest.id
        });

        return {
            success: true,
            pendingApproval: true,
            message: 'Your access request has been sent to Balan Studios management. To protect client privacy, all accounts require owner approval before entry. You will be notified once approved.'
        };
    };

    // Owner approves a customer's access
    const approveCustomerAccess = (requestIdOrEmail) => {
        try {
            const requests = getAccessRequests();
            let targetEmail = requestIdOrEmail;

            const updatedRequests = requests.map(req => {
                if (req.id === requestIdOrEmail || req.email.toLowerCase() === requestIdOrEmail.toLowerCase()) {
                    targetEmail = req.email;
                    return { ...req, status: 'approved' };
                }
                return req;
            });
            localStorage.setItem('studio_access_requests', JSON.stringify(updatedRequests));

            const approvedList = getApprovedCustomers();
            const lowerEmail = targetEmail.toLowerCase();
            if (!approvedList.includes(lowerEmail)) {
                approvedList.push(lowerEmail);
                localStorage.setItem('studio_approved_customers', JSON.stringify(approvedList));
            }

            // Record confirmation notification
            recordNotification({
                type: 'approval_confirmed',
                title: '✅ Customer Access Approved',
                message: `Portal access granted to customer ${targetEmail}.`,
                email: targetEmail,
                unread: false
            });

            return true;
        } catch (e) {
            console.error('Error approving customer:', e);
            return false;
        }
    };

    // Owner rejects a customer's access
    const rejectCustomerAccess = (requestIdOrEmail) => {
        try {
            const requests = getAccessRequests();
            const updatedRequests = requests.map(req => {
                if (req.id === requestIdOrEmail || req.email.toLowerCase() === requestIdOrEmail.toLowerCase()) {
                    return { ...req, status: 'declined' };
                }
                return req;
            });
            localStorage.setItem('studio_access_requests', JSON.stringify(updatedRequests));

            const approvedList = getApprovedCustomers();
            const filtered = approvedList.filter(e => e.toLowerCase() !== requestIdOrEmail.toLowerCase());
            localStorage.setItem('studio_approved_customers', JSON.stringify(filtered));

            recordNotification({
                type: 'approval_declined',
                title: '🚫 Customer Access Declined',
                message: `Access declined for ${requestIdOrEmail}.`,
                email: requestIdOrEmail,
                unread: false
            });

            return true;
        } catch (e) {
            console.error('Error declining customer:', e);
            return false;
        }
    };

    // Check if the current device is verified and trusted by the Studio Owner
    const isOwnerDeviceTrusted = () => {
        try {
            return localStorage.getItem('studio_owner_trusted_device') === 'true';
        } catch {
            return false;
        }
    };

    // Verify Owner Master PIN (loaded from VITE_OWNER_PIN env var)
    const verifyOwnerPin = async (enteredPin, trustDevice = true) => {
        const cleanPin = (enteredPin || '').trim();
        const storedPin = localStorage.getItem('studio_owner_pin') || OWNER_PIN;
        const validPins = [storedPin, OWNER_PIN].filter(Boolean);

        if (validPins.includes(cleanPin)) {
            if (trustDevice) {
                localStorage.setItem('studio_owner_trusted_device', 'true');
            }
            const ownerUser = {
                id: 'owner-balan',
                email: STUDIO_EMAIL,
                first_name: 'Balan',
                last_name: '',
                phone: OWNER_PHONE,
                user_type: 'studio_owner',
                is_superuser: true,
            };
            localStorage.setItem('current_user', JSON.stringify(ownerUser));
            localStorage.setItem('access_token', SESSION_KEY);
            setUser(ownerUser);
            setViewMode('owner');

            recordNotification({
                type: 'owner_login',
                title: '👑 Studio Owner Verified via PIN',
                message: `Owner verified with Master PIN and signed in at ${new Date().toLocaleTimeString()}.`,
                email: STUDIO_EMAIL,
                unread: false
            });

            return { success: true, user: ownerUser };
        } else {
            recordNotification({
                type: 'security_violation',
                title: '🚨 Failed Owner PIN Attempt!',
                message: `Someone entered an incorrect PIN while attempting Studio Owner access at ${new Date().toLocaleTimeString()}. Access blocked.`,
                email: STUDIO_EMAIL,
                unread: true
            });
            return {
                success: false,
                error: 'Incorrect Owner PIN. This unauthorized attempt has been logged and the Studio Owner has been notified.'
            };
        }
    };

    // SECURE LOGIN:
    // 1. Studio Owner demo credentials (from env VITE_STUDIO_EMAIL / VITE_OWNER_PASSWORDS):
    //    Auto-signs in on trusted devices. On any other device prompts for Owner Master PIN.
    // 2. Customer demo credentials (from env VITE_DEMO_CUSTOMER_EMAIL):
    //    Requires owner approval. Visitors cannot enter without permission.
    // 3. Owner emails (from env VITE_OWNER_EMAILS) with password verification.
    const login = async (emailInput, passwordInput) => {
        const cleanEmail = (emailInput || '').trim().toLowerCase();
        const cleanPassword = (passwordInput || '').trim();

        if (!cleanEmail || !cleanPassword) {
            return { success: false, error: 'Email and password are required.' };
        }

        // 👑 1. SAMPLE ADMIN / STUDIO OWNER QUICK ROLE
        if (cleanEmail === STUDIO_EMAIL.toLowerCase() || OWNER_PASSWORDS.includes(cleanPassword)) {
            if (isOwnerDeviceTrusted()) {
                const ownerUser = {
                    id: 'owner-balan',
                    email: STUDIO_EMAIL,
                    first_name: 'Balan',
                    last_name: '',
                    phone: OWNER_PHONE,
                    user_type: 'studio_owner',
                    is_superuser: true,
                };
                localStorage.setItem('current_user', JSON.stringify(ownerUser));
                localStorage.setItem('access_token', SESSION_KEY);
                setUser(ownerUser);
                setViewMode('owner');

                recordNotification({
                    type: 'owner_login',
                    title: '👑 Studio Owner Auto-Authorized',
                    message: `Owner signed in on trusted device at ${new Date().toLocaleTimeString()}.`,
                    email: STUDIO_EMAIL,
                    unread: false
                });

                return { success: true, user: ownerUser };
            }

            // Unrecognized device: Challenge with Owner Master PIN!
            recordNotification({
                type: 'security_alert',
                title: '🚨 Sample Admin Sign-In Attempted',
                message: `Someone tried to sign in using Studio Owner sample credentials on an unrecognized device at ${new Date().toLocaleTimeString()}. PIN challenge issued.`,
                email: cleanEmail,
                unread: true
            });

            return {
                success: false,
                requireOwnerPin: true,
                error: 'Owner Security Verification: Sample credentials require Owner Master PIN on unrecognized devices. Enter PIN to verify owner identity.'
            };
        }

        // 👤 2. SAMPLE CLIENT / CUSTOMER QUICK ROLE
        if (cleanEmail === DEMO_CUST_EMAIL.toLowerCase()) {
            const approvedCustomers = getApprovedCustomers();
            const isApproved = approvedCustomers.some(e => e.toLowerCase() === cleanEmail);

            if (!isApproved) {
                recordNotification({
                    type: 'access_request',
                    title: '👤 Customer Portal Access Attempt',
                    message: `A visitor clicked Client Demo / sample credentials (${cleanEmail}) at ${new Date().toLocaleTimeString()}. Owner permission required.`,
                    email: cleanEmail,
                    client: 'Sample Client (Demo)',
                    phone: '',
                    event_type: 'Photography Session',
                    status: 'pending_approval',
                    unread: true
                });

                return {
                    success: false,
                    pendingApproval: true,
                    error: 'Customer Access Restricted: Portal access requires Balan Studios owner permission. A notification has been sent to the owner for approval.'
                };
            }

            const customerUser = {
                id: 'cust_demo',
                email: cleanEmail,
                first_name: cleanEmail.split('@')[0],
                last_name: '',
                phone: '',
                user_type: 'customer',
                is_superuser: false,
            };
            localStorage.setItem('current_user', JSON.stringify(customerUser));
            setUser(customerUser);
            setViewMode('customer');
            return { success: true, user: customerUser };
        }

        // 👑 3. STUDIO OWNER AUTHENTICATION BY EMAIL
        const isOwnerEmail = OWNER_EMAILS.includes(cleanEmail);

        if (isOwnerEmail) {
            const storedOwnerPass = localStorage.getItem('studio_owner_password') || OWNER_PASSWORDS[0] || '';

            if (cleanPassword === storedOwnerPass || OWNER_PASSWORDS.includes(cleanPassword)) {
                const ownerUser = {
                    id: 'owner-balan',
                    email: cleanEmail,
                    first_name: 'Balan',
                    last_name: '',
                    phone: OWNER_PHONE,
                    user_type: 'studio_owner',
                    is_superuser: true,
                };
                localStorage.setItem('current_user', JSON.stringify(ownerUser));
                localStorage.setItem('access_token', SESSION_KEY);
                setUser(ownerUser);
                setViewMode('owner');

                recordNotification({
                    type: 'owner_login',
                    title: '👑 Studio Owner Signed In',
                    message: `Owner signed in securely to Balan Studios Command Center at ${new Date().toLocaleTimeString()}.`,
                    email: cleanEmail,
                    unread: false
                });

                return { success: true, user: ownerUser };
            } else {
                recordNotification({
                    type: 'security_alert',
                    title: '🚨 Failed Owner Login Attempt',
                    message: `Failed sign-in attempt on owner email (${cleanEmail}) with wrong password at ${new Date().toLocaleTimeString()}.`,
                    email: cleanEmail,
                    unread: true
                });
                return { success: false, error: 'Invalid owner password. Please verify your credentials.' };
            }
        }

        // 👤 4. CUSTOMER PORTAL AUTHENTICATION (REQUIRES OWNER APPROVAL)
        const approvedCustomers = getApprovedCustomers();
        const isApproved = approvedCustomers.some(e => e.toLowerCase() === cleanEmail);

        if (!isApproved) {
            const requests = getAccessRequests();
            const matchingReq = requests.find(r => r.email.toLowerCase() === cleanEmail);

            recordNotification({
                type: 'unapproved_login',
                title: '🚨 Unapproved Customer Access Attempt',
                message: `${matchingReq?.firstName || ''} ${cleanEmail} attempted to sign in without owner permission at ${new Date().toLocaleTimeString()}.`,
                email: cleanEmail,
                unread: true
            });

            return {
                success: false,
                error: `Access Denied: Your customer account is pending approval by Balan Studios owner. You cannot sign in without permission. Please contact ${OWNER_PHONE} or submit an Access Request.`
            };
        }

        // If approved customer:
        const customerUser = {
            id: `cust_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
            email: cleanEmail,
            first_name: cleanEmail.split('@')[0],
            last_name: '',
            phone: '',
            user_type: 'customer',
            is_superuser: false,
        };
        localStorage.setItem('current_user', JSON.stringify(customerUser));
        localStorage.setItem('access_token', `cust_token_${Date.now()}`);
        setUser(customerUser);
        setViewMode('customer');

        recordNotification({
            type: 'customer_login',
            title: '👤 Customer Signed In',
            message: `Approved client (${cleanEmail}) signed in to customer portal at ${new Date().toLocaleTimeString()}.`,
            email: cleanEmail,
            unread: false
        });

        return { success: true, user: customerUser };
    };

    // 🌐 Sign in with Google (Firebase Auth) with Automatic Role Detection & Access Control
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const fbUser = result.user;
            const cleanEmail = (fbUser.email || '').trim().toLowerCase();

            // Automatic Role Detection: check if signed-in email is in Studio Owner list
            const isOwner = OWNER_EMAILS.includes(cleanEmail) || cleanEmail.includes('owner');

            if (isOwner) {
                const finalUser = {
                    id: fbUser.uid,
                    email: cleanEmail,
                    first_name: fbUser.displayName ? fbUser.displayName.split(' ')[0] : 'Studio',
                    last_name: fbUser.displayName ? fbUser.displayName.split(' ').slice(1).join(' ') : 'Owner',
                    photo_url: fbUser.photoURL || '',
                    phone: OWNER_PHONE,
                    user_type: 'studio_owner',
                    is_superuser: true,
                    auth_provider: 'google'
                };

                setUser(finalUser);
                setViewMode('owner');
                localStorage.setItem('current_user', JSON.stringify(finalUser));
                localStorage.setItem('studio_owner_trusted_device', 'true');

                recordNotification({
                    type: 'owner_login',
                    title: '👑 Studio Owner Signed In (Google)',
                    message: `${finalUser.first_name} ${finalUser.last_name} (${cleanEmail}) signed in via Google at ${new Date().toLocaleTimeString()}.`,
                    email: cleanEmail,
                    unread: false
                });

                return { success: true, user: finalUser, isOwner: true };
            }

            // 👤 Customer Access Control: Check if customer Google account is approved
            const approvedCustomers = getApprovedCustomers();
            const isApproved = approvedCustomers.some(e => e.toLowerCase() === cleanEmail);

            if (!isApproved) {
                // Parse Google display name
                const displayName = fbUser.displayName || '';
                const parts = displayName.trim().split(' ');
                const gFirstName = parts[0] || cleanEmail.split('@')[0];
                const gLastName = parts.slice(1).join(' ') || '';
                const gPhone = fbUser.phoneNumber || '';

                const existingRequests = getAccessRequests();
                const alreadyRequested = existingRequests.some(r => r.email.toLowerCase() === cleanEmail);

                if (!alreadyRequested) {
                    await requestAccess({
                        firstName: gFirstName,
                        lastName: gLastName,
                        email: cleanEmail,
                        phone: gPhone || 'Google Account',
                        eventType: 'Client Portal (Google Sign-In)',
                        message: `Client requested access using Google account (${cleanEmail}).`
                    });
                } else {
                    recordNotification({
                        type: 'unapproved_login',
                        title: '🚨 Pending Google Client Sign-In Attempt',
                        message: `${gFirstName} (${cleanEmail}) tried to sign in with Google while awaiting owner approval at ${new Date().toLocaleTimeString()}.`,
                        email: cleanEmail,
                        unread: true
                    });
                }

                return {
                    success: false,
                    pendingApproval: true,
                    clientEmail: cleanEmail,
                    clientName: gFirstName,
                    error: `Access Pending Approval: Your Google account (${cleanEmail}) has been registered and is awaiting Balan Studios owner permission.`
                };
            }

            // If approved customer:
            const customerUser = {
                id: fbUser.uid,
                email: cleanEmail,
                first_name: fbUser.displayName ? fbUser.displayName.split(' ')[0] : cleanEmail.split('@')[0],
                last_name: fbUser.displayName ? fbUser.displayName.split(' ').slice(1).join(' ') : '',
                photo_url: fbUser.photoURL || '',
                phone: fbUser.phoneNumber || '',
                user_type: 'customer',
                is_superuser: false,
                auth_provider: 'google'
            };

            setUser(customerUser);
            setViewMode('customer');
            localStorage.setItem('current_user', JSON.stringify(customerUser));
            localStorage.setItem('access_token', `cust_token_${Date.now()}`);

            recordNotification({
                type: 'customer_login',
                title: '👤 Client Signed In (Google)',
                message: `Approved client (${customerUser.first_name} - ${cleanEmail}) signed in via Google at ${new Date().toLocaleTimeString()}.`,
                email: cleanEmail,
                unread: false
            });

            return { success: true, user: customerUser, isOwner: false };
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                return { success: false, cancelled: true };
            }
            return {
                success: false,
                error: error.message || 'Google sign-in failed. Please try again.'
            };
        }
    };

    // Logout
    const logout = async () => {
        localStorage.removeItem('current_user');
        localStorage.removeItem('demo_user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        try {
            await firebaseSignOut(firebaseAuth).catch(() => {});
        } catch {}
        try {
            await supabase.auth.signOut().catch(() => {});
        } catch {}
        setUser(null);
        setSession(null);
        setViewMode('owner');
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'owner' ? 'customer' : 'owner');
    };

    // Notification helpers for navbar & dashboard
    const getNotifications = () => {
        try {
            return JSON.parse(localStorage.getItem('studio_admin_notifications') || '[]');
        } catch {
            return [];
        }
    };

    const clearNotification = (id) => {
        try {
            const list = getNotifications();
            const updated = list.filter(n => n.id !== id);
            localStorage.setItem('studio_admin_notifications', JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent('studio_notification_update'));
        } catch {}
    };

    const clearAllNotifications = () => {
        try {
            localStorage.setItem('studio_admin_notifications', '[]');
            window.dispatchEvent(new CustomEvent('studio_notification_update'));
        } catch {}
    };

    const markAllNotificationsRead = () => {
        try {
            const list = getNotifications();
            const updated = list.map(n => ({ ...n, unread: false }));
            localStorage.setItem('studio_admin_notifications', JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent('studio_notification_update'));
        } catch {}
    };

    const isStudioOwner = user?.user_type === 'studio_owner' || user?.is_superuser;
    const isCustomer = user?.user_type === 'customer';
    const activeView = isStudioOwner ? viewMode : 'customer';

    const value = {
        user,
        session,
        loading,
        isAuthenticated: !!user || !!session,
        isCustomer,
        isStudioOwner,
        viewMode: activeView,
        setViewMode,
        toggleViewMode,
        login,
        loginWithGoogle,
        logout,
        requestAccess,
        approveCustomerAccess,
        rejectCustomerAccess,
        getAccessRequests,
        getApprovedCustomers,
        getNotifications,
        clearNotification,
        clearAllNotifications,
        markAllNotificationsRead,
        isOwnerDeviceTrusted,
        verifyOwnerPin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
