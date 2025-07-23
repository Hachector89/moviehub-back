import axios from 'axios';

export async function verifyRecaptchaToken(token: string): Promise<void> {

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    if (!token) {
        throw new Error('reCAPTCHA token is required');
    }

    try {
        const response = await axios.post(
            verifyUrl,
            new URLSearchParams({
                secret: secret!,
                response: token,
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const { success, score, 'error-codes': errorCodes } = response.data;

        if (!success) {
            console.error('reCAPTCHA failed:', errorCodes);
            throw new Error('Failed reCAPTCHA verification');
        }


    } catch (err: any) {
        throw new Error(`reCAPTCHA verification error: ${err.message}`);
    }

}