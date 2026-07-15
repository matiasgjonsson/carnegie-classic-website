document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', () => {
        const bio = button.previousElementSibling;
        bio.classList.toggle('expanded');
        button.classList.toggle('hide-more');
    });
});
