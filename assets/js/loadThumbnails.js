document.addEventListener("DOMContentLoaded", function() {
  const thumbnailsContainer = document.getElementById('thumbnails');
  
  // URL naar de GitHub API die de inhoud van de 'images' map haalt
  const apiUrl = 'https://api.github.com/repos/WnnsSchdts/OwnPhotographyWebsite/contents/images';
  
  // Haal de inhoud van de map op
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Filter de data op afbeeldingen (bijvoorbeeld jpg, png)
      data.forEach(item => {
        if (item.type === 'file' && (item.name.endsWith('.jpg') || item.name.endsWith('.png'))) {
          const article = document.createElement('article');
          
          // Maak de thumbnail
          const anchor = document.createElement('a');
          anchor.classList.add('thumbnail');
          anchor.href = item.download_url;  // Gebruik de download URL van het volledige bestand
          
          // Voeg de afbeelding toe
          const img = document.createElement('img');
          img.src = item.download_url;  // Gebruik de download URL voor de afbeelding
          anchor.appendChild(img);
          
          // Voeg een titel en beschrijving toe (je kunt deze uit metadata halen als je wilt)
          const h2 = document.createElement('h2');
          h2.textContent = item.name;  // Je kunt hier ook andere metadata gebruiken
          
          const p = document.createElement('p');
          p.textContent = "Beschrijving van het bestand";  // Beschrijving kan ook uit metadata komen
          
          article.appendChild(anchor);
          article.appendChild(h2);
          article.appendChild(p);
          thumbnailsContainer.appendChild(article);
        }
      });
    })
    .catch(error => {
      console.error('Er is een fout opgetreden:', error);
    });
});
