jQuery(function() {
  $(document).mouseup(function(e) {
    var dropdown_container;
    dropdown_container = $('.with-dropdown');
    if (!dropdown_container.is(e.target) && dropdown_container.has(e.target).length === 0) {
      return dropdown_container.removeClass('opened');
    }
  });
  $(document).on('touchstart click', '.with-dropdown', function(e) {
    var $container;
    e.preventDefault();
    $container = $(e.target).parent();
    $container.siblings('.with-dropdown').removeClass('opened');
    return $container.toggleClass('opened');
  });
  return $(document).on('touchstart click', '.with-dropdown > ul.dropdown', function(e) {
    return e.stopPropagation();
  });
});
