import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TrainingSession, SprintEntry } from '../../types';
import styles from '../../styles/forms.module.css';

interface SprintsSectionProps {
    data: Partial<TrainingSession>;
    onChange: (data: Partial<TrainingSession>) => void;
}

const SprintsSection: React.FC<SprintsSectionProps> = ({ data, onChange }) => {
    const sprints = data.sprints || [];

    const addSprint = () => {
        const newSprint: SprintEntry = { distance: 60, count: 1, bestTime: undefined };
        onChange({ ...data, sprints: [...sprints, newSprint] });
    };

    const removeSprint = (index: number) => {
        const newSprints = sprints.filter((_, i) => i !== index);
        onChange({ ...data, sprints: newSprints });
    };

    const updateSprint = (index: number, field: keyof SprintEntry, value: number) => {
        const newSprints = [...sprints];
        newSprints[index] = { ...newSprints[index], [field]: value };
        onChange({ ...data, sprints: newSprints });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Sprinty</h3>
                <button
                    type="button"
                    onClick={addSprint}
                    style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                >
                    <Plus size={16} /> Přidat
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sprints.map((sprint, index) => (
                    <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: '10px',
                        alignItems: 'end',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Vzdálenost (m)</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={sprint.distance}
                                onChange={(e) => updateSprint(index, 'distance', Number(e.target.value))}
                                placeholder="m"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Počet</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={sprint.count}
                                onChange={(e) => updateSprint(index, 'count', Number(e.target.value))}
                                placeholder="ks"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Čas (s)</label>
                            <input
                                type="number"
                                step="0.01"
                                className={styles.input}
                                value={sprint.bestTime || ''}
                                onChange={(e) => updateSprint(index, 'bestTime', Number(e.target.value))}
                                placeholder="s (volitelné)"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeSprint(index)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '8px',
                                marginBottom: '2px'
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {sprints.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                        Žádné sprinty
                    </div>
                )}
            </div>
        </div>
    );
};

export default SprintsSection;
