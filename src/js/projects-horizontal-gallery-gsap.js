import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector("[data-projects-horizontal]");
const sticky = section?.querySelector(".projects-page__sticky");
const track = section?.querySelector(".project__grid");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (section && sticky && track && !reduceMotion.matches) {
    const media = gsap.matchMedia();

    media.add("(min-width: 1025px)", () => {
        const getDistance = () => Math.max(0, track.scrollWidth - sticky.clientWidth);
        const setSectionHeight = () => {
            section.style.setProperty("--projects-scroll-height", `${getDistance() + window.innerHeight}px`);
        };

        setSectionHeight();

        gsap.set(track, {
            x: 0,
            force3D: true,
        });

        const animation = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top+=64",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
                onRefreshInit: setSectionHeight,
            },
        });

        const refresh = () => {
            setSectionHeight();
            ScrollTrigger.refresh();
        };

        window.addEventListener("load", refresh, {once: true});
        window.addEventListener("resize", refresh);

        return () => {
            window.removeEventListener("load", refresh);
            window.removeEventListener("resize", refresh);
            animation.scrollTrigger?.kill();
            animation.kill();
            section.style.removeProperty("--projects-scroll-height");
            gsap.set(track, {clearProps: "transform"});
        };
    });
}
