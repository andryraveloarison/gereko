import React, { useState, useMemo } from 'react';
import { useSellers, useTickets, useAssignTickets, useUpdateTickets, useTicketTypes } from '../hooks/useData';
import { Card, Button, Input, Select, Modal, cn } from '../components/UI';
import { Plus, Ticket as TicketIcon, CheckSquare, Square, CreditCard, Search, Tag, ShoppingBag, X } from 'lucide-react';
import { useOperation } from '../context/OperationContext';

export const Tickets: React.FC = () => {
    const { selectedOperationId } = useOperation();
    const { data: sellers } = useSellers();
    const { data: tickets, isLoading } = useTickets(selectedOperationId);
    const { data: ticketTypes } = useTicketTypes(selectedOperationId);

    const assignTickets = useAssignTickets();
    const updateTickets = useUpdateTickets();

    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isBulkSellModalOpen, setIsBulkSellModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [ticketToCancel, setTicketToCancel] = useState<string | null>(null);

    const [assignData, setAssignData] = useState({
        sellerId: '',
        startNumber: 1,
        endNumber: 10
    });

    const [bulkSellData, setBulkSellData] = useState({
        ticketTypeId: ''
    });

    const [bulkData, setBulkData] = useState({
        is_paid: true,
        payment_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        ticketTypeId: ''
    });

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOperationId) return;
        assignTickets.mutate({
            operationId: selectedOperationId,
            ...assignData
        }, {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                setAssignData({ sellerId: '', startNumber: 1, endNumber: 10 });
            }
        });
    };

    const handleBulkSell = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTickets.length === 0 || !selectedOperationId) return;

        updateTickets.mutate({
            ids: selectedTickets,
            operationId: selectedOperationId,
            updates: {
                is_sold: true,
                ticket_type_id: bulkSellData.ticketTypeId || null
            }
        }, {
            onSuccess: () => {
                setIsBulkSellModalOpen(false);
                setSelectedTickets([]);
                setBulkSellData({ ticketTypeId: '' });
            }
        });
    };

    const toggleTicketSelection = (id: string) => {
        setSelectedTickets(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const filteredTickets = useMemo(() => {
        if (!tickets) return [];
        if (!searchTerm) return tickets;
        const term = searchTerm.toLowerCase();
        return tickets.filter(t =>
            t.seller?.name?.toLowerCase().includes(term) ||
            String(t.number).includes(term)
        );
    }, [tickets, searchTerm]);

    const toggleAllSelection = () => {
        if (selectedTickets.length === filteredTickets.length && filteredTickets.length > 0) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(filteredTickets.map(t => t.id));
        }
    };

    const handleBulkUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTickets.length === 0 || !selectedOperationId) return;

        // Build updates preserving existing ticket types
        const updates: any = {
            is_paid: bulkData.is_paid,
            is_sold: true, // If paying, it's sold
            payment_reference: bulkData.payment_reference || null,
            payment_date: bulkData.payment_date || new Date().toISOString()
        };

        // Only set ticket_type_id if a new type is selected
        if (bulkData.ticketTypeId) {
            updates.ticket_type_id = bulkData.ticketTypeId;
        }

        updateTickets.mutate({
            ids: selectedTickets,
            operationId: selectedOperationId,
            updates
        }, {
            onSuccess: () => {
                setIsBulkModalOpen(false);
                setSelectedTickets([]);
                setBulkData({ is_paid: true, payment_reference: '', payment_date: new Date().toISOString().split('T')[0], ticketTypeId: '' });
            }
        });
    };

    const handleCancelTicket = (ticketId: string) => {
        if (!selectedOperationId) return;
        updateTickets.mutate({
            ids: [ticketId],
            operationId: selectedOperationId,
            updates: {
                is_sold: false,
                is_paid: false,
                payment_reference: null,
                payment_date: null
            }
        }, {
            onSuccess: () => {
                setTicketToCancel(null);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Billets</h1>
                    <p className="text-slate-500">Assignez et suivez le statut des billets par opération</p>
                </div>
                <div className="flex-0 max-w-md">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Rechercher un vendeur ou n°..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 w-full"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        disabled={!selectedOperationId}
                        onClick={() => setIsAssignModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Assigner
                    </Button>
                    {selectedTickets.length > 0 && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => setIsBulkSellModalOpen(true)}
                                className="flex items-center gap-2 animate-in slide-in-from-right-4"
                            >
                                <ShoppingBag size={18} />
                                Vendre ({selectedTickets.length})
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setIsBulkModalOpen(true)}
                                className="flex items-center gap-2 animate-in slide-in-from-right-4"
                            >
                                <CreditCard size={18} />
                                Payer ({selectedTickets.length})
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {!selectedOperationId ? (
                <Card className="py-20 text-center">
                    <TicketIcon size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">Veuillez sélectionner une opération pour voir les billets associés</p>
                </Card>
            ) : (
                <Card className="overflow-hidden border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 w-10">
                                        <button onClick={toggleAllSelection} className="text-slate-400 hover:text-slate-600 transition-colors">
                                            {selectedTickets.length === filteredTickets.length && filteredTickets.length > 0
                                                ? <CheckSquare size={20} className="text-emerald-600" />
                                                : <Square size={20} />
                                            }
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Numéro</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendeur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut Vente</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut Paiement</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="px-6 py-4"><div className="h-4 w-full bg-slate-100 rounded" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className={cn(
                                                "hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                                                selectedTickets.includes(ticket.id) && "bg-emerald-50"
                                            )}
                                        >
                                            <td className="px-6 py-4">
                                                <button onClick={() => toggleTicketSelection(ticket.id)} className="text-slate-400 hover:text-emerald-600 transition-colors">
                                                    {selectedTickets.includes(ticket.id) ? <CheckSquare size={20} className="text-emerald-600" /> : <Square size={20} />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-emerald-600 text-sm">
                                                #{String(ticket.number).padStart(4, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-slate-900 text-sm">{ticket.seller?.name || 'Inconnu'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-500 text-sm">
                                                    {ticket.ticket_type?.name ? (
                                                        <span className="flex items-center gap-1">
                                                            <Tag size={12} className="text-emerald-500" />
                                                            {ticket.ticket_type.name}
                                                        </span>
                                                    ) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ticket.is_sold ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        Vendu
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                                                        Disponible
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {ticket.is_paid ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        Payé
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                                                        Attente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {(ticket.is_sold || ticket.is_paid) && (
                                                    <Button
                                                        variant="ghost"
                                                        className="text-xs h-8 text-rose-600 hover:bg-rose-50"
                                                        onClick={() => setTicketToCancel(ticket.id)}
                                                    >
                                                        <X size={16} />
                                                        Annuler
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {filteredTickets.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">
                                            {searchTerm ? 'Aucun résultat pour cette recherche.' : 'Aucun billet assigné pour cette opération.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Assign Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assigner des Billets"
            >
                <form onSubmit={handleAssign} className="space-y-4">
                    <Select
                        label="Vendeur"
                        required
                        value={assignData.sellerId}
                        onChange={e => setAssignData({ ...assignData, sellerId: e.target.value })}
                    >
                        <option value="">Sélectionner un vendeur</option>
                        {sellers?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="De (Numéro)"
                            type="number"
                            required
                            value={assignData.startNumber}
                            onChange={e => setAssignData({ ...assignData, startNumber: Number(e.target.value) })}
                        />
                        <Input
                            label="À (Numéro)"
                            type="number"
                            required
                            value={assignData.endNumber}
                            onChange={e => setAssignData({ ...assignData, endNumber: Number(e.target.value) })}
                        />
                    </div>
                    <p className="text-xs text-slate-500 px-1 italic">
                        Cela créera et assignera {Math.max(0, assignData.endNumber - assignData.startNumber + 1)} billets.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAssignModalOpen(false)}>Annuler</Button>
                        <Button type="submit" className="flex-1" disabled={assignTickets.isPending}>
                            {assignTickets.isPending ? 'Chargement...' : 'Assigner'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Bulk Sell Modal */}
            <Modal
                isOpen={isBulkSellModalOpen}
                onClose={() => setIsBulkSellModalOpen(false)}
                title={`Vendre (${selectedTickets.length} billets)`}
            >
                <form onSubmit={handleBulkSell} className="space-y-4">
                    <p className="text-sm text-slate-400 mb-4">
                        Vous allez marquer {selectedTickets.length} billets comme vendus.
                    </p>
                    <Select
                        label="Type de billet"
                        value={bulkSellData.ticketTypeId}
                        onChange={e => setBulkSellData({ ...bulkSellData, ticketTypeId: e.target.value })}
                    >
                        <option value="">Sans type</option>
                        {ticketTypes?.map(t => <option key={t.id} value={t.id}>{t.name} ({t.price}Ar)</option>)}
                    </Select>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsBulkSellModalOpen(false)}>Annuler</Button>
                        <Button type="submit" className="flex-1" disabled={updateTickets.isPending} variant="secondary">
                            {updateTickets.isPending ? 'Chargement...' : 'Marquer comme vendu'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Bulk Payment Modal */}
            <Modal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                title={`Paiement groupé (${selectedTickets.length} billets)`}
            >
                <form onSubmit={handleBulkUpdate} className="space-y-4">
                    <p className="text-sm text-slate-400 mb-4">
                        Vous allez marquer {selectedTickets.length} billets comme payés pour l'opération en cours.
                    </p>
                    {selectedTickets.some(id => !tickets?.find(t => t.id === id)?.ticket_type_id) && (
                        <Select
                            label="Type de billet"
                            value={bulkData.ticketTypeId}
                            onChange={e => setBulkData({ ...bulkData, ticketTypeId: e.target.value })}
                        >
                            <option value="">Sans type</option>
                            {ticketTypes?.map(t => <option key={t.id} value={t.id}>{t.name} ({t.price}Ar)</option>)}
                        </Select>
                    )}
                    <Input
                        label="Référence de paiement commune"
                        placeholder="Ex: Virement groupé, Chèque global"
                        value={bulkData.payment_reference}
                        onChange={e => setBulkData({ ...bulkData, payment_reference: e.target.value })}
                        required
                    />
                    <Input
                        label="Date de paiement"
                        type="date"
                        value={bulkData.payment_date}
                        onChange={e => setBulkData({ ...bulkData, payment_date: e.target.value })}
                        required
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsBulkModalOpen(false)}>Annuler</Button>
                        <Button type="submit" className="flex-1" disabled={updateTickets.isPending} variant="secondary">
                            {updateTickets.isPending ? 'Chargement...' : 'Confirmer le paiement'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Cancel Ticket Modal */}
            <Modal
                isOpen={!!ticketToCancel}
                onClose={() => setTicketToCancel(null)}
                title="Annuler ce billet"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Êtes-vous sûr de vouloir annuler ce billet ? Il passera en statut "Disponible" et "Attente".
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setTicketToCancel(null)}>Annuler</Button>
                        <Button type="button" className="flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => ticketToCancel && handleCancelTicket(ticketToCancel)} disabled={updateTickets.isPending}>
                            {updateTickets.isPending ? 'Chargement...' : 'Confirmer l\'annulation'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
