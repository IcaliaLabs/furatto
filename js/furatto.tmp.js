window.Furatto = {
  name: 'Furatto',
  version: '1.0.0'
};

$('.alert .close').each(function() {
  return $(this).click(function(e) {
    e.preventDefault();
    return $(this).parent().fadeOut();
  });
});
