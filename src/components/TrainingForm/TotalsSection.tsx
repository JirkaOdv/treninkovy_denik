import React, { useEffect } from 'react';
import type { TrainingSession } from '../../types';
import styles from '../../styles/forms.module.css';

interface TotalsSectionProps {
    data: Partial<TrainingSession>;
    onChange: (data: Partial<TrainingSession>) => void;
}

const TotalsSection: React.FC<TotalsSectionProps> = ({ data, onChange }) => {

    // Simple auto-calculation effect (can be overridden)
    useEffect(() => {
        let calculatedDist = 0;
        if (data.sprints) {
            data.sprints.forEach(s => {
                calculatedDist += (s.distance * s.count);
            });
        }
        // Convert to KM if > 1000? Or keep in meters? Assuming KM for totalDistance in main type
        // logic: if sprints only, it's small. If runs...
        // Let's just suggest it if it's currently 0 or undefined
        if ((!data.totalDistance || data.totalDistance === 0) && calculatedDist > 0) {
            // onChange({ ...data, totalDistance: calculatedDist / 1000 });
        }
    }, [data.sprints]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: Number(value) });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Souhrnné Statistiky</h3>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Celková Vzdálenost (km)</label>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                    Včetně rozklusání, výklusu a všech úseků.
                </div>
                <input
                    type="number"
                    step="0.01"
                    name="totalDistance"
                    value={data.totalDistance || ''}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="0.00"
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Celková Zátěž (Arbitrary Units / Tuny)</label>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                    Pro silový trénink (tuny) nebo obecné zatížení.
                </div>
                <input
                    type="number"
                    step="0.1"
                    name="totalLoad"
                    value={data.totalLoad || ''}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="0"
                />
            </div>
        </div>
    );
};

export default TotalsSection;
