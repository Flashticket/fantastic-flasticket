import type { SeatType, TicketMapType } from '$lib/types.js';
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
    const seats: SeatType[] = [];
    const $ = cheerio.load(seatsString);
    $('.item-info-map').map((i, el) => {
        console.log('info-map', i);
        const qty = parseInt(el.attribs['data-qty'] || '1');
        const price = parseFloat(el.attribs['data-price'] || '0');
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
                price: price / qty,
                // price: parseInt(price),
            });
        });
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    $('.area-item').map((i, el) => {
        console.log('area-item', i);
        // const id = el.attribs['data-id'];
        const qty = parseInt(el.attribs['data-qty'] || '1');
        const price = parseFloat(el.attribs['data-price'] || '0');
        const id = $(el).find('.title-ticket').text();
        console.log('id', id);
        console.log('qty', qty);
        // console.log('price', price);
        seats.push({
            seat: id,
            amount: qty,
            type: 'area',
            price: price / qty,
        });
    });
    $('.wp-seat-info').map((i, el) => {
        console.log('wp-seat-info', i);
        const span = $(el).find('span');
        console.log('span', span);
        span.map((i, el) => {
            let ticketId=null;
            let qty = 1;
            let price = 0;
            if (el.parentNode?.parentNode?.parentNode) {
                ticketId = $(el.parentNode.parentNode.parentNode).attr('class')?.replace('item-info ', '') || 'unknown';
                qty = parseInt($(el.parentNode.parentNode.parentNode).attr('data-qty') || '1');
                price = parseFloat($(el.parentNode.parentNode.parentNode).attr('data-price') || '0');
                // is ticketId a number?
                if (isNaN(parseInt(ticketId))) {
                    ticketId = null;
                }
            }
            console.log(el.parentNode?.parentNode && $(el.parentNode?.parentNode).attr('class'))
            const id = $(el).text();
            console.log('seat', id);
            // console.log('price', price);
            if (ticketId) {
                seats.push({
                    seat: id,
                    amount: 1,
                    type: 'dropdown',
                    ticketId,
                    price: price / qty,
                });
            } else {
                console.log('no ticketId', id)
            }
        });
    });
    let discount = 0;
    let tax = 0;
    let systemFee = 0;
    let totalBeforeTax = 0;
    let totalPrice = 0;
    $('.discount-number').map((i, el) => {
        discount = parseFloat(el.attribs['data-discount'] || '0');
    });
    $('.tax-number').map((i, el) => {
        tax = parseFloat(el.attribs['data-tax'] || '0');
    });
    $('.system-fee-number').map((i, el) => {
        systemFee = parseFloat(el.attribs['data-system-fee'] || '0');
    });
    $('.total-cart-info').map((i, el) => {
        totalBeforeTax = parseFloat(el.attribs['data-price-before-tax'] || '0');
        totalPrice = parseFloat(el.attribs['data-price'] || '0');
    });

    // wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('seats', seats);
    return {
        price: {
            discount,
            tax,
            systemFee,
            totalBeforeTax,
            totalPrice,
        },
        seats,
        eventId,
        idCal,
    }

}
