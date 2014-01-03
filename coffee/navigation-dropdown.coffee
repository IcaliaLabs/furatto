jQuery ->
  $('.with-dropdown').click (e) ->
    e.preventDefault()
    $(@).toggleClass 'opened'
