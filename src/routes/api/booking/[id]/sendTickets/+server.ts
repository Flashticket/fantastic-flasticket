import { getBooking } from "$lib/server/api";
import { sendEmail, takeScreenshot } from "$lib/server/util";
import type { RequestEvent } from "@sveltejs/kit"
import { SENDGRID_TEMPLATE_ID } from '$env/static/private';
export const POST = async ({ request, params, url }: { request: RequestEvent, params: any, url: URL}) => {
    try {
        const { id } = params;
        const booking = await getBooking(parseInt(id));
        console.log('booking', booking);
        const base64File = await takeScreenshot(`https://boletera.vercel.app/pages/booking/${id}`);
        // console.log('base64File', base64File);
        const data = {
            eventName: booking.event.name,
            customerName: booking.customer.name,
            eventDate: booking.event.date,
            numberOfTickets: booking.tickets.length,
            totalPrice: 1234.56,
        }
        const res = await sendEmail('Wotoch contact <contact@wotoch.com>', booking.customer.email, 'Tickets', undefined, SENDGRID_TEMPLATE_ID, data, [{
            content: base64File,
            filename: "tickets.pdf",
            type: "application/pdf",
            disposition: "attachment" }]);
        return new Response(JSON.stringify(res), {
            headers: {
                'content-type': 'application/json'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}
