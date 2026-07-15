const container = document.querySelector('.table-wrapper');

function updateScrollFadeClasses() {
  const scrollLeft = container.scrollLeft;
  const scrollRight = container.scrollWidth - container.clientWidth - scrollLeft;

  container.classList.toggle('scrolled-start', scrollLeft === 0);
  container.classList.toggle('scrolled-end', scrollRight <= 1); // small buffer for rounding
}

// Update on scroll and resize
container.addEventListener('scroll', updateScrollFadeClasses);
window.addEventListener('resize', updateScrollFadeClasses);

// Run once on load
updateScrollFadeClasses();