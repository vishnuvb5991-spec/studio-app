import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, ExternalLink, Trash2, Eye, Sparkles, FolderLock, Download, Heart, Share2 } from 'lucide-react';
import api from '../services/api';

const defaultShowcaseAlbums = [
    {
        id: 'alb-01',
        title: 'Roy & Deepika Grand Heritage Wedding',
        album_type: 'wedding',
        photo_count: 480,
        status: 'ready',
        views: 1240,
        cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        client: 'Roy Family (Udaipur Palace)'
    },
    {
        id: 'alb-02',
        title: 'Sunset Coastline Pre-Wedding Story',
        album_type: 'pre_wedding',
        photo_count: 160,
        status: 'ready',
        views: 890,
        cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        client: 'Aman & Karishma (Goa)'
    },
    {
        id: 'alb-03',
        title: 'Vogue Commercial Editorial Shoot',
        album_type: 'commercial',
        photo_count: 95,
        status: 'ready',
        views: 640,
        cover_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        client: 'Kavita Designs'
    },
    {
        id: 'alb-04',
        title: 'Golden Jubilee Vintage Family Portrait',
        album_type: 'restoration',
        photo_count: 32,
        status: 'processing',
        views: 210,
        cover_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        client: 'Kapoor Clan'
    }
];

function Albums() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const response = await api.get('/albums/');
            const data = response.data;
            const fetched = Array.isArray(data) ? data : (data.results || []);
            setAlbums(fetched.length > 0 ? fetched : defaultShowcaseAlbums);
        } catch (error) {
            console.error('Using showcase albums default:', error);
            setAlbums(defaultShowcaseAlbums);
        } finally {
            setLoading(false);
        }
    };

    const filteredAlbums = activeTab === 'all'
        ? albums
        : albums.filter(a => (a.album_type || '').toLowerCase().includes(activeTab.toLowerCase()));

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h1 className="gradient-text">Client Gallery Hub</h1>
                        <Sparkles size={20} color="#8b5cf6" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Ultra-HD client portals with pin-protected downloads & guest sharing.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => alert('New Client Gallery Creation Wizard opened!')}
                >
                    <Plus size={18} /> Create New Album
                </button>
            </div>

            {/* Filter Pills */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                background: 'rgba(20, 24, 48, 0.6)',
                padding: '0.4rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                width: 'fit-content'
            }}>
                {[
                    { id: 'all', label: 'All Collections' },
                    { id: 'wedding', label: 'Weddings' },
                    { id: 'pre_wedding', label: 'Pre-Wedding' },
                    { id: 'commercial', label: 'Commercial' },
                    { id: 'restoration', label: 'Restoration' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.5rem 1.15rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--grad-primary)' : 'transparent',
                            color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Albums Showcase Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem',
            }}>
                {filteredAlbums.map((album) => (
                    <div
                        key={album.id}
                        className="card card-interactive"
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* Cover Image & Overlays */}
                        <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                            <img
                                src={album.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                                alt={album.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.4s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                            />
                            
                            {/* Glass Type Tag */}
                            <div style={{ position: 'absolute', top: 14, left: 14 }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'rgba(15, 17, 35, 0.75)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.15)'
                                }}>
                                    {album.album_type?.toUpperCase() || 'WEDDING'}
                                </span>
                            </div>

                            {/* Status Tag */}
                            <div style={{ position: 'absolute', top: 14, right: 14 }}>
                                <span className={`badge ${album.status === 'ready' ? 'badge-success' : 'badge-warning'}`}>
                                    {album.status === 'ready' ? '● Live' : '● Processing'}
                                </span>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                                    {album.title}
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                                    {album.client || 'Verified Client'} • {album.photo_count || 120} High-Res Stills
                                </p>
                            </div>

                            {/* Quick Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.65rem' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
                                    onClick={() => alert(`Opening Gallery Management for: ${album.title}`)}
                                >
                                    <Eye size={15} /> Open Gallery
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: '0.6rem 0.85rem' }}
                                    title="Share Client PIN Link"
                                    onClick={() => alert(`Shareable link copied for: ${album.title}`)}
                                >
                                    <Share2 size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Albums;
