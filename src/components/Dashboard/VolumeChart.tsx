import React, { useState, useEffect } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { trainingStorage } from '../../services/storage';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';

const VolumeChart: React.FC = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Mock / Real hybrid implementation
        // Get last 14 days
        const end = new Date();
        const start = subDays(end, 13);

        const allTrainings = await trainingStorage.getAllTrainings();

        const days = eachDayOfInterval({ start, end });

        const chartData = days.map(day => {
            const dayTrainings = allTrainings.filter(t => isSameDay(new Date(t.date), day));

            let volume = 0;
            let feelingSum = 0;
            let count = 0;

            dayTrainings.forEach(t => {
                // Primitive volume calculation logic for demo
                // If cardio -> dist in km
                // If strength -> just count session as 1 unit or try to sum tons? 
                // Let's use duration/10 as a "load" proxy if no totalDistance
                volume += t.totalDistance || (t.durationMinutes / 10) || 0;

                const feelingMap: any = { 'great': 5, 'good': 4, 'average': 3, 'bad': 2, 'terrible': 1 };
                feelingSum += feelingMap[t.feeling] || 3;
                count++;
            });

            return {
                date: format(day, 'dd.MM', { locale: cs }),
                volume: Number(volume.toFixed(1)), // km or load units
                feeling: count > 0 ? (feelingSum / count) : null
            };
        });

        setData(chartData);
    };

    return (
        <div style={{
            background: 'var(--color-surface)',
            backdropFilter: 'var(--glass-blur)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            border: '1px solid var(--border-color)',
            height: '100%',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Objem & Regenerace</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: 2 }}></div> Objem
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: 10, height: 10, background: '#fbbf24', borderRadius: '50%' }}></div> Pocit
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 6]}
                            hide
                        />
                        <Tooltip
                            contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="volume"
                            fill="url(#colorVolume)"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="feeling"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#fbbf24', strokeWidth: 2, stroke: '#1e293b' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VolumeChart;
