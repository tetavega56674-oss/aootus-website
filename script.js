const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav__links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("form[data-inquiry-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const originalText = submitButton ? submitButton.textContent : "";
    const pageTitle = document.querySelector("h1")?.textContent?.trim() || document.title;
    const recipient = form.dataset.inquiryEmail || "sales@aootus.com";
    const fields = Array.from(form.elements).filter((field) => {
      return field.name && !field.disabled && ["INPUT", "SELECT", "TEXTAREA"].includes(field.tagName);
    });
    const lines = [`Page: ${pageTitle}`, `URL: ${window.location.href}`];

    fields.forEach((field) => {
      const value = field.value.trim();
      if (!value) return;

      const label = field.id ? form.querySelector(`label[for="${field.id}"]`) : null;
      const labelText = label ? label.textContent.trim() : field.name;
      lines.push(`${labelText}: ${value}`);
    });

    const subject = encodeURIComponent(`AOOTUS Inquiry - ${pageTitle}`);
    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
    const formActions = form.querySelector(".form-actions");
    let status = form.querySelector(".form-status");

    if (submitButton) {
      submitButton.textContent = "Inquiry Ready";
      submitButton.disabled = true;
    }

    form.classList.add("is-submitted");

    if (!status) {
      status = document.createElement("div");
      status.className = "form-status";
      status.setAttribute("role", "status");
      if (formActions) {
        formActions.insertAdjacentElement("afterend", status);
      } else {
        form.append(status);
      }
    }

    status.textContent = "Inquiry details are ready. ";
    const emailLink = document.createElement("a");
    emailLink.href = mailto;
    emailLink.textContent = "Open email draft";
    status.append(emailLink, document.createTextNode(" or use the WhatsApp button."));
    status.classList.add("is-visible");

    window.setTimeout(() => {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
      form.classList.remove("is-submitted");
    }, 1800);
  });
});
