const header = document.querySelector(".header");
const menuButton = document.querySelector(".header__toggle");
const menuLinks = document.querySelectorAll(".header__menu a");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("header--scrolled");
        } else {
            header.classList.remove("header--scrolled");
        }
    });
}

if (header && menuButton) {
    menuButton.addEventListener("click", () => {
        const isOpen = header.classList.toggle("header--menu-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            header.classList.remove("header--menu-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menú");
        });
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            header.classList.remove("header--menu-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menú");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            header.classList.remove("header--menu-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menú");
        }
    });
}
