/**
 * Template Name: iPortfolio
 * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
 * Updated: Jun 29 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector(".header-toggle");

  function headerToggle() {
    document.querySelector("#header").classList.toggle("header-show");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }
  headerToggleBtn.addEventListener("click", headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".header-show")) {
        headerToggle();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Load Config Data and Populate Sections
   */
  fetch("config.json")
    .then((response) => response.json())
    .then((data) => {
      // NAV BAR
      {
        document.title = data.site_title;

        // 2️⃣ Generate Navigation Menu with Icons
        const navMenu = document.getElementById("dynamic-navmenu");
        navMenu.innerHTML = ""; // Clear existing menu items

        data.navigation.forEach((menuItem) => {
          let navItem = document.createElement("li");

          let navLink = document.createElement("a");
          navLink.href = `#${menuItem.id}`;

          // Add icon and text
          navLink.innerHTML = `<i class="bi ${menuItem.icon} navicon"></i> ${menuItem.label}`;

          navItem.appendChild(navLink);
          navMenu.appendChild(navItem);
        });

        // 3️⃣ Generate Contact Emails under the Menu (WITHOUT Icons)
        const contactEmailsContainer =
          document.getElementById("contact-emails");
        contactEmailsContainer.innerHTML = ""; // Clear existing emails

        data.contact_info.forEach((contact) => {
          let contactItem = document.createElement("p");
          contactItem.className = "nav-email";
          contactItem.innerHTML = `<em>${contact.type}:</em> <strong>${contact.email}</strong>`;
          contactEmailsContainer.appendChild(contactItem);
        });

        // 4️⃣ Update Section Titles
        Object.entries(data.section_titles).forEach(([sectionId, title]) => {
          const sectionElement = document.getElementById(`${sectionId}-title`);
          if (sectionElement) {
            sectionElement.textContent = title;
          }
        });
      }
      // ABOUT SECTION
      {
        document.getElementById("about-description").textContent =
          data.about_description;
        const aboutListContainer = document.getElementById("about-list");
        aboutListContainer.innerHTML = ""; // Clear existing content
        data.about_roles.forEach((role) => {
          let roleEntry = document.createElement("p");
          roleEntry.innerHTML = `<em>${role.title}</em> | <strong>${role.affilation}</strong>`;
          aboutListContainer.appendChild(roleEntry);
        });
      }

      // RESEARCH SECTION
      {
        // Update Research Section Title
        document.getElementById("research-title").textContent =
          data.research.section_title;

        // Populate Research Areas
        const researchAreasContainer = document.getElementById(
          "research-areas-container"
        );
        researchAreasContainer.innerHTML = ""; // Clear existing content

        data.research.research_areas.forEach((area) => {
          let areaTile = document.createElement("div");
          areaTile.className = "focus-tile";
          areaTile.innerHTML = `<h6>${area}</h6>`;
          researchAreasContainer.appendChild(areaTile);
        });

        // Populate Frameworks (Theories, Methods, Design)
        const frameworksContainer = document.getElementById(
          "frameworks-container"
        );
        frameworksContainer.innerHTML = ""; // Clear existing content

        Object.entries(data.research.frameworks).forEach(
          ([category, items]) => {
            let frameworkTile = document.createElement("div");
            frameworkTile.className = "framework-tile";

            let tileHeader = document.createElement("div");
            tileHeader.className = "tile-header-stripe";
            tileHeader.innerHTML = `<h4 class="tile-title">${category}</h4>`;

            frameworkTile.appendChild(tileHeader);

            let itemList = document.createElement("ul");
            itemList.className = "tile-list";

            items.forEach((item) => {
              let listItem = document.createElement("li");
              listItem.innerHTML = `<em>${item}</em>`;
              itemList.appendChild(listItem);
            });

            frameworkTile.appendChild(itemList);
            frameworksContainer.appendChild(frameworkTile);
          }
        );
      }

      //PUBLICATIONS SECTION
      {
        const publicationsContainer = document.getElementById(
          "publications-container"
        );
        publicationsContainer.innerHTML = "";
        data.publications.forEach((pub) => {
          let pubEntry = document.createElement("p");

          // Bold only the "featured_author" within the author list
          let authorList = pub.authors.replace(
            new RegExp(`\\b${data.featured_author}\\b`, "g"),
            `<strong>${data.featured_author}</strong>`
          );

          // Construct the publication entry text
          let publicationText = `${authorList} (${pub.year}). ${pub.title}. <em>${pub.journal}</em>.`;

          // Append publisher if it exists
          if (pub.publisher && pub.publisher.trim() !== "") {
            publicationText += ` ${pub.publisher}.`;
          }

          pubEntry.innerHTML = publicationText;

          // If there's a link, add it
          if (pub.link) {
            let linkElement = document.createElement("a");
            linkElement.href = pub.link;
            linkElement.className = "tile-link";
            linkElement.innerHTML = ` Read Now <i class="bi bi-arrow-right"></i>`;
            pubEntry.appendChild(linkElement);
          }

          // Append the publication entry to the container
          publicationsContainer.appendChild(pubEntry);
        });
      }

      //PROJECTS SECTION
      {
        const projectsContainer = document.getElementById("projects-container");
        projectsContainer.innerHTML = "";
        data.projects.forEach((project) => {
          let projectTile = document.createElement("div");
          projectTile.className = "project-tile";

          // Create the tile header
          let tileHeader = document.createElement("div");
          tileHeader.className = "tile-header";

          // Add project icon
          let iconElement = document.createElement("div");
          iconElement.className = "icon flex-shrink-0";
          iconElement.innerHTML = `<i class="bi ${project.icon}"></i>`;
          tileHeader.appendChild(iconElement);

          // Add Project Site button (only if a link is provided)
          if (project.link && project.link.trim() !== "") {
            let linkContainer = document.createElement("div");
            linkContainer.className = "tile-link-container";

            let linkElement = document.createElement("a");
            linkElement.href = project.link;
            linkElement.className = "project-button";
            linkElement.innerHTML = `Project Site <i class="bi bi-arrow-right"></i>`;
            linkContainer.appendChild(linkElement);

            tileHeader.appendChild(linkContainer);
          }

          projectTile.appendChild(tileHeader);

          // Create a container for the project content
          let projectContent = document.createElement("div");

          // Title
          let titleElement = document.createElement("h4");
          titleElement.className = "title";
          titleElement.textContent = project.title;
          projectContent.appendChild(titleElement);

          // Description
          let descriptionElement = document.createElement("p");
          descriptionElement.className = "description";
          descriptionElement.textContent = project.description;
          projectContent.appendChild(descriptionElement);

          // Role
          let roleElement = document.createElement("p");
          roleElement.className = "role";
          roleElement.innerHTML = `<strong>${project.role}</strong> | ${project.years}`;
          projectContent.appendChild(roleElement);

          // PI (if provided)
          if (project.pi && project.pi.trim() !== "") {
            let piElement = document.createElement("p");
            piElement.className = "principles";
            piElement.innerHTML = `<strong>Co-PIs</strong> | ${project.pi}`;
            projectContent.appendChild(piElement);
          }

          projectTile.appendChild(projectContent);
          projectsContainer.appendChild(projectTile);
        });
      }

      //TECHNOLOGIES SECTION
      {
        const technologiesContainer = document.getElementById(
          "technologies-container"
        );

        // Clear existing content
        technologiesContainer.innerHTML = "";

        data.technologies.forEach((tech) => {
          let techTileWrapper = document.createElement("div");

          let techTile = document.createElement("div");
          techTile.className = "technologies-content h-100 custom-tile";

          // Create tile header (title + role)
          let tileHeader = document.createElement("div");
          tileHeader.className = "tile-header";

          let titleElement = document.createElement("h4");
          titleElement.className = "tile-title";
          titleElement.textContent = tech.title;

          let roleElement = document.createElement("p");
          roleElement.className = "tile-role";
          roleElement.textContent = tech.role;

          // Append title and role in the correct order
          tileHeader.appendChild(titleElement);
          tileHeader.appendChild(roleElement);
          techTile.appendChild(tileHeader);

          // Add Visit Site button (if link is provided)
          if (tech.link && tech.link.trim() !== "") {
            let tileFooter = document.createElement("div");
            tileFooter.className = "tile-footer";

            let linkElement = document.createElement("a");
            linkElement.href = tech.link;
            linkElement.className = "tile-link";
            linkElement.innerHTML = `Visit Site <i class="bi bi-arrow-right"></i>`;
            tileFooter.appendChild(linkElement);

            techTile.appendChild(tileFooter);
          }

          techTileWrapper.appendChild(techTile);
          technologiesContainer.appendChild(techTileWrapper);
        });
      }
    })
    .catch((error) => console.error("Error loading config:", error));
})();
