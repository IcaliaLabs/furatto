jQuery ->

  #Pagination Demo
  $(".pagination a").click (e) ->
    e.preventDefault()
    if (!$(this).parent().hasClass("previous") && !$(this).parent().hasClass("next"))
      $(this).parent().siblings("li").removeClass("active")
      $(this).parent().addClass("active")
  
  $('.panel-content').scroll ->
    sidebar = $('.docs-sidebar')
    if $(window).width() > 767
      if $('.panel-content').scrollTop() >= 320
        sidebar.addClass("affix")
      if $('.panel-content').scrollTop() < 320
        sidebar.removeClass("affix")
