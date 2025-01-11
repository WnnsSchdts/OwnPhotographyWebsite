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
          // Controleer of het bestand een afbeelding is (jpg of png)
          if (item.type === 'file' && (item.name.endsWith('.jpg') || item.name.endsWith('.png'))) {
            // Maak een nieuw article voor de thumbnail
            const article = document.createElement('article');
            
            // Maak de thumbnail link
            const anchor = document.createElement('a');
            anchor.classList.add('thumbnail');
            anchor.href = item.download_url;  // Gebruik de download URL van het volledige bestand
            anchor.setAttribute('data-position', 'left center');  // Dit attribuut kun je aanpassen zoals nodig
            
            // Voeg de afbeelding toe (let op dat we hier ook de download URL gebruiken)
            const img = document.createElement('img');
            img.src = item.download_url;  // Gebruik de download URL voor de afbeelding
            img.alt = item.name;  // Voeg een alt-tekst toe die de bestandsnaam is
            anchor.appendChild(img);
            
            // Voeg de titel toe (je kunt dit aanpassen naar andere metadata)
            const h2 = document.createElement('h2');
            h2.textContent = item.name;  // Gebruik de bestandsnaam voor de titel
            
            // Voeg een beschrijving toe (je kunt deze tekst aanpassen)
            const p = document.createElement('p');
            p.textContent = "Beschrijving van het bestand";  // Hier kun je metadata gebruiken of gewoon tekst
            
            // Voeg alles samen in het article
            article.appendChild(anchor);
            article.appendChild(h2);
            article.appendChild(p);
            
            // Voeg het article toe aan de container
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

