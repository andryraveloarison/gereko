import React from 'react';
import { Card } from '../components/UI';
import { Shield, Zap, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <div className="text-center space-y-4 pt-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    À propos de <span className="text-emerald-600">Gereko</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Une solution de gestion de ventes simplifiée, conçue pour l'efficacité et la clarté.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card className="p-8 space-y-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Zap size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Notre Mission</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Gereko a été créé pour répondre aux besoins des organisateurs d'événements et des commerçants qui souhaitent suivre leurs opérations de vente en temps réel, sans la complexité des outils traditionnels.
                    </p>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-slate-700">Interface intuitive</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-slate-700">Gestion centralisée des billets</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-slate-700">Statistiques financières précises</span>
                        </div>
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="p-8 bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-200">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-6">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Guide d'Utilisation</h2>
                        <p className="text-emerald-50 leading-relaxed mb-6">
                            Suivez ces étapes simples pour gérer votre événement avec Gereko :
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                                <p className="text-sm">Créez ou sélectionnez une <strong>Opération</strong> dans le menu du haut.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
                                <p className="text-sm">Ajoutez vos <strong>Vendeurs</strong> et assignez-leur des billets.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</span>
                                <p className="text-sm">Suivez les ventes et les paiements dans l'onglet <strong>Billets</strong>.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">4</span>
                                <p className="text-sm">Enregistrez vos <strong>Dépenses</strong> pour calculer votre bénéfice net.</p>
                            </li>
                        </ul>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-6 text-center space-y-2">
                            <Shield size={24} className="mx-auto text-emerald-600 mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fiabilité</p>
                            <p className="text-sm font-semibold text-slate-900">Données Sécurisées</p>
                        </Card>
                        <Card className="p-6 text-center space-y-2">
                            <Zap size={24} className="mx-auto text-emerald-600 mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vitesse</p>
                            <p className="text-sm font-semibold text-slate-900">React + Vite + Supabase</p>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="text-center pt-10">
                <p className="text-sm text-slate-400">
                    Version 1.3.0
                </p>
            </div>
        </div>
    );
};
