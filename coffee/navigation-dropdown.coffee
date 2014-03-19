jQuery ->

  $(document).mouseup (e) ->
    dropdown_container = $('.with-dropdown')
    if not dropdown_container.is(e.target) and dropdown_container.has(e.target).length is 0
      dropdown_container.removeClass('opened')

  $(document).on 'touchstart click', '.with-dropdown', (e) ->
    e.preventDefault()

    $container = $(e.target).parent()

    $container.siblings('.with-dropdown').removeClass 'opened'
    $container.toggleClass 'opened'


  $(document).on 'touchstart click', '.with-dropdown > ul.dropdown', (e) ->
    e.stopPropagation()
