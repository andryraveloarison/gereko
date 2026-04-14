import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Ticket,
    Wallet,
    Info,
    Menu,
    X,
    Filter,
    Heart
} from 'lucide-react';
import { useOperation } from '../context/OperationContext';
import { useOperations } from '../hooks/useData';
import { Select } from './UI';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const { selectedOperationId, setSelectedOperationId } = useOperation();
    const { data: operations } = useOperations();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Opérations', href: '/operations', icon: Briefcase },
        { name: 'Vendeurs', href: '/sellers', icon: Users },
        { name: 'Billets', href: '/tickets', icon: Ticket },
        { name: 'Dépenses', href: '/expenses', icon: Wallet },
        { name: 'À propos', href: '/about', icon: Info },
    ];

    // Page-specific background color for transition effect
    const pageBgClass = React.useMemo(() => {
        if (location.pathname === '/') return "bg-white";
        if (location.pathname === '/tickets') return "bg-emerald-50/10";
        if (location.pathname === '/expenses') return "bg-rose-50/10";
        return "bg-white";
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-white text-slate-900 flex">
            {/* Sidebar Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-slate-900/40 lg:hidden animate-in fade-in duration-700"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - z-z-[70] to be above everything */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-[70] w-64 bg-slate-900 transition-all duration-700 ease-in-out lg:relative border-r border-slate-800 shadow-2xl shadow-black/50",
                    !isSidebarOpen ? "-translate-x-full lg:w-0 lg:opacity-0" : "translate-x-0"
                )}
            >
                <div className={cn("flex flex-col h-full text-white transition-opacity duration-300", !isSidebarOpen && "lg:opacity-0")}>
                    <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
                        <div className="flex items-center">
                            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                Gere
                            </span>
                            <span className="text-2xl font-black tracking-tight ">
                                ko
                            </span>
                        </div>
                        <button
                            className="lg:hidden p-1 text-slate-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <NavLink
                                onClick={() => {
                                    setTimeout(() => setIsSidebarOpen(false), 250)
                                }}
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => cn(
                                    "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-slate-800 text-emerald-500 shadow-lg shadow-black/20"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-emerald-400"
                                )}
                            >
                                <item.icon className={cn("mr-3 h-5 w-5", "group-hover:scale-110 transition-transform duration-300")} />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-6 space-y-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 font-medium">
                                <span>Made with</span>
                                <Heart size={10} className="fill-slate-700 text-slate-700" />
                                <span>by AR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Fixed Topbar - Always full width inset-x-0, behind sidebar (z-40) */}
                <header className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 transition-none">
                    <div className="h-full px-4 flex items-center justify-between lg:px-8 max-w-7xl mx-auto w-full">
                        <div className="flex items-center gap-4">
                            <button
                                className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                <Menu size={24} />
                            </button>
                            {/* Empty space for sidebar when open on large screens */}
                            <div className={cn("hidden lg:block transition-all duration-700", isSidebarOpen ? "w-64" : "w-0")} />
                        </div>

                        <div className="flex items-center space-x-4 flex-1 justify-end">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 min-w-[200px] md:min-w-[300px] shadow-sm">
                                <Filter size={14} className="text-slate-400" />
                                <Select
                                    value={selectedOperationId}
                                    onChange={e => setSelectedOperationId(e.target.value)}
                                    className="border-0 bg-transparent focus:ring-0 h-auto py-0 text-sm font-bold text-slate-700 w-full"
                                >
                                    <option value="">Toutes les opérations</option>
                                    {operations?.map(op => (
                                        <option key={op.id} value={op.id}>{op.name}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main section starts after header and respects sidebar offset */}
                <main className={cn(
                    "flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-24 transition-all duration-700",
                    pageBgClass
                )}>
                    <div key={location.pathname} className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
