import { supabase } from './supabase';
import type { Operation } from '../types';

export const operationsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('operations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Operation[];
    },

    async create(operation: Partial<Operation>) {
        const { data, error } = await supabase
            .from('operations')
            .insert(operation)
            .select()
            .single();

        if (error) throw error;
        return data as Operation;
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('operations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Operation;
    }
};
