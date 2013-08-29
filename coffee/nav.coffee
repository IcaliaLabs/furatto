(($, window) ->
  "use strict"

  class Nav
    constructor: (el, options) ->
      @options = $.extend {}, options
      @$el = $(el)

    slide: ->
      @$el.next('ul').slideToggle()

  $.fn.nav = (option) ->
    @each ->
      $this = $(this)
      data = $this.data('Nav')

      if not data
        $this.data 'Nav', (data = new Nav(this, {}))
      if typeof option is 'string'
        data[option]()

  $(document).on 'click', '[data-toggle="nav"]', (e) ->
    $(this).nav('slide')
    e.preventDefault()
  
) window.jQuery, window
