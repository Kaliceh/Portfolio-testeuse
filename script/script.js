
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



function createSkillsFromJSON() {
    const container = document.querySelector("#skills .container");
    let row = document.createElement("div");
    row.classList.add("row");


    fetch("data/skills.json")
        .then((response) => response.json())
        .then((data) => {

            data.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");
                card.innerHTML = `
    <div class="card skillsText">
        <div class="card-body">
<img src="./images/${item.image}" alt="${item.alt}" loading="lazy" decoding="async" />

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


                row.appendChild(card);


                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });
        });
}
function createPortfolioFromJSON() {
    const container = document.querySelector("#portfolio .container");
    let row = document.createElement("div");
    row.classList.add("row");

    fetch("data/portfolio.json")
        .then((response) => response.json())
        .then((data) => {

            data.forEach((item, index) => {

                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4");

                card.innerHTML = `
                    <div class="card portfolioContent portfolio-card" 
                         data-project="${index}"
                         tabindex="0"
                         role="button"
                         aria-label="Voir les détails du projet ${item.title}">

                        <img
    class="card-img-top"
    src="images/${item.image}"
    alt="${item.alt}"
    width="${item.width}"
    height="${item.height}"
    loading="lazy"
    decoding="async"
>

                        <div class="card-body">
                            <h4 class="card-title">${item.title}</h4>

                            <p class="card-text">
                                ${item.text}
                            </p>

                            <span class="portfolio-more">
                                Voir le projet →
                            </span>
                        </div>
                    </div>
                `;

                row.appendChild(card);

                if ((index + 1) % 3 === 0 || index === data.length - 1) {
                    container.appendChild(row);
                    row = document.createElement("div");
                    row.classList.add("row");
                }
            });

            // Création de la modale
            createProjectModal(data);

            // Clic sur les cartes
            const cards = document.querySelectorAll(".portfolio-card");

            cards.forEach((card) => {
                card.addEventListener("click", () => {
                    const projectIndex = card.dataset.project;
                    openProjectModal(data[projectIndex]);
                });

                // Permet aussi l'ouverture avec Entrée
                card.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();

                        const projectIndex = card.dataset.project;
                        openProjectModal(data[projectIndex]);
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des projets :", error);
        });
}

function createProjectModal(data) {

    const modal = document.createElement("div");

    modal.id = "projectModal";
    modal.classList.add("project-modal");

    modal.innerHTML = `
        <div class="project-modal-overlay"></div>

        <div class="project-modal-content">

            <button class="project-modal-close" aria-label="Fermer">
                ×
            </button>

            <div class="project-modal-body">

                <h4 id="modalProjectTitle">Titre du projet</h4>

                <p id="modalProjectDescription"></p>

                <div class="project-modal-details">

                    <div>
                        <strong>Projet</strong>
                        <span id="modalProjectType"></span>
                    </div>

                    <div>
                        <strong>Technologies</strong>
                        <span id="modalProjectTech"></span>
                    </div>

                    <div>
                        <strong>Tests</strong>
                        <span id="modalProjectTests"></span>
                    </div>

                </div>

                <a 
                    id="modalProjectLink"
                    class="project-modal-button"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Voir le projet
                </a>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".project-modal-close");
    const overlay = modal.querySelector(".project-modal-overlay");

    closeButton.addEventListener("click", closeProjectModal);
    overlay.addEventListener("click", closeProjectModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeProjectModal();
        }
    });
}


function openProjectModal(project) {

    const modal = document.querySelector("#projectModal");

    document.querySelector("#modalProjectTitle").textContent =
        project.title;

    document.querySelector("#modalProjectDescription").textContent =
        project.description || project.text;

    document.querySelector("#modalProjectType").textContent =
        project.type || "Projet OpenClassrooms";

    document.querySelector("#modalProjectTech").textContent =
        project.technologies || "À préciser";

    document.querySelector("#modalProjectTests").textContent =
        project.tests || "À préciser";

    document.querySelector("#modalProjectLink").href =
        project.link || "#";

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}


function closeProjectModal() {

    const modal = document.querySelector("#projectModal");

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");
}


function handleModalEscape(event) {

    if (event.key === "Escape") {
        closeProjectModal();
    }
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
