document.addEventListener("DOMContentLoaded", function() {
  const thumbnailsContainer = document.getElementById('thumbnails');
  
  // URL naar de GitHub API die de inhoud van de 'images' map haalt
  const apiUrl = 'https://api.github.com/repos/WnnsSchdts/OwnPhotographyWebsite/contents/images';
  
  // Functie om een map te doorlopen
  function fetchImagesFromFolder(folderUrl) {
    fetch(folderUrl)
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          if (item.type === 'file' && (item.name.endsWith('.jpg') || item.name.endsWith('.png'))) {
            // Voeg de afbeelding toe aan de thumbnails
            const article = document.createElement('article');
            
            // Maak de thumbnail
            const anchor = document.createElement('a');
            anchor.classList.add('thumbnail');
            anchor.href = item.download_url;  // Gebruik de download URL van het volledige bestand
            
            // Voeg de afbeelding toe
            const img = document.createElement('img');
            img.src = item.download_url;  // Gebruik de download URL voor de afbeelding
            anchor.appendChild(img);
            
            // Voeg een titel en beschrijving toe
            const h2 = document.createElement('h2');
            h2.textContent = item.name;
            
            const p = document.createElement('p');
            p.textContent = "Beschrijving van het bestand";  // Beschrijving kan aangepast worden
            
            article.appendChild(anchor);
            article.appendChild(h2);
            article.appendChild(p);
            thumbnailsContainer.appendChild(article);
          }
          
          // Als het item een map is, moet je deze map doorlopen
          if (item.type === 'dir') {
            fetchImagesFromFolder(item.url);  // Roep de functie opnieuw aan voor submappen
          }
        });
      })
      .catch(error => {
        console.error('Er is een fout opgetreden:', error);
      });
  }
  
  // Roep de functie aan voor de hoofdmap 'images'
  fetchImagesFromFolder(apiUrl);
});
