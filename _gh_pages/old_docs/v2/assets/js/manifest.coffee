jQuery ->

  #Pagination Demo
  $(".pagination a").click (e) ->
    e.preventDefault()
    if (!$(this).parent().hasClass("previous") && !$(this).parent().hasClass("next"))
      $(this).parent().siblings("li").removeClass("active")
      $(this).parent().addClass("active")

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

  $(".rslides").responsiveSlides
    auto: true
    pager: true
    nav: true
    speed: 500
    namespace: "centered-btns"

  $('#js-show-left-navbar').click (e) ->
    $('.vrt-navbar').toggleClass 'hide'
    $('.navbar:first').toggleClass 'hide'
    false

  $('.navbar [data-furatto="search"]').each ->
    current_width = $(@).width()
    $(@).focus ->
      $(@).animate({ width: current_width + 20}, 'slow')
    $(@).blur ->
      $(@).animate({ width: current_width }, 'slow')
