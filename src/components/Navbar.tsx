import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    // Get the current location to determine active link
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path || (path === '/' && location.pathname === '/');
    };

    // Define navigation items with their labels and paths
    const navItems = [
        { label: 'Login', path: '/login' },
        { label: 'Signup', path: '/signup' },
        { label: 'Lost & Found', path: '/lostfound' },
        { label: 'Admin', path: '/admin' },
    ];

    return (
        <nav className="fixed left-0 top-0 h-screen w-64 bg-[#3d348b] text-[#e6e2c5] shadow-lg flex flex-col">
            <div className="flex-1 flex flex-col gap-2 p-4 items-center justify-center">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 font-semibold text-center ${
                            isActive(item.path)
                                ? 'bg-[#e6e2c5] text-[#3d348b]'
                                : 'text-[#e6e2c5] hover:bg-[#2b4593]'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;
