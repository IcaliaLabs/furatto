(($, window, document) ->
  "use strict"

  #Set plugin name
  pluginName = 'offScreen'

  defaults =
    type: 'overlap'
    levelSpacing: 40
    backClass: 'navigation-back'

  getLevelDepth = (level, id, waypoint, cnt = 0) ->
    return cnt if level.id.indexOf(id) >= 0
    if $(level).hasClass waypoint
      ++cnt

    return level.parentNode and getLevelDepth(level.parentNode, id, waypoint, cnt)

  #taken from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
  hasParent = (e, id) ->
    return false  unless e
    el = e.target or e.srcElement or e or false
    el = el.parentNode or false  while el and el.id isnt id
    el isnt false

  closest = (e, classname) ->
    if $(e).hasClass classname
      return e
    return e.parentNode and closest(e.parentNode, classname)


  isFromMobile = ->
    check = false
    ((a) ->
      check = true  if /(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) or /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    ) navigator.userAgent or navigator.vendor or window.opera
    check


  class OffScreen
    constructor: (@el, a, options) ->
      #merges options
      @options = $.extend {}, defaults, options
      #if the menu is open or not
      @open = false
      #level depth
      @level = 0
      # the moving wrapper
      @wrapper = document.getElementById('off-screen')
      # levels
      @levels = Array.prototype.slice.call( @el.querySelectorAll('div.off-screen-level'))
      # prepare the levels
      @_setLevels()
      # list items
      @menuItems = Array.prototype.slice.call(@el.querySelectorAll('li'))
      # back links
      @levelBack = Array.prototype.slice.call(@el.querySelectorAll('.navigation-back'))
      # event type depending on the access
      @eventType = if isFromMobile() then 'touchstart' else 'click'
      # sets the offscreen type behavior
      $(@el).addClass "off-screen-#{@options.type}"
      #trigger menu element
      @trigger = $('#trigger')

      #bind events
      @_bindEvents()
      @_shouldPreventOffScreenMenuFromOpening()

    _setLevels: ->
      for level in @levels
        level.setAttribute('data-level', getLevelDepth(level, @el.id, 'off-screen-level'))

    _shouldPreventOffScreenMenuFromOpening: =>
      @trigger.unbind(@eventType) if $(window).width() > 768
      $(window).resize =>
        if $(window).width() > 768
          @trigger.unbind(@eventType, @resetMenu)
        else
          @trigger.bind @eventType, (event) =>
            event.stopPropagation()
            event.preventDefault()
            if @open
              @resetMenu()
            else
              @openMenu()
              document.addEventListener @eventType, (event) =>
                if @open and not hasParent(event.target, @el.id)
                  bodyClickBinding document

    _bindEvents: =>

      bodyClickBinding = (el) =>
        @resetMenu()
        el.removeEventListener @eventType, bodyClickBinding

      @trigger.bind @eventType, (event) =>
        event.stopPropagation()
        event.preventDefault()
        if @open
          @resetMenu()
        else
          @openMenu()
          document.addEventListener @eventType, (event) =>
            if @open and not hasParent(event.target, @el.id)
              bodyClickBinding document


      @_setupMenuItems()
      @_setupLevelsClosing()
      @_setupLevelBack()

    _setupMenuItems: =>
      @menuItems.forEach (el, i) =>
        subLevel = el.querySelector('div.off-screen-level')
        if subLevel
          el.querySelector('a').addEventListener @eventType, (event) =>
            event.preventDefault()
            level = closest(el, 'off-screen-level').getAttribute('data-level')
            if @level <= level
              event.stopPropagation()
              $(closest(el, 'off-screen-level')).addClass 'off-screen-level-overlay'
              @openMenu subLevel

    _hideOnEsc: (event) =>
      @resetMenu() if event.keyCode is 27

    _setupLevelsClosing: =>
      for levelEl in @levels
        levelEl.addEventListener @eventType, (event) ->
          event.stopPropagation()
          level = levelEl.getAttribute 'data-level'
          if @level > level
            @level = level
            @_closeMenu()

    _setupLevelBack: =>
      @levelBack.forEach (el, i) =>
        el.addEventListener @eventType, (event) =>
          event.preventDefault()
          level = closest(el, 'off-screen-level').getAttribute('data-level')
          if @level <= level
            event.stopPropagation()
            @level = closest(el, 'off-screen-level').getAttribute('data-level') - 1
            if @level is 0 then @resetMenu() else @_closeMenu()


    #resets the menu
    resetMenu: =>
      @_setTransform('translate3d(0,0,0)')
      @level = 0
      # remove class off-screen-pushed from main wrapper
      $(@wrapper).removeClass 'off-screen-pushed'
      @_toggleLevels()
      @open = false
      $(document).unbind 'keyup', @_hideOnEsc

    _closeMenu: =>
      translateVal = if @options.type is 'overlap' then @el.offsetWidth + (@level - 1) * @options.levelSpacing else @el.offsetWidth
      @_setTransform("translate3d(#{translateVal}px, 0, 0")
      @_toggleLevels()

    #opens the menu
    openMenu: (subLevel) =>
      ++@level

      levelFactor = (@level - 1) * @options.levelSpacing
      translateVal = if @options.type is 'overlap' then (@el.offsetWidth + levelFactor) else @el.offsetWidth

      @_setTransform('translate3d(' + translateVal + 'px,0,0)')

      if subLevel
        @_setTransform '', subLevel

        for level in @levels
          if level isnt subLevel and !$(level).hasClass 'off-screen-level-open'
            @_setTransform "translate3d(-100%, 0, 0) translate3d(#{ -1*levelFactor}px, 0, 0)", $(level)
        
      if @level is 1
        $(@wrapper).addClass 'off-screen-pushed'
        @open = true

      if subLevel
        $(subLevel).addClass 'off-screen-level-open'
      else
        $(@levels[0]).addClass 'off-screen-level-open'

      $(document).bind 'keyup', @_hideOnEsc


    _toggleLevels: ->
      for level in @levels
        if level.getAttribute('data-level') >= @level + 1
          $(level).removeClass 'off-screen-level-open'
          $(level).removeClass 'off-screen-level-overlay'
        else if Number level.getAttribute('data-level') is @level
          $(level).removeClass 'off-screen-level-overlay'


    _setTransform: (value, element = @wrapper) ->
      $(element).css(
        '-webkit-transform': value
        '-moz-transform': value
        '-o-transform': value
        'transform': value
      )


  $.fn[pluginName] = (a, options) ->
    [_, args...] = arguments
    @each ->
      plugin = $.data @, "plugin_#{pluginName}"

      unless plugin
        $.data @, "plugin_#{pluginName}", new OffScreen(@, a, options)
      else if plugin[_]? and $.type(plugin[_]) == 'function'
        plugin[_].apply plugin, args

  $('.off-screen-navigation').offScreen()
  OffScreen.version = "1.0.0"
      
) jQuery, window, document
