import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Activity, Dumbbell, Timer, BarChart2, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { trainingStorage } from '../services/storage';
import type { TrainingSession, TrainingType, Feeling } from '../types';
import styles from '../styles/forms.module.css';

// Components
import BasicInfo from '../components/TrainingForm/BasicInfo';
import SprintsSection from '../components/TrainingForm/SprintsSection';
import GymSection from '../components/TrainingForm/GymSection';
import JumpsSection from '../components/TrainingForm/JumpsSection';
import TotalsSection from '../components/TrainingForm/TotalsSection';

type Tab = 'basic' | 'sprints' | 'gym' | 'jumps' | 'totals';

const AddTraining: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('basic');

    const [formData, setFormData] = useState<Partial<TrainingSession>>({
        date: new Date().toISOString().split('T')[0],
        type: 'strength',
        durationMinutes: 60,
        feeling: 'good',
        notes: '',
        sprints: [],
        gym: [],
        jumps: []
    });

    useEffect(() => {
        if (id) {
            const loadTraining = async () => {
                setLoading(true);
                try {
                    const training = await trainingStorage.getTrainingById(id);
                    if (training) {
                        setFormData(training);
                    } else {
                        alert('Trénink nenalezen');
                        navigate('/diary');
                    }
                } catch (error) {
                    console.error('Failed to load training:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadTraining();
        }
    }, [id, navigate]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const trainingData: TrainingSession = {
                id: id || uuidv4(),
                date: formData.date!,
                type: formData.type as TrainingType,
                durationMinutes: Number(formData.durationMinutes),
                feeling: formData.feeling as Feeling,
                notes: formData.notes,
                sprints: formData.sprints,
                gym: formData.gym,
                jumps: formData.jumps,
                totalDistance: formData.totalDistance,
                totalLoad: formData.totalLoad
            };

            if (id) {
                await trainingStorage.updateTraining(trainingData);
            } else {
                await trainingStorage.addTraining(trainingData);
            }
            navigate('/diary');
        } catch (error) {
            console.error('Failed to save training:', error);
            alert('Chyba při ukládání tréninku.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Základ', icon: <FileText size={18} /> },
        { id: 'sprints', label: 'Běhy', icon: <Timer size={18} /> },
        { id: 'gym', label: 'Síla', icon: <Dumbbell size={18} /> },
        { id: 'jumps', label: 'Skoky', icon: <Activity size={18} /> },
        { id: 'totals', label: 'Součty', icon: <BarChart2 size={18} /> },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className={`${styles.button} ${styles.buttonSecondary}`} style={{ padding: '0.5rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{id ? 'Upravit Trénink' : 'Nový Trénink'}</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    className={styles.button}
                    disabled={loading}
                    style={{ padding: '8px 20px', gap: '8px' }}
                >
                    <Save size={18} />
                    {loading ? '...' : (id ? 'Uložit změny' : 'Uložit')}
                </button>
            </div>

            {/* Tabs Navigation */}
            <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '4px',
                borderBottom: '1px solid var(--border-color)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        style={{
                            flex: 1,
                            minWidth: '80px',
                            padding: '10px',
                            background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                            border: 'none',
                            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={styles.formContainer} style={{ minHeight: '400px' }}>
                {activeTab === 'basic' && (
                    <BasicInfo data={formData} onChange={setFormData} />
                )}
                {activeTab === 'sprints' && (
                    <SprintsSection data={formData} onChange={setFormData} />
                )}
                {activeTab === 'gym' && (
                    <GymSection data={formData} onChange={setFormData} />
                )}
                {activeTab === 'jumps' && (
                    <JumpsSection data={formData} onChange={setFormData} />
                )}
                {activeTab === 'totals' && (
                    <TotalsSection data={formData} onChange={setFormData} />
                )}
            </div>

            {/* Bottom Navigation (Mobile friendly) */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', marginTop: '1rem'
            }}>
                <button
                    onClick={() => {
                        const idx = tabs.findIndex(t => t.id === activeTab);
                        if (idx > 0) setActiveTab(tabs[idx - 1].id as Tab);
                    }}
                    style={{
                        visibility: activeTab === 'basic' ? 'hidden' : 'visible',
                        padding: '10px 20px',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    Zpět
                </button>

                <button
                    onClick={() => {
                        const idx = tabs.findIndex(t => t.id === activeTab);
                        if (idx < tabs.length - 1) {
                            setActiveTab(tabs[idx + 1].id as Tab);
                        } else {
                            handleSubmit();
                        }
                    }}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'totals' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    {activeTab === 'totals' ? 'Dokončit' : 'Další'}
                </button>
            </div>
        </div>
    );
};

export default AddTraining;
