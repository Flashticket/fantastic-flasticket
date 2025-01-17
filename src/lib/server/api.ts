import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';


import { DB_HOST, DB_USER, DB_PASSWORD,  DB_NAME, EMAIL_FROM } from '$env/static/private'
import type { Booking, PriceType, SeatType, Ticket, TicketMapType } from '$lib/types';

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
  });
  
const getMeta = (meta: any[], key: string) => {
    const metaObj = meta.find((m: any) => m.meta_key === key);
    console.log('metaObj', metaObj);
    return metaObj ? metaObj.meta_value : null;
}

// typescript mysql client to run raw queries
export const runQuery = async (query: string) => {
    let connection: mysql.PoolConnection | null = null;
    try {
        console.log('running query:', query)
        const connData = {
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
        };
        console.log('connData:', connData);
        connection = await pool.getConnection();
        if (!connection) {
            throw new Error('No connection');
        }
        // run the query and get the results
        let results = await connection?.query({
            sql: query,
            timeout: 40000,
            values: []
        });
        // close the connection
        console.log('results', results);
        return results[0] as (any & { insertId?: number  }) | any[];
    } catch (ex) {
        console.log('Error:', ex);
        throw ex;
    } finally {
        connection?.release();
    }
};

export const getPost = async (postId: number) => {
    const post = await runQuery(`SELECT * FROM wp_sya2cn_posts WHERE ID = ${postId}`);
    return post.length > 0 ? post[0] : null;
}

export const getPostMeta = async (postId: number, metaKey: string) => {
    const meta = await runQuery(`SELECT * FROM wp_sya2cn_postmeta WHERE post_id = ${postId} AND meta_key = '${metaKey}'`);
    return meta.length > 0 ? meta[0] : null;
}
export const getFullPostMeta = async (postId: number) => {
    return await runQuery(`SELECT * FROM wp_sya2cn_postmeta WHERE post_id = ${postId}`);
}
export const getMetaByKeyAndValue = async (metaKey: string, metaValue: string) => {
    const result = await runQuery(`SELECT * FROM wp_sya2cn_postmeta WHERE meta_key = '${metaKey}' AND meta_value = '${metaValue}'`);
    return result.length > 0 ? result[0] : null;
}
// group array of objects by a property of the objects
export const groupBy = (array: any[], key: string) => {
    return array.reduce((acc, cur) => {
        (acc[cur[key]] = acc[cur[key]] || []).push(cur);
        return acc;
    }, {});
}
// get unique values from an array
export const unique = (array: any[]) => {
    return [...new Set(array)];
}

