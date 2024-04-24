import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql';

import { DB_HOST, DB_USER, DB_PASSWORD,  DB_NAME } from '$env/static/private'
import type { Booking, PriceType, SeatType, Ticket, TicketMapType } from '$lib/types';

// typescript mysql client to run raw queries
export const runQuery = async (query: string) => {
    console.log('running query:', query)
    const connData = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
    };
    console.log('connData:', connData);
    const connection = mysql.createConnection(connData);
    // run the query and get the results
    let results = await new Promise((resolve, reject) => {
        connection.query({
            sql: query,
            timeout: 40000,
            values: []
        }, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve(results as any);
        });
    });
    // close the connection
    connection.end();
    console.log(results);
    return results as any;
};

export const getPost = async (postId: number) => {
    const post = await runQuery(`SELECT * FROM wp_sya2cn_posts WHERE ID = ${postId}`);
    return post[0];
}

export const getPostMeta = async (postId: number, metaKey: string) => {
    const meta = await runQuery(`SELECT * FROM wp_sya2cn_postmeta WHERE post_id = ${postId} AND meta_key = '${metaKey}'`);
    return meta.length > 0 ? meta[0] : null;
}
export const getFullPostMeta = async (postId: number) => {
    return await runQuery(`SELECT * FROM wp_sya2cn_postmeta WHERE post_id = ${postId}`);
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
export const bookSeats = async (eventId: number, idCal: string, seats: SeatType[], price: PriceType) => {
    console.log('seats:', seats);
    // const seatBook = 'a:3:{i:0;s:23:"VERDE-SECC-GEN-DER-ASTO";i:1;s:30:"PLATINUM_ROJO-SECC-B1-ASTO-X44";i:2;s:30:"ORO_AMARILLO-SECC-C1-ASTO-FF45";}';
    const seatBook = getSeatBook(seats);
    console.log('seatBook:', seatBook);
    // const seatQuantity = 'a:3:{s:23:"VERDE-SECC-GEN-DER-ASTO";i:4;s:30:"PLATINUM_ROJO-SECC-B1-ASTO-X44";i:1;s:30:"ORO_AMARILLO-SECC-C1-ASTO-FF45";i:1;}';
    const seatQuantity = `a:${seats.length}:{${seats.map((s, i) => `s:${s.seat.length}:"${s.seat}";i:${s.amount}`).join(';')};}`;
    // const listIdTicket = ["VERDE-SECC-GEN-DER-ASTO","PLATINUM_ROJO-SECC-B1-ASTO-X44","ORO_AMARILLO-SECC-C1-ASTO-FF45"];
    const listIdTicket = `a:${seats.length}:{${seats.map((s, i) => `i:${i};s:${s.seat.length}:"${s.seat}"`).join(';')};}`;
    console.log('seatBook:', seatBook);
    console.log('seatQuantity:', seatQuantity);
    console.log('listIdTicket:', listIdTicket);
    console.log('eventId:', eventId);
    // return;
    const event = await getPost(eventId);
    const eventStart = await getPostMeta(eventId, 'ova_mb_event_start_date_str');
    const eventEnd = await getPostMeta(eventId, 'ova_mb_event_end_date_str');
    const img = 15067 // where to get this from?
    const customer = {
        name: 'Taquilla',
        phone: '123',
        email: 'andoni.arostegui@stacknvault.com',
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
        
        
        // (${bookingId}, 'ova_mb_event_orderid', '16489'),
        // (${bookingId}, 'ova_mb_event_profit_status', ''),
        // (${bookingId}, 'ova_mb_event_id_customer', '10'),
        // (${bookingId}, 'ova_mb_event_tax', '100'),
        // (${bookingId}, 'ova_mb_event_profit', '2000'),
        // (${bookingId}, 'ova_mb_event_commission', '110'),
        // (${bookingId}, 'ova_mb_event_total_after_tax', '2210'),
        // (${bookingId}, 'ova_mb_event_total', '2110'),
        // (${bookingId}, 'ova_mb_event_address', '23423'),
        // (${bookingId}, 'ova_mb_event_email', 'martinuribe73@gmail.com'),
        // (${bookingId}, 'ova_mb_event_phone', '5574783438'),
        // (${bookingId}, 'ova_mb_event_last_name', 's'),
        // (${bookingId}, 'ova_mb_event_first_name', 'Andoni'),
        // (${bookingId}, 'ova_mb_event_name', 'Andoni s'),
        // (${bookingId}, 'ova_mb_event_date_cal_tmp', '1717027200'),
        // (${bookingId}, 'ova_mb_event_date_cal', '30 mayo, 2024'),
        // (${bookingId}, 'ova_mb_event_id_cal', '1708643128')
    const results = await runQuery(bookingMetaQueries);
    const tickets = [];
    const eventMeta = await getFullPostMeta(eventId);
    const eventAddress = eventMeta.find((m: any) => m.meta_key === 'ova_mb_event_address').meta_value;
    for (const seat of seats) {
        for (let i = 0; i < seat.amount; i++) {
            const postQuery = `INSERT INTO wp_sya2cn_posts
            (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
            VALUES(1, CURRENT_TIMESTAMP(), UTC_TIMESTAMP(), '', 'Mapa', '', 'publish', 'closed', 'closed', '', '${postPassword}', '', '', CURRENT_TIMESTAMP(), UTC_TIMESTAMP(), '', 0, 'https://boletera.dev-mt.com/el_tickets/${postPassword}/', 0, 'el_tickets', '', 0);
            `;
            const postResult = await runQuery(postQuery);
            const ticketId = postResult.insertId;
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
            tickets.push(ticket);
            await createTicket(ticket);
            console.log(`ticket created for seat ${seat}`);
        }
    }

    // 'a:6:{i:0;i:16502;i:1;i:16504;i:2;i:16506;i:3;i:16508;i:4;i:16510;i:5;i:16512;}';
    const ticketIdsStr = tickets.map((r: Ticket, index) => `i: ${index};i:${r.ticketId}`).join(';');
    const ticketListQuery = `INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_record_ticket_ids', 'a:${tickets.length}:{${ticketIdsStr};}')`;
    await runQuery(ticketListQuery);

    await runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_name', '${customer.name}')`);
    await runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_phone', '${customer.phone}')`);
    await runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_email', '${customer.email}')`);
    await runQuery(`INSERT INTO wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${bookingId}, 'ova_mb_event_address', '${customer.address}')`);

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
const getMeta = (meta: any[], key: string) => {
    const metaObj = meta.find((m: any) => m.meta_key === key);
    console.log('metaObj', metaObj);
    return metaObj ? metaObj.meta_value : null;
}
export const getBooking = async (bookingId: number) => {
    // const booking = await getPost(bookingId);
    const bookingMeta = await getFullPostMeta(bookingId);
    const ticketIds = await runQuery(`SELECT post_id FROM wp_sya2cn_postmeta WHERE meta_key = 'ova_mb_event_booking_id' and meta_value = ${bookingId}`);
    const tickets = [];
    const eventPost = await getPost(parseInt(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_id_event').meta_value));
    const eventMeta = await getFullPostMeta(parseInt(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_id_event').meta_value));
    for (const ticketId of ticketIds) {
        // const ticketPost = await getPost(ticketId.post_id);
        const ticketMeta = await getFullPostMeta(ticketId.post_id);
        const venueStr = ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_venue').meta_value;
        const venue = venueStr.substring(venueStr.indexOf('"') + 1, venueStr.lastIndexOf('"'));
        const ticket: Ticket = {
            bookingId,
            eventId: parseInt(ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_event_id').meta_value),
            img: parseInt(ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_img').meta_value),
            eventStart: parseInt(ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_date_start').meta_value),
            eventEnd: parseInt(ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_date_end').meta_value),
            eventName: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_name_event').meta_value,
            qrCode: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_qr_code').meta_value,
            customer: {
                name: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_name_customer').meta_value,
                phone: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_phone_customer').meta_value,
                email: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_email_customer').meta_value,
                address: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_address_customer').meta_value,
            },
            venue,
            address: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_address').meta_value,
            seat: ticketMeta.find((m: any) => m.meta_key === 'ova_mb_event_seat').meta_value,
            ticketId: ticketId.post_id,
        };
        tickets.push(ticket);
    }

    const event = {
        name: eventPost.post_title,
        date: parseInt(eventMeta.find((m: any) => m.meta_key === 'ova_mb_event_start_date_str')?.meta_value || '0'),
        img: eventMeta.find((m: any) => m.meta_key === 'ova_mb_event_img_thumbnail')?.meta_value || '',
        url: eventPost.guid,
        description: eventPost.post_content,
        tickets,
    }
    return {
        bookingId,
        customer: {
            name: bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_name')?.meta_value,
            phone: bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_phone')?.meta_value,
            email: bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_email')?.meta_value,
            address: bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_address')?.meta_value,
        },
        event,
        tickets,
        price: {
            discount: 0,
            tax: parseFloat(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_tax')?.meta_value || '0'),
            systemFee: parseFloat(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_system_fee')?.meta_value || '0'),
            totalBeforeTax: parseFloat(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_total')?.meta_value || '0'),
            totalPrice: parseFloat(bookingMeta.find((m: any) => m.meta_key === 'ova_mb_event_total_after_tax')?.meta_value || '0'),
        }
    } as Booking;
}