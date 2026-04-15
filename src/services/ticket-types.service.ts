import { supabase } from './supabase';
import type { TicketType } from '../types';

export const ticketTypesService = {
    async getAllByOperation(operationId: string) {
        const { data, error } = await supabase
            .from('ticket_types')
            .select('*')
            .eq('operation_id', operationId)
            .order('created_at');

        if (error) throw error;
        return data as TicketType[];
    },

    async create(ticketType: Partial<TicketType>) {
        const { data, error } = await supabase
            .from('ticket_types')
            .insert(ticketType)
            .select()
            .single();

        if (error) throw error;
        return data as TicketType;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('ticket_types')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
