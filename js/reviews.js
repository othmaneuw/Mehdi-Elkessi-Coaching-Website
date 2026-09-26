const track = document.querySelector(".testimonials-track");
const cards = document.querySelectorAll(".testimonial-card");

const prevButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");

const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function getCardWidth() {
  if (!cards.length) return 0;

  const card = cards[0];
  const gap = 25;

  return card.offsetWidth + gap;
}

function updateCarousel(index) {
  if (!track || !cards.length) return;

  currentIndex = Math.max(0, Math.min(index, cards.length - 1));

  track.scrollTo({
    left: currentIndex * getCardWidth(),
    behavior: "smooth"
  });

//   dots.forEach((dot, i) => {
//     dot.classList.toggle("active", i === currentIndex);
//   });
}

nextButton.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    updateCarousel(currentIndex + 1);
  } else {
    updateCarousel(0);
  }
});

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    updateCarousel(currentIndex - 1);
  } else {
    updateCarousel(cards.length - 1);
  }
});

// dots.forEach((dot, index) => {
//   dot.addEventListener("click", () => {
//     updateCarousel(index);
//   });
// });