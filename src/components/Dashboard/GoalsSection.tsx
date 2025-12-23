import React, { useState, useEffect } from 'react';
import { Target, Edit2, X } from 'lucide-react';
import { trainingStorage } from '../../services/storage';
import type { SeasonGoal } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const GoalsSection: React.FC = () => {
    const [goals, setGoals] = useState<SeasonGoal[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<SeasonGoal>>({
        category: 'sprint',
        unit: 's'
    });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        const loadedGoals = await trainingStorage.getAllGoals();
        setGoals(loadedGoals);
    };

    const handleSaveGoal = async () => {
        if (editForm.discipline && editForm.targetValue) {
            const newGoal: SeasonGoal = {
                id: uuidv4(),
                discipline: editForm.discipline,
                targetValue: Number(editForm.targetValue),
                unit: editForm.unit || 's',
                category: editForm.category as any
            };
            await trainingStorage.saveGoal(newGoal);
            setIsEditing(false);
            setEditForm({ category: 'sprint', unit: 's' });
            loadGoals();
        }
    };

    const handleDelete = async (id: string) => {
        await trainingStorage.deleteGoal(id);
        loadGoals();
    };

    return (
        <div style={{
            background: 'var(--color-surface)',
            backdropFilter: 'var(--glass-blur)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            border: '1px solid var(--border-color)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={20} color="var(--color-accent)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cíle na sezónu</h2>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.875rem'
                    }}
                >
                    <Edit2 size={14} /> Nastavit cíle
                </button>
            </div>

            {goals.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Zatím nebyl stanoven hlavní cíl.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1rem',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                }}>
                    {goals.map(goal => (
                        <div key={goal.id} style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            position: 'relative',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <button
                                onClick={() => handleDelete(goal.id)}
                                style={{
                                    position: 'absolute', top: '4px', right: '4px',
                                    background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer',
                                    padding: '4px', zIndex: 2
                                }}
                            >
                                <X size={14} />
                            </button>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>
                                {goal.discipline}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginRight: '4px' }}>Cíl:</span>
                                {goal.targetValue} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>{goal.unit}</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '0%', height: '100%', background: 'var(--color-accent)' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'var(--color-surface)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        width: '90%', maxWidth: '400px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Nový Cíl</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Disciplína (např. 60m)"
                                style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                value={editForm.discipline || ''}
                                onChange={e => setEditForm({ ...editForm, discipline: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Cílová hodnota"
                                style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                value={editForm.targetValue || ''}
                                onChange={e => setEditForm({ ...editForm, targetValue: Number(e.target.value) })}
                            />
                            <select
                                style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                value={editForm.unit}
                                onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                            >
                                <option value="s">Sekundy (s)</option>
                                <option value="kg">Kilogramy (kg)</option>
                                <option value="m">Metry (m)</option>
                            </select>
                            <select
                                style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                value={editForm.category}
                                onChange={e => setEditForm({ ...editForm, category: e.target.value as any })}
                            >
                                <option value="sprint">Sprint</option>
                                <option value="strength">Síla</option>
                                <option value="jump">Skok</option>
                            </select>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                >
                                    Zrušit
                                </button>
                                <button
                                    onClick={handleSaveGoal}
                                    style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', border: 'none', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                >
                                    Uložit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalsSection;
