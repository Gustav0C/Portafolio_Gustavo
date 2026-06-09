import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const MIN_SUBMIT_TIME_MS = 3_000; // 3 segundos
const MAX_MESSAGE_LENGTH = 5_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as {
			name?: string;
			email?: string;
			message?: string;
			website?: string;
			loadTimestamp?: number;
		};

		// ── 1. Honeypot ───────────────────────────────────────────
		// Si el campo oculto tiene contenido, es un bot.
		// Respondemos 200 para que el bot crea que funcionó.
		if (body.website && body.website.trim().length > 0) {
			return NextResponse.json({ success: true, honeypot: true });
		}

		// ── 2. Timing check ──────────────────────────────────────
		// Los bots suelen enviar el formulario inmediatamente.
		if (body.loadTimestamp) {
			const elapsed = Date.now() - body.loadTimestamp;
			if (elapsed < MIN_SUBMIT_TIME_MS) {
				return NextResponse.json(
					{ error: "El formulario se envió demasiado rápido. Espera unos segundos." },
					{ status: 429 },
				);
			}
		}

		// ── 3. Rate limit por IP ─────────────────────────────────
		const ip =
			request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			request.headers.get("x-real-ip") ||
			"unknown";

		if (!checkRateLimit(`contact:${ip}`)) {
			return NextResponse.json(
				{ error: "Demasiados intentos. Intenta de nuevo en un minuto." },
				{ status: 429 },
			);
		}

		// ── 4. Validación de campos ──────────────────────────────
		const name = body.name?.trim();
		const email = body.email?.trim();
		const message = body.message?.trim();

		const errors: string[] = [];

		if (!name) {
			errors.push("El nombre es requerido");
		} else if (name.length < 2) {
			errors.push("El nombre debe tener al menos 2 caracteres");
		} else if (name.length > MAX_NAME_LENGTH) {
			errors.push("El nombre es demasiado largo");
		}

		if (!email) {
			errors.push("El email es requerido");
		} else if (!emailRegex.test(email)) {
			errors.push("Email inválido");
		} else if (email.length > MAX_EMAIL_LENGTH) {
			errors.push("El email es demasiado largo");
		}

		if (!message) {
			errors.push("El mensaje es requerido");
		} else if (message.length < 10) {
			errors.push("El mensaje debe tener al menos 10 caracteres");
		} else if (message.length > MAX_MESSAGE_LENGTH) {
			errors.push("El mensaje es demasiado largo (máximo 5000 caracteres)");
		}

		if (errors.length > 0) {
			return NextResponse.json({ error: errors.join(". ") }, { status: 400 });
		}

		// ── 5. Enviar email ──────────────────────────────────────
		// Seguro: los campos ya fueron validados arriba
		await sendContactEmail({ name: name!, email: email!, message: message! });

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error en /api/contact:", error);
		return NextResponse.json(
			{ error: "Error al enviar el mensaje. Intenta de nuevo." },
			{ status: 500 },
		);
	}
}
