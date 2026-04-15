import { supabase } from './supabase';
import type { Ticket } from '../types';

export const ticketsService = {
    async getAllByOperation(operationId: string) {
        const { data, error } = await supabase
            .from('tickets')
            .select('*, seller:sellers(*), operation:operations(*), ticket_type:ticket_types(*)')
            .eq('operation_id', operationId)
            .order('number');

        if (error) throw error;
        return data as Ticket[];
    },

    async assignTickets(operationId: string, sellerId: string, startNumber: number, endNumber: number, ticketTypeId?: string) {
        const tickets = [];
        for (let i = startNumber; i <= endNumber; i++) {
            tickets.push({
                operation_id: operationId,
                seller_id: sellerId,
                number: i,
                is_sold: false,
                is_paid: false,
                ticket_type_id: ticketTypeId || null
            });
        }

        const { data, error } = await supabase
            .from('tickets')
            .insert(tickets)
            .select();

        if (error) throw error;
        return data as Ticket[];
    },

    async updateStatus(ticketId: string, updates: Partial<Ticket>) {
        const { data, error } = await supabase
            .from('tickets')
            .update(updates)
            .eq('id', ticketId)
            .select()
            .single();

        if (error) throw error;
        return data as Ticket;
    },

    async updateMultiple(ticketIds: string[], updates: Partial<Ticket>) {
        const { data, error } = await supabase
            .from('tickets')
            .update(updates)
            .in('id', ticketIds)
            .select();

        if (error) throw error;
        return data as Ticket[];
    }
};
