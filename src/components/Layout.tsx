import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

// Layout component that wraps the application with a navbar and main content area
function Layout({ children }: LayoutProps) {
    return (
        <div className="flex">
            <Navbar />
            <main className="ml-64 w-full">
                {children}
            </main>
        </div>
    );
}

export default Layout;
