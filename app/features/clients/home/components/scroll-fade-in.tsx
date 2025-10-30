import React, { useEffect, useState } from "react";

interface ScrollFadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollFadeIn({
  children,
  delay = 0,
  className = "",
}: ScrollFadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, delay]);

  return (
    <div
      ref={setRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
