import { corsHeaders } from "$lib/server/util";
import type { RequestEvent } from "@sveltejs/kit"
export const OPTIONS = async (request) => {
    return new Response(null, {
        headers: corsHeaders,
    });
}
export const POST = async ({ request, params, url }: { request: RequestEvent, params: any, url: URL}) => {
    const { id } = params;
    const baseUrl = new URL(request.url).origin;
    fetch(`${baseUrl}/api/booking/${id}/sendTickets`, { method: 'POST' });
    // wait a couple of seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    return new Response(null, {
        headers: {
            'content-type': 'application/json',
            ...corsHeaders
        }
    });
}
