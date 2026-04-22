import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationsService } from '../services/operations.service';
import { sellersService } from '../services/sellers.service';
import { ticketsService } from '../services/tickets.service';
import { ticketTypesService } from '../services/ticket-types.service';
import { expensesService } from '../services/expenses.service';
import type { Operation, Seller, Expense, Ticket, TicketType } from '../types';

// Operations Hooks
export function useOperations() {
    return useQuery({
        queryKey: ['operations'],
        queryFn: () => operationsService.getAll(),
    });
}

export function useOperation(id: string) {
    return useQuery({
        queryKey: ['operations', id],
        queryFn: () => operationsService.getById(id),
        enabled: !!id,
    });
}

export function useCreateOperation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (operation: Partial<Operation>) => operationsService.create(operation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operations'] });
        },
    });
}

// Sellers Hooks
export function useSellers() {
    return useQuery({
        queryKey: ['sellers'],
        queryFn: () => sellersService.getAll(),
    });
}

export function useCreateSeller() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (seller: Partial<Seller>) => sellersService.create(seller),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
        },
    });
}

export function useUpdateSeller() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Seller> }) =>
            sellersService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
        },
    });
}

export function useDeleteSeller() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => sellersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
        },
    });
}

// Tickets Hooks
export function useTickets(operationId?: string | null) {
    return useQuery({
        queryKey: ['tickets', operationId],
        queryFn: () => ticketsService.getAllByOperation(operationId!),
        enabled: !!operationId,
    });
}

export function useAssignTickets() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ operationId, sellerId, startNumber, endNumber }: { operationId: string, sellerId: string, startNumber: number, endNumber: number }) =>
            ticketsService.assignTickets(operationId, sellerId, startNumber, endNumber),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets', variables.operationId] });
        },
    });
}

export function useUpdateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Ticket> }) =>
            ticketsService.updateStatus(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tickets', data.operation_id] });
        },
    });
}

export function useUpdateTickets() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, updates }: { ids: string[], updates: Partial<Ticket>, operationId: string }) =>
            ticketsService.updateMultiple(ids, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets', variables.operationId] });
        },
    });
}

// Expenses Hooks
export function useExpenses(operationId?: string | null) {
    return useQuery({
        queryKey: ['expenses', operationId],
        queryFn: () => expensesService.getAllByOperation(operationId!),
        enabled: !!operationId,
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (expense: Partial<Expense>) => expensesService.create(expense),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['expenses', data.operation_id] });
        },
    });
}

// Ticket Types Hooks
export function useTicketTypes(operationId?: string | null) {
    return useQuery({
        queryKey: ['ticket-types', operationId],
        queryFn: () => ticketTypesService.getAllByOperation(operationId!),
        enabled: !!operationId,
    });
}

export function useCreateTicketType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ticketType: Partial<TicketType>) => ticketTypesService.create(ticketType),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['ticket-types', data.operation_id] });
        },
    });
}

export function useDeleteTicketType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id }: { id: string, operationId: string }) => ticketTypesService.delete(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ticket-types', variables.operationId] });
        },
    });
}
