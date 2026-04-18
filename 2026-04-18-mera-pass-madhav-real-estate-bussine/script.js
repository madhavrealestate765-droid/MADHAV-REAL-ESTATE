const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const form = document.querySelector("#contact-form");
const quickForm = document.querySelector("#quick-form");
const formNote = document.querySelector("#form-note");
const whatsappLead = document.querySelector("#whatsapp-lead");
const galleryImages = Array.from(document.querySelectorAll(".lightbox-image"));
const lightbox = document.querySelector("#lightbox");
const lightboxPhoto = document.querySelector("#lightbox-photo");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrev = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");
const lightboxThumbs = document.querySelector("#lightbox-thumbs");
let activeImageIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const interest = (data.get("interest") || "").toString().trim();
    const location = (data.get("location") || "").toString().trim();
    const budget = (data.get("budget") || "").toString().trim();
    const contactMode = (data.get("contactMode") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (whatsappLead) {
      const text = [
        "Hello Madhav Real Estate,",
        `Name: ${name || "-"}`,
        `Phone: ${phone || "-"}`,
        `Interest: ${interest || "-"}`,
        `Location: ${location || "-"}`,
        `Budget: ${budget || "-"}`,
        `Preferred Contact: ${contactMode || "-"}`,
        `Message: ${message || "-"}`
      ].join("\n");

      whatsappLead.setAttribute("href", `https://wa.me/919265937309?text=${encodeURIComponent(text)}`);
    }

    formNote.textContent = name
      ? `Thank you, ${name}. Your inquiry has been prepared. You can also send it directly on WhatsApp.`
      : "Thank you. Our team will contact you shortly.";

    form.reset();
  });
}

if (quickForm) {
  quickForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function renderLightbox(index) {
  if (!galleryImages.length || !lightbox || !lightboxPhoto || !lightboxCaption) {
    return;
  }

  activeImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeImageIndex];
  lightboxPhoto.src = image.getAttribute("src") || "";
  lightboxPhoto.alt = image.getAttribute("alt") || "Property photo";
  lightboxCaption.textContent = image.getAttribute("alt") || "";
  updateThumbState();
}

function updateThumbState() {
  if (!lightboxThumbs) {
    return;
  }

  const thumbs = Array.from(lightboxThumbs.querySelectorAll(".lightbox-thumb"));
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle("is-active", index === activeImageIndex);
    if (index === activeImageIndex) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
}

function buildThumbnails() {
  if (!lightboxThumbs) {
    return;
  }

  lightboxThumbs.innerHTML = "";

  galleryImages.forEach((image, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "lightbox-thumb";
    thumb.setAttribute("aria-label", `Open image ${index + 1}`);

    const thumbImage = document.createElement("img");
    thumbImage.src = image.getAttribute("src") || "";
    thumbImage.alt = image.getAttribute("alt") || `Property image ${index + 1}`;

    thumb.appendChild(thumbImage);
    thumb.addEventListener("click", () => {
      renderLightbox(index);
    });

    lightboxThumbs.appendChild(thumb);
  });

  updateThumbState();
}

function openLightbox(index) {
  if (!lightbox) {
    return;
  }

  renderLightbox(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryImages.forEach((image, index) => {
  image.addEventListener("click", () => {
    openLightbox(index);
  });
});

buildThumbnails();

lightboxPrev?.addEventListener("click", () => {
  renderLightbox(activeImageIndex - 1);
});

lightboxNext?.addEventListener("click", () => {
  renderLightbox(activeImageIndex + 1);
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    renderLightbox(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    renderLightbox(activeImageIndex + 1);
  }
});

lightboxPhoto?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0]?.screenX || 0;
});

lightboxPhoto?.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0]?.screenX || 0;
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 40) {
    return;
  }

  if (swipeDistance < 0) {
    renderLightbox(activeImageIndex + 1);
  } else {
    renderLightbox(activeImageIndex - 1);
  }
});
