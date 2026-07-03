const nodemailer = require('nodemailer');

const RECIPIENT_EMAIL = 'contact@noirsys.com';

function normalizeBody(body) {
    if (!body) {
        return {};
    }

    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch (error) {
            return Object.fromEntries(new URLSearchParams(body));
        }
    }

    return body;
}

function toBoolean(value) {
    return value === true || value === 'true' || value === 'on' || value === '1';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        return res.status(500).json({ error: 'Email service is not configured' });
    }

    const body = normalizeBody(req.body);
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const organization = String(body.organization || '').trim();
    const challenge = String(body.challenge || '').trim();
    const roleFunder = toBoolean(body.role_funder);
    const roleBeneficiary = toBoolean(body.role_beneficiary);

    if (!name || !email || !organization || !challenge) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });

    const message = [
        'New Ashtabula Initiative - Assessment Request',
        '',
        `Contact Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization}`,
        `Can fund modernization: ${roleFunder ? 'Yes' : 'No'}`,
        `Needs subsidized support: ${roleBeneficiary ? 'Yes' : 'No'}`,
        '',
        'Primary Challenge:',
        challenge
    ].join('\n');

    try {
        await transporter.sendMail({
            from: SMTP_FROM || SMTP_USER,
            to: RECIPIENT_EMAIL,
            replyTo: email,
            subject: `NAI Assessment Request: ${organization}`,
            text: message
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Failed to send assessment request email', error);
        return res.status(500).json({ error: 'Unable to send request right now' });
    }
};
