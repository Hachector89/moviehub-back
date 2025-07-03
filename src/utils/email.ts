const nodemailer = require("nodemailer");

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS_APP
    }
  });

  const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `"MovieHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your MovieHub account',
    html: `<p>Thanks for registering! Click the link below to verify your email:</p>
           <a href="${link}">Verify Account</a>`
  });
}