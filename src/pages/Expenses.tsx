import React, { useState } from 'react';
import { useOperations, useExpenses, useCreateExpense } from '../hooks/useData';
import { Card, Button, Input, Select, Modal } from '../components/UI';
import { Plus, Wallet, Tag } from 'lucide-react';
import { useOperation } from '../context/OperationContext';

export const Expenses: React.FC = () => {
    const { selectedOperationId } = useOperation();
    const { data: operations } = useOperations();
    const { data: expenses, isLoading } = useExpenses(selectedOperationId || undefined);

    const createExpense = useCreateExpense();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        label: '',
        amount: 0,
        operation_id: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOperationId && !formData.operation_id) return;

        createExpense.mutate({
            ...formData,
            operation_id: formData.operation_id || selectedOperationId
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ label: '', amount: 0, operation_id: '' });
            }
        });
    };

    const totalExpenses = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dépenses</h1>
                    <p className="text-slate-500">Suivez les coûts associés à chaque opération</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Plus size={18} />
                        Ajouter une Dépense
                    </Button>
                </div>
            </div>

            {!selectedOperationId && expenses?.length === 0 ? (
                <Card className="py-20 text-center">
                    <Wallet size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">Aucune dépense enregistrée. Veuillez sélectionner une opération ou en créer une nouvelle.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden border-slate-200">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Libellé</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {isLoading ? (
                                            [1, 2, 3].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={3} className="px-6 py-4"><div className="h-4 w-full bg-slate-100 rounded" /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            expenses?.map((expense) => (
                                                <tr key={expense.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-sm">
                                                    <td className="px-6 py-4 font-semibold text-slate-900">{expense.label}</td>
                                                    <td className="px-6 py-4 text-rose-600 font-bold">-{expense.amount}€</td>
                                                    <td className="px-6 py-4 text-slate-400 font-medium">
                                                        {new Date(expense.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        {expenses?.length === 0 && !isLoading && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-20 text-center text-slate-500 italic">
                                                    Aucune dépense trouvée.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 bg-rose-50 border-rose-100">
                            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">Total Dépenses</h3>
                            <p className="text-3xl font-bold text-rose-700">{totalExpenses}€</p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <Tag size={12} />
                                <span>Pour {selectedOperationId ? operations?.find(o => o.id === selectedOperationId)?.name : 'toutes les opérations'}</span>
                            </div>
                        </Card>

                        <Card className="p-6 border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Statistiques</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Nombre de dépenses</span>
                                    <span className="font-bold text-slate-900">{expenses?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Moyenne / dépense</span>
                                    <span className="font-bold text-slate-900">{(totalExpenses / (expenses?.length || 1)).toFixed(2)}€</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter une Dépense"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!selectedOperationId && (
                        <Select
                            label="Opération"
                            required
                            value={formData.operation_id}
                            onChange={e => setFormData({ ...formData, operation_id: e.target.value })}
                        >
                            <option value="">Sélectionner une opération</option>
                            {operations?.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                        </Select>
                    )}
                    <Input
                        label="Libellé de la dépense"
                        placeholder="Ex: Impression flyers, Achat boisson..."
                        value={formData.label}
                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                        required
                    />
                    <Input
                        label="Montant (€)"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount || ''}
                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                        required
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button type="submit" className="flex-1" disabled={createExpense.isPending}>
                            {createExpense.isPending ? 'Chargement...' : 'Ajouter'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
