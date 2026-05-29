import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const initAboutIntro = () => {
    const aboutIntro = document.querySelector(".about__intro");
    const logoGroup = aboutIntro?.querySelector(".about__logo-group");
    const introImage = aboutIntro?.querySelector(".about__intro-img");
    const headings = Array.from(aboutIntro?.querySelectorAll(".about__intro-heading") ?? []);
    const introText = document.querySelector(".about__intro-text .large-text");
    const descriptionItems = Array.from(document.querySelectorAll(".about__description > div"));
    const clientsTitle = document.querySelector(".about__clients > h2");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!aboutIntro) {
        return;
    }

    const activeHeading = headings.find((heading) => window.getComputedStyle(heading).display !== "none");
    const headingLines = Array.from(activeHeading?.querySelectorAll(".about__heading-line") ?? []);

    headingLines.forEach((line) => {
        line.dataset.finalText = line.dataset.typewriterText || line.textContent || "";
    });

    if (prefersReducedMotion) {
        gsap.set([logoGroup, introImage, activeHeading, introText, descriptionItems, clientsTitle], {
            clearProps: "all",
            opacity: 1,
        });
        headingLines.forEach((line) => {
            line.textContent = line.dataset.finalText || "";
        });
        return;
    }

    if (activeHeading) {
        const headingRect = activeHeading.getBoundingClientRect();
        activeHeading.style.minHeight = `${Math.ceil(headingRect.height) + 8}px`;
    }

    headingLines.forEach((line) => {
        line.textContent = "";
    });

    const introTimeline = gsap.timeline({
        delay: 0.2,
        defaults: {
            ease: "power3.out",
        },
    });

    introTimeline.from(logoGroup, {
        autoAlpha: 0,
        x: -32,
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 1,
    });

    introTimeline.from(
        introImage,
        {
            autoAlpha: 0,
            y: 24,
            scale: 0.98,
            duration: 0.9,
        },
        0.18,
    );

    headingLines.forEach((line, index) => {
        const text = line.dataset.finalText || "";
        const proxy = {characters: 0};

        introTimeline.to(
            proxy,
            {
                characters: text.length,
                duration: Math.max(0.65, text.length * 0.045),
                ease: `steps(${Math.max(text.length, 1)})`,
                onUpdate: () => {
                    line.textContent = text.slice(0, Math.round(proxy.characters));
                },
                onComplete: () => {
                    line.textContent = text;
                },
            },
            0.45 + index * 0.68,
        );
    });

    if (introText) {
        introTimeline.from(
            introText,
            {
                autoAlpha: 0,
                y: 28,
                duration: 0.9,
            },
            1.05,
        );
    }

    if (descriptionItems.length > 0) {
        gsap.from(descriptionItems, {
            autoAlpha: 0,
            y: 32,
            duration: 0.85,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".about__description",
                start: "top 78%",
                once: true,
            },
        });
    }

    if (clientsTitle) {
        gsap.from(clientsTitle, {
            autoAlpha: 0,
            x: -28,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: clientsTitle,
                start: "top 85%",
                once: true,
            },
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAboutIntro, {once: true});
} else {
    initAboutIntro();
}
