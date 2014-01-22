(($, window, document) ->
  "use strict"

  #set the plugin name
  pluginName = 'suraido'

  defaults =
    speed: 500
    delay: 3000
    init: 0
    pause: false
    loop: false
    keys: false
    dots: false
    arrows: false
    prev: '<<'
    next: '>>'
    fluid: false
    starting: false
    completed: false
    easing: 'swing'
    autoplay: false

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


      #set the main element
      @$el.css(
        width: @maxSize.width
        height: @items.first().outerHeight()
        overflow: 'hidden'
      )

      #Set relative widths
      @itemsWrapper.css(
        position: "relative"
        left: 0
        width: "#{@itemsLength * 100}%"
      )

      @items.css(
        float: 'left'
        width: "#{(100 / @itemsLength)}%"
      )

      #autoslide
      if @options.autoplay
        setTimeout(=>
          if @options.delay | 0
            @play()

            if @options.pause
              @$el.on 'mouseover, mouseout', (event) =>
                @stop()
                event.type is 'mouseout' && @play()
        , @options.init | 0)

      #keypresses
      if @options.keys
        $(document).keydown (event) =>
          key = event.which
          if key is 37
            @prev()
          else if key is 39
            @next()
          else if key is 27
            @stop()

      @options.dots and @_createPagination('dot')
      @options.arrows and @_createPagination('arrow')

      if @options.fluid
        $(window).resize(=>
         @r and clearTimeout(@r)

         @r = setTimeout( =>
           style =
             height: @items.eq(@currentItemIndex).outerHeight()
           width = @$el.outerWidth()

           @itemsWrapper.css style
           style['width'] = "#{Math.min(Math.round((width / @$el.parent().width()) * 100), 100)}%"
           @$el.css style
           , 50)
        ).resize()

      if $.event.special['swipe'] or $.Event 'swipe'
        @$el.on 'swipeleft swiperight swipeLeft swipeRight', (e) =>
         if e.type.toLowerCase() is 'swipeleft' then @next() else @prev()

    _createPagination: (name, html) =>
      if name is 'dot'
        html = "<ol class='dots'>"
        $.each @items, (index) =>
          html += "<li class='#{if index == @currentItemIndex then name + ' active' else name}'> #{++index}</li>"
        html += "</ol>"
      else
        html = "<div class=\""
        html = html + name + "s\">" + html + name + " prev\">" + @options.prev + "</div>" + html + name + " next\">" + @options.next + "</div></div>"

      weakSelf = @
      @$el.addClass("has-#{name}s").append(html).find(".#{name}").click ->
        me = $(@)
        if me.hasClass('dot') then weakSelf.stop().to(me.index()) else if me.hasClass('prev') then weakSelf.prev() else weakSelf.next()

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
        height: target.outerHeight()

      if not @itemsWrapper.queue('fx').length
        @$el.find('.dot').eq(index).addClass('active').siblings().removeClass('active')
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
