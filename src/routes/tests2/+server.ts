import * as pk from "passkit-generator";
// import fs from "fs";
import { getBooking } from "$lib/server/api.js";
import { generatePass } from "$lib/server/passkit/index.js";
const { PKPass } = pk.default;

// const fetchBuffer = async (resource: string) => {
// 	const res = await fetch(`http://localhost:5173/passkit/123456/${resource}`);
// 	const data = await res.arrayBuffer();
// 	return Buffer.from(data);
// }
export const GET = async (request) => {
    try {

		
// 		const wwdr = fs.readFileSync('./passkit/certs/AppleWWDRCAG4.pem', 'utf8');
// 		const signerCert = fs.readFileSync('./passkit/certs/pass.pem', 'utf8');
// 		const signerKey = fs.readFileSync('./passkit/certs/eventCert.key', 'utf8');
// 		const signerKeyPassphrase = 'HAGvhjgsvde!';
// 		console.log(PKPass);
		
// 		console.log('Generating pass...');
// 		const pass = new PKPass(
// 			{
// 				"background.png": await fetchBuffer('background.png'),
// 				"background@2x.png": await fetchBuffer('background@2x.png'),
// 				"icon.png": await fetchBuffer('icon.png'),
// 				"icon@2x.png": await fetchBuffer('icon@2x.png'),
// 				"logo.png": await fetchBuffer('logo.png'),
// 				"logo@x2.png": await fetchBuffer('logo@2x.png'),
// 				"thumbnail.png": await fetchBuffer('thumbnail.png'),
// 				"thumbnail@2x.png": await fetchBuffer('thumbnail@2x.png'),
// 			},
// 			{
// 				signerCert,
// 				signerKey,
// 				signerKeyPassphrase,
// 				wwdr,
// 			},
// 			{
// 				"formatVersion" : 1,
// 				"passTypeIdentifier" : "pass.com.stacknvault.event",
// 				"serialNumber" : Math.random().toString(36).substring(7),
// 				"teamIdentifier" : "4753DC7Q64",
// 				// "webServiceURL" : "https://example.com/passes/",
// 				// "authenticationToken" : "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc",
// 				// "relevantDate" : "2011-12-08T13:00-08:00",
// 				// "locations" : [
// 				// 	{
// 				// 	"longitude" : -122.3748889,
// 				// 	"latitude" : 37.6189722
// 				// 	},
// 				// 	{
// 				// 	"longitude" : -122.03118,
// 				// 	"latitude" : 37.33182
// 				// 	}
// 				// ],
// 				"barcode" : {
// 					// "message" : "123456789",
// 					"format" : "PKBarcodeFormatQR",
// 					"messageEncoding" : "iso-8859-1"
// 				},
// 				"organizationName" : "Flash Ticket",
// 				"description" : "S&V Event Ticket",
// 				"foregroundColor" : "rgb(255, 255, 255)",
// 				"backgroundColor" : "rgb(100, 65, 76)",
				
// 			}
// ,
// 		);
// 		console.log('Pass generated');
		
	
	
// 		// Adding some settings to be written inside pass.json
// 		// pass.localize("en", { ... });
// 		pass.type = "eventTicket";
// 		pass.primaryFields.push(
// 				{
// 				"key" : "event",
// 				"label" : "EVENT",
// 				"value" : "The Beat Goes On"
// 				}
// 			);
// 		pass.secondaryFields.push(
// 				  {
// 					"key" : "loc",
// 					"label" : "LOCATION",
// 					"value" : "Moscone West"
// 				  }
// 		);
// 		pass.auxiliaryFields.push(
// 				  {
// 					"key" : "date",
// 					"label" : "DATE",
// 					"value" : "27/03/2024"
// 				  }
// 		);
// 		pass.auxiliaryFields.push(
// 			{
// 			  "key" : "time",
// 			  "label" : "TIME",
// 			  "value" : "9:00 AM"
// 			}
//   );
			  
// 		// pass.transitType = "PKTransitTypeAir";
// 		pass.setBarcodes("5623652"); // Random value
// 		pass.setRelevantDate(new Date());
		
	
// 		// Generate the stream .pkpass file stream
// 		const buffer = pass.getAsBuffer();
// 		return new Response(buffer, {
// 			headers: {
// 				"Content-Type": "application/vnd.apple.pkpass",
// 				"Content-Disposition": "attachment; filename=Event.pkpass"
// 			}
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		return new Response(err.message, { status: 500 });
// 	}

const booking = await getBooking(17294);
if (!booking.tickets || !booking.tickets.length) {
	throw new Error('No tickets found');
}
const ticket = booking.tickets[1];
const baseUrl = new URL(request.url).origin;
const buffer = await generatePass(baseUrl, ticket);
return new Response(buffer, {
				headers: {
					"Content-Type": "application/vnd.apple.pkpass",
					"Content-Disposition": "attachment; filename=Event.pkpass"
				}
			});

	} catch (err) {
		console.error(err);
		return new Response(err.message, { status: 500 });
	}


    
}