import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projectImages = gsap.utils.toArray(".project__grid-image");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (projectImages.length > 0 && !prefersReducedMotion.matches) {
    gsap.set(projectImages, {
        autoAlpha: 0,
        y: 28,
    });

    projectImages.forEach((image) => {
        gsap.to(image, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
                trigger: image,
                start: "top 88%",
                once: true,
            },
        });
    });
}
