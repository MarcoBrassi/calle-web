import { gsap } from "gsap";

const initContactIntro = () => {
    const contactPage = document.querySelector(".contact-page");
    const eyebrow = contactPage?.querySelector(".contact-page__eyebrow");
    const title = contactPage?.querySelector(".contact-page__intro h1");
    const infoText = contactPage?.querySelector(".contact-page__info .large-text");
    const email = contactPage?.querySelector(".contact-page__email");
    const formRows = Array.from(contactPage?.querySelectorAll(".contact-form__row") ?? []);
    const submit = contactPage?.querySelector(".contact-form__submit");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!contactPage) {
        return;
    }

    const animatedElements = [eyebrow, title, infoText, email, ...formRows, submit].filter(Boolean);

    if (prefersReducedMotion) {
        gsap.set(animatedElements, {
            clearProps: "all",
            opacity: 1,
        });
        return;
    }

    const timeline = gsap.timeline({
        delay: 0.18,
        defaults: {
            ease: "power3.out",
        },
    });

    timeline.from(eyebrow, {
        autoAlpha: 0,
        y: 12,
        duration: 0.45,
    });

    timeline.from(
        title,
        {
            autoAlpha: 0,
            x: -36,
            clipPath: "inset(0% 100% 0% 0%)",
            duration: 1,
        },
        0.08,
    );

    timeline.from(
        [infoText, email],
        {
            autoAlpha: 0,
            y: 24,
            duration: 0.75,
            stagger: 0.14,
        },
        0.55,
    );

    timeline.from(
        [...formRows, submit],
        {
            autoAlpha: 0,
            y: 18,
            duration: 0.58,
            stagger: 0.08,
        },
        0.72,
    );
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactIntro, {once: true});
} else {
    initContactIntro();
}
