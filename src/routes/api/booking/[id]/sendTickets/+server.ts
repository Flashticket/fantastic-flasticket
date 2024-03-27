import { getBooking } from "$lib/server/api";
import { sendEmail, takeScreenshot } from "$lib/server/util";
import type { RequestEvent } from "@sveltejs/kit"
import { SENDGRID_TEMPLATE_ID } from '$env/static/private';
import { generatePass } from "$lib/server/passkit";
import moment from "moment";
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
            eventDate: moment(new Date(booking.event.date * 1000)).format('DD/MM/YYYY hh:mm A'),
            numberOfTickets: booking.tickets.length,
            totalPrice: 1234.56,
        }
        const passkitFiles = await Promise.all(booking.tickets.map(async (ticket, index) => {
            const pass = await generatePass(ticket);
            const base64File = pass.toString('base64');
            return {
                content: base64File,
                filename: `ticket-${index + 1}.pkpass`,
                type: "application/vnd.apple.pkpass",
                disposition: "attachment"
            }
        }));
        const res = await sendEmail('Contact <contact@wotoch.com>', booking.customer.email, 'Tickets', undefined, SENDGRID_TEMPLATE_ID, data, [{
            content: base64File,
            filename: "tickets.pdf",
            type: "application/pdf",
            disposition: "attachment" },
            ...passkitFiles
        ]);
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
