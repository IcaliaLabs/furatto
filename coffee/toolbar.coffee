###
Toolbar.js

@fileoverview  jQuery plugin that creates tooltip style toolbars.
@link          http://paulkinzett.github.com/toolbar/
@author        Paul Kinzett (http://kinzett.co.nz/)
@version       1.0.4
@requires      jQuery 1.7+

@license jQuery Toolbar Plugin v1.0.4
http://paulkinzett.github.com/toolbar/
Copyright 2013 Paul Kinzett (http://kinzett.co.nz/)
Released under the MIT license.
<https://raw.github.com/paulkinzett/toolbar/master/LICENSE.txt>
###
if typeof Object.create isnt "function"
  Object.create = (obj) ->
    F = ->
    F:: = obj
    new F()

(($, window, document, undefined_) ->
  ToolBar =
    init: (options, elem) ->
      self = this
      self.elem = elem
      self.$elem = $(elem)
      self.options = $.extend({}, $.fn.toolbar.options, options)
      self.toolbar = $("<div class='tool-container gradient ' />").addClass("tool-" + self.options.position).addClass("tool-rounded").addClass(self.options.theme).append("<div class=\"tool-items\" />").append("<div class='arrow " + self.options.theme + "' />").appendTo("body").css("opacity", 0).hide()
      self.toolbar_arrow = self.toolbar.find(".arrow")
      self.initializeToolbar()

    initializeToolbar: ->
      self = this
      self.populateContent()
      self.setTrigger()
      self.toolbarWidth = self.toolbar.width()

    setTrigger: ->
      self = this
      self.$elem.on "click", (event) ->
        event.preventDefault()
        if self.$elem.hasClass("pressed")
          self.hide()
        else
          self.show()

      if self.options.hideOnClick
        $("html").on "click.toolbar", (event) ->
          self.hide()  if event.target isnt self.elem and self.$elem.has(event.target).length is 0 and self.toolbar.has(event.target).length is 0 and self.toolbar.is(":visible")

      $(window).resize (event) ->
        event.stopPropagation()
        if self.toolbar.is(":visible")
          self.toolbarCss = self.getCoordinates(self.options.position, 20)
          self.collisionDetection()
          self.toolbar.css self.toolbarCss
          self.toolbar_arrow.css self.arrowCss


    populateContent: ->
      self = this
      location = self.toolbar.find(".tool-items")
      content = $(self.options.content).clone(true).find("a").addClass("tool-item gradient").addClass(self.options.theme)
      location.html content
      location.find(".tool-item").on "click", (event) ->
        event.preventDefault()
        self.$elem.trigger "toolbarItemClick", this


    calculatePosition: ->
      self = this
      self.arrowCss = {}
      self.toolbarCss = self.getCoordinates(self.options.position, 0)
      self.toolbarCss.position = "absolute"
      self.toolbarCss.zIndex = self.options.zIndex
      self.collisionDetection()
      self.toolbar.css self.toolbarCss
      self.toolbar_arrow.css self.arrowCss

    getCoordinates: (position, adjustment) ->
      self = this
      self.coordinates = self.$elem.offset()
      adjustment = self.options.adjustment[self.options.position]  if self.options.adjustment and self.options.adjustment[self.options.position]
      switch self.options.position
        when "top"
          left: self.coordinates.left - (self.toolbar.width() / 2) + (self.$elem.outerWidth() / 2)
          top: self.coordinates.top - self.$elem.height() - adjustment
          right: "auto"
        when "left"
          left: self.coordinates.left - (self.toolbar.width() / 2) - (self.$elem.width() / 2) - adjustment
          top: self.coordinates.top - (self.toolbar.height() / 2) + (self.$elem.outerHeight() / 2)
          right: "auto"
        when "right"
          left: self.coordinates.left + (self.toolbar.width() / 2) + (self.$elem.width() / 3) + adjustment
          top: self.coordinates.top - (self.toolbar.height() / 2) + (self.$elem.outerHeight() / 2)
          right: "auto"
        when "bottom"
          left: self.coordinates.left - (self.toolbar.width() / 2) + (self.$elem.outerWidth() / 2)
          top: self.coordinates.top + self.$elem.height() + adjustment
          right: "auto"

    collisionDetection: ->
      self = this
      edgeOffset = 20
      if self.options.position is "top" or self.options.position is "bottom"
        self.arrowCss =
          left: "50%"
          right: "50%"

        if self.toolbarCss.left < edgeOffset
          self.toolbarCss.left = edgeOffset
          self.arrowCss.left = self.$elem.offset().left + self.$elem.width() / 2 - (edgeOffset)
        else if ($(window).width() - (self.toolbarCss.left + self.toolbarWidth)) < edgeOffset
          self.toolbarCss.right = edgeOffset
          self.toolbarCss.left = "auto"
          self.arrowCss.left = "auto"
          self.arrowCss.right = ($(window).width() - self.$elem.offset().left) - (self.$elem.width() / 2) - (edgeOffset) - 5

    show: ->
      self = this
      animation = opacity: 1
      self.$elem.addClass "pressed"
      self.calculatePosition()
      switch self.options.position
        when "top"
          animation.top = "-=20"
        when "left"
          animation.left = "-=20"
        when "right"
          animation.left = "+=20"
        when "bottom"
          animation.top = "+=20"
      self.toolbar.show().animate animation, 200
      self.$elem.trigger "toolbarShown"

    hide: ->
      self = this
      animation = opacity: 0
      self.$elem.removeClass "pressed"
      switch self.options.position
        when "top"
          animation.top = "+=20"
        when "left"
          animation.left = "+=20"
        when "right"
          animation.left = "-=20"
        when "bottom"
          animation.top = "-=20"
      self.toolbar.animate animation, 200, ->
        self.toolbar.hide()

      self.$elem.trigger "toolbarHidden"

    getToolbarElement: ->
      @toolbar.find ".tool-items"

  $.fn.toolbar = (options) ->
    if $.isPlainObject(options)
      @each ->
        toolbarObj = Object.create(ToolBar)
        toolbarObj.init options, this
        $(this).data "toolbarObj", toolbarObj

    else if typeof options is "string" and options.indexOf("_") isnt 0
      toolbarObj = $(this).data("toolbarObj")
      method = toolbarObj[options]
      method.apply toolbarObj, $.makeArray(arguments_).slice(1)

  $.fn.toolbar.options =
    content: "#myContent"
    position: "top"
    hideOnClick: false
    zIndex: 120
    theme: ""

  $(document).ready ->
    $('[data-furatto="toolbar"]').each ->
      $(@).toolbar
        content: $(@).data('content')
        position: $(@).data('position') || 'top'
        hideOnClick: true

        theme: $(@).data('theme')
) jQuery, window, document
