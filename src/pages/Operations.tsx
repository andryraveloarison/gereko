import React, { useState } from 'react';
import { useOperations, useCreateOperation } from '../hooks/useData';
import { Card, Button, Input, Modal } from '../components/UI';
import { Plus, Briefcase, Calendar, Tag } from 'lucide-react';

export const Operations: React.FC = () => {
    const { data: operations, isLoading } = useOperations();
    const createOperation = useCreateOperation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', ticket_price: 0 });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createOperation.mutate(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ name: '', ticket_price: 0 });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Opérations</h1>
                    <p className="text-slate-500">Gérez vos différentes campagnes de vente</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} />
                    Nouvelle Opération
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {operations?.map((op) => (
                        <Card key={op.id} className="p-6 space-y-4 hover:border-emerald-200 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                                    <Briefcase size={24} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                    {new Date(op.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{op.name}</h3>
                                <div className="flex items-center gap-2 mt-2 text-slate-500">
                                    <Tag size={14} />
                                    <p className="text-sm">Prix du billet: <span className="text-emerald-600 font-bold">{op.ticket_price}Ar</span></p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <Calendar size={12} />
                                    Crée le {new Date(op.created_at).toLocaleDateString()}
                                </div>
                                <Button variant="ghost" className="text-xs h-8 text-emerald-600 hover:bg-emerald-50">Détails</Button>
                            </div>
                        </Card>
                    ))}
                    {operations?.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-500">Aucune opération trouvée. Créez votre première opération !</p>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvelle Opération"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom de l'opération"
                        placeholder="Ex: Opération Cake"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Prix du billet (€)"
                        type="number"
                        placeholder="0.00"
                        value={formData.ticket_price || ''}
                        onChange={e => setFormData({ ...formData, ticket_price: Number(e.target.value) })}
                        required
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button type="submit" className="flex-1" disabled={createOperation.isPending}>
                            {createOperation.isPending ? 'Chargement...' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
