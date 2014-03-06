jQuery(function() {
  $('.with-dropdown').on('touchstart click', function(e) {
    e.preventDefault();
    return $(this).toggleClass('opened');
  });
  return $('.with-dropdown').mouseenter(function(e) {
    $('.with-dropdown .dropdown li a').click(function(e) {
      return e.stopPropagation();
    });
    return $(this).addClass('opened');
  }).mouseleave(function() {
    return $(this).removeClass('opened');
  });
});
