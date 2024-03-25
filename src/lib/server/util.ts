import sgMail from "@sendgrid/mail";
import type { AttachmentJSON } from "@sendgrid/helpers/classes/attachment";
import { SENDGRID_API_KEY, APY_TOKEN } from '$env/static/private'
import axios from 'axios';
// send email via sendgrid with template and attachment
export const sendEmail = async (from: string, to: string, subject: string, html: string, attachments?: AttachmentJSON[]) => {
    sgMail.setApiKey(SENDGRID_API_KEY || '');
    const msg = {
        to,
        from,
        subject,
        html,
        attachments,
    };
    await sgMail.send(msg);
}
// export const takeScreenshot = async (url: string, fileName: string) => {
//     var options = {
//       method: 'POST',
//       url: 'https://api.apyhub.com/generate/webpage/pdf-file',
//       params: {output: 'test-sample.pdf', landscape: 'false', margin: '0'},
//       headers: {
//         'apy-token': APY_TOKEN || '',
//         'Content-Type': 'application/json'
//       },
//       data: {url: 'https://apyhub.com'}
//     };
    
//     const response = await axios.request(options);
//     if (response.status !== 200) {
//         throw new Error('Error taking screenshot');
//     }
    
//     const str = Buffer.from(response.data, 'binary').toString('base64');

//     return str;
// }
export const takeScreenshot = async (url: string) => {
    const screenshotRequestURL = `https://api.urlbox.io/v1/TmDsstCwzocSSbwn/pdf?full_page=false&url=${encodeURIComponent(url)}`
    console.log('Requesting screenshot', screenshotRequestURL);
    const response = await fetch(screenshotRequestURL)
    if (!response.ok) {
        throw new Error('Error taking screenshot');
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return base64;
}


// https://boletera.vercel.app/pages/booking/16798