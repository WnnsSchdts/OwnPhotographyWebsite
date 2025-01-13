<?php
// Pad naar de 'fulls' map
$directory = "images/EindwerkToegepastefotografie/fulls/";

// Verkrijg alle jpg-afbeeldingen in de map
$images = glob($directory . "*.jpg");

// Verkrijg het aantal afbeeldingen
$imageCount = count($images);

// Return de lijst van afbeeldingsbestanden als JSON
echo json_encode($images);
?>
