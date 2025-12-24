import React, { useState } from 'react';
import type { TrainingSession } from '../../types';
import styles from '../../styles/forms.module.css';

// RPE Helper
const getRpeColor = (rpe: number) => {
    if (rpe <= 4) return 'var(--color-success)';
    if (rpe <= 7) return 'var(--color-warning)';
    return 'var(--color-danger)';
};

const getRpeLabel = (rpe: number) => {
    if (rpe <= 2) return 'Velmi lehké';
    if (rpe <= 4) return 'Lehké';
    if (rpe <= 6) return 'Střední';
    if (rpe <= 8) return 'Těžké';
    if (rpe <= 9) return 'Velmi těžké';
    return 'MAXIMÁLNÍ ÚSILÍ';
};

interface BasicInfoProps {
    data: Partial<TrainingSession>;
    onChange: (data: Partial<TrainingSession>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ data, onChange }) => {
    const [tagInput, setTagInput] = useState('');
    const [isCustomType, setIsCustomType] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    // RPE Handler
    const handleRpeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        onChange({ ...data, rpe: val });
    };

    // Tags Handler
    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !data.tags?.includes(newTag)) {
                onChange({ ...data, tags: [...(data.tags || []), newTag] });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange({ ...data, tags: data.tags?.filter(t => t !== tagToRemove) });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Date & Time Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Datum</label>
                    <input
                        type="date"
                        name="date"
                        value={data.date}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Délka (min)</label>
                    <input
                        type="number"
                        name="durationMinutes"
                        value={data.durationMinutes}
                        onChange={handleChange}
                        className={styles.input}
                        min="1"
                        required
                    />
                </div>
            </div>

            {/* Type Selection */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>Typ Tréninku</label>
                {!isCustomType ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            name="type"
                            value={data.type}
                            onChange={(e) => {
                                if (e.target.value === 'custom_switch') {
                                    setIsCustomType(true);
                                    onChange({ ...data, type: '' });
                                } else {
                                    handleChange(e);
                                }
                            }}
                            className={styles.select}
                            style={{ flex: 1 }}
                        >
                            <option value="strength">🏋️ Silový trénink</option>
                            <option value="cardio">🏃 Běh / Kardio</option>
                            <option value="mobility">🧘 Mobilita / Jóga</option>
                            <option value="sprint">⚡ Sprinty</option>
                            <option value="jumps">🦘 Skoky</option>
                            <option value="custom_switch">➕ Jiný sport ...</option>
                        </select>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            name="type"
                            value={data.type}
                            onChange={handleChange}
                            placeholder="Např. Plavání, Lezení..."
                            className={styles.input}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setIsCustomType(false)}
                            className={styles.buttonSecondary}
                        >
                            Zpět
                        </button>
                    </div>
                )}
            </div>

            {/* RPE Slider */}
            <div className={styles.inputGroup} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className={styles.label} style={{ marginBottom: 0 }}>Náročnost (RPE)</label>
                    <span style={{ fontWeight: 700, color: getRpeColor(data.rpe || 5) }}>
                        {data.rpe || 5}/10 - {getRpeLabel(data.rpe || 5)}
                    </span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={data.rpe || 5}
                    onChange={handleRpeChange}
                    style={{ width: '100%', accentColor: getRpeColor(data.rpe || 5) }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.5, marginTop: '4px' }}>
                    <span>Lehké</span>
                    <span>Těžké</span>
                    <span>Max</span>
                </div>
            </div>

            {/* Tag Input */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>Štítky (Tags)</label>
                <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    background: 'var(--color-surface)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center'
                }}>
                    {data.tags?.map(tag => (
                        <span key={tag} style={{
                            background: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>×</button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder={data.tags?.length ? '' : "Přidat štítek (Enter)..."}
                        style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', flex: 1, minWidth: '100px' }}
                    />
                </div>
            </div>


            <div className={styles.inputGroup}>
                <label className={styles.label}>Poznámky</label>
                <textarea
                    name="notes"
                    value={data.notes}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Detaily tréninku, vybavení, podmínky..."
                />
            </div>
        </div>
    );
};

export default BasicInfo;
