import type { Ticket } from "$lib/types";
import * as pk from "passkit-generator";
import moment from "moment";

const { PKPass } = pk.default;
import { WWDR, EVENT_CERT_KEY, EVENT_CERT, EVENT_CERT_KEY_PASSPHRASE, TEAM_IDENTIFIER } from '$env/static/private' 
const fetchBuffer = async (baseUrl: string, eventId: number, resource: string) => {
    const url = `${baseUrl}/passkit/${eventId}/${resource}`;
    console.log('fetchBuffer', url);
	const res = await fetch(url);
	const data = await res.arrayBuffer();
	return Buffer.from(data);
}

export const generatePass = async (baseUrl: string, ticket: Ticket) => {
    try {
        console.log('Generating pass...', { WWDR, EVENT_CERT_KEY, EVENT_CERT, EVENT_CERT_KEY_PASSPHRASE, TEAM_IDENTIFIER });
		
		const wwdr = WWDR;
		const signerCert = EVENT_CERT;
		const signerKey = EVENT_CERT_KEY;
		const signerKeyPassphrase = EVENT_CERT_KEY_PASSPHRASE;

        const eventDate = new Date(ticket.eventStart * 1000);

		
		console.log('Generating pass...');
		const pass = new PKPass(
			{
				"background.png": await fetchBuffer(baseUrl, ticket.eventId, 'background.png'),
				"background@2x.png": await fetchBuffer(baseUrl, ticket.eventId, 'background@2x.png'),
				"icon.png": await fetchBuffer(baseUrl, ticket.eventId, 'icon.png'),
				"icon@2x.png": await fetchBuffer(baseUrl, ticket.eventId, 'icon@2x.png'),
				"logo.png": await fetchBuffer(baseUrl, ticket.eventId, 'logo.png'),
				"logo@x2.png": await fetchBuffer(baseUrl, ticket.eventId, 'logo@2x.png'),
				"thumbnail.png": await fetchBuffer(baseUrl, ticket.eventId, 'thumbnail.png'),
				"thumbnail@2x.png": await fetchBuffer(baseUrl, ticket.eventId, 'thumbnail@2x.png'),
			},
			{
				signerCert,
				signerKey,
				signerKeyPassphrase,
				wwdr,
			},
			{
				"formatVersion" : 1,
				"passTypeIdentifier" : "pass.com.stacknvault.event",
				"serialNumber" : Math.random().toString(36).substring(7),
				"teamIdentifier" : TEAM_IDENTIFIER,
				// "webServiceURL" : "https://example.com/passes/",
				// "authenticationToken" : "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc",
				// "relevantDate" : "2011-12-08T13:00-08:00",
				// "locations" : [
				// 	{
				// 	"longitude" : -122.3748889,
				// 	"latitude" : 37.6189722
				// 	},
				// 	{
				// 	"longitude" : -122.03118,
				// 	"latitude" : 37.33182
				// 	}
				// ],
				"barcode" : {
					"format" : "PKBarcodeFormatQR",
					"messageEncoding" : "iso-8859-1"
				},
				"organizationName" : "Flash Ticket",
				"description" : ticket.eventName,
				"foregroundColor" : "rgb(255, 255, 255)",
				"backgroundColor" : "rgb(100, 65, 76)",
				
			}
,
		);
		console.log('Pass generated');
		
	
	
		// Adding some settings to be written inside pass.json
		// pass.localize("en", { ... });
		pass.type = "eventTicket";
		pass.primaryFields.push(
				{
				"key" : "event",
				"label" : "EVENT",
				"value" : ticket.eventName
				}
			);
		pass.secondaryFields.push(
				  {
					"key" : "loc",
					"label" : "LOCATION",
					"value" : ticket.address
				  }
		);
		pass.auxiliaryFields.push(
				  {
					"key" : "date",
					"label" : "DATE",
					"value" : moment(eventDate).format('DD/MM/YYYY')
				  }
		);
		pass.auxiliaryFields.push(
			{
			  "key" : "time",
			  "label" : "TIME",
			  "value" : moment(eventDate).format('hh:mm A')
			}
  );
			  
		// pass.transitType = "PKTransitTypeAir";
		pass.setBarcodes(ticket.qrCode); // Random value
		pass.setRelevantDate(eventDate);
		
	
		// Generate the stream .pkpass file stream
		const buffer = pass.getAsBuffer();
		return buffer;
	} catch (err) {
		console.error(err);
		return new Response(err.message, { status: 500 });
	}
}