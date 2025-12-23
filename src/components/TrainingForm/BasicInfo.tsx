import React from 'react';
import type { TrainingSession } from '../../types';
import styles from '../../styles/forms.module.css';

interface BasicInfoProps {
    data: Partial<TrainingSession>;
    onChange: (data: Partial<TrainingSession>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ data, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <label className={styles.label}>Typ Tréninku</label>
                <select
                    name="type"
                    value={data.type}
                    onChange={handleChange}
                    className={styles.select}
                >
                    <option value="strength">Silový trénink</option>
                    <option value="cardio">Kardio / Běh</option>
                    <option value="mobility">Mobilita / Protahování</option>
                    <option value="other">Jiné</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Délka (minuty)</label>
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

            <div className={styles.inputGroup}>
                <label className={styles.label}>Pocit</label>
                <select
                    name="feeling"
                    value={data.feeling}
                    onChange={handleChange}
                    className={styles.select}
                >
                    <option value="great">Skvělý (5/5)</option>
                    <option value="good">Dobrý (4/5)</option>
                    <option value="average">Průměrný (3/5)</option>
                    <option value="bad">Špatný (2/5)</option>
                    <option value="terrible">Hrozný (1/5)</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Poznámky</label>
                <textarea
                    name="notes"
                    value={data.notes}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Jak to šlo? Váhy, pocity..."
                />
            </div>
        </div>
    );
};

export default BasicInfo;
