// // import nodemailer from 'nodemailer';

// export const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendVerificationEmail = async (to: string, token: string) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject: 'Verifikasi Token Voting',
//     text: `Gunakan token berikut untuk verifikasi: ${token}`,
//   });
// };