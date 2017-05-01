function removeImage(imageId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/users/remove-image');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Remove request sent.');
  };
  xhr.send('imageId=' + imageId);
  $('#'+imageId).remove();
  $('.remove-btn').prop('disabled', true);
  
  setTimeout(function() {
    $('.remove-btn').prop('disabled', false);
  }, 1000);
}
