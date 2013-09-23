jQuery ->

  $('.panel-content').scroll ->
    sidebar = $('.docs-sidebar')
    if $(window).width() > 767
      if $('.panel-content').scrollTop() >= 320
        sidebar.addClass("affix")
      if $('.panel-content').scrollTop() < 320
        sidebar.removeClass("affix")
