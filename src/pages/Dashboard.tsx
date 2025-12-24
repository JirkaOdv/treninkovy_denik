import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { Calendar, TrendingUp, Activity, Award, Clock } from 'lucide-react';
import { trainingStorage } from '../services/storage';
import type { TrainingSession } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC = () => {
    const [trainings, setTrainings] = useState<TrainingSession[]>([]);
    const [stats, setStats] = useState<any>({ duration: 0, load: 0, count: 0 });
    const [chartData, setChartData] = useState<any[]>([]);
    const [typeData, setTypeData] = useState<any[]>([]);
    const [bestSprints, setBestSprints] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await trainingStorage.getAllTrainings();
            setTrainings(data);
            processStats(data);
        };
        load();
    }, []);

    const processStats = (data: TrainingSession[]) => {
        if (!data || data.length === 0) {
            setStats({ duration: 0, load: 0, count: 0 });
            setChartData([]);
            setTypeData([]);
            setBestSprints([]);
            return;
        }

        // 1. Basic Stats
        const totalDuration = data.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
        // Estimate Load if RPE exists, else 5
        const totalLoad = data.reduce((acc, t) => acc + ((t.durationMinutes || 0) * (t.rpe || 5)), 0);

        setStats({
            duration: Math.round(totalDuration / 60), // hours
            load: totalLoad,
            count: data.length
        });

        // 2. Chart Data (Last 7 days or groupings)
        // Group by Date
        const grouped = data.reduce((acc: any, t) => {
            if (!t.date) return acc;
            const date = t.date.split('T')[0];
            if (!acc[date]) acc[date] = { date, load: 0, rpe: 0, count: 0 };

            const dur = t.durationMinutes || 0;
            const rpe = t.rpe || 5;

            acc[date].load += (dur * rpe);
            acc[date].rpe += rpe;
            acc[date].count += 1;
            return acc;
        }, {});

        // Sort and slice last 7-14 entries for chart
        const sortedChart = Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(-10);
        setChartData(sortedChart);

        // 3. Type Distribution
        const types = data.reduce((acc: any, t) => {
            const type = t.type || 'other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        setTypeData(Object.keys(types).map(key => ({ name: key, value: types[key] })));

        // 4. Find Bests (Quick Sprint Parsing)
        const bests: any[] = [];
        data.forEach(t => {
            if (t.sprints && Array.isArray(t.sprints)) {
                t.sprints.forEach(s => {
                    if (s.bestTime) {
                        bests.push({ date: t.date, distance: s.distance, time: s.bestTime });
                    }
                });
            }
        });
        // Sort by time asc, distinct by distance?
        const uniqueBests = bests.sort((a, b) => a.time - b.time).slice(0, 5); // Simplistic
        setBestSprints(uniqueBests);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Vítej zpět! 👋</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Přehled tvé tréninkové sezóny</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} /> <span>Posledních 30 dní</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    label="Celkový Čas"
                    value={`${stats.duration} hod`}
                    icon={<Clock size={24} color="#3b82f6" />}
                    trend="+12% tento týden"
                />
                <StatCard
                    label="Tréninková Zátěž"
                    value={stats.load.toLocaleString()}
                    icon={<Activity size={24} color="#ef4444" />}
                    trend="Vysoká intenzita"
                />
                <StatCard
                    label="Celkem Tréninků"
                    value={stats.count}
                    icon={<TrendingUp size={24} color="#10b981" />}
                    trend="Konzistentní"
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Main Load Chart */}
                <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', minHeight: '300px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} /> Tréninková Zátěž (Load)
                    </h3>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} tickFormatter={val => val.slice(5)} />
                                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="load" name="Zátěž" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Type Distribution & Bests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Pie Chart */}
                    <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Rozdělení Sportů</h3>
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={typeData}
                                        cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {typeData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: 'var(--color-surface)', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                                {typeData.map((entry: any, index: number) => (
                                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                                        <span style={{ textTransform: 'capitalize' }}>{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bests Card */}
                    <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-surface))', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', color: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award size={20} color="#f59e0b" /> Nejlepší Výkony (Top 3)
                        </h3>
                        {bestSprints.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {bestSprints.slice(0, 3).map((s, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                        <span>{s.distance}m</span>
                                        <span style={{ fontWeight: 700 }}>{s.time}s</span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{s.date.slice(5)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>Zatím žádné rekordy...</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Recent Trainings List (Simplified) */}
            <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Poslední Aktivity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {trainings.slice(0, 5).map(t => (
                        <div key={t.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)',
                            borderLeft: `4px solid ${getColorForType(t.type)}`
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t.type?.toUpperCase()}
                                    {t.tags && t.tags.length > 0 && (
                                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                            {t.tags[0]}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t.date} • {t.durationMinutes} min • RPE {t.rpe || '-'}/10</div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', opacity: 0.3 }}>
                                ➔
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

// Helper Components & Functions
const StatCard = ({ label, value, icon, trend }: any) => (
    <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
            {icon}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</div>
        {trend && <div style={{ fontSize: '0.8rem', color: '#10b981' }}>{trend}</div>}
    </div>
);

const getColorForType = (type: string) => {
    if (type === 'strength') return '#8b5cf6';
    if (type === 'cardio') return '#10b981';
    if (type === 'sprint') return '#f59e0b';
    return '#3b82f6';
};

export default Dashboard;
