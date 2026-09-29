// Function to add the "navbarDark" class to the navbar on scroll
function handleNavbarScroll() {
    const header = document.querySelector(".navbar");
    window.onscroll = function () {
        const top = window.scrollY;
        if (top >= 100) {
            header.classList.add("navbarDark");
        } else {
            header.classList.remove("navbarDark");
        }
    };
}

// Function to handle navbar collapse on small devices after a click
function handleNavbarCollapse() {
    const navLinks = document.querySelectorAll(".nav-item");
    const menuToggle = document.getElementById("navbarSupportedContent");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            new bootstrap.Collapse(menuToggle).toggle();
        });
    });
}

function handleTestProgress() {
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section, index) => {
        const progress = section.querySelector(".test-line-progress");
        const testColumn = section.querySelector(".column-test");

        if (!progress || !testColumn) return;

        function updateProgress() {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Début du test : quand la section arrive dans l'écran
            const start = windowHeight * 0.80;

            // Fin du test : quand on approche de la fin de la section
            const end = windowHeight * 0.20;

            let percentage =
                ((start - rect.top) / (start - end)) * 100;

            percentage = Math.min(100, Math.max(0, percentage));

            progress.style.transform = `scaleY(${percentage / 100})`;

            // Pas encore dans la section
            if (percentage <= 0) {
                testColumn.classList.remove("is-testing");
                testColumn.classList.remove("is-passed");
                return;
            }

            // Test en cours
            if (percentage < 90) {
                testColumn.classList.add("is-testing");
                testColumn.classList.remove("is-passed");
            }

            // Test terminé
            if (percentage >= 90) {
                testColumn.classList.remove("is-testing");
                testColumn.classList.add("is-passed");
                progress.style.transform = "scaleY(1)";;
            }
        }

        window.addEventListener("scroll", updateProgress);
        updateProgress();
    });
}


// Function to dynamically create HTML elements from the JSON file
function createSkillsFromJSON() {
    const container = document.querySelector("#skills .container");
    let row = document.createElement("div");
    row.classList.add("row");

    // Load the JSON file
    fetch("data/skills.json")
        .then((response) => response.json())
        .then((data) => {
            // Iterate through the JSON data and create HTML elements
            data.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");
                card.innerHTML = `
    <div class="card skillsText">
        <div class="card-body">
            <img src="./images/${item.image}" alt="${item.alt}" />

            <h4 class="card-title mt-3">${item.title}</h4>

            <p class="card-text mt-3">
                ${item.text}
            </p>

            <div class="skill-status">
                ✓ TEST TYPE — VALIDATED
            </div>
        </div>
    </div>
`;

                // Append the card to the current row
                row.appendChild(card);

                // If the index is a multiple of 3 or it's the last element, create a new row
                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });
        });
}
// Function to dynamically create HTML elements from the JSON file
function createPortfolioFromJSON() {
    const container = document.querySelector("#portfolio .container");
    let row = document.createElement("div");
    row.classList.add("row");

    // Load the JSON file
    fetch("data/portfolio.json")
        .then((response) => response.json())
        .then((data) => {
            // Iterate through the JSON data and create HTML elements
            data.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");
                card.innerHTML = `
                    <div class="card portfolioContent">
                    <img class="card-img-top" src="images/${item.image}" alt="${item.alt}">
                    <div class="card-body">
                        <h4 class="card-title">${item.title}</h4>
                        <p class="card-text">${item.text}</p>
                        <div class="text-center">
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-success">Lien</a>
                        </div>
                    </div>
                </div>
                `;

                // Append the card to the current row
                row.appendChild(card);

                // If the index is a multiple of 3 or it's the last element, create a new row
                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });
        });
}

function handleFinalTest() {
    const finalTest = document.querySelector(".final-test");

    if (!finalTest) return;

    function updateFinalTest() {
        const rect = finalTest.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            finalTest.classList.add("is-complete");
        }
    }

    window.addEventListener("scroll", updateFinalTest);
    updateFinalTest();
}


// Call the functions to execute the code
handleNavbarScroll();
handleTestProgress();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
handleFinalTest();
