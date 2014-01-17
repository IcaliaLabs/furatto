jQuery ->
  $('.with-dropdown').on 'touchstart click', (e) ->
    e.preventDefault()
    $(@).toggleClass 'opened'

  $('.with-dropdown').hover(->
      $(@).addClass 'opened'
  , ->
      $(@).removeClass 'opened'
  )
