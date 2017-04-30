$(document).ready(function(){
  // Detect broken images and replace with default placeholder.
 $("img").bind("error",function(){
  // Replacing image source
  $(this).attr("src","/assets/images/placeholder.png");
 });
 
 // Refresh the masonry layout every 1 second.
  setInterval(function() {
    // Masonry Setup
    $('.grid').masonry({
      // options
      itemSelector: '.grid-item',
      columnWidth: 200
    });
  }, 1000);
});
