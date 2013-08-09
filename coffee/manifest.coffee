jQuery ->

  #Closing buttons
  $('.close').each ->
    $(@).click (e) ->
      e.preventDefault()
      $(@).parent().fadeOut()

  #Tooltips
  $("[data-toggle=tooltip]").tooltip()

  #Tags
  $("[data-tags]").tagsInput()

  #Datepicker
  $("[data-datepicker]").each ->
    input = $(@)
    input.pickadate
      selectYears: input.data('select-years') || false
      selectMonths: input.data('select-months') || false

  $("[data-furatto='slider']").responsiveSlides
    auto: true
    pager: true
    nav: true
    speed: 500
    namespace: "centered-btns"

  $('.navbar [data-furatto="search"]').each ->
    current_width = $(@).width()
    $(@).focus ->
      $(@).animate({ width: current_width + 20}, 'slow')
    $(@).blur ->
      $(@).animate({ width: current_width }, 'slow')
