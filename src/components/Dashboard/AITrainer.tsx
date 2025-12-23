import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const AITrainer: React.FC = () => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Bot size={24} color="#a855f7" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Trenér</h2>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
                color: 'var(--color-text-secondary)',
                padding: '2rem 1rem'
            }}>
                <Sparkles size={48} style={{ opacity: 0.5, color: '#a855f7' }} />
                <p>Klikni pro analýzu období <strong>2025 - Vše</strong>.</p>
            </div>

            <button style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
            }}>
                Analyzovat výběr
            </button>
        </div>
    );
};

export default AITrainer;
