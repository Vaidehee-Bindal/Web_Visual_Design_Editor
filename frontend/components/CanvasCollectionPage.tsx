'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CanvasDocument } from '../services/api';
import { api } from '../services/api';
import CanvasThumbnail from './CanvasThumbnail';

export default function CanvasCollectionPage({ view }: { view: 'active' | 'trash' }) {
  const router = useRouter(); const [items, setItems] = useState<CanvasDocument[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = async () => { setLoading(true); setError(null); try { setItems(await api.list(view)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load canvases'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, [view]);
  const title = view === 'trash' ? 'Trash' : 'My Canvases';
  const restore = async (id: string) => { try { await api.restore(id); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to restore canvas'); } };
  const remove = async (id: string) => { try { if (view === 'trash') await api.permanentlyRemove(id); else await api.remove(id); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to delete canvas'); } };
  return <main className="app-shell"><header className="toolbar"><div className="brand"><span className="brand-mark">✦</span><span>canvasly</span></div></header><div className="collection-page"><div className="collection-heading"><span className="eyebrow">Workspace</span><h1>{title}</h1><button className="save-button" onClick={() => router.push('/')}>Open editor</button></div>{loading && <p className="muted">Loading canvases…</p>}{error && <p className="muted">{error} <button className="subtle-button" onClick={() => void load()}>Retry</button></p>}{!loading && !error && items.length === 0 && <div className="empty-properties"><div className="empty-art">⌁</div><h3>{view === 'trash' ? 'Trash is empty' : 'No canvases yet'}</h3><p>{view === 'trash' ? 'Deleted canvases will appear here.' : 'Create a canvas to get started.'}</p></div>}<div className="collection-grid">{items.map(canvas => { const id = canvas._id || canvas.localId!; return <article className="collection-card" key={id}><button className="collection-preview" onClick={() => view === 'trash' ? undefined : router.push('/canvas/' + id)}><CanvasThumbnail elements={canvas.elements || []} width={canvas.width} height={canvas.height} /></button><strong>{canvas.name}</strong><small>{canvas.width} × {canvas.height}</small><div className="collection-actions">{view === 'trash' && <button className="subtle-button" onClick={() => void restore(id)}>Restore</button>}<button className="remove-canvas" onClick={() => void remove(id)}>{view === 'trash' ? 'Delete permanently' : '×'}</button></div></article>; })}</div></div></main>;
}
