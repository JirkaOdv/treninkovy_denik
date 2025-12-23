import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import GoalsSection from '../components/Dashboard/GoalsSection';
import VolumeChart from '../components/Dashboard/VolumeChart';
import AITrainer from '../components/Dashboard/AITrainer';
import StatCard from '../components/Dashboard/StatCard';

const Dashboard: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', paddingBottom: '2rem' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Přehled</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface)', border: '1px solid var(--border-color)',
                        color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer'
                    }}>
                        <Filter size={16} /> Filtrování období
                    </button>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface)', border: '1px solid var(--border-color)',
                        color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer'
                    }}>
                        <Calendar size={16} /> 2025 - Celá sezóna
                    </button>
                </div>
            </div>

            {/* Goals Section (Full Width) */}
            <GoalsSection />

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <StatCard label="OBJEM" value="1.8 km" subtext="2025" icon="🏃" />
                <StatCard label="METRÁŽ" value="2.28 ..." subtext="Sprinty" icon="⚡" variant="accent" />
                <StatCard label="ROVINKY" value="0 ks" subtext="Celkem" icon="➡️" />
                <StatCard label="POCIT" value="6.9/10" subtext="Průměr" icon="🙂" variant="warning" />
                <StatCard label="POSILOVNA" value="2" subtext="Tréninky" icon="🏋️" variant="purple" />
                <StatCard label="TRÉNINKY" value="8" subtext="Celkem" icon="📅" />
            </div>

            {/* Bottom Grid: Chart + AI Trainer */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
                <div style={{ flex: 2, minHeight: '350px' }}>
                    <VolumeChart />
                </div>
                <div style={{ flex: 1, minHeight: '350px' }}>
                    <AITrainer />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
