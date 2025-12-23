import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Function to determine sidebar class based on state and generic styling
    // Note: manipulating generic classes or passing props might be cleaner, 
    // but for simple module CSS we can condition the class on a wrapper or pass a prop to Sidebar.
    // For now, let's wrap Sidebar or pass `isOpen` prop if we modify Sidebar.
    // Actually, standard approach: Sidebar handles its own responsive class via props or we use a wrapper.

    // Let's modify Sidebar to accept `mobileOpen` prop or handle it via wrapper here?
    // Let's assume we can style the sidebar from here if we passed the class, but modules are scoped.
    // Better: Pass `isOpen` and `onClose` to Sidebar component!
    // I will update Sidebar component in next step to accept these props, OR I will just render it here and hack styles.
    // Wait, I can't easily hack module styles from outside.

    // Alternative: The Sidebar is fixed. I can wrap it in a div that handles the transform?
    // Or I can update Sidebar.tsx quickly. I'll stick to a planned update of Sidebar.tsx or passing style overrides.

    // Simplest: Layout renders items.
    // Let's assume I will update Sidebar.tsx to accept `isOpen` prop for mobile.

    return (
        <div className={styles.container}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <button
                    className={styles.menuBtn}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>FitTrack</span>
                <div style={{ width: 24 }} /> {/* Spacer */}
            </header>

            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Overlay for mobile */}
            <div
                className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayOpen : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
