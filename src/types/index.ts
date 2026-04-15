export interface Operation {
    id: string;
    name: string;
    ticket_price: number;
    created_at: string;
}

export interface Seller {
    id: string;
    name: string;
}

export interface TicketType {
    id: string;
    operation_id: string;
    name: string;
    price: number;
    created_at: string;
}

export interface Ticket {
    id: string;
    number: number;
    seller_id: string;
    operation_id: string;
    ticket_type_id: string | null;
    is_sold: boolean;
    is_paid: boolean;
    payment_reference: string | null;
    payment_date: string | null;
    // Join data
    seller?: Seller;
    operation?: Operation;
    ticket_type?: TicketType;
}

export interface Expense {
    id: string;
    operation_id: string;
    label: string;
    amount: number;
    created_at: string;
}

export interface DashboardStats {
    total_billets: number;
    billets_vendus: number;
    billets_payes: number;
    revenu: number;
    total_depenses: number;
    benefice: number;
    is_profit: boolean;
}

export interface SellerStats {
    seller_id: string;
    seller_name: string;
    total_billets: number;
    billets_vendus: number;
    billets_payes: number;
}
