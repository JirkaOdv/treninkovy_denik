import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    subtext: string;
    icon: string; // Emoji or specific icon component could be passed
    variant?: 'defaut' | 'accent' | 'warning' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon, variant = 'default' }) => {
    let bg = 'rgba(255, 255, 255, 0.03)'; // Default slightly lighter surface
    let color = 'var(--color-text-primary)';

    if (variant === 'accent') { bg = 'var(--color-primary)'; color = 'white'; }
    if (variant === 'warning') { bg = 'rgba(245, 158, 11, 0.1)'; color = '#f59e0b'; } // Amber tint
    if (variant === 'purple') { bg = 'rgba(168, 85, 247, 0.1)'; color = '#a855f7'; }

    return (
        <div style={{
            background: bg,
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: variant === 'accent' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: color }}>{value}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{subtext}</div>
            </div>
        </div>
    );
};

export default StatCard;
