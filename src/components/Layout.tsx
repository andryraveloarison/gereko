import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Ticket,
    Wallet,
    Menu,
    X,
    Filter
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

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Opérations', href: '/operations', icon: Briefcase },
        { name: 'Vendeurs', href: '/sellers', icon: Users },
        { name: 'Billets', href: '/tickets', icon: Ticket },
        { name: 'Dépenses', href: '/expenses', icon: Wallet },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            {/* Sidebar Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    !isSidebarOpen && "-translate-x-full lg:hidden shadow-none"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-100">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Gereko
                        </span>
                        <button
                            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users size={16} className="text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-slate-900">Gereko Admin</p>
                                <p className="text-xs text-slate-500">Gestion des ventes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                    <div className="h-full px-4 flex items-center justify-between lg:px-8">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:text-slate-900"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center space-x-4 flex-1 justify-end">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[200px] md:min-w-[300px]">
                                <Filter size={16} className="text-slate-400" />
                                <Select
                                    value={selectedOperationId}
                                    onChange={e => setSelectedOperationId(e.target.value)}
                                    className="border-0 bg-transparent focus:ring-0 h-auto py-0 text-sm font-semibold text-slate-700 w-full"
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

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
