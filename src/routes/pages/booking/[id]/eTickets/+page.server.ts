import { getBooking } from '$lib/server/api.js';

export const load = async ({ request, params }) => {    
    console.log(request);
    const { id } = params;
    if (!id) {
        return { error: 'No id'};
    }
    console.log('id', id);
    return await getBooking(parseInt(id));
}
