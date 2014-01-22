(($, window, document) ->
  "use strict"

  #set the plugin name
  pluginName = 'suraido'

  defaults =
    speed: 500
    delay: 3000
    pause: false
    loop: false
    enableKeys: false
    enableDots: false
    enableArrows: false
    prev: '<<'
    next: '>>'
    fluid: false
    starting: false
    completed: false
    easing: 'swing'
    autoplay: false
    paginationClass: 'pagination'
    paginationItemClass: 'dot'
    arrowsClass: 'arrows'
    arrowClass: 'arrow'

  class Suraido
    constructor: (@el, options) ->
      #jquery element wrapper
      @$el = $(@el)

      #merges options
      @options = $.extend {}, defaults, options

      #slider items wrapper
      @itemsWrapper = @$el.find('>ul')

      #max slider size 
      @maxSize =
        width: @$el.outerWidth() | 0
        height: @$el.outerHeight() | 0

      #items definition
      weakSelf = @
      @items = $(@itemsWrapper).find('>li').each (index) ->
        $this = $(@)
        width = $this.outerWidth()
        height = $this.outerHeight()

        weakSelf.maxSize.width = width if width > weakSelf.maxSize.width
        weakSelf.maxSize.height = height if height > weakSelf.maxSize.height

      #items on the wrapper
      @itemsLength = @items.length

      #current item position
      @currentItemIndex = 0

      #fix for alpha on captions
      @items.find('.caption').css(width: "#{100 / @itemsLength}%")

      #set the main element
      @_setsMainElement()

      #Set relative widths
      @itemsWrapper.css(
        position: "relative"
        left: 0
        width: "#{@itemsLength * 100}%"
      )

      #sets the styling for each slider item
      @_setsItems()

      #autoslide
      @_enablesAutoPlay() if @options.autoplay

      #keypresses binding
      @_enableBindKeys() if @options.enableKeys

      @options.enableDots and @_createPagination()
      @options.enableArrows and @_createArrows()

      #fluid behavior for responsive layouts
      @_enablesFluidBehavior() if @options.fluid

      #chrome fix
      if window.chrome
        @items.css 'background-size', '100% 100%'

      if $.event.special['swipe'] or $.Event 'swipe'
        @$el.on 'swipeleft swiperight swipeLeft swipeRight', (e) =>
         if e.type.toLowerCase() is 'swipeleft' then @next() else @prev()

    _setsItems: =>
      @items.css
        float: 'left'
        width: "#{100 / @itemsLength}%"

    _setsMainElement: =>
      @$el.css
        width: @maxSize.width
        height: @items.first().outerHeight()
        overflow: 'hidden'

    _enablesAutoPlay: =>
      setTimeout(=>
         if @options.delay | 0
           @play()

           if @options.pause
             @$el.on 'mouseover, mouseout', (event) =>
               @stop()
               event.type is 'mouseout' && @play()
      , @options.autoPlayDelay | 0)

    _enablesFluidBehavior: =>
      $(window).resize(=>
        @resize and clearTimeout(@resize)

        @resize = setTimeout(=>
          style =
            height: @items.eq(@currentItemIndex).outerHeight() + 30
          width = @$el.outerWidth()

          @itemsWrapper.css style
          style['width'] = "#{Math.min(Math.round((width / @$el.parent().width()) * 100), 100)}%"
          @$el.css style
          , 50)
      ).resize()

    _enableBindKeys: =>
      $(document).on 'keydown', (event) =>
        switch event.which
          when 37 then @prev()
          when 39 then @next()
          when 27 || 32 then @stop()

    _createPagination: =>
        html = "<ol class='#{@options.paginationClass}'>"
        $.each @items, (index) =>
          html += "<li class='#{if index == @currentItemIndex then @options.paginationItemClass + ' active' else @options.paginationItemClass}'> #{++index}</li>"
        html += "</ol>"

        @_bindPagination(@options.paginationClass, @options.paginationItemClass, html)

    _createArrows: =>
        html = "<div class=\""
        html = html + @options.arrowsClass + "\">" + html + @options.arrowClass + " prev\">" + @options.prev + "</div>" + html + @options.arrowClass + " next\">" + @options.next + "</div></div>"

        @_bindPagination(@options.arrowsClass, @options.arrowClass, html)

    _bindPagination: (className, itemClassName, html) ->
      weakSelf = @
      @$el.addClass("has-#{className}").append(html).find(".#{itemClassName}").click ->
        $this = $(@)
        if $this.hasClass(weakSelf.options.paginationItemClass)
          weakSelf.stop().to($this.index())
        else if $this.hasClass('prev') then weakSelf.prev() else weakSelf.next()


    to: (index, callback) =>
      if @t
        @stop()
        @play()

      target = @items.eq(index)

      $.isFunction(@options.starting) and !callback and @options.starting @$el, @items.eq(@currentItemIndex)

      if not (target.length || index < 0) and @options.loop is false
        return
      if index < 0
        index = @items.length - 1

      speed = if callback then 5 else @options.speed | 0
      easing = @options.easing
      obj =
        height: target.outerHeight() + 30

      if not @itemsWrapper.queue('fx').length
        @$el.find(".#{@options.paginationItemClass}").eq(index).addClass('active').siblings().removeClass('active')
        @$el.animate(obj, speed, easing) and @itemsWrapper.animate($.extend(
          left: "-#{index}00%", obj), speed, easing, (data) =>
            @currentItemIndex = index
            $.isFunction(@options.complete) and !callback and @options.complete(@el, target)
        
        )

    play: =>
      @t = setInterval( =>
        @to(@currentItemIndex + 1)
      , @options.delay | 0)

    stop: =>
      @t = clearInterval(@t)
      @
    
    next: =>
      if @currentItemIndex == (@itemsLength - 1)
        @stop().to(0)
      else
        @stop().to(@currentItemIndex + 1)

    prev: =>
      @stop().to(@currentItemIndex - 1)


  $.fn[pluginName] = (options) ->
    sliders = this.length
    [_, args...] = arguments
    @each (index) ->
      me = $(@)
      plugin = $.data @, "plugin_#{pluginName}"

      unless plugin
        key = "suraido#{if sliders > 1 then '-' + ++index else ''}"
        instance = new Suraido(@, options)
        me.data(key, instance).data('key', key)
      else if plugin[_]? and $.type(plugin[_]) == 'function'
        plugin[_].apply plugin, args

  Suraido.version = "1.0.0"

) $, window, document
