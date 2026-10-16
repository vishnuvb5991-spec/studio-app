import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Image as ImageIcon, 
    ExternalLink, 
    Trash2, 
    Eye, 
    Sparkles, 
    FolderLock, 
    Download, 
    Heart, 
    Share2,
    X,
    CheckCircle2,
    Lock,
    Upload,
    Camera
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultShowcaseAlbums = [
    {
        id: 'alb-01',
        title: 'Roy & Deepika Grand Heritage Wedding',
        album_type: 'wedding',
        photo_count: 480,
        status: 'ready',
        views: 1240,
        cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        client: 'Roy Family (Udaipur Palace)',
        pin: '4921',
        sample_photos: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        id: 'alb-02',
        title: 'Sunset Coastline Pre-Wedding Story',
        album_type: 'pre_wedding',
        photo_count: 160,
        status: 'ready',
        views: 890,
        cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        client: 'Aman & Karishma (Goa)',
        pin: '7730',
        sample_photos: [
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        id: 'alb-03',
        title: 'Vogue Commercial Editorial Shoot',
        album_type: 'commercial',
        photo_count: 95,
        status: 'ready',
        views: 640,
        cover_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        client: 'Kavita Designs (Mumbai)',
        pin: '8812',
        sample_photos: [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        id: 'alb-04',
        title: 'Golden Jubilee Vintage Family Portrait',
        album_type: 'restoration',
        photo_count: 32,
        status: 'processing',
        views: 210,
        cover_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        client: 'Kapoor Clan',
        pin: '3391',
        sample_photos: [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
        ]
    }
];

const PRESET_COVERS = [
    { label: 'Wedding Royal', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pre-Wedding Sunset', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
    { label: 'Haldi / Mehendi', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80' },
    { label: 'Editorial Fashion', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Vintage B&W', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' }
];

function Albums() {
    const { user, isStudioOwner, viewMode } = useAuth();
    const isCustomer = !isStudioOwner || viewMode === 'customer';

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Create Album Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [albumType, setAlbumType] = useState('wedding');
    const [photoCount, setPhotoCount] = useState(120);
    const [pin, setPin] = useState(Math.floor(1000 + Math.random() * 9000).toString());
    const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Preview / Gallery Modal State
    const [viewingAlbum, setViewingAlbum] = useState(null);

    useEffect(() => {
        loadAlbums();
    }, [isCustomer, user]);

    const loadAlbums = () => {
        try {
            const stored = localStorage.getItem('studio_custom_albums');
            const customAlbums = stored ? JSON.parse(stored) : [];

            if (isCustomer) {
                // For client/customer: ONLY show albums specifically added for them
                const userEmail = (user?.email || '').toLowerCase().trim();
                const userName = (user?.first_name || user?.name || '').toLowerCase().trim();

                const myAlbums = customAlbums.filter(a => {
                    const cEmail = (a.client_email || a.email || '').toLowerCase().trim();
                    const cName = (a.client || a.customer || a.client_name || '').toLowerCase().trim();
                    return (userEmail && cEmail === userEmail) || (userName && cName.includes(userName)) || (a.userId && a.userId === user?.id);
                });

                // Clean state — NO fallback to sample albums
                setAlbums(myAlbums);
                setLoading(false);
                return;
            }

            // For Studio Owner: show custom albums if present, otherwise showcase albums
            if (Array.isArray(customAlbums) && customAlbums.length > 0) {
                setAlbums(customAlbums);
            } else {
                setAlbums(defaultShowcaseAlbums);
            }
        } catch (e) {
            console.error('Error reading local albums:', e);
            setAlbums(isCustomer ? [] : defaultShowcaseAlbums);
        }
        setLoading(false);
    };

    const handleCreateAlbum = (e) => {
        e.preventDefault();
        if (!title.trim() || !client.trim()) return;

        setIsSubmitting(true);

        const newAlbum = {
            id: `alb-${Date.now()}`,
            title: title.trim(),
            album_type: albumType,
            photo_count: Number(photoCount) || 50,
            status: 'ready',
            views: 1,
            cover_image: coverImage,
            client: client.trim(),
            pin: pin || '1234',
            sample_photos: [coverImage]
        };

        const updated = [newAlbum, ...albums];
        setAlbums(updated);
        try {
            localStorage.setItem('studio_custom_albums', JSON.stringify(updated));
        } catch (err) {
            console.error('Error saving to storage:', err);
        }

        // Try syncing to backend API if available
        api.post('/albums/', {
            title: newAlbum.title,
            album_type: newAlbum.album_type,
            client_name: newAlbum.client,
        }).catch(() => {});

        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        setSuccessMessage(`Album "${newAlbum.title}" created successfully!`);
        setTimeout(() => setSuccessMessage(''), 4000);

        // Reset form
        setTitle('');
        setClient('');
        setPin(Math.floor(1000 + Math.random() * 9000).toString());
    };

    const handleDeleteAlbum = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this album?')) {
            const updated = albums.filter(a => a.id !== id);
            setAlbums(updated);
            try {
                localStorage.setItem('studio_custom_albums', JSON.stringify(updated));
            } catch (err) {}
        }
    };

    const handleDownloadAll = (album, e) => {
        e.stopPropagation();
        alert(`Downloading ${album.photo_count} Ultra-HD original stills for "${album.title}". Secure PIN: ${album.pin || '4921'}`);
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
                        <h1 className="gradient-text">{isCustomer ? 'My Photo Albums' : 'Client Gallery Hub'}</h1>
                        <Sparkles size={20} color="#d97706" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {isCustomer
                            ? 'Your private, high-resolution shoot galleries and downloads.'
                            : 'Ultra-HD client portals with pin-protected downloads & guest sharing.'}
                    </p>
                </div>

                {!isCustomer && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem' }}
                    >
                        <Plus size={18} /> Create New Album
                    </button>
                )}
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    padding: '0.85rem 1.25rem',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 'var(--radius-md)',
                    color: '#065f46',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle2 size={16} /> {successMessage}
                </div>
            )}

            {/* Filter Pills */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                background: '#fafaf9',
                padding: '0.35rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #e5e7eb',
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
                            background: activeTab === tab.id ? '#18181b' : 'transparent',
                            color: activeTab === tab.id ? '#ffffff' : '#52525b',
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

            {/* Albums Showcase Grid or Clean Empty State */}
            {filteredAlbums.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 1.5rem',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: '#fef3c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto'
                    }}>
                        <ImageIcon size={32} color="#d97706" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18181b', marginBottom: '0.45rem' }}>
                        {isCustomer ? 'No Photo Albums Yet' : 'No Albums in this Collection'}
                    </h3>
                    <p style={{ color: '#71717a', fontSize: '0.9rem', maxWidth: 460, margin: '0 auto' }}>
                        {isCustomer
                            ? 'Your private, high-resolution photo albums will appear here once the studio completes editing and delivers your gallery.'
                            : 'No albums found matching the selected filter. Click "Create New Album" to upload one.'}
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.75rem',
                }}>
                {filteredAlbums.map((album) => (
                    <div
                        key={album.id}
                        className="card card-interactive"
                        onClick={() => setViewingAlbum(album)}
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer'
                        }}
                    >
                        {/* Cover Image Preview */}
                        <div style={{
                            height: 220,
                            position: 'relative',
                            overflow: 'hidden',
                            background: '#090d16'
                        }}>
                            <img
                                src={album.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                                alt={album.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.4s ease'
                                }}
                            />
                            
                            {/* Overlay Badges */}
                            <div style={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    textTransform: 'uppercase'
                                }}>
                                    {album.album_type?.replace('_', ' ')}
                                </span>
                            </div>

                            {/* PIN Protected Chip */}
                            <div style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.25rem 0.6rem',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(24, 24, 27, 0.85)',
                                backdropFilter: 'blur(8px)',
                                color: '#f59e0b',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                border: '1px solid rgba(217, 119, 6, 0.35)'
                            }}>
                                <FolderLock size={12} />
                                <span>PIN: {album.pin || '4921'}</span>
                            </div>

                            {/* View Overlay on Hover */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '1rem',
                                background: 'linear-gradient(to top, rgba(24, 24, 27, 0.95), transparent)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}>
                                <span style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 600 }}>
                                    📷 {album.photo_count} HD Photos
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                                    👁️ {album.views || 100}+ views
                                </span>
                            </div>
                        </div>

                        {/* Card Info */}
                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>
                                    {album.title}
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                    Client: <strong style={{ color: 'var(--text-pure)' }}>{album.client}</strong>
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingAlbum(album); }}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                                >
                                    <Eye size={14} /> Open Gallery
                                </button>
                                <button
                                    onClick={(e) => handleDownloadAll(album, e)}
                                    className="btn btn-cyan"
                                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                    title="Download All Photos"
                                >
                                    <Download size={14} />
                                </button>
                                <button
                                    onClick={(e) => handleDeleteAlbum(album.id, e)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        color: '#f87171',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.5rem 0.65rem',
                                        cursor: 'pointer'
                                    }}
                                    title="Delete Album"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}

            {/* CREATE NEW ALBUM MODAL */}
            {isCreateModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: 580,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: 18,
                                right: 18,
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: 'none',
                                color: '#ffffff',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={16} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Camera size={22} color="#d97706" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create New Client Gallery</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Upload client event stills, configure PIN protection, and publish for instant web & mobile downloads.
                        </p>

                        <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                    Album Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Vikram & Ananya Royal Wedding"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Client Name / Family *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Ananya Sharma"
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Collection Category
                                    </label>
                                    <select
                                        value={albumType}
                                        onChange={(e) => setAlbumType(e.target.value)}
                                        style={{ width: '100%', height: 44 }}
                                    >
                                        <option value="wedding">Wedding (Traditional/Luxury)</option>
                                        <option value="pre_wedding">Pre-Wedding / Engagement</option>
                                        <option value="commercial">Commercial / Fashion Editorial</option>
                                        <option value="restoration">AI Photo Restoration</option>
                                        <option value="portrait">Maternity / Portrait</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Total Photos Count
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={photoCount}
                                        onChange={(e) => setPhotoCount(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Security Download PIN
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="4-digit PIN"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Preset Cover Selector */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                    Select Cover Photo Preset (or paste custom URL)
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                                    {PRESET_COVERS.map((preset, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCoverImage(preset.url)}
                                            style={{
                                                flexShrink: 0,
                                                width: 80,
                                                height: 55,
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: coverImage === preset.url ? '2px solid #d97706' : '1px solid var(--border-subtle)',
                                                opacity: coverImage === preset.url ? 1 : 0.6,
                                                transition: 'all 0.2s'
                                            }}
                                            title={preset.label}
                                        >
                                            <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="url"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    placeholder="https://..."
                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                    style={{ flex: 1, padding: '0.85rem', fontWeight: 700 }}
                                >
                                    {isSubmitting ? 'Creating Album...' : 'Publish Album to Portal'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    style={{ padding: '0.85rem 1.25rem' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FULL GALLERY PHOTO VIEWER MODAL */}
            {viewingAlbum && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.88)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: 900,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setViewingAlbum(null)}
                            style={{
                                position: 'absolute',
                                top: 18,
                                right: 18,
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                color: '#ffffff',
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={18} />
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                                    {viewingAlbum.album_type?.replace('_', ' ')}
                                </span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>
                                    {viewingAlbum.title}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    Client: <strong style={{ color: '#ffffff' }}>{viewingAlbum.client}</strong> • PIN Protected: <code style={{ color: 'var(--accent-cyan)' }}>{viewingAlbum.pin || '4921'}</code>
                                </p>
                            </div>

                            <button
                                onClick={(e) => handleDownloadAll(viewingAlbum, e)}
                                className="btn btn-cyan"
                                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                            >
                                <Download size={16} /> Download Full Album (ZIP)
                            </button>
                        </div>

                        {/* Photo Grid Preview */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '1rem'
                        }}>
                            {(viewingAlbum.sample_photos && viewingAlbum.sample_photos.length > 0 ? viewingAlbum.sample_photos : [viewingAlbum.cover_image]).map((img, idx) => (
                                <div key={idx} style={{
                                    height: 180,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '1px solid var(--border-subtle)'
                                }}>
                                    <img src={img} alt="Gallery Still" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        background: 'rgba(0,0,0,0.75)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.65rem',
                                        color: '#ffffff',
                                        fontWeight: 700
                                    }}>
                                        4K RAW
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Albums;
