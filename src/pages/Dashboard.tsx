import React, { useMemo } from 'react';
import { useOperations, useTickets, useExpenses, useSellers } from '../hooks/useData';
import { Card, cn } from '../components/UI';
import { useOperation } from '../context/OperationContext';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Ticket as TicketIcon,
    Users,
    Wallet
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

export const Dashboard: React.FC = () => {
    const { selectedOperationId } = useOperation();
    const { data: operations } = useOperations();
    const { data: sellers } = useSellers();

    const { data: tickets } = useTickets(selectedOperationId);
    const { data: expenses } = useExpenses(selectedOperationId);

    const currentOperation = useMemo(() =>
        operations?.find(o => o.id === selectedOperationId),
        [operations, selectedOperationId]
    );

    const stats = useMemo(() => {
        if (!tickets || !currentOperation) return null;

        const total_billets = tickets.length;
        const billets_vendus = tickets.filter(t => t.is_sold).length;
        const billets_payes = tickets.filter(t => t.is_paid).length;
        const revenu = billets_payes * currentOperation.ticket_price;
        const total_depenses = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
        const benefice = revenu - total_depenses;

        return {
            total_billets,
            billets_vendus,
            billets_payes,
            revenu,
            total_depenses,
            benefice,
            is_profit: benefice >= 0
        };
    }, [tickets, expenses, currentOperation]);

    const sellerStats = useMemo(() => {
        if (!tickets || !sellers) return [];

        return sellers.map(seller => {
            const sellerTickets = tickets.filter(t => t.seller_id === seller.id);
            return {
                name: seller.name,
                assigned: sellerTickets.length,
                sold: sellerTickets.filter(t => t.is_sold).length,
                paid: sellerTickets.filter(t => t.is_paid).length,
            };
        }).filter(s => s.assigned > 0);
    }, [tickets, sellers]);

    const chartData = useMemo(() => {
        if (!stats) return [];
        return [
            { name: 'Revenu', value: stats.revenu, color: '#2563eb' },
            { name: 'Dépenses', value: stats.total_depenses, color: '#e11d48' }
        ];
    }, [stats]);

    const ticketData = useMemo(() => {
        if (!stats) return [];
        return [
            { name: 'Vendus', value: stats.billets_vendus, color: '#059669' },
            { name: 'Non vendus', value: stats.total_billets - stats.billets_vendus, color: '#94a3b8' }
        ];
    }, [stats]);

    if (!selectedOperationId) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
                <Card className="py-20 text-center">
                    <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">Veuillez sélectionner une opération dans la barre de navigation pour voir les statistiques</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard: {currentOperation?.name}</h1>
                    <p className="text-slate-500 text-sm">Aperçu en temps réel de votre opération de vente</p>
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-blue-50/50 border-blue-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Revenu Total</p>
                            <h3 className="text-2xl font-bold mt-1 text-blue-900">{stats?.revenu}€</h3>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-slate-500">
                        <span className="text-blue-600 font-bold mr-1">{stats?.billets_payes} billets</span> payés sur {stats?.billets_vendus} vendus
                    </div>
                </Card>

                <Card className="p-6 bg-rose-50/50 border-rose-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Total Dépenses</p>
                            <h3 className="text-2xl font-bold mt-1 text-rose-900">{stats?.total_depenses}€</h3>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-slate-500">
                        Fixes et variables confondues
                    </div>
                </Card>

                <Card className={cn(
                    "p-6",
                    stats?.is_profit ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
                )}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={cn(
                                "text-xs font-semibold uppercase tracking-wider",
                                stats?.is_profit ? "text-emerald-600" : "text-rose-600"
                            )}>{stats?.is_profit ? 'Bénéfice' : 'Perte'}</p>
                            <h3 className={cn(
                                "text-2xl font-bold mt-1",
                                stats?.is_profit ? "text-emerald-900" : "text-rose-900"
                            )}>
                                {Math.abs(stats?.benefice || 0)}€
                            </h3>
                        </div>
                        <div className={cn(
                            "p-2 rounded-lg",
                            stats?.is_profit ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                        )}>
                            {stats?.is_profit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                    </div>
                    <p className={cn(
                        "mt-4 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded inline-block",
                        stats?.is_profit ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                        {stats?.is_profit ? 'RENTABLE' : 'DÉFICIT'}
                    </p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-amber-600/10 to-transparent border-amber-500/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Progression Ventes</p>
                            <h3 className="text-2xl font-bold mt-1">
                                {stats?.total_billets ? Math.round((stats.billets_vendus / stats.total_billets) * 100) : 0}%
                            </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                            <TicketIcon size={20} />
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5">
                        <div
                            className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${stats?.total_billets ? (stats.billets_vendus / stats.total_billets) * 100 : 0}%` }}
                        />
                    </div>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 h-[400px]">
                    <h3 className="text-lg font-semibold mb-6 text-slate-900 border-b border-slate-50 pb-2">Répartition Financière</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}€`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6 h-[400px]">
                    <h3 className="text-lg font-semibold mb-6 text-slate-900 border-b border-slate-50 pb-2">Statut des Billets</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={ticketData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {ticketData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Seller Performance */}
            <Card className="overflow-hidden border-slate-200">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <Users size={20} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Performance par Vendeur</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendeur</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Billets Assignés</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendus</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payés</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Taux de conversion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sellerStats.map((s, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900">{s.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{s.assigned}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-medium">{s.sold}</td>
                                    <td className="px-6 py-4 text-blue-600 font-medium">{s.paid}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[100px]">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full shadow-sm shadow-blue-200"
                                                    style={{ width: `${Math.round((s.sold / s.assigned) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{Math.round((s.sold / s.assigned) * 100)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sellerStats.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                                        Aucune donnée de vente pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
