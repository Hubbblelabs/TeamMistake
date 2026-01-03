import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not found in environment variables. Email sending skipped.');
        return { success: false, error: 'RESEND_API_KEY missing' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'TeamMistake Support <onboarding@kavinweb.info>', // Default Resend test domain or verify your own
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend API Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error sending email:', error);
        return { success: false, error };
    }
};
