export type TicketMapType = 'area' | 'map' | 'dropdown';
export type SeatType = { seat: string, amount: number, type: TicketMapType, ticketId?: string };
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
    seat: string;
    ticketId: number;
}