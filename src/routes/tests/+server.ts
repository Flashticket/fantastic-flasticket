import * as pk from "passkit-generator";
import fs from "fs";

export const GET = async (request) => {
    try {
		/** Each, but last, can be either a string or a Buffer. See API Documentation for more */
		const wwdr = fs.readFileSync('./passkit/certs/AppleWWDRCAG4.pem', 'utf8');
		const signerCert = fs.readFileSync('./passkit/certs/pass.pem', 'utf8');
		const signerKey = fs.readFileSync('./passkit/certs/eventCert.key', 'utf8');
		const signerKeyPassphrase = 'HAGvhjgsvde!';
		console.log('pk', pk);
		const pass = await pk.default.PKPass.from({
			/**
			 * Note: .pass extension is enforced when reading a
			 * model from FS, even if not specified here below
			 */
			model: "./passkit/Event.pass",
			certificates: {
				wwdr,
				signerCert,
				signerKey,
				signerKeyPassphrase
			},
		}, {
			// keys to be added or overridden
			serialNumber: "kduwkydecuysdbc"
		});
	
		// Adding some settings to be written inside pass.json
		// pass.localize("en", { ... });
		pass.setBarcodes("36478105430"); // Random value
	
		// Generate the stream .pkpass file stream
		const buffer = pass.getAsBuffer();
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