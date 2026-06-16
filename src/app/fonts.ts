import localFont from "next/font/local";

const berkeleyMono = localFont({
	src: [
		{
			path: "../../public/fonts/berkeley-mono-400.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/berkeley-mono-700.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-mono",
});

export default berkeleyMono;
