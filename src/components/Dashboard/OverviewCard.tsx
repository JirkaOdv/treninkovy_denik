import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
    title: string;
    value: string;
    unit?: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    trendUp,
    color = 'var(--color-primary)'
}) => {
    return (
        <div style={{
            background: 'var(--color-surface)',
            backdropFilter: 'var(--glass-blur)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                    {title}
                </span>
                <div style={{
                    color: color,
                    background: `color-mix(in srgb, ${color} 15%, transparent)`,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={20} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {value}
                </span>
                {unit && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{unit}</span>}
            </div>

            {trend && (
                <div style={{
                    fontSize: '0.75rem',
                    color: trendUp ? 'var(--color-accent)' : 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: 'auto'
                }}>
                    <span>{trendUp ? '↑' : '↓'}</span>
                    <span>{trend} vs minulý týden</span>
                </div>
            )}
        </div>
    );
};

export default OverviewCard;
