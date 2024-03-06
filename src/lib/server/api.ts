import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql';
import * as phpUnserialize from 'php-unserialize';
import * as phpSerialize from 'php-serialize';
import { DB_HOST, DB_USER, DB_PASSWORD,  DB_NAME, VERCEL_ENV } from '$env/static/private'
import { eventData } from './constants';
export interface Ticket {
    eventId: number;
    bookingId: number;
    img: number,
    eventStart: number;
    eventEnd: number;
    eventName: string;
    qrCode: string;
    customer: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
    venue: string;
    seat: string;
    ticketId: number;
}
// typescript mysql client to run raw queries
export const runQuery = async (query: string) => {
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
            resolve(results);
        });
    });
    // close the connection
    connection.end();
    console.log(results);
    return results;
};
export const createTicket = async (ticket: Ticket) => {
    
    const insertQueries = [
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_event_id', ${ticket.eventId})`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_booking_id', ${ticket.bookingId})`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_name_event', '${ticket.eventName}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_qr_code', '${ticket.qrCode}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_name_customer', '${ticket.customer.name}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_phone_customer', '${ticket.customer.phone}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_email_customer', '${ticket.customer.email}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_address_customer', '${ticket.customer.address}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_venue', 'a:1:{i:0;s:${ticket.venue.length}:"${ticket.venue}";}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_address', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_data_checkout_field', '[]')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_seat', '${ticket.seat}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_date_start', '${ticket.eventStart}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_date_end', '${ticket.eventEnd}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_img', '${ticket.img}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_color_ticket', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_color_label_ticket', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_color_content_ticket', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_desc_ticket', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_private_desc_ticket', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_ticket_status', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_checkin_time', '')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_ticket_id_event', '${ticket.seat}')`,
        `INSERT INTO boletera_dev_mt_com.wp_sya2cn_postmeta (post_id, meta_key, meta_value) VALUES(${ticket.ticketId}, 'ova_mb_event_ticket_id', '${ticket.ticketId}')`,
    ];
    const results = await Promise.all(insertQueries.map(runQuery));
    return results;
}
export const createPurchase = async (seats: string[]) => {
    // 98976	16388	ova_mb_event_list_seat_book	a:2:{i:0;s:26:"AZUL-VIP-SECC-C3-ASTO-AA23";i:1;s:25:"DIAMANTE-SECC-A3-ASTO-K21";}

    /**
     * Get post of type el_bookings (for prod 18501)
     * Get event start from ova_mb_event_date_start (for prod 1710016200)
     * Get event end from ova_mb_event_date_end (for prod 1710027900)
     * Get event name from ova_mb_event_name_event (for prod Kurt en Concierto)
     * Get img id from ova_mb_event_img (for prod 16367)
     * From its meta get the seat list from ova_mb_event_list_seat_book. Get the meta_id (for prod 127892)
     * From its meta get the event id from ova_mb_event_event_id (for prod 15090)
     * Get the booking id from ova_mb_event_booking_id (for prod 18501)
     * Venue for prod is Teatro Metropolitano
     */
    const environment = VERCEL_ENV || 'local';
    const config = (eventData as any)[environment];
    const { seatListMetaId } = config;
    const seatListMeta = (await runQuery(`SELECT meta_value FROM boletera_dev_mt_com.wp_sya2cn_postmeta WHERE meta_id = ${seatListMetaId}`)) as any;
    const metaValue = seatListMeta[0].meta_value;
    console.log('seatListMeta:', metaValue);
    const seatList = phpUnserialize.unserialize(metaValue);
    console.log('parsedData:', seatList);
    let n = Object.keys(seatList).length;
    const tickets = [];
    for (const seat of seats) {
        seatList[n] = seat;
        n++;
        const postQuery = `INSERT INTO boletera_dev_mt_com.wp_sya2cn_posts
        (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
        VALUES(1, CURRENT_TIMESTAMP(), UTC_TIMESTAMP(), '', 'Mapa', '', 'publish', 'closed', 'closed', '', 'mapa-270', '', '', CURRENT_TIMESTAMP(), UTC_TIMESTAMP(), '', 0, 'https://boletera.dev-mt.com/el_tickets/mapa-270/', 0, 'el_tickets', '', 0);
        `;
        const postResult = (await runQuery(postQuery)) as any;
        const ticketId = postResult.insertId;
        if (!ticketId) throw new Error('No ticketId');
        const ticket = { ...config.ticket, qrCode: uuidv4().replace(/-/g, ''), seat, ticketId };
        tickets.push(ticket);
        await createTicket(ticket);
        console.log(`ticket created for seat ${seat}`);
    }
    console.log(seatList);
    const serialized = phpSerialize.serialize(seatList);
    console.log('serialized:', serialized);
    await runQuery(`UPDATE boletera_dev_mt_com.wp_sya2cn_postmeta set meta_value = '${serialized}' WHERE meta_id = ${seatListMetaId}`);
    return tickets;
   
}