export const getSeatBook = (seats: SeatType[]) => {
    if (!seats.some(s => s.type === 'dropdown')) {
        return `a:${seats.length}:{${seats.map((s, i) => `i:${i};s:${s.seat.length}:"${s.seat}"`).join(';')};}`;
    }
    const groupedSeats = groupBy(seats, 'ticketId');
    return `a:${Object.keys(groupedSeats).length}:{${Object.keys(groupedSeats).map((ticketId, i) => {
        return `i:${ticketId};a:${groupedSeats[ticketId].length}:{${groupedSeats[ticketId].map((s: SeatType, i: number) => `i:${i};s:${s.seat.length}:"${s.seat}"`).join(';')};}`;
    })}}`;
}
export const bookSeats = async (eventId: number, idCal: string, seats: SeatType[], price: PriceType, email?: string) => {
    console.log('seats:', seats);
    // const seatBook = 'a:3:{i:0;s:23:"VERDE-SECC-GEN-DER-ASTO";i:1;s:30:"PLATINUM_ROJO-SECC-B1-ASTO-X44";i:2;s:30:"ORO_AMARILLO-SECC-C1-ASTO-FF45";}';
    const seatBook = getSeatBook(seats);
    console.log('seatBook:', seatBook);
    // const seatQuantity = 'a:3:{s:23:"VERDE-SECC-GEN-DER-ASTO";i:4;s:30:"PLATINUM_ROJO-SECC-B1-ASTO-X44";i:1;s:30:"ORO_AMARILLO-SECC-C1-ASTO-FF45";i:1;}';
    const seatQuantity = `a:${seats.length}:{${seats.map((s, i) => `s:${s.seat.length}:"${s.seat}";i:${s.amount}`).join(';')};}`;
    // const listIdTicket = `a:${seats.length}:{${seats.map((s, i) => `i:${i};s:${s.seat.length}:"${s.seat}"`).join(';')};}`;
    const listIdTicket = JSON.stringify(seats.map((s, i) => s.seat));
    console.log('seatBook:', seatBook);
    console.log('seatQuantity:', seatQuantity);
    console.log('listIdTicket:', listIdTicket);
    console.log('eventId:', eventId);
    // Make sure the seats aren't booked already, at least the non general ones
    for (const seat of seats.filter(s => s.type !== 'area')) {
        const seatMeta = await getMetaByKeyAndValue('ova_mb_event_seat', seat.seat);
        if (seatMeta) {
            throw new Error(`El asiento ${seat.seat} ya se ha reservado.`);
        }
    }
    // return;
    const event = await getPost(eventId);
    const eventStart = await getPostMeta(eventId, 'ova_mb_event_start_date_str');
    const eventEnd = await getPostMeta(eventId, 'ova_mb_event_end_date_str');
    const img = 15067 // where to get this from?
    const customer = {
        name: 'Taquilla',
        phone: '123',
        email: email || EMAIL_FROM,
        address: 'Internal address',
    };
    const venue = 'Teatro Metropolitano';
    

    const eventName = event.post_title;
    const postPassword = Math.round(Math.random() * 10000); // not sure about this one...
    

    const query = `INSERT INTO wp_sya2cn_posts (post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count) VALUES
	 (1,CURRENT_TIMESTAMP(), UTC_TIMESTAMP(),'','${eventId} - ${eventName}','','publish','closed','closed','','${postPassword}','','',CURRENT_TIMESTAMP(), UTC_TIMESTAMP(),'',0,'https://boletera.dev-mt.com/el_bookings/${postPassword}/',0,'el_bookings','',0);`
    const booking = await runQuery(query);
    if (!booking) throw new Error('No booking');
    const bookingId = booking.insertId;
    console.log('==========> bookingId:', bookingId);

    // a:3:{i:0;s:23:"CAFE-SECC-GEN-CENT-ASTO";i:1;s:23:"VERDE-SECC-GEN-DER-ASTO";i:2;s:22:"ROSA-SECC-GEN-IZQ-ASTO";}
    const areaSeats = seats.filter(s => s.type === 'area').map(s => s.seat);
    const areaSeatsStr = `a:${areaSeats.length}:{${areaSeats.map((s, i) => `i:${i};s:${s.length}:"${s}"`).join(';')};}`;



    const bookingMetaQueries = 
        `INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_status_holding_ticket', 'Completed'),
        (${bookingId}, 'ova_mb_event_multiple_ticket', 'no'),
        (${bookingId}, 'ova_mb_event_status', 'Completed'),
        (${bookingId}, 'ova_mb_event_list_seat_book', '${seatBook}'),
        (${bookingId}, 'ova_mb_event_list_qty_ticket_by_id_ticket', '${seatQuantity}'),
        (${bookingId}, 'ova_mb_event_list_id_ticket', '${listIdTicket}'),
        (${bookingId}, 'ova_mb_event_title_event', '${eventName}'),
        (${bookingId}, 'ova_mb_event_id_event', '${eventId}'),
        (${bookingId}, 'ova_mb_event_id_cal', '${idCal}'),
        (${bookingId}, 'ova_mb_event_arr_area', '${areaSeatsStr}'),
        (${bookingId}, 'ova_mb_event_system_fee', '${price.systemFee}'),
        (${bookingId}, 'ova_mb_event_tax', '${price.tax}'),
        (${bookingId}, 'ova_mb_event_total', '${price.totalBeforeTax}'),
        (${bookingId}, 'ova_mb_event_total_after_tax', '${price.totalPrice}')
        `;
    const results = await runQuery(bookingMetaQueries);
    // const tickets = [];
    const eventMeta = await getFullPostMeta(eventId);
    const eventAddress = getMeta(eventMeta, 'ova_mb_event_address') || 'Desconocido';
    // for (const seat of seats) {
    const tickets = (await Promise.all(seats.map(async (seat) => {
        // for (let i = 0; i < seat.amount; i++) {
        return await Promise.all(new Array(seat.amount).fill(0).map(async (s, i) => {
            const postQuery = `INSERT INTO wp_sya2cn_posts
            (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
            VALUES(1, CURRENT_TIMESTAMP(), UTC_TIMESTAMP(), '', 'Mapa', '', 'publish', 'closed', 'closed', '', '${postPassword}', '', '', CURRENT_TIMESTAMP(), UTC_TIMESTAMP(), '', 0, 'https://boletera.dev-mt.com/el_tickets/${postPassword}/', 0, 'el_tickets', '', 0);
            `;
            const postResult = await runQuery(postQuery);
            const ticketId = postResult.insertId;
            console.log('==========> ticketId:', ticketId);
            if (!ticketId) {
                throw new Error('No ticketId');
            }
            const qrCode = uuidv4().replace(/-/g, '');
            const ticket: Ticket = {
                eventId,
                bookingId,
                img,
                eventStart: eventStart.meta_value,
                eventEnd: eventEnd.meta_value,
                eventName,
                qrCode,
                customer,
                venue,
                address: eventAddress,
                seat: seat.seat,
                ticketId,
            }
            // tickets.push(ticket);
            await createTicket(ticket);
            console.log(`ticket created for seat ${seat}`);
            return ticket;
        }))
    }))).flat();


    const ticketIdsStr = tickets.map((r: Ticket, index) => `i: ${index};i:${r.ticketId}`).join(';');
    const ticketListQuery = `INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_record_ticket_ids', 'a:${tickets.length}:{${ticketIdsStr};}')`;
    const cart = `a:${seats.length}:{${seats.map((s, i) => `i:${i};a:${s.type === 'area' ? 3 : 2}:{s:2:"id";s:${s.seat.length}:"${s.seat}";s:5:"price";d:${s.price};${s.type === 'area' ? `s:3:"qty";s:${`${s.amount}`.length}:"${s.amount}";` : ''}}`).join('')}}`;
    const promises = [
        runQuery(ticketListQuery),
        runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_name', '${customer.name}')`),
        runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_phone', '${customer.phone}')`),
        runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_email', '${customer.email}')`),
        runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_address', '${customer.address}')`),
        runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_cart', '${cart}')`)
    ];
    await Promise.all(promises);
    return { bookingId, tickets };
}
export const createTicket = async (ticket: Ticket) => {
    const insertQueries = 
        `INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_event_id', ${ticket.eventId}),
        (${ticket.ticketId}, 'ova_mb_event_booking_id', ${ticket.bookingId}),
        (${ticket.ticketId}, 'ova_mb_event_name_event', '${ticket.eventName}'),
        (${ticket.ticketId}, 'ova_mb_event_qr_code', '${ticket.qrCode}'),
        (${ticket.ticketId}, 'ova_mb_event_name_customer', '${ticket.customer.name}'),
        (${ticket.ticketId}, 'ova_mb_event_phone_customer', '${ticket.customer.phone}'),
        (${ticket.ticketId}, 'ova_mb_event_email_customer', '${ticket.customer.email}'),
        (${ticket.ticketId}, 'ova_mb_event_address_customer', '${ticket.customer.address}'),
        (${ticket.ticketId}, 'ova_mb_event_venue', 'a:1:{i:0;s:${ticket.venue.length}:"${ticket.venue}";}'),
        (${ticket.ticketId}, 'ova_mb_event_address', '${ticket.address}'),
        (${ticket.ticketId}, 'ova_mb_event_data_checkout_field', '[]'),
        (${ticket.ticketId}, 'ova_mb_event_seat', '${ticket.seat}'),
        (${ticket.ticketId}, 'ova_mb_event_date_start', '${ticket.eventStart}'),
        (${ticket.ticketId}, 'ova_mb_event_date_end', '${ticket.eventEnd}'),
        (${ticket.ticketId}, 'ova_mb_event_img', '${ticket.img}'),
        (${ticket.ticketId}, 'ova_mb_event_color_ticket', ''),
        (${ticket.ticketId}, 'ova_mb_event_color_label_ticket', ''),
        (${ticket.ticketId}, 'ova_mb_event_color_content_ticket', ''),
        (${ticket.ticketId}, 'ova_mb_event_desc_ticket', ''),
        (${ticket.ticketId}, 'ova_mb_event_private_desc_ticket', ''),
        (${ticket.ticketId}, 'ova_mb_event_ticket_status', ''),
        (${ticket.ticketId}, 'ova_mb_event_checkin_time', ''),
        (${ticket.ticketId}, 'ova_mb_event_ticket_id_event', '${ticket.eventId}'),
        (${ticket.ticketId}, 'ova_mb_event_ticket_id', '${ticket.ticketId}')`;
    const results = await runQuery(insertQueries);
    return results;
}
export const getBooking = async (bookingId: number) => {
    // const booking = await getPost(bookingId);
    const bookingMeta = await getFullPostMeta(bookingId);
    console.log('bookingMeta', bookingMeta);
    const ticketIds = await runQuery(`SELECT post_id FROM wp_sya2cn_postmeta WHERE meta_key = 'ova_mb_event_booking_id' and meta_value = ${bookingId}`);
    // const tickets = [];
    const eventPost = await getPost(parseInt(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_id_event').meta_value || '0'));
    const eventMeta = await getFullPostMeta(parseInt(getMeta(bookingMeta, 'ova_mb_event_id_event') || '0'));
    console.log('eventMeta', eventMeta);
    // for (const ticketId of ticketIds) {
    const tickets = await Promise.all(ticketIds.map(async (ticketId: any) => {
        // const ticketPost = await getPost(ticketId.post_id);
        const ticketMeta = await getFullPostMeta(ticketId.post_id);
        console.log('ticketMeta', ticketMeta);
        const venueStr = ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_venue').meta_value;
        const venue = venueStr.substring(venueStr.indexOf('"') + 1, venueStr.lastIndexOf('"'));
        const ticket: Ticket = {
            bookingId,
            eventId: parseInt(getMeta(ticketMeta, 'ova_mb_event_event_id') || '0'),
            img: parseInt(getMeta(ticketMeta, 'ova_mb_event_img') || '0'),
            eventStart: parseInt(getMeta(ticketMeta, 'ova_mb_event_date_start') || '0'),
            eventEnd: parseInt(getMeta(ticketMeta, 'ova_mb_event_date_end') || '0'),
            eventName: getMeta(ticketMeta, 'ova_mb_event_name_event') || 'Desconocido',
            qrCode: getMeta(ticketMeta, 'ova_mb_event_qr_code') || null,
            customer: {
                name: getMeta(ticketMeta, 'ova_mb_event_name_customer') || 'Desconocido',
                phone: getMeta(ticketMeta, 'ova_mb_event_phone_customer') || 'Desconocido',
                email: getMeta(ticketMeta, 'ova_mb_event_email_customer') || 'Desconocido',
                address: getMeta(ticketMeta, 'ova_mb_event_address_customer') || 'Desconocido',
            },
            venue,
            address: getMeta(ticketMeta, 'ova_mb_event_address') || 'Desconocido',
            seat: getMeta(ticketMeta, 'ova_mb_event_seat') || null,
            ticketId: ticketId.post_id,
        };
        // tickets.push(ticket);
        return ticket;
    }));

    const event = {
        name: eventPost.post_title,
        date: parseInt(getMeta(eventMeta, 'ova_mb_event_start_date_str') || '0'),
        img: eventMeta.find((m: any) => m.meta_key === 'ova_mb_event_img_thumbnail')?.meta_value || '',
        url: eventPost.guid,
        description: eventPost.post_content,
        tickets,
    }
    return {
        bookingId,
        customer: {
            name: getMeta(bookingMeta, 'ova_mb_event_name') || 'Desconocido',
            phone: getMeta(bookingMeta, 'ova_mb_event_phone') || 'Desconocido',
            email: getMeta(bookingMeta, 'ova_mb_event_email') || null,
            address: getMeta(bookingMeta, 'ova_mb_event_address') || 'Desconocido',
        },
        event,
        tickets,
        price: {
            discount: 0,
            systemFee: parseFloat(getMeta(bookingMeta, 'ova_mb_event_system_fee') || '0'),
            tax: parseFloat(getMeta(bookingMeta, 'ova_mb_event_tax') || '0'),
            totalBeforeTax: parseFloat(getMeta(bookingMeta, 'ova_mb_event_total') || '0'),
            totalPrice: parseFloat(getMeta(bookingMeta, 'ova_mb_event_total_after_tax') || '0'),
        }
    } as Booking;
}