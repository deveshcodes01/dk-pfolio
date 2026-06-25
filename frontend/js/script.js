// ============================================
// CONFIGURATION
// ============================================
const API_BASE_URL = "http://localhost:8000/api"; // Change to your Django API URL
// const API_BASE_URL = 'https://your-django-api.com/api';
const MEDIA_BASE_URL = "http://localhost:8000/media";

// ============================================
// CUSTOM CURSOR
// ============================================
const initCursor = () => {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (!cursorDot || !cursorOutline) return;
  if (window.innerWidth <= 768) return;

  let mouseX = 0,
    mouseY = 0;
  let outlineX = 0,
    outlineY = 0;
  let rafId = null;

  // Move dot immediately on mousemove
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth outline follow with requestAnimationFrame
  const animateOutline = () => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    rafId = requestAnimationFrame(animateOutline);
  };
  animateOutline();

  // Hover effects on interactive elements
  document
    .querySelectorAll(
      "a, button, .btn, .service-card, .portfolio-card, .article-card, .social-link, .nav-link, input, textarea",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });

  // Click animation
  document.addEventListener("mousedown", () => {
    document.body.classList.add("cursor-click");
  });
  document.addEventListener("mouseup", () => {
    document.body.classList.remove("cursor-click");
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorOutline.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1";
    cursorOutline.style.opacity = "1";
  });
};

// ============================================
// NAVIGATION
// ============================================
const initNavigation = () => {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLinkItems = document.querySelectorAll(".nav-link");

  if (!navbar) return;

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Close mobile menu on link click
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.classList.remove("active");
      if (navLinks) navLinks.classList.remove("active");
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
};

