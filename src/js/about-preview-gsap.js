import { gsap } from "gsap";

const clientsWrap = document.querySelector(".about__clients-list-wrap");
const clientsPreview = clientsWrap?.querySelector(".about__clients-preview");
const clientsPreviewImage = clientsPreview?.querySelector("img");
const clientItems = Array.from(clientsWrap?.querySelectorAll(".about__client-item") ?? []);
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

if (
    clientsWrap &&
    clientsPreview &&
    clientsPreviewImage &&
    clientItems.length > 0 &&
    canHover.matches &&
    !prefersReducedMotion.matches
) {
    gsap.set(clientsPreview, {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0,
        scale: 0.96,
        rotation: -2,
    });

    gsap.set(clientsPreviewImage, {
        scale: 1.08,
        transformOrigin: "50% 50%",
    });

    const setX = gsap.quickTo(clientsPreview, "x", {
        duration: 0.38,
        ease: "power3",
    });
    const setY = gsap.quickTo(clientsPreview, "y", {
        duration: 0.38,
        ease: "power3",
    });
    const setRotation = gsap.quickTo(clientsPreview, "rotation", {
        duration: 0.45,
        ease: "power3",
    });
    const setImageX = gsap.quickTo(clientsPreviewImage, "x", {
        duration: 0.55,
        ease: "power3",
    });
    const setImageY = gsap.quickTo(clientsPreviewImage, "y", {
        duration: 0.55,
        ease: "power3",
    });
    const showPreview = gsap.to(clientsPreview, {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 0.16,
        ease: "power2.out",
        paused: true,
    });

    const alignPreview = (event) => {
        const wrapRect = clientsWrap.getBoundingClientRect();
        const previewRect = clientsPreview.getBoundingClientRect();
        const previewWidth = previewRect.width || 280;
        const previewHeight = previewRect.height || 210;
        const x = event.clientX - wrapRect.left;
        const y = event.clientY - wrapRect.top;
        const normalizedX = (x / wrapRect.width - 0.5) * 2;
        const normalizedY = (y / wrapRect.height - 0.5) * 2;
        const offsetX = normalizedX * 18;
        const offsetY = normalizedY * 14;
        const centerX = clamp(x + offsetX, previewWidth / 2, wrapRect.width - previewWidth / 2);
        const centerY = clamp(y + offsetY, previewHeight / 2, wrapRect.height - previewHeight / 2);

        setX(centerX);
        setY(centerY);
        setRotation(clamp(normalizedX * 4 + normalizedY * -2, -5, 5));
        setImageX(clamp(normalizedX * -12, -12, 12));
        setImageY(clamp(normalizedY * -10, -10, 10));
    };

    const onMouseMove = (event) => {
        alignPreview(event);
    };

    clientItems.forEach((item) => {
        item.addEventListener("mouseenter", (event) => {
            const previewSrc = item.dataset.preview;

            if (!previewSrc) return;

            clientsPreviewImage.src = previewSrc;
            document.addEventListener("mousemove", onMouseMove);
            alignPreview(event);
            showPreview.play();
        });

        item.addEventListener("mouseleave", () => {
            showPreview.reverse();
            document.removeEventListener("mousemove", onMouseMove);
        });

        item.addEventListener("focus", () => {
            const previewSrc = item.dataset.preview;

            if (!previewSrc) return;

            clientsPreviewImage.src = previewSrc;
            gsap.set(clientsPreview, {
                x: clientsWrap.clientWidth * 0.5,
                y: clientsWrap.clientHeight * 0.5,
                rotation: 0,
            });
            gsap.set(clientsPreviewImage, {
                x: 0,
                y: 0,
            });
            showPreview.play();
        });

        item.addEventListener("blur", () => {
            showPreview.reverse();
        });
    });

    clientsWrap.addEventListener("mouseleave", () => {
        showPreview.reverse();
        document.removeEventListener("mousemove", onMouseMove);
    });
}
