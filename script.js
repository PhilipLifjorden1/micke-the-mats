// 1) Footer year (safe)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 2) Reveal animations
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => observer.observe(el));

// 3) Booking form -> send to API
const form = document.getElementById("bookingForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (statusEl) statusEl.textContent = "Skickar...";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (statusEl) statusEl.textContent = data.error || "Något gick fel. Testa igen.";
        alert(data.error || "Något gick fel. Försök igen.");
        return;
      }

      if (statusEl) statusEl.textContent = "Tack! Förfrågan skickad ✅";
      alert("Tack! Vi hör av oss inom kort 🎶");
      form.reset();
    } catch (err) {
      if (statusEl) statusEl.textContent = "Nätverksfel. Testa igen.";
      alert("Nätverksfel. Testa igen.");
    }
  });
}