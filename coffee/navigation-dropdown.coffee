jQuery ->
  $('.with-dropdown').on 'click', (e) ->
    e.preventDefault()
    $(@).toggleClass 'opened'

  $('.with-dropdown').hover(->
      $(@).addClass 'opened'
  , ->
      $(@).removeClass 'opened'
  )
