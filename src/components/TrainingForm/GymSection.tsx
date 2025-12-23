import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TrainingSession, GymEntry } from '../../types';
import styles from '../../styles/forms.module.css';

interface GymSectionProps {
    data: Partial<TrainingSession>;
    onChange: (data: Partial<TrainingSession>) => void;
}

const GymSection: React.FC<GymSectionProps> = ({ data, onChange }) => {
    const gym = data.gym || [];

    const addExercise = () => {
        const newExercise: GymEntry = { exercise: '', weight: 0, reps: 0, sets: 0 };
        onChange({ ...data, gym: [...gym, newExercise] });
    };

    const removeExercise = (index: number) => {
        const newGym = gym.filter((_, i) => i !== index);
        onChange({ ...data, gym: newGym });
    };

    const updateExercise = (index: number, field: keyof GymEntry, value: string | number) => {
        const newGym = [...gym];
        // @ts-ignore - dynamic assignment
        newGym[index] = { ...newGym[index], [field]: value };
        onChange({ ...data, gym: newGym });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Posilovna</h3>
                <button
                    type="button"
                    onClick={addExercise}
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
                {gym.map((entry, index) => (
                    <div key={index} style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                    }}>
                        <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            style={{
                                position: 'absolute', top: '8px', right: '8px',
                                background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className={styles.inputGroup} style={{ marginBottom: '8px' }}>
                            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Cvik</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={entry.exercise}
                                onChange={(e) => updateExercise(index, 'exercise', e.target.value)}
                                placeholder="např. Přemístění"
                                list="exercises-list"
                            />
                            <datalist id="exercises-list">
                                <option value="Přemístění" />
                                <option value="Trh" />
                                <option value="Dřep" />
                                <option value="Bench Press" />
                                <option value="Mrtvý tah" />
                            </datalist>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ fontSize: '0.75rem' }}>Váha (kg)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={entry.weight}
                                    onChange={(e) => updateExercise(index, 'weight', Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ fontSize: '0.75rem' }}>Opakování</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={entry.reps || ''}
                                    onChange={(e) => updateExercise(index, 'reps', Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ fontSize: '0.75rem' }}>Série</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={entry.sets || ''}
                                    onChange={(e) => updateExercise(index, 'sets', Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {gym.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                        Žádné cviky
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymSection;
