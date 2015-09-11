window.Furatto =
  name: 'Furatto'
  version: '1.0.0'

$('.alert .close').each ->
  $(@).click (e) ->
    e.preventDefault()
    $(@).parent().fadeOut()
