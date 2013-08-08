$(document).ready ->
  $('[data-furatto="toolbar"]').each ->
    $(@).toolbar
      content: $(@).data('content')
      position: $(@).data('position') || 'top'
      hideOnClick: true
