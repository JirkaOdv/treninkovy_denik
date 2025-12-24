import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/forms.module.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.post('/auth/login', { email, password });

            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Přihlášení</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Email nebo Uživatelské jméno</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Heslo</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <button type="submit" className={styles.buttonPrimary} style={{ width: '100%', marginTop: '10px' }}>
                    Přihlásit se
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Systém je pouze pro autorizované uživatele.
            </p>
        </div>
    );
};

export default Login;
