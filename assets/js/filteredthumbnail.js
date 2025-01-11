document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const imageFolder = 'https://raw.githubusercontent.com/WnnsSchdts/OwnPhotographyWebsite/main/images/';

    // Functie om de mappen uit een txt-bestand te lezen
    function getFolders() {
        return fetch('https://raw.githubusercontent.com/WnnsSchdts/OwnPhotographyWebsite/main/folders.txt')
            .then(response => response.text())
            .then(data => {
                // Splits de tekst in een array van mappen (verwijder lege regels)
                const folders = data.split('\n').map(folder => folder.trim()).filter(folder => folder.length > 0);
                return folders;
            })
            .catch(error => {
                console.error('Error fetching folders.txt:', error);
                return [];
            });
    }

    // Functie om de bestanden in een submap op GitHub te verkrijgen via de GitHub API
    function getImagesFromGitHub(category) {
        const apiUrl = `https://api.github.com/repos/WnnsSchdts/OwnPhotographyWebsite/contents/images/${category}`;

        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const images = data.filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png'))
                                   .map(file => file.name);
                return images;
            })
            .catch(error => {
                console.error('Error fetching images from GitHub:', error);
                return [];
            });
    }

    // Functie om afbeeldingen te laden voor de geselecteerde categorie
    function loadImages(category) {
        thumbnailsContainer.innerHTML = ''; // Leeg de thumbnails-container

        getImagesFromGitHub(category).then(images => {
            if (images.length > 0) {
                images.forEach(imageName => {
                    const imageUrl = imageFolder + category + '/' + imageName;
                    const article = document.createElement('article');
                    article.innerHTML = `
                        <a class="thumbnail" href="${imageUrl}">
                            <img src="${imageUrl}" alt="${imageName}">
                        </a>
                        <h2>${imageName}</h2>
                        <p>Beschrijving van ${imageName}</p>
                    `;
                    thumbnailsContainer.appendChild(article);
                });
            } else {
                thumbnailsContainer.innerHTML = '<p>Geen afbeeldingen gevonden voor deze categorie.</p>';
            }
        });
    }

    // Functie om dynamisch knoppen toe te voegen op basis van de geladen submappen
    function loadCategoryButtons() {
        getFolders().then(folders => {
            const categoryList = document.querySelector('#work-list ul');
            folders.forEach(folder => {
                const button = document.createElement('button');
                button.classList.add('filter-btn');
                button.setAttribute('data-category', folder);
                button.textContent = folder; // De naam van de map als de tekst van de knop
                button.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    loadImages(category); // Laad de afbeeldingen van de geselecteerde categorie
                });

                const listItem = document.createElement('li');
                listItem.appendChild(button);
                categoryList.appendChild(listItem);
            });

            // Laad standaard de eerste categorie
            if (folders.length > 0) {
                loadImages(folders[0]);
            }
        });
    }

    // Laad de knoppen en afbeeldingen
    loadCategoryButtons();
});

