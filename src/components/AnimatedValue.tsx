import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  format: (v: number) => string;
  className?: string;
  flashColors?: boolean; // green/red flash on change
}

export default function AnimatedValue({ value, format, className = "", flashColors = false }: Props) {
  const prevRef = useRef(value);
  const [displayed, setDisplayed] = useState(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;

    const diff = value - prev;
    if (flashColors && diff !== 0) {
      setFlash(diff > 0 ? "up" : "down");
    }

    // Animate over ~400ms
    const duration = 400;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(prev + diff * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    // Clear flash after 600ms
    const timer = setTimeout(() => setFlash(null), 600);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [value, flashColors]);

  const flashClass = flash === "up"
    ? "animate-flash-up"
    : flash === "down"
    ? "animate-flash-down"
    : "";

  return (
    <span className={`${className} ${flashClass} transition-colors duration-300`}>
      {format(displayed)}
    </span>
  );
}
