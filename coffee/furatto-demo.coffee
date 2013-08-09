jQuery ->

  #Pagination Demo
  $(".pagination a").click (e) ->
    e.preventDefault()
    if (!$(this).parent().hasClass("previous") && !$(this).parent().hasClass("next"))
      $(this).parent().siblings("li").removeClass("active")
      $(this).parent().addClass("active")

  #Toggle navbars
  $('#js-show-left-navbar').click (e) ->
    $('.vrt-navbar').toggleClass 'hide'
    $('.navbar:first').toggleClass 'hide'
    false
