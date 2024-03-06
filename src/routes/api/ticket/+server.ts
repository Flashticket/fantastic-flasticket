import { createPurchase } from "$lib/server/api";
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
export const POST = async ({ request, params, url }: { request: RequestEvent, params: any, url: URL}) => {
    const body = await parsedData(request);
    console.log('body:', body);
    const { seats } = body;
    const results = await createPurchase(seats);
    return new Response(JSON.stringify(results), {
        headers: {
            'content-type': 'application/json'
        }
    });
}