import { bookSeats } from "$lib/server/api";
import { authenticate } from "$lib/server/util";
import type { RequestEvent } from "@sveltejs/kit"
const parseJson = async (buffer: ArrayBuffer) => {
    const data = Buffer.from(buffer).toString('utf8');
    // console.log('parsing json...', data);
    return JSON.parse(data);
}
const parsedData = (requestEvent: any) => {
    console.log('requestEvent:', requestEvent);
    if (!requestEvent.body) return new Promise<object>(resolve => resolve({}));
    return requestEvent.arrayBuffer().then(buffer => {
        return parseJson(buffer).catch(ex => {
            console.log('Error parsing json:', ex);
        });
    });
}
export const POST = async (requestEvent) => {
    const { request, params, url } = requestEvent;
    const authenticated = authenticate(requestEvent);
    if (!authenticated) {
        return new Response(JSON.stringify({ error: 'Unauthorized'}));
    }
    const body = await parsedData(request);
    console.log('body:', body);
    const { seats, eventId, idCal, price } = body;
    if (!seats || seats.length === 0) {
        return new Response(JSON.stringify({ error: 'No seats'}), {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    const results = await bookSeats(eventId, idCal, seats, price);
    return new Response(JSON.stringify(results), {
        headers: {
            'content-type': 'application/json'
        }
    });
}