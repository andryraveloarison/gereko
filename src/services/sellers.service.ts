import { supabase } from './supabase';
import type { Seller } from '../types';

export const sellersService = {
    async getAll() {
        const { data, error } = await supabase
            .from('sellers')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Seller[];
    },

    async create(seller: Partial<Seller>) {
        const { data, error } = await supabase
            .from('sellers')
            .insert(seller)
            .select()
            .single();

        if (error) throw error;
        return data as Seller;
    },

    async update(id: string, updates: Partial<Seller>) {
        const { data, error } = await supabase
            .from('sellers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Seller;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('sellers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
