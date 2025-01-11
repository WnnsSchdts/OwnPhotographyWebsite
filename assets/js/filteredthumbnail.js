// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Stel de knoppen in voor interactie
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Zoek alle artikelen in de thumbnails sectie
            const thumbnails = document.querySelectorAll('.thumbnails article');
            
            // Verberg of toon de thumbnails op basis van de categorie
            thumbnails.forEach(thumb => {
                if (thumb.getAttribute('data-category') === category || category === 'all') {
                    thumb.style.display = 'block';
                } else {
                    thumb.style.display = 'none';
                }
            });
        });
    });
});
