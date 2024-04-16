import sgMail, { type MailDataRequired } from "@sendgrid/mail";
import { BASIC_CREDENTIALS } from '$env/static/private'
import type { AttachmentJSON } from "@sendgrid/helpers/classes/attachment";
import { SENDGRID_API_KEY } from '$env/static/private'
import axios from 'axios';
import { error, type RequestEvent } from "@sveltejs/kit";
const credentials = JSON.parse(BASIC_CREDENTIALS || '[]');

// send email via sendgrid with template and attachment
export const sendEmail = async (from: string, to: string, subject: string, html?: string, templateId?: string, dynamic_template_data?: any, attachments?: AttachmentJSON[]) => {
    sgMail.setApiKey(SENDGRID_API_KEY || '');
    if (!templateId && !html) {
        throw new Error('No templateId or html provided');
    }

    const msg = {
        to,
        from,
        subject,
        ...(html && { html }),
        ...(templateId && { templateId }),
        ...(dynamic_template_data && { dynamic_template_data }),
        attachments,
    };
    console.log('msg', msg);
    return await sgMail.send(msg);
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
    const screenshotRequestURL = `https://api.urlbox.io/v1/TmDsstCwzocSSbwn/pdf?full_page=false&force=true&url=${encodeURIComponent(url)}`
    console.log('Requesting screenshot', screenshotRequestURL);
    const response = await fetch(screenshotRequestURL)
    if (!response.ok) {
        throw new Error('Error taking screenshot');
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return base64;
}


export const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,PATCH,GET,DELETE',
    'Access-Control-Allow-Headers':
        'authorization, x-client-info, apikey, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
};


export const authenticate = (request: RequestEvent) => {
    console.log('authenticating', request.url.href);
    const authorization = request.request.headers.get('Authorization');
    if (!authorization) {
        request.setHeaders({
            'WWW-Authenticate': 'Basic realm="FlashTicket"',
        })
        error(401, 'not logged in');
    }
    // get user pass from basic auth
    const [user, pass] = atob(authorization.split(' ')[1]).split(':');
    console.log('user', user);
    if (credentials.find((cred: any) => cred.username === user && cred.password === pass)) {
        return true;
    }
    request.setHeaders({
        'WWW-Authenticate': 'Basic realm="FlashTicket"',
    })
    error(401, 'not logged in');
    return false;
}