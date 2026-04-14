import { supabase } from './supabase';
import type { Expense } from '../types';

export const expensesService = {
    async getAllByOperation(operationId: string) {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('operation_id', operationId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Expense[];
    },

    async create(expense: Partial<Expense>) {
        const { data, error } = await supabase
            .from('expenses')
            .insert(expense)
            .select()
            .single();

        if (error) throw error;
        return data as Expense;
    }
};
