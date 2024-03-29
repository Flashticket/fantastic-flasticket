import { getBooking } from "$lib/server/api";
import { corsHeaders, sendEmail, takeScreenshot } from "$lib/server/util";
import type { RequestEvent } from "@sveltejs/kit"
import { SENDGRID_TEMPLATE_ID, EMAIL_FROM } from '$env/static/private';
import { generatePass } from "$lib/server/passkit";
import moment from "moment";
export const OPTIONS = async (request) => {
    return new Response(null, {
        headers: corsHeaders,
    });
}
export const POST = async ({ request, params, url }: { request: RequestEvent, params: any, url: URL}) => {
    try {
        // log headers
        // console.log('request.headers', request.request.headers);
        const { id } = params;
        const baseUrl = new URL(request.url).origin;
        console.log('baseUrl', baseUrl);
        const booking = await getBooking(parseInt(id));
        console.log('booking', booking);
        const base64File = await takeScreenshot(`${baseUrl}/pages/booking/${id}`);
        // console.log('base64File', base64File);
        let MXN = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const data = {
            eventName: booking.event.name,
            customerName: booking.customer.name,
            eventDate: moment(new Date(booking.event.date * 1000)).format('DD/MM/YYYY hh:mm A'),
            numberOfTickets: booking.tickets.length,
            totalPrice: MXN.format(booking.price.totalPrice),
        }
        const passkitFiles = await Promise.all(booking.tickets.map(async (ticket, index) => {
            const pass = await generatePass(baseUrl, ticket);
            const base64File = pass.toString('base64');
            return {
                content: base64File,
                filename: `ticket-${index + 1}.pkpass`,
                type: "application/vnd.apple.pkpass",
                disposition: "attachment"
            }
        }));
        const res = await sendEmail(`Flash Ticket <${EMAIL_FROM}>`, booking.customer.email, 'Tickets', undefined, SENDGRID_TEMPLATE_ID, data, [{
            content: base64File,
            filename: "tickets.pdf",
            type: "application/pdf",
            disposition: "attachment" },
            ...passkitFiles
        ]);
        return new Response(JSON.stringify({ code: 0, message: 'ok'}), {
            headers: {
                'content-type': 'application/json',
                ...corsHeaders
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            headers: {
                'content-type': 'application/json',
                ...corsHeaders
            }
        });
    }
}
