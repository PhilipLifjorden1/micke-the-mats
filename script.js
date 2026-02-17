document.getElementById("year").textContent =
  new Date().getFullYear();

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:.15});

reveals.forEach(el => observer.observe(el));

const form = document.getElementById('bookingForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    alert('Tack! Vi hör av oss inom kort 🎶');
    form.reset();
  } else {
    alert('Något gick fel. Försök igen.');
  }
});