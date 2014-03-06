jQuery ->
  $('.with-dropdown').on 'touchstart click', (e) ->
    e.preventDefault()
    $(@).toggleClass 'opened'

  $('.with-dropdown').mouseenter((e) ->
    $('.with-dropdown .dropdown li a').click (e) ->
      e.stopPropagation()
    $(@).addClass 'opened'
  ).mouseleave(->
    $(@).removeClass 'opened'
  )
