const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("show");

        if (navMenu.classList.contains("show")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }

    });

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("show");

            menuToggle.textContent = "☰";

        });

    });

}

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const emailInput = newsletterForm.querySelector("input");

        if (emailInput.value.trim() !== "") {

            alert(
                "Thank you for subscribing to Sebby's Cafe! ☕"
            );

            emailInput.value = "";

        }

    });

}