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

  #Swiper configuration
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
