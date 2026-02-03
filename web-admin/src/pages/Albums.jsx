import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, ExternalLink, Trash2, Eye } from 'lucide-react';
import api from '../services/api';

function Albums() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const response = await api.get('/albums/');
            // Handle both paginated (results) and non-paginated responses safely
            const data = response.data;
            setAlbums(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Failed to fetch albums:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Albums</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and share client photo galleries</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Create New Album
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse">Loading albums...</div>
            ) : albums.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <ImageIcon size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3>No Albums Found</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Start by creating your first photo gallery for a client.
                    </p>
                    <button className="btn btn-secondary">
                        <Plus size={18} /> Create First Album
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {albums.map((album) => (
                        <div key={album.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ position: 'relative', height: 180 }}>
                                {album.cover_image ? (
                                    <img src={album.cover_image} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageIcon size={48} color="var(--text-muted)" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                    <span className={`badge ${album.status === 'ready' ? 'badge-success' : 'badge-warning'}`}>
                                        {album.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>{album.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    {album.album_type.toUpperCase()} • {album.photo_count} Photos
                                </p>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>
                                        <Eye size={16} /> Manage
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                        <ExternalLink size={16} />
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--error)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Albums;
