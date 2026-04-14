import React, { useState } from 'react';
import { useSellers, useCreateSeller } from '../hooks/useData';
import { Card, Button, Input, Modal } from '../components/UI';
import { Plus, MoreVertical } from 'lucide-react';

export const Sellers: React.FC = () => {
    const { data: sellers, isLoading } = useSellers();
    const createSeller = useCreateSeller();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createSeller.mutate(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ name: '' });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendeurs</h1>
                    <p className="text-slate-500">Gérez votre équipe de vente</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} />
                    Ajouter un Vendeur
                </Button>
            </div>

            <Card className="overflow-hidden border-slate-200 shadow-sm transition-all duration-300">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendeur</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-10 w-48 bg-slate-100 rounded-full" /></td>
                                    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-100 rounded-full ml-auto" /></td>
                                </tr>
                            ))
                        ) : (
                            sellers?.map((seller) => (
                                <tr key={seller.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-inner">
                                                {seller.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{seller.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!isLoading && sellers?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-6 py-20 text-center text-slate-500">
                                    Aucun vendeur trouvé. Ajoutez votre premier vendeur !
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter un Vendeur"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom complet"
                        placeholder="Ex: Jean Dupont"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button type="submit" className="flex-1" disabled={createSeller.isPending}>
                            {createSeller.isPending ? 'Chargement...' : 'Ajouter'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
