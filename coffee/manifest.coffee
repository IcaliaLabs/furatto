jQuery ->

  #Closing buttons
  $('.close').each ->
    $(@).click (e) ->
      e.preventDefault()
      $(@).parent().fadeOut()

  #Tooltips
  $("[data-toggle=tooltip]").tooltip()

  #Datepicker
  $("[data-datepicker]").each ->
    input = $(@)
    input.pickadate
      selectYears: input.data('select-years') || false
      selectMonths: input.data('select-months') || false

  swiper = new Swiper('.swiper-container',
    pagination: '.swiper-pagination'
    mode: 'horizontal'
    loop: true
    calculateHeight: true
    grabCursor: true
    paginationClickable: true
    speed: 600
  )

  $('.swiper-control.left').on 'click', (e) ->
    e.preventDefault()
    swiper.swipePrev()

  $('.swiper-control.right').on 'click', (e) ->
    e.preventDefault()
    swiper.swipeNext()

  $('.navbar [data-furatto="search"]').each ->
    current_width = $(@).width()
    $(@).focus ->
      $(@).animate({ width: current_width + 20}, 'slow')
    $(@).blur ->
      $(@).animate({ width: current_width }, 'slow')

  #if $(window).width() > 979
    #setTimeout (->
      #$('.navbar').animate({"opacity":1}, 1000)
    #), 800
  #else
    #$('.navbar').css
      #"opacity":1
