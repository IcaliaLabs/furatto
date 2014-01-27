(($, window, document) ->

  #sets the plugin name
  pluginName = 'tabu'

  defaults =
    startIndex: 0
    tabContentClass: 'tabu-content'
    tabContentsClass: 'content'

  class Furatto.Tabu
    constructor: (@el, options) ->
      #jquery element
      @$el = $(@el)

      #merges options
      @options = $.extend defaults, options, @$el.data()

      @tabItems = @$el.find('li')
      @tabItemsLength = @tabItems.length

      # we don't want to assume somehitng, so we look for content class
      # elements
      @tabContents = @$el.next(".#{@options.tabContentClass}").find(">.#{@options.tabContentsClass}")

      # prevents when an index is bigger than the tab elements you have
      @_preventsIndexOutofBounds()

      #initial configuration
      @_setActiveElements()

      #binds the touchstart and click events
      @_toggle()


    _preventsIndexOutofBounds: =>
      @options.startIndex = (@tabItemsLength - 1) if @options.startIndex >= @tabItemsLength

    _setActiveElements: =>
      $(@tabItems[@options.startIndex]).addClass 'active'
      $(@tabContents[@options.startIndex]).addClass 'active'

    _toggle: =>
      weakSelf = @
      @tabItems.on 'touchstart click', (event) ->
        event.preventDefault()
        weakSelf.tabItems.removeClass('active')
        $(this).addClass 'active'

        weakSelf.tabContents.removeClass('active')
        id = $(this).find('a').attr('href')
        $(id).addClass 'active'

  $.fn[pluginName] = (options) ->
    tabsLength = this.length
    [_, args...] = arguments
    @each (index) ->
      me = $(@)
      plugin = $.data @, "plugin_#{pluginName}"

      unless plugin
        key = "tabu#{if tabsLength > 1 then '-' + ++index else ''}"
        instance = new Furatto.Tabu(@, options)
        me.data(key, instance).data('key', key)
      else if plugin[_]? and $.type(plugin[_]) == 'function'
        plugin[_].apply plugin, args

  Furatto.Tabu.version = "1.0.0"

  $(document).ready ->
    $('[data-tabu]').each ->
      $(@).tabu()


) $, window, document
