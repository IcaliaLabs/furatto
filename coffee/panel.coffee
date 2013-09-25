(($, window) ->
  "use strict"

  class Panel
    @DEFAULTS = {
      element: null,
      dragger: null,
      disable: 'right',
      addBodyClasses: true,
      hyperextensible: true,
      resistance: 0.5,
      flickThreshold: 50,
      transitionSpeed: 0.3,
      easing: 'ease',
      maxPosition: 266,
      minPosition: -266,
      tapToClose: true,
      touchToDrag: false,
      slideIntent: 40,
      minDragDistance: 5
    }

    constructor: (el, options) ->
      @options = $.extend options, { element: el }
      @menu = $($('[data-toggle="panel"]').data('target'))
      @append_menu_to_panel()
      @snapper = new Snap @options

    apply_ios_devices_fix: ->
      if navigator.userAgent.match(/(iPad|iPhone|iPod)/g)
        $('.panel-content').css 'overflow':'visible'

    append_menu_to_panel: ->
      $('.panel-left').html(@menu.html())

    toggle: ->
      $('.panel').css 'display', 'block'
      if( @snapper.state().state == "left" )
        @snapper.close()
      else
        @snapper.open('left')

  $.fn.panel = (option) ->
    @each ->
      $this = $(this)
      data = $this.data('Panel')
      options = $.extend {}, Panel.DEFAULTS, $this.data(), typeof option is 'object' and option

      if not data
        $this.data 'Panel', ( data = new Panel(this, options) )
      if typeof option is 'string'
        data[option]()

  $(document).on 'click', '[data-toggle="panel"]', (e) ->
    e.preventDefault()
    $('.panel-content').panel 'toggle'

  $(document).ready ->
    $('.panel-content').panel 'apply_ios_devices_fix'

) window.jQuery, window
