import styles from "./GhostAvatar.module.css";

export default function GhostAvatar({ size = 80 }: { size?: number }) {
	return (
		<svg
			className={styles.ghost}
			width={size}
			height={size}
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			{/* Ghost body - uses currentColor from CSS */}
			<path
				className={styles.body}
				d="M20 55 L20 50 A30 30 0 0 1 80 50 L80 55
				   Q80 62 75 65 Q70 68 65 65 Q60 62 55 65
				   Q50 68 45 65 Q40 62 35 65 Q30 68 25 65
				   Q20 62 20 55 Z"
				fill="currentColor"
			/>
			{/* Left eye */}
			<circle
				className={styles.eye}
				cx="38"
				cy="42"
				r="7"
				fill="currentColor"
			/>
			{/* Right eye (winks) */}
			<circle
				className={`${styles.eye} ${styles.eyeRight}`}
				cx="62"
				cy="42"
				r="7"
				fill="currentColor"
			/>
		</svg>
	);
}
