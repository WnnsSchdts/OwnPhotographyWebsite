// De maplocaties
const folderFulls = "images/EindwerkToegepastefotografie/fulls/";
const folderThumbs = "images/EindwerkToegepastefotografie/thumbs/";

// Selecteer de thumbnails-container
const thumbnailsContainer = document.getElementById("thumbnails_indiansummer");

// Haal de lijst van afbeeldingen op van de server
fetch('get_images_indiansummer.php')
  .then(response => response.json()) // Zet de JSON om naar een JavaScript-array
  .then(images => {
      // Voor elke afbeelding in de lijst
      images.forEach((imagePath, index) => {
          // Extract alleen de bestandsnaam van het pad
          const fileName = imagePath.split('/').pop(); // Haal alleen de bestandsnaam

          // Maak een nieuw artikel-element voor de thumbnail
          const article = document.createElement("article");
          const link = document.createElement("a");
          link.className = "thumbnail";
          link.href = `${folderFulls}${fileName}`;

          const image = document.createElement("img");
          image.src = `${folderThumbs}${fileName}`;
          image.alt = `Image ${index + 1}`; // Gebruik een dynamisch nummer voor de alt-tekst

          // Voeg de afbeelding toe aan de link, en het artikel toe aan de container
          link.appendChild(image);
          article.appendChild(link);
          thumbnailsContainer.appendChild(article);
      });
  })
  .catch(error => console.log('Error loading images:', error));

