import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, PlusCircle, Settings, Dumbbell } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logo}>
                <Dumbbell size={28} />
                <span>FitTrack</span>
            </div>

            <nav className={styles.nav}>
                <NavLink
                    to="/dashboard"
                    onClick={onClose}
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Přehled</span>
                </NavLink>

                <NavLink
                    to="/diary"
                    onClick={onClose}
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                    <Calendar size={20} />
                    <span>Deník</span>
                </NavLink>

                <NavLink
                    to="/add-training"
                    onClick={onClose}
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                    <PlusCircle size={20} />
                    <span>Nový Trénink</span>
                </NavLink>
            </nav>

            <div className={styles.footer}>
                <NavLink
                    to="/settings"
                    onClick={onClose}
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                    <Settings size={20} />
                    <span>Nastavení</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
