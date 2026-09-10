import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('owner'); // 'owner' | 'customer'

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                // Check for local demo session
                const demoUser = localStorage.getItem('demo_user');
                if (demoUser) {
                    try {
                        const parsed = JSON.parse(demoUser);
                        setUser(parsed);
                        setViewMode(parsed.user_type === 'customer' ? 'customer' : 'owner');
                    } catch (e) {}
                }
                setLoading(false);
            }
        });

        // Real-time auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                await fetchUserProfile(session.user);
            } else {
                const demoUser = localStorage.getItem('demo_user');
                if (!demoUser) {
                    setUser(null);
                }
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (authUser) => {
        try {
            // Fetch metadata from public.profiles table
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            const userMeta = authUser.user_metadata || {};
            const finalUser = {
                id: authUser.id,
                email: authUser.email,
                first_name: profile?.first_name || userMeta.first_name || authUser.email?.split('@')[0],
                last_name: profile?.last_name || userMeta.last_name || '',
                phone: profile?.phone || userMeta.phone || '',
                user_type: profile?.user_type || userMeta.user_type || (authUser.email?.includes('admin') ? 'studio_owner' : 'customer'),
                is_superuser: (profile?.user_type === 'studio_owner' || authUser.email?.includes('admin')),
            };

            setUser(finalUser);
            if (finalUser.user_type === 'customer') {
                setViewMode('customer');
            } else {
                setViewMode('owner');
            }
        } catch (err) {
            console.error('Error fetching Supabase profile:', err);
            const userMeta = authUser.user_metadata || {};
            const fallbackUser = {
                id: authUser.id,
                email: authUser.email,
                first_name: userMeta.first_name || authUser.email?.split('@')[0],
                last_name: userMeta.last_name || '',
                user_type: userMeta.user_type || 'customer',
            };
            setUser(fallbackUser);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Instant 1-Click Demo Accounts
            if (email === 'admin@studio.com' || email === 'client@studio.com' || email === 'ananya.s@gmail.com') {
                const isOwner = email === 'admin@studio.com';
                const demoUser = {
                    id: isOwner ? 'demo-admin-id' : 'demo-client-id',
                    email,
                    first_name: isOwner ? 'Studio' : 'Ananya',
                    last_name: isOwner ? 'Owner' : 'Sharma',
                    user_type: isOwner ? 'studio_owner' : 'customer',
                    is_superuser: isOwner,
                };
                localStorage.setItem('demo_user', JSON.stringify(demoUser));
                localStorage.setItem('access_token', 'demo-session-token');
                setUser(demoUser);
                setViewMode(isOwner ? 'owner' : 'customer');
                return { success: true, user: demoUser };
            }

            // Supabase Direct Cloud Login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // If user doesn't exist yet on this Supabase project, auto-register for convenience
                if (error.message?.toLowerCase().includes('invalid login credentials')) {
                    const isOwnerEmail = email.includes('admin') || email.includes('owner');
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                first_name: email.split('@')[0],
                                user_type: isOwnerEmail ? 'studio_owner' : 'customer'
                            }
                        }
                    });

                    if (!signUpError && signUpData.user) {
                        await fetchUserProfile(signUpData.user);
                        return { success: true, user: signUpData.user };
                    }
                }
                return { success: false, error: error.message };
            }

            if (data.user) {
                await fetchUserProfile(data.user);
                return { success: true, user: data.user };
            }

            return { success: false, error: 'Login failed. Please verify credentials.' };
        } catch (error) {
            console.error('❌ Supabase Login Error:', error);
            const msg = error.message || '';
            if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
                return { success: false, error: 'Supabase cloud connection resumed. Please click Sign In again, or use the 1-Click Demo buttons.' };
            }
            return { success: false, error: error.message || 'Authentication failed' };
        }
    };

    const register = async ({ email, password, firstName, lastName, phone, userType = 'customer' }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone || '',
                        user_type: userType
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // Also insert into profiles directly
                try {
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        email,
                        first_name: firstName,
                        last_name: lastName,
                        phone,
                        user_type: userType
                    });
                } catch (e) {}

                await fetchUserProfile(data.user);
                return { success: true, user: data.user };
            }

            return { success: false, error: 'Registration failed. Please try again.' };
        } catch (error) {
            console.error('❌ Supabase Register Error:', error);
            return { success: false, error: error.message || 'Registration failed' };
        }
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'owner' ? 'customer' : 'owner');
    };

    const logout = async () => {
        localStorage.removeItem('demo_user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        await supabase.auth.signOut().catch(() => {});
        setUser(null);
        setSession(null);
        setViewMode('owner');
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
        register,
        logout,
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
