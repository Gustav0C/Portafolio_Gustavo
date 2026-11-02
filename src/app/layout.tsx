import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import ThemeToggle from "@/components/ThemeToggle";
import PageTransition from "@/components/PageTransition";
import NavLinks from "@/components/NavLinks";
import MobileNav from "@/components/MobileNav";
import berkeleyMono from "./fonts";

export const metadata: Metadata = {
	metadataBase: new URL("https://gcanales.is-a.dev"),
	title:
		"Gustavo Canales | Desarrollador Full Stack | React, Next.js, TypeScript",
	description:
		"Portafolio profesional de Gustavo Canales - Desarrollador Full Stack con experiencia en React, Next.js, TypeScript, Python y herramientas de IA. Especializado en arquitectura web moderna.",
	keywords: [
		"desarrollador",
		"full stack",
		"React",
		"Next.js",
		"TypeScript",
		"JavaScript",
		"portfolio",
		"web developer",
		"developer Peru",
		"developer Perú",
		"freelance developer",
		"Python",
		"Node.js",
	],
	authors: [{ name: "Gustavo Canales" }],
	creator: "Gustavo Canales",
	publisher: "Gustavo Canales",
	openGraph: {
		title: "Gustavo Canales | Desarrollador Full Stack",
		description:
			"Portafolio profesional - Desarrollador Full Stack especializado en React, Next.js, TypeScript y herramientas de IA",
		type: "website",
		locale: "es_PE",
		url: "https://gcanales.is-a.dev",
		siteName: "Gustavo Canales",
		images: [
			{
				url: "https://gcanales.is-a.dev/og-image.png",
				width: 1200,
				height: 630,
				alt: "Gustavo Canales - Portafolio de Desarrollador Full Stack",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Gustavo Canales | Desarrollador Full Stack",
		description: "Portafolio profesional - React, Next.js, TypeScript y IA",
		creator: "@Gustav0C",
		images: ["https://gcanales.is-a.dev/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
	},
	verification: {
		google: "add-your-google-verification-code",
	},
	alternates: {
		canonical: "https://gcanales.is-a.dev",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning data-scroll-behavior="smooth" className={berkeleyMono.variable}>
			<head>
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
			</head>
			<body>
				{/* Scroll Restoration */}
				<Script
					id="scroll-restoration"
					dangerouslySetInnerHTML={{
						__html: `if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.onbeforeunload = function () { window.scrollTo(0, 0); };`,
					}}
					strategy="beforeInteractive"
				/>

				{/* Organization Schema - JSON-LD */}
				<Script
					id="organization-schema"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "schema.org",
							"@type": "Organization",
							name: "Gustavo Canales",
							url: "https://gcanales.is-a.dev",
							logo: "https://gcanales.is-a.dev/og-image.png",
							description:
								"Portafolio profesional de Gustavo Canales - Desarrollador Full Stack",
							sameAs: [
								"https://github.com/Gustav0C",
								"https://www.linkedin.com/in/gscp/",
							],
							contactPoint: {
								"@type": "ContactPoint",
								email: "gcanales58@gmail.com",
								contactType: "Customer Support",
							},
							founder: {
								"@type": "Person",
								name: "Gustavo Canales",
							},
						}),
					}}
					strategy="afterInteractive"
				/>

				{/* Person Schema - JSON-LD */}
				<Script
					id="person-schema"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "schema.org",
							"@type": "Person",
							name: "Gustavo Canales",
							url: "https://gcanales.is-a.dev",
							image: "https://gcanales.is-a.dev/og-image.png",
							jobTitle: "Full Stack Developer",
							email: "gcanales58@gmail.com",
							sameAs: [
								"https://github.com/Gustav0C",
								"https://www.linkedin.com/in/gscp/",
							],
							knowsAbout: [
								"React",
								"Next.js",
								"TypeScript",
								"Python",
								"Node.js",
								"SQL",
								"Docker",
								"Git",
							],
						}),
					}}
					strategy="afterInteractive"
				/>

				{/* Breadcrumb Schema - JSON-LD */}
				<Script
					id="breadcrumb-schema"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "schema.org",
							"@type": "BreadcrumbList",
							itemListElement: [
								{
									"@type": "ListItem",
									position: 1,
									name: "Home",
									item: "https://gcanales.is-a.dev/",
								},
							],
						}),
					}}
					strategy="afterInteractive"
				/>
				{/* Skip to content link - WCAG 2.4.1 */}
				<a
					href="#main-content"
					className={styles.skipLink}
				>
					Saltar al contenido principal
				</a>
				<div className={styles.wrapper}>
					{/* Navigation */}
					<nav className={styles.navbar} aria-label="Navegación principal">
						<div className={styles.navbarInner}>
							<Link href="/" className={styles.brand} aria-label="Gustavo Canales - Home">
								<span className={styles.brandPrompt} aria-hidden="true">
									~
								</span>
								<span className={styles.brandSlash} aria-hidden="true">
									/
								</span>
								<span className={styles.brandName}>gscp</span>
								<span className={styles.brandBadge} aria-hidden="true">
									<span className={styles.brandDot} />
									<span className={styles.brandStatus}>online</span>
								</span>
							</Link>
							<div className={styles.navRight}>
								<NavLinks />
								<div className={styles.navControls}>
									<ThemeToggle />
									<MobileNav />
								</div>
							</div>
						</div>
					</nav>

					{/* Main Content */}
					<main id="main-content" className={styles.main}>
						<PageTransition>{children}</PageTransition>
					</main>

					{/* Footer */}
					<footer className={styles.footer}>
						<div className={styles.footerInner}>
							<div className={styles.footerGrid}>
								{/* Col 1: Identity */}
								<div className={styles.footerBrandCol}>
									<Link href="/" className={styles.footerBrand} aria-label="Gustavo Canales - Home">
										<span className={styles.brandPrompt} aria-hidden="true">~</span>
										<span className={styles.brandSlash} aria-hidden="true">/</span>
										<span className={styles.brandName}>gscp</span>
									</Link>
									<p className={styles.footerRole}>
										Gustavo Canales · Full Stack Engineer &amp; AI Integrator
									</p>
									<div className={styles.footerStatus}>
										<span className={styles.statusDot} aria-hidden="true" />
										<span>ONLINE · ICA, PE (GMT-5)</span>
									</div>
								</div>

								{/* Col 2: Navigation */}
								<nav className={styles.footerNavCol} aria-label="Navegación pie de página">
									<span className={styles.footerColHeading}>{"// NAVEGACIÓN"}</span>
									<ul className={styles.footerColList}>
										<li>
											<Link href="/" className={styles.footerNavLink}>
												<span className={styles.footerLinkPrefix}>{"01 //"}</span> Inicio
											</Link>
										</li>
										<li>
											<Link href="/proyectos" className={styles.footerNavLink}>
												<span className={styles.footerLinkPrefix}>{"02 //"}</span> Proyectos
											</Link>
										</li>
										<li>
											<Link href="/perfil" className={styles.footerNavLink}>
												<span className={styles.footerLinkPrefix}>{"03 //"}</span> Perfil
											</Link>
										</li>
										<li>
											<Link href="/contacto" className={styles.footerNavLink}>
												<span className={styles.footerLinkPrefix}>{"04 //"}</span> Contacto
											</Link>
										</li>
									</ul>
								</nav>

								{/* Col 3: Channels */}
								<div className={styles.footerNavCol}>
									<span className={styles.footerColHeading}>{"// CANALES"}</span>
									<ul className={styles.footerColList}>
										<li>
											<a
												href="https://github.com/Gustav0C"
												target="_blank"
												rel="noopener noreferrer"
												className={styles.footerNavLink}
											>
												<span className={styles.footerLinkPrefix}>↗</span> GitHub
											</a>
										</li>
										<li>
											<a
												href="https://www.linkedin.com/in/gscp/"
												target="_blank"
												rel="noopener noreferrer"
												className={styles.footerNavLink}
											>
												<span className={styles.footerLinkPrefix}>↗</span> LinkedIn
											</a>
										</li>
										<li>
											<a
												href="mailto:gcanales58@gmail.com"
												className={styles.footerNavLink}
											>
												<span className={styles.footerLinkPrefix}>@</span> Email
											</a>
										</li>
									</ul>
								</div>
							</div>

							<div className={styles.footerBottom}>
								<p className={styles.copyright}>
									© {new Date().getFullYear()} Gustavo Canales · Terminal Monospace Aesthetic
								</p>
								<div className={styles.footerSysStatus} aria-hidden="true">
									<span>SYS_STATUS: OPTIMAL</span>
								</div>
							</div>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
