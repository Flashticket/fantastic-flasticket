import { getBooking } from "$lib/server/api";
import { sendEmail, takeScreenshot } from "$lib/server/util";
import type { RequestEvent } from "@sveltejs/kit"
export const POST = async ({ request, params, url }: { request: RequestEvent, params: any, url: URL}) => {
    const { id } = params;
    const booking = await getBooking(parseInt(id));
    const base64File = await takeScreenshot(`https://boletera.vercel.app/pages/booking/${id}`);
    // console.log('base64File', base64File);
    const res = await sendEmail('Wotoch contact <contact@wotoch.com>', booking.customer.email, 'Tickets', 'Here are your tickets', [{
        content: base64File,
        filename: "tickets.pdf",
        type: "application/pdf",
        disposition: "attachment" }]);
    return new Response(JSON.stringify(res), {
        headers: {
            'content-type': 'application/json'
        }
    });
}