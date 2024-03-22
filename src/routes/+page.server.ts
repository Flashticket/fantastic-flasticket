import * as cheerio from 'cheerio';

export const load = async (request) => {    
    const seatsStringEncoded = request.url.searchParams.get('seats');
    const eventId = request.url.searchParams.get('eventId');
    const idCal = request.url.searchParams.get('idCal');
    if (!seatsStringEncoded) {
        return { error: 'No seats'};
    }
    if (!eventId) {
        return { error: 'No eventId'};
    }
    if (!idCal) {
        return { error: 'No idCal'};
    }
    const seatsString = atob(seatsStringEncoded);
    console.log('seatsString', seatsString);
    const seats: { seat: string, amount: number, type: 'area' | 'map' }[] = [];
    const $ = cheerio.load(seatsString);
    $('.item-info-map').map((i, el) => {
        console.log('info-map', i);
        const qty = el.attribs['data-qty'];
        // const price = el.attribs['data-price'];
        console.log('qty', qty);
        // console.log('price', price);
        $(el).find('.wp-seat-info span').map((i, el) => {
            console.log('info-map seat info', i);
            // console.log('el', $(this).find().text());
            console.log('el', $(el).text());
            seats.push({
                seat: $(el).text(),
                amount: 1,
                type: 'map',
                // price: parseInt(price),
            });
        });
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    $('.area-item').map((i, el) => {
        console.log('area-item', i);
        // const id = el.attribs['data-id'];
        const qty = el.attribs['data-qty'];
        // const price = el.attribs['data-price'];
        const id = $(el).find('.title-ticket').text();
        console.log('id', id);
        console.log('qty', qty);
        // console.log('price', price);
        seats.push({
            seat: id,
            amount: parseInt(qty),
            type: 'area',
            // price: parseInt(price),
        });
    });
    $('.wp-seat-info').map((i, el) => {
        console.log('wp-seat-info', i);
        const span = $(el).find('span');
        console.log('span', span);
        span.map((i, el) => {
            const id = $(el).text();
            console.log('seat', id);
            // console.log('price', price);
            seats.push({
                seat: id,
                amount: 1,
                type: 'area',
                // price: parseInt(price),
            });
        });
    });

    // wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('seats', seats);
    return {
        seats,
        eventId,
        idCal,
    }

}
