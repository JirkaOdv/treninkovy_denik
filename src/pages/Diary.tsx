import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Plus, Calendar as CalendarIcon, Dumbbell, Activity, Clock, Trash2, Edit } from 'lucide-react';
import { trainingStorage } from '../services/storage';
import type { TrainingSession, GymEntry } from '../types';

const Diary: React.FC = () => {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState<TrainingSession[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTrainings = async () => {
        try {
            const data = await trainingStorage.getAllTrainings();
            data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTrainings(data);
        } catch (error) {
            console.error('Failed to load trainings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrainings();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Opravdu chcete smazat tento trénink?')) {
            await trainingStorage.deleteTraining(id);
            loadTrainings();
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'strength': return <Dumbbell size={18} />;
            case 'cardio': return <Activity size={18} />;
            case 'mobility': return <Activity size={18} />; // Reuse activity for mobility
            default: return <Clock size={18} />;
        }
    };

    const getFeelingColor = (feeling: string) => {
        switch (feeling) {
            case 'great': return 'var(--color-accent)';
            case 'good': return 'var(--color-primary)';
            case 'average': return '#f59e0b';
            case 'bad': return '#f97316';
            case 'terrible': return 'var(--color-danger)';
            default: return 'var(--color-text-muted)';
        }
    };

    // Helper to summarize content
    const formatContent = (t: TrainingSession) => {
        const parts = [];

        if (t.sprints && t.sprints.length > 0) {
            const sprintSummary = t.sprints.map(s => `${s.count}x${s.distance}m`).join(', ');
            parts.push(sprintSummary);
        }

        if (t.gym && t.gym.length > 0) {
            // Take first 2 exercises as preview
            const gymSummary = t.gym.slice(0, 2).map((g: GymEntry) => `${g.exercise} ${g.weight}kg`).join(', ');
            parts.push(gymSummary + (t.gym.length > 2 ? '...' : ''));
        }

        if (t.jumps && t.jumps.length > 0) {
            parts.push(`${t.jumps.length} disciplín(y)`);
        }

        if (parts.length === 0) return t.notes || 'Bez popisu';

        return parts.join(' • ');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Tréninkový Deník</h1>
                <button
                    onClick={() => navigate('/add-training')}
                    style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        cursor: 'pointer', fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    <Plus size={20} />
                    Nový Trénink
                </button>
            </div>

            {loading ? (
                <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem' }}>Načítám...</div>
            ) : trainings.length === 0 ? (
                <div style={{
                    background: 'var(--color-surface)',
                    padding: '4rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    border: '1px dashed var(--border-color)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                    }}>
                        <CalendarIcon size={40} style={{ color: 'var(--color-text-muted)', opacity: 0.7 }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zatím zde nejsou žádné záznamy</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        Začněte zaznamenávat své tréninky, abyste mohli sledovat svůj progres a využívat analytické nástroje.
                    </p>
                    <button
                        onClick={() => navigate('/add-training')}
                        style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
                    >
                        Přidat první trénink
                    </button>
                </div>
            ) : (
                <div style={{
                    overflowX: 'auto',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>Datum</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>Typ</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>Obsah Tréninku</th>
                                <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>Objem</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>Pocit</th>
                                <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainings.map(training => (
                                <tr key={training.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.1s' }} className="table-row">
                                    <td style={{ padding: '16px', fontWeight: 600 }}>
                                        {format(new Date(training.date), 'd. MMM', { locale: cs })}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                padding: '6px', borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)'
                                            }}>
                                                {getIcon(training.type)}
                                            </div>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                                {training.type === 'strength' ? 'Síla' : training.type === 'cardio' ? 'Běh' : 'Jiné'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '300px' }}>
                                        {formatContent(training)}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                        {training.totalDistance ? `${training.totalDistance} km` :
                                            training.totalLoad ? `${training.totalLoad} t` : '-'}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '10px', height: '10px', borderRadius: '50%',
                                            background: getFeelingColor(training.feeling),
                                            margin: '0 auto'
                                        }} title={training.feeling} />
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/edit-training/${training.id}`); }}
                                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', marginRight: '8px' }}
                                            title="Upravit"
                                        >
                                            <Edit size={16} className="hover:text-blue-500" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(training.id, e)}
                                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                                            title="Smazat"
                                        >
                                            <Trash2 size={16} className="hover:text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Diary;
