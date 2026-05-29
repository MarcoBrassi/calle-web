import { gsap } from "gsap";

const initHomeIntro = () => {
    const heroSlider = document.querySelector(".hero-slider");
    const logo = heroSlider?.querySelector(".hero-slider__logo-img");
    const claimLines = Array.from(heroSlider?.querySelectorAll(".hero-slider__claim-line") ?? []);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;

    if (!heroSlider || !logo || claimLines.length === 0) {
        return;
    }

    const claimTitle = claimLines[0].closest("h2");

    claimLines.forEach((line) => {
        line.dataset.finalText = line.dataset.typewriterText || line.textContent || "";
    });

    if (claimTitle && isDesktop) {
        const titleRect = claimTitle.getBoundingClientRect();
        claimTitle.style.width = `${Math.ceil(titleRect.width)}px`;
        claimTitle.style.height = `${Math.ceil(titleRect.height) + 8}px`;
    }

    if (prefersReducedMotion) {
        gsap.set(logo, {opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)"});
        claimLines.forEach((line) => {
            line.textContent = line.dataset.finalText || "";
        });
        return;
    }

    gsap.set(logo, {
        opacity: 0,
        x: -32,
        clipPath: "inset(0% 100% 0% 0%)",
    });

    claimLines.forEach((line) => {
        line.textContent = "";
    });

    const timeline = gsap.timeline({delay: 0.25});

    timeline.to(logo, {
        opacity: 1,
        x: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.1,
        ease: "power3.out",
    });

    claimLines.forEach((line, lineIndex) => {
        const text = line.dataset.finalText || "";
        const proxy = {characters: 0};

        timeline.to(
            proxy,
            {
                characters: text.length,
                duration: Math.max(0.7, text.length * 0.045),
                ease: `steps(${Math.max(text.length, 1)})`,
                onUpdate: () => {
                    line.textContent = text.slice(0, Math.round(proxy.characters));
                },
                onComplete: () => {
                    line.textContent = text;
                },
            },
            0.55 + lineIndex * 0.72,
        );
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomeIntro, {once: true});
} else {
    initHomeIntro();
}
