import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TrainingSession, JumpEntry } from '../../types';
import styles from '../../styles/forms.module.css';

interface JumpsSectionProps {
    data: Partial<TrainingSession>;
    onChange: (data: Partial<TrainingSession>) => void;
}

const JumpsSection: React.FC<JumpsSectionProps> = ({ data, onChange }) => {
    const jumps = data.jumps || [];

    const addJump = () => {
        const newJump: JumpEntry = { type: 'DZM', result: 0 };
        onChange({ ...data, jumps: [...jumps, newJump] });
    };

    const removeJump = (index: number) => {
        const newJumps = jumps.filter((_, i) => i !== index);
        onChange({ ...data, jumps: newJumps });
    };

    const updateJump = (index: number, field: keyof JumpEntry, value: string | number) => {
        const newJumps = [...jumps];
        // @ts-ignore
        newJumps[index] = { ...newJumps[index], [field]: value };
        onChange({ ...data, jumps: newJumps });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Skoky & Odhody</h3>
                <button
                    type="button"
                    onClick={addJump}
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
                {jumps.map((jump, index) => (
                    <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto',
                        gap: '10px',
                        alignItems: 'end',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Disciplína</label>
                            <select
                                className={styles.select}
                                value={jump.type}
                                onChange={(e) => updateJump(index, 'type', e.target.value)}
                            >
                                <option value="DZM">Dálka z místa</option>
                                <option value="Petiskok">Pětiskok</option>
                                <option value="Desetiskok">Desetiskok</option>
                                <option value="Koule_Popredu">Koule popředu</option>
                                <option value="Koule_Pozadu">Koule pozadu</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Výkon (m)</label>
                            <input
                                type="number"
                                step="0.01"
                                className={styles.input}
                                value={jump.result}
                                onChange={(e) => updateJump(index, 'result', Number(e.target.value))}
                                placeholder="m"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeJump(index)}
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
            </div>
        </div>
    );
};

export default JumpsSection;
