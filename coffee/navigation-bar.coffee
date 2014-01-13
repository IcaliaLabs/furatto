(($, window, document) ->
  "use strict"

  pluginName = 'responsiveNavBar'

  class ResponsiveNavBar
    constructor: (@el, a, options) ->
      #navbar elements
      @navbarElements = $('.navigation-bar ul:not(.brand-section)')
      #jquery wrapper
      @$el = $(@el)

      @_initEvents()


    _initEvents: =>
      $('.navigation-bar .menu-toggle').on 'touchstart click', (e) =>
        e.preventDefault()
        @toggleNavbar()

    toggleNavbar: =>
      @$el.toggleClass 'opened'

    openNavbar: =>
      @$el.addClass 'opened'

    closeNavbar: =>
      @$el.removeClass 'opened'


  $.fn[pluginName] = (a, options) ->
    [_, args...] = arguments
    @each ->
      plugin = $.data @, "plugin_#{pluginName}"

      unless plugin
        $.data @, "plugin_#{pluginName}", new ResponsiveNavBar(@, a, options)
      else if plugin[_]? and $.type(plugin[_]) == 'function'
        plugin[_].apply plugin, args

) jQuery, window, document
