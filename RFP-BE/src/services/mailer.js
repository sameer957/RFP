import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter
  .verify()
  .then(() => console.log("Mailer connected"))
  .catch((err) => console.error("Mailer connection error:", err));

async function sendMail(options) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: options.to,
    subject: options.subject || "(no subject)",
    text: options.text || "",
    html: options.html || undefined,
  };

  return transporter.sendMail(mailOptions);
}

export default sendMail;
