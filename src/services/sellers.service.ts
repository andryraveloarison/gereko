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
    }
};
