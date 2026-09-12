import './styles.css';
import './editor-enhancements.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Canvasly — Design canvas', description: 'A focused visual design editor' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
