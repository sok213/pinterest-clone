// Refresh the masonry layout every 1 second.
setInterval(function() {
 // Masonry Setup
 $('.grid').masonry({
   // options
   itemSelector: '.grid-item',
   columnWidth: 200
 });
}, 1000);

// Detect broken images and replace with default placeholder.
function imgError(image) {
  image.onerror = "";
  image.src = "/assets/images/placeholder.png";
  return true;
}