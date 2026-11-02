"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Background.module.css";

export interface BackgroundProps {
	className?: string;
	children?: React.ReactNode;
}

/**
 * Blueprint Technical Grid Background (OpenCode / Flat Terminal style).
 * CSS blueprint grid with an interactive ambient cursor glow
 * that follows the mouse via positioned overlay divs.
 */
export function BlueprintBackground({ className, children }: BackgroundProps) {
	const [mouse, setMouse] = useState({ x: -1000, y: -1000 });
	const rafRef = useRef<number | null>(null);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(() => {
			setMouse({ x: e.clientX, y: e.clientY });
		});
	}, []);

	const handleMouseLeave = useCallback(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		setMouse({ x: -1000, y: -1000 });
	}, []);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		document.addEventListener("mouseleave", handleMouseLeave);
		window.addEventListener("blur", handleMouseLeave);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			window.removeEventListener("blur", handleMouseLeave);
		};
	}, [handleMouseMove, handleMouseLeave]);

	return (
		<div
			className={`${styles.container} ${className || ""}`.trim()}
			aria-hidden="true"
		>
			<div className={styles.gridBase} />

			{/* Ambient glow — follows cursor */}
			<div
				className={styles.ambientGlow}
				style={{
					left: mouse.x - 300,
					top: mouse.y - 300,
				}}
			/>

			{/* Spotlight mask — reveals brighter grid lines around cursor */}
			<div
				className={styles.gridSpotlight}
				style={{
					maskImage: `radial-gradient(450px circle at ${mouse.x}px ${mouse.y}px, black 0%, transparent 80%)`,
					WebkitMaskImage: `radial-gradient(450px circle at ${mouse.x}px ${mouse.y}px, black 0%, transparent 80%)`,
				}}
			/>

			<div className={styles.vignette} />

			{children && (
				<div
					style={{
						position: "relative",
						zIndex: 1,
						height: "100%",
						width: "100%",
						pointerEvents: "auto",
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
}

export const DotPattern = BlueprintBackground;

export default function Background(props: BackgroundProps) {
	return <BlueprintBackground {...props} />;
}
