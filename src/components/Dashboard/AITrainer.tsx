import React, { useState } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AITrainer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const data = await api.post('/ai/analyze', {});
            setAnalysis(data.analysis);
        } catch (error) {
            console.error(error);
            setAnalysis('Omlouváme se, AI trenér je momentálně nedostupný. Zkuste to prosím později.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexShrink: 0 }}>
                <Bot size={24} color="#a855f7" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Trenér</h2>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: analysis ? 'flex-start' : 'center',
                alignItems: analysis ? 'flex-start' : 'center',
                textAlign: analysis ? 'left' : 'center',
                gap: '1rem',
                color: 'var(--color-text-secondary)',
                padding: '1rem 0.5rem',
                overflowY: 'auto'
            }}>
                {analysis ? (
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {analysis}
                    </div>
                ) : (
                    <>
                        <Sparkles size={48} style={{ opacity: 0.5, color: '#a855f7' }} />
                        <p>Klikni pro analýzu tvých tréninků za <strong>posledních 30 dní</strong>.</p>
                    </>
                )}
            </div>

            {!analysis && (
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(to right, #a855f7, #ec4899)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)',
                        cursor: loading ? 'wait' : 'pointer',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: loading ? 0.8 : 1
                    }}>
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            Analyzuji...
                        </>
                    ) : (
                        'Analyzovat data'
                    )}
                </button>
            )}

            {analysis && (
                <button
                    onClick={() => setAnalysis(null)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}>
                    Zavřít výsledek
                </button>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AITrainer;
