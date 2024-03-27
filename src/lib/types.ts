export type TicketMapType = 'area' | 'map' | 'dropdown';
export type SeatType = { seat: string, amount: number, type: TicketMapType, ticketId?: string, price: number };
export type PriceType = {
    discount: number;
    tax: number;
    systemFee: number;
    totalBeforeTax: number;
    totalPrice: number;
}
export interface Ticket {
    eventId: number;
    bookingId: number;
    img: number,
    eventStart: number;
    eventEnd: number;
    eventName: string;
    qrCode: string;
    customer: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
    venue: string;
    address: string;
    seat: string;
    ticketId: number;
}
export interface Event {
    id: number;
    name: string;
    date: number;
    venue: string;
    img: string;
    url: string;
    description: string;
    tickets: Ticket[];
    customer: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
}

export interface Booking {
    bookingId: number;
    customer: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
    event: Event;
    tickets: Ticket[];
    price: PriceType;
}