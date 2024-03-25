import sgMail from "@sendgrid/mail";
import type { AttachmentJSON } from "@sendgrid/helpers/classes/attachment";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
// send email via sendgrid with template and attachment
export const sendEmail = async (from: string, to: string, subject: string, html: string, attachments?: AttachmentJSON[]) => {
    const msg = {
        to,
        from,
        subject,
        html,
        attachments,
    };
    await sgMail.send(msg);
}
