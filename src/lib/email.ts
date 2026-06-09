import nodemailer from "nodemailer";

export interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function getTransporter() {
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!user || !pass) {
		throw new Error("SMTP_USER y SMTP_PASS deben estar configurados en .env.local");
	}

	return nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // STARTTLS
		auth: { user, pass },
	});
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
	const { name, email, message } = data;
	const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
	const user = process.env.SMTP_USER!;

	const transporter = getTransporter();

	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeMessage = escapeHtml(message);

	await transporter.sendMail({
		from: `"Portfolio Contacto" <${user}>`,
		replyTo: email,
		to,
		subject: `[Portfolio] Mensaje de ${safeName}`,
		text: [
			"Nuevo mensaje desde el portfolio",
			"",
			`Nombre: ${name}`,
			`Email: ${email}`,
			"",
			"Mensaje:",
			message,
		].join("\n"),
		html: `
      <h2 style="margin-bottom:16px;">📬 Nuevo mensaje desde el portfolio</h2>
      <table style="font-family:sans-serif;font-size:14px;line-height:1.6;">
        <tr><td style="font-weight:700;padding-right:12px;">Nombre</td><td>${safeName}</td></tr>
        <tr><td style="font-weight:700;padding-right:12px;">Email</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      </table>
      <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;" />
      <p style="font-family:sans-serif;font-size:14px;line-height:1.6;">${safeMessage.replace(/\n/g, "<br>")}</p>
    `.trim(),
	});
}
