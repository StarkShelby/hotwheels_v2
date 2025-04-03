document.addEventListener("DOMContentLoaded", () => {
  const myCollectionNav = document.getElementById("mycollection-navbar");

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-collection")) {
      const card = event.target.closest(".car-card");
      if (!card || !myCollectionNav) return;

      // Clone the card for animation
      const clone = card.cloneNode(true);
      document.body.appendChild(clone);
      clone.style.position = "fixed";
      clone.style.zIndex = "1000";
      clone.style.pointerEvents = "none"; // Prevent interaction

      // Get card & nav positions
      const cardRect = card.getBoundingClientRect();
      const navRect = myCollectionNav.getBoundingClientRect();

      // Position clone over original
      clone.style.top = `${cardRect.top}px`;
      clone.style.left = `${cardRect.left}px`;
      clone.style.width = `${cardRect.width}px`;
      clone.style.height = `${cardRect.height}px`;
      clone.style.transition =
        "transform 0.8s ease-in-out, opacity 0.8s ease-in-out";

      // Small delay before animation starts
      setTimeout(() => {
        clone.style.transform = `translate(${navRect.left - cardRect.left}px, ${
          navRect.top - cardRect.top
        }px) rotate(30deg) scale(0.5)`;
        clone.style.opacity = "0.2";
      }, 50);

      // Remove the clone after animation
      setTimeout(() => {
        clone.remove();
      }, 900);
    }
  });
});

function createDustEffect(element) {
  const rect = element.getBoundingClientRect(); // Get position of the card
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  let particles = [];
  const numParticles = 100; // Number of small dust particles

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height,
      size: Math.random() * 5 + 2, // Random small size
      speedX: (Math.random() - 0.5) * 8, // Move randomly left-right
      speedY: (Math.random() - 0.5) * 8, // Move randomly up-down
      alpha: 1, // Opacity
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha -= 0.02; // Slowly disappear

      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`; // White dust
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.alpha <= 0) particles.splice(i, 1); // Remove faded particles
    });

    if (particles.length > 0) {
      requestAnimationFrame(animateParticles);
    } else {
      canvas.remove(); // Remove canvas after effect finishes
    }
  }

  animateParticles();
}