// ============================================
// SCROLL REVEAL
// ============================================
const initScrollReveal = () => {
  const revealElements = () => {
    const reveals = document.querySelectorAll(
      ".reveal, .section-header, .service-card, .portfolio-card, .article-card, .skill-item, .contact-item",
    );

    reveals.forEach((el) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealElements);
  window.addEventListener("load", revealElements);
};

// ============================================
// BACK TO TOP
// ============================================
const initBackToTop = () => {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

// ============================================
// SKILL BARS ANIMATION
// ============================================
const initSkillBars = () => {
  const skillSection = document.querySelector(".skills-section");
  if (!skillSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.getElementById("frontend-bar").style.width = "90%";
          document.getElementById("backend-bar").style.width = "80%";
          document.getElementById("hacking-bar").style.width = "95%";
          document.getElementById("ai-bar").style.width = "85%";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(skillSection);
};

// ============================================
// API FETCH FUNCTIONS
// ============================================

// Fetch profile data
const fetchProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    const data = await response.json();

    if (data.length > 0) {
      const profile = data[0];

      // Update bio text
      const bioEl = document.getElementById("hero-bio");
      if (bioEl) bioEl.textContent = profile.bio;

      // Update resume link
      const resumeBtn = document.getElementById("resume-btn");
      if (resumeBtn && profile.resume_url) {
        resumeBtn.href = profile.resume_url;
      }

      // Update profile image (with fallback)
      const profileImg = document.getElementById("profile-img");
      if (profileImg && profile.profile_image) {
        const imgUrl = profile.profile_image.startsWith("http")
          ? profile.profile_image
          : `${MEDIA_BASE_URL}/${profile.profile_image}`;
        profileImg.src = imgUrl;
      }

      // Update skill percentages
      const frontendPct = document.getElementById("frontend-pct");
      const backendPct = document.getElementById("backend-pct");
      const hackingPct = document.getElementById("hacking-pct");
      const aiPct = document.getElementById("ai-pct");

      if (frontendPct) frontendPct.textContent = `${profile.frontend_skill}%`;
      if (backendPct) backendPct.textContent = `${profile.backend_skill}%`;
      if (hackingPct)
        hackingPct.textContent = `${profile.ethical_hacking_skill}%`;
      if (aiPct) aiPct.textContent = `${profile.ai_skill}%`;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    // Fallback bio
    const bioEl = document.getElementById("hero-bio");
    if (bioEl) {
      bioEl.textContent =
        "Ethical Hacker & Full Stack Developer with a focus on secure, scalable web applications. Hands-on with OWASP Top 10, penetration testing basics, and full-stack tools like JavaScript, Python, React, and Node.js.";
    }
  }
};

// Fetch services
const getServiceHighlights = (service) => {
  const title = (service.title || "").toLowerCase();

  if (
    title.includes("security") ||
    title.includes("vapt") ||
    title.includes("hacking")
  ) {
    return ["Threat modeling", "Secure deployment"];
  }

  if (title.includes("web") || title.includes("full")) {
    return ["Modern UI", "Scalable logic"];
  }

  if (title.includes("ai")) {
    return ["Automation", "Smart workflows"];
  }

  return ["Custom solution", "Reliable delivery"];
};

const fetchServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/`);
    if (!response.ok) throw new Error("Failed to fetch services");
    const data = await response.json();
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    if (data.results && data.results.length > 0) {
      grid.innerHTML = data.results
        .map((service, index) => {
          const highlights = getServiceHighlights(service);
          return `
            <div class="service-card reveal">
              <div class="service-meta">
                <span class="service-badge">${service.title}</span>
                <a href="#contact" class="service-link">Let's talk <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="service-number">0${index + 1}</div>
              <div class="service-icon">
                <i class="fas fa-${service.icon}"></i>
              </div>
              <h3 class="service-title">${service.title}</h3>
              <p class="service-desc">${service.description}</p>
              <ul class="service-list">
                ${highlights.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    // Fallback services are already in HTML
  }
};
const servicesData = [
  {
    title: "Full Stack",
    desc: "Building responsive, user-centric web applications using modern stacks like React, Node.js, and PostgreSQL.",
  },
  {
    title: "Security First",
    desc: "I perform rigorous security audits, penetration testing, and vulnerability assessments to secure your digital assets.",
  },
  {
    title: "AI Powered",
    desc: "Integrating AI/LLM solutions to automate workflows and create intelligent features for modern web applications.",
  },
];

function loadServices() {
  const grid = document.getElementById("services-grid");
  grid.innerHTML = ""; // Clear skeleton loaders

  servicesData.forEach((service) => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="skeleton-icon"><i class="fas fa-code"></i></div>
      <div class="skeleton-title">${service.title}</div>
      <div class="skeleton-text">${service.desc}</div>
    `;
    grid.appendChild(card);
  });
}

// Call this when your page loads
document.addEventListener("DOMContentLoaded", loadServices);
// Fetch projects
const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/`);
    if (!response.ok) throw new Error("Failed to fetch projects");
    const data = await response.json();
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    if (data.results && data.results.length > 0) {
      grid.innerHTML = data.results
        .map(
          (project) => `
        <div class="portfolio-card reveal">
          <div class="portfolio-image-wrapper">
            <img src="${project.primary_image || project.image}" alt="${project.title}" class="portfolio-image" loading="lazy">
            <div class="portfolio-overlay">
              ${project.github_url ? `<a href="${project.github_url}" class="portfolio-link" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ""}
              ${project.live_url ? `<a href="${project.live_url}" class="portfolio-link" target="_blank" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ""}
            </div>
          </div>
          <div class="portfolio-content">
            <h3 class="portfolio-title">${project.title}</h3>
            <p class="portfolio-desc">${project.description}</p>
            <div class="portfolio-tech">
              ${project.technologies
                .split(",")
                .map((tech) => `<span class="tech-tag">${tech.trim()}</span>`)
                .join("")}
            </div>
          </div>
        </div>
      `,
        )
        .join("");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    // Fallback projects are already in HTML
  }
};
// added
const projects = [
  {
    title: "Real Estate Site",
    desc: "A full-stack real estate website meant to generate leads ",
    image: "assets/Screenshot 2026-06-25 224256.png",
    techs: ["HTML", "CSS", "Javascript"],
    link: "https://realestateaura.netlify.app/",
  },
  {
    title: "Furniture Store Website",
    desc: "Furniture store ecommerce website",
    image: "assets/Screenshot 2026-06-25 223901.png",
    techs: ["HTML", "Javascript", "Tailwind CSS"],
    link: "https://velourfurniture.netlify.app/",
  },
  {
    title: "Watch Store Website",
    desc: "Watch store ecommerce website",
    image: "assets/Screenshot 2026-06-25 224218.png",
    techs: ["HTML", "Javascript", "Tailwind CSS"],
    link: "https://classywatchstore.netlify.app/",
  },
];

function loadPortfolio() {
  const grid = document.getElementById("portfolio-grid");
  grid.innerHTML = ""; // Clear skeleton

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "portfolio-card";
    card.innerHTML = `
      <div class="portfolio-image-wrapper">
        <img src="${project.image}" alt="${project.title}" class="portfolio-image">
        <div class="portfolio-overlay">
          <a href="${project.link}" class="portfolio-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>
        </div>
      </div>
      <div class="portfolio-content">
        <h3 class="portfolio-title">${project.title}</h3>
        <p class="portfolio-desc">${project.desc}</p>
        <div class="portfolio-tech">
          ${project.techs.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadPortfolio);

// Fetch articles
const fetchArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/`);
    if (!response.ok) throw new Error("Failed to fetch articles");
    const data = await response.json();
    const grid = document.getElementById("articles-grid");
    if (!grid) return;

    if (data.results && data.results.length > 0) {
      grid.innerHTML = data.results
        .map((article) => {
          const date = new Date(article.date);
          const day = date.getDate();
          const month = date.toLocaleString("en-US", { month: "short" });
          const year = date.getFullYear();

          return `
          <div class="article-card reveal">
            <div class="article-image-wrapper">
              <img src="${article.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"}" alt="${article.title}" class="article-image" loading="lazy">
              <div class="article-date">
                <span class="day">${day}</span>
                <span class="month">${month} ${year}</span>
              </div>
            </div>
            <div class="article-content">
              <span class="article-category">${article.category}</span>
              <h3 class="article-title">${article.title}</h3>
              <p class="article-excerpt">${article.excerpt}</p>
              <div class="article-meta">
                <span class="article-readtime"><i class="far fa-clock"></i> ${article.read_time}</span>
                <a href="#" class="article-readmore">Read more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    // Fallback articles are already in HTML
  }
};

const articles = [
  {
    title: "Understanding Zero-Day Vulnerabilities",
    desc: "A deep dive into how zero-day exploits work and how developers can build resilient systems.",
    category: "Security",
    link: "#",
  },
  {
    title: "The Future of AI in Web Development",
    desc: "Exploring how LLMs are changing the way we write code and design user interfaces in 2026.",
    category: "AI/Tech",
    link: "#",
  },
];

function loadArticles() {
  const grid = document.getElementById("articles-grid");
  grid.innerHTML = ""; // Clear skeleton

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "article-card";
    card.innerHTML = `
      <div class="article-content">
        <span class="article-category">${article.category}</span>
        <h3 class="article-title">${article.title}</h3>
        <p class="article-desc">${article.desc}</p>
        <a href="${article.link}" class="article-link">Read More →</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadArticles);

// ============================================
// CONTACT FORM
// ============================================
// const initContactForm = () => {
//   const contactForm = document.getElementById("contact-form");
//   const formStatus = document.getElementById("form-status");
//   if (!contactForm) return;

//   contactForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = {
//       name: document.getElementById("name").value,
//       email: document.getElementById("email").value,
//       subject: document.getElementById("subject").value,
//       message: document.getElementById("message").value,
//     };

//     const submitBtn = contactForm.querySelector('button[type="submit"]');
//     const originalText = submitBtn.innerHTML;
//     submitBtn.innerHTML =
//       '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
//     submitBtn.disabled = true;

//     try {
//       const response = await fetch(`${API_BASE_URL}/contact/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         formStatus.className = "form-status success";
//         formStatus.textContent =
//           "Message sent successfully! I will get back to you soon.";
//         contactForm.reset();
//       } else {
//         throw new Error("Failed to send message");
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       formStatus.className = "form-status error";
//       formStatus.textContent =
//         "Failed to send message. Please try again later.";
//     } finally {
//       submitBtn.innerHTML = originalText;
//       submitBtn.disabled = false;
//       setTimeout(() => {
//         formStatus.style.display = "none";
//       }, 5000);
//     }
//   });
// };

const initContactForm = () => {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  // Debugging check
  if (!contactForm) {
    console.error("Contact form element not found!");
    return;
  }
  if (!formStatus) console.warn("form-status element missing!");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Ensure status is visible
    if (formStatus) formStatus.style.display = "block";

    const formData = {
      name: document.getElementById("name")?.value,
      email: document.getElementById("email")?.value,
      subject: document.getElementById("subject")?.value,
      message: document.getElementById("message")?.value,
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // UI Feedback
    submitBtn.innerHTML =
      '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
      // Check if API_BASE_URL exists
      if (typeof API_BASE_URL === "undefined") {
        throw new Error("API_BASE_URL is not defined");
      }

      const response = await fetch(`${API_BASE_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      formStatus.className = "form-status success";
      formStatus.textContent = "Message sent successfully!";
      contactForm.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      if (formStatus) {
        formStatus.className = "form-status error";
        formStatus.textContent = "Failed to send. Please check the console.";
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Auto-hide status after 5 seconds
      setTimeout(() => {
        if (formStatus) formStatus.style.display = "none";
      }, 5000);
    }
  });
};

// ============================================
// PARALLAX EFFECT
// ============================================
const initParallax = () => {
  const parallaxElements = document.querySelectorAll(".gradient-orb");
  if (parallaxElements.length === 0) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach((el, index) => {
      const speed = (index + 1) * 0.2;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
};

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollTo({ top: 0, behavior: "smooth" });
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
};

// ============================================
// KEYBOARD NAVIGATION
// ============================================
const initKeyboardNav = () => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const menuToggle = document.querySelector(".menu-toggle");
      const navLinks = document.querySelector(".nav-links");
      if (menuToggle) menuToggle.classList.remove("active");
      if (navLinks) navLinks.classList.remove("active");
    }
  });
};

// ============================================
// PREFERS REDUCED MOTION
// ============================================
const respectReducedMotion = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(
        ".gradient-orb, .profile-ring, .floating-card, .scroll-wheel",
      )
      .forEach((el) => {
        el.style.animation = "none";
      });
  }
};

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initNavigation();
  initScrollReveal();
  initBackToTop();
  initSkillBars();
  initContactForm();
  initParallax();
  initSmoothScroll();
  initKeyboardNav();
  respectReducedMotion();

  // Load data from API
  fetchProfile();
  fetchServices();
  fetchProjects();
  fetchArticles();
});
