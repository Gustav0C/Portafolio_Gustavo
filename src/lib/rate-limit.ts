/**
 * Simple in-memory rate limiter.
 *
 * ⚠️ Best-effort para portfolios y sitios de baja carga.
 * En Vercel serverless cada instancia tiene su propia memoria,
 * pero combinado con honeypot + timing check + CSP es más que
 * suficiente para este caso de uso.
 *
 * Para alta carga en producción: reemplazar con Upstash o Vercel KV.
 */

interface RateEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateEntry>();

const DEFAULT_MAX_REQUESTS = 3;
const DEFAULT_WINDOW_MS = 60_000; // 1 minuto

export function checkRateLimit(
	key: string,
	maxRequests: number = DEFAULT_MAX_REQUESTS,
	windowMs: number = DEFAULT_WINDOW_MS,
): boolean {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now > entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}

	if (entry.count >= maxRequests) {
		return false;
	}

	entry.count++;
	return true;
}
