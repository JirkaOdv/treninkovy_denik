import React, { useState, useEffect } from 'react';
import { trainingStorage } from '../services/storage';
import type { UserProfile } from '../types';
import { Save, Trash2, User, Ruler, Scale, Calendar, Sun, Moon, Monitor, Eye, EyeOff } from 'lucide-react';
import styles from '../styles/forms.module.css';
import { useTheme } from '../components/Layout/ThemeProvider';

const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [profile, setProfile] = useState<UserProfile>({
        id: '',
        name: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: 'user',
        theme: 'system'
    });
    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Sync from Backend + Local
    useEffect(() => {
        const loadProfile = async () => {
            const savedLocal = trainingStorage.getUserProfile();

            try {
                // Fetch fresh identity data
                const { api } = await import('../services/api');
                // Assume we have an endpoint or use current user ID if savedLocal has it. 
                // However, savedLocal might not have ID if fresh. 
                // Let's assume we can get /auth/me or similar if we implemented it, 
                // OR we just use the ID from local if it exists.
                // Actually, let's use the users list filtered by ID logic or similar if /auth/me doesn't exist.
                // Better: The 'Login' saves 'user' to localStorage. We can read that?
                // But it's in AuthContext. Let's rely on basic sync for now or implement /auth/me later.
                // For now: Read user from localStorage 'user' key (AuthContext defaults).

                const storedUserStr = localStorage.getItem('user');
                let backendUser = null;
                if (storedUserStr) {
                    const localUser = JSON.parse(storedUserStr);
                    // Fetch fresh info for this user
                    const users = await api.get('/auth/users') as any[];
                    backendUser = users.find(u => u.id === localUser.id) || localUser;
                }

                if (backendUser) {
                    setProfile(prev => ({
                        ...prev,
                        ...savedLocal, // Keep local physical data
                        id: backendUser.id,
                        username: backendUser.username || savedLocal?.username || prev.username,
                        firstName: backendUser.firstName || savedLocal?.firstName || prev.firstName,
                        lastName: backendUser.lastName || savedLocal?.lastName || prev.lastName,
                        email: backendUser.email || savedLocal?.email || prev.email,
                        name: backendUser.name || savedLocal?.name || '',
                        role: backendUser.role
                    }));
                } else if (savedLocal) {
                    setProfile(savedLocal);
                }
            } catch (e) {
                console.error("Failed to sync profile", e);
                if (savedLocal) setProfile(savedLocal);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (field: keyof UserProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        handleChange('theme', newTheme);
    };

    const handleSave = async () => {
        try {
            // 1. Save Physical Data Locally
            trainingStorage.saveUserProfile(profile);

            // 2. Save Identity Data to Backend
            if (profile.id) {
                const { api } = await import('../services/api');
                const updateData = {
                    username: profile.username,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    name: `${profile.firstName} ${profile.lastName}`.trim()
                };

                console.log('Updating user:', profile.id, updateData);
                await api.put(`/auth/users/${profile.id}`, updateData);

                // Refresh the User List (Admin view) to reflect changes immediately
                setRefreshTrigger(prev => prev + 1);
            } else {
                console.warn('No user ID found, skipping backend update');
            }

            setSavedMessage('Nastavení uloženo!');
            setTimeout(() => setSavedMessage(null), 3000);
        } catch (error) {
            console.error(error);
            alert('Chyba při ukládání: ' + (error as any).message);
        }
    };

    const handleReset = async () => {
        if (window.confirm('OPRAVDU chcete smazat veškerá data? Tato akce je nevratná a odstraní všechny tréninky, cíle i nastavení.')) {
            await trainingStorage.clearAllData();
            alert('Data byla vymazána. Aplikace bude restartována.');
            window.location.href = '/';
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Nastavení</h1>

            {/* Profile Section */}
            <section style={{
                background: 'var(--color-surface)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <User style={{ color: 'var(--color-primary)' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Osobní Údaje</h2>
                </div>

                <div className={styles.formGrid}>
                    {/* 1. Identity Identifier */}
                    <div className={styles.formGroup}>
                        <label>Uživatelské jméno</label>
                        <input
                            type="text"
                            value={profile.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                            placeholder="@jirka"
                            className={styles.input}
                        />
                    </div>

                    {/* 2. Real Name (Side-by-side) */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className={styles.formGroup} style={{ flex: '1 1 200px' }}>
                            <label>Jméno</label>
                            <input
                                type="text"
                                value={profile.firstName || ''}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                placeholder="Jan"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup} style={{ flex: '1 1 200px' }}>
                            <label>Příjmení</label>
                            <input
                                type="text"
                                value={profile.lastName || ''}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                placeholder="Novák"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* 3. Contact */}
                    <div className={styles.formGroup}>
                        {/* Email (readonly or editable) */}
                        <label>Email</label>
                        <input
                            type="email"
                            value={profile.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    {/* 4. Bio Start */}
                    <div className={styles.formGroup}>
                        <label>Datum narození</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="date"
                                value={profile.birthDate || ''}
                                onChange={(e) => handleChange('birthDate', e.target.value)}
                                className={styles.input}
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>
                    </div>

                    {/* 5. Physical Stats (Side-by-side) */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className={styles.formGroup} style={{ flex: '1 1 150px' }}>
                            <label>Výška (cm)</label>
                            <div style={{ position: 'relative' }}>
                                <Ruler size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="number"
                                    value={profile.height || ''}
                                    onChange={(e) => handleChange('height', Number(e.target.value))}
                                    placeholder="184"
                                    className={styles.input}
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup} style={{ flex: '1 1 150px' }}>
                            <label>Váha (kg)</label>
                            <div style={{ position: 'relative' }}>
                                <Scale size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="number"
                                    value={profile.weight || ''}
                                    onChange={(e) => handleChange('weight', Number(e.target.value))}
                                    placeholder="90"
                                    className={styles.input}
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                    {savedMessage && (
                        <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                            {savedMessage}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        className={styles.buttonPrimary}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                    >
                        <Save size={18} />
                        Uložit údaje
                    </button>
                </div>
            </section >

            {/* User Management Section (Admin Only) */}
            {
                profile.role === 'admin' && (
                    <section style={{
                        background: 'var(--color-surface)',
                        padding: 'var(--spacing-lg)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <User style={{ color: 'var(--color-accent)' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Správa Uživatelů (Admin)</h2>
                        </div>

                        <UserManagementList key={refreshTrigger} currentUserId={profile.id} />
                    </section>
                )
            }

            {/* Appearance Section */}
            <section style={{
                background: 'var(--color-surface)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Monitor style={{ color: 'var(--color-accent)' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Vzhled Aplikace</h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {['light', 'dark', 'system'].map((themeOption) => (
                        <button
                            key={themeOption}
                            onClick={() => handleThemeChange(themeOption as any)}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: theme === themeOption ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: theme === themeOption ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {themeOption === 'light' && <Sun size={24} />}
                            {themeOption === 'dark' && <Moon size={24} />}
                            {themeOption === 'system' && <Monitor size={24} />}
                            <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
                                {themeOption === 'system' ? 'Systémové' : themeOption === 'light' ? 'Světlé' : 'Tmavé'}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                    onClick={handleReset}
                    className={styles.buttonSecondary}
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                    <Trash2 size={18} style={{ marginRight: '8px' }} />
                    Smazat všechna data
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {savedMessage && <span style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>{savedMessage}</span>}
                    <button onClick={handleSave} className={styles.buttonPrimary} style={{ padding: '12px 24px', fontSize: '1rem' }}>
                        <Save size={20} style={{ marginRight: '8px' }} />
                        Uložit nastavení
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                FitTrack v0.3.1 • Build 2025-12-24
            </div>
        </div >
    );
};

const UserManagementList: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        password: ''
    });

    const loadUsers = async () => {
        try {
            const { api } = await import('../services/api');
            const data = await api.get('/auth/users');
            setUsers(data as any[]);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);



    const handleDelete = async (userId: string, userName: string) => {
        if (!window.confirm(`Opravdu smazat uživatele ${userName}? Tato akce je nevratná.`)) return;
        try {
            const { api } = await import('../services/api');
            await api.delete(`/auth/users/${userId}`);
            loadUsers();
        } catch (error) {
            alert('Chyba při mazání uživatele');
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const openEdit = (user: any) => {
        setEditingUser(user);

        // Fallback: Parse firstName/lastName from 'name' if separate fields are missing
        // This handles cases where only 'name' was updated or persisted.
        let fName = user.firstName || '';
        let lName = user.lastName || '';
        if ((!fName || !lName) && user.name) {
            const parts = user.name.split(' ');
            if (!fName) fName = parts[0] || '';
            if (!lName) lName = parts.slice(1).join(' ') || '';
        }

        setFormData({
            username: user.username || '',
            firstName: fName,
            lastName: lName,
            email: user.email,
            role: user.role,
            password: ''
        });
        setConfirmPassword('');
        setIsCreateMode(false);
    };

    const openCreate = () => {
        setEditingUser(null);
        setFormData({ username: '', firstName: '', lastName: '', email: '', role: 'user', password: '' });
        setConfirmPassword('');
        setIsCreateMode(true);
    };

    const closeEditor = () => {
        setEditingUser(null);
        setIsCreateMode(false);
    };

    // Auto-generate username from email if username is empty or matches previous auto-gen
    const handleEmailChange = (newEmail: string) => {
        const emailPrefix = newEmail.split('@')[0];
        setFormData(prev => ({
            ...prev,
            email: newEmail,
            // Only auto-fill username if it's empty OR if it matched the OLD email prefix (heuristic)
            // For simplicity/UX: if username is empty, fill it.
            username: prev.username ? prev.username : emailPrefix
        }));
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== confirmPassword) {
            alert('Hesla se neshodují!');
            return;
        }

        try {
            const { api } = await import('../services/api');

            if (isCreateMode) {
                await api.post('/auth/users', {
                    ...formData,
                    name: `${formData.firstName} ${formData.lastName}`.trim() // Construct full name for compat
                });
                alert('Uživatel vytvořen');
            } else {
                const updateData: any = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    role: formData.role
                };
                if (formData.password) updateData.password = formData.password;

                await api.put(`/auth/users/${editingUser.id}`, updateData);
                alert('Uživatel aktualizován');
            }
            closeEditor();
            loadUsers();
        } catch (error) {
            alert('Chyba při ukládání uživatele: ' + (error as any).message); // Better error logging
        }
    };

    if (loading) return <div>Načítám uživatele...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

            <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={openCreate}
                    className={styles.buttonSecondary}
                    style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <User size={16} />
                    Nový uživatel
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>Seznam uživatelů ({users.length})</label>
                {users.map(user => (
                    <div key={user.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        transition: 'background 0.2s',
                        cursor: 'default'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name || user.username || 'Bez jména'}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span>{user.email}</span>
                                    {user.username && (
                                        <span style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}>
                                            <User size={10} />
                                            {user.username}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {user.id === currentUserId && <span style={{ fontSize: '0.7rem', background: 'var(--color-primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>VY</span>}
                                <span style={{ fontSize: '0.7rem', background: user.role === 'admin' ? 'var(--color-accent)' : 'var(--color-surface-hover)', color: user.role === 'admin' ? 'white' : 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 600 }}>{user.role}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => openEdit(user)}
                                className={styles.buttonSecondary}
                                style={{ padding: '8px', fontSize: '0.75rem' }}
                                title="Upravit uživatele"
                            >
                                <User size={16} />
                            </button>
                            {user.id !== currentUserId && (
                                <button
                                    onClick={() => handleDelete(user.id, user.name || user.email)}
                                    className={styles.buttonSecondary}
                                    style={{ padding: '8px', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                                    title="Smazat uživatele"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(isCreateMode || editingUser) && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem' // Add padding to wrapper to prevent edge touching
                }} onClick={closeEditor}>
                    <div style={{
                        background: 'var(--color-surface)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%', maxWidth: '450px',
                        maxHeight: '90vh', // Prevent vertical overflow
                        overflowY: 'auto', // Enable scroll if needed
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {isCreateMode ? <><User color="var(--color-primary)" /> Nový uživatel</> : <><User color="var(--color-accent)" /> Upravit uživatele</>}
                        </h3>

                        <form onSubmit={handleSaveUser} className={styles.formGrid} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label>Uživatelské jméno (Login)</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="jirka123"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div className={styles.formGroup} style={{ flex: '1 1 150px' }}> {/* Allow wrap and set min basis */}
                                    <label>Jméno</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Jan"
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ flex: '1 1 150px' }}>
                                    <label>Příjmení</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Novák"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={e => handleEmailChange(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select
                                    className={styles.input}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">Uživatel (User)</option>
                                    <option value="admin">Administrátor (Admin)</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Heslo {isCreateMode ? '(Povinné)' : '(Nechte prázdné pro zachování)'}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={styles.input}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={isCreateMode ? 'Heslo' : '••••••'}
                                        required={isCreateMode}
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {formData.password && (
                                <div className={styles.formGroup}>
                                    <label>Potvrzení hesla</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={styles.input}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Zadejte heslo znovu"
                                        required
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={closeEditor} className={styles.buttonSecondary} style={{ flex: 1 }}>Zrušit</button>
                                <button type="submit" className={styles.buttonPrimary} style={{ flex: 1 }}>Uložit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
