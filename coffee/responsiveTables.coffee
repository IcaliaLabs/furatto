(($, window, document) ->
  "use strict"

  pluginName = "responsiveTables"

  defaults =
    widthToCollapse: 768

  class Furatto.ResponsiveTables
    constructor: (@el, a, options) ->
      #merges options
      @options = $.extend {}, defaults, options
      #jquery representation
      @$el = $(@el)

      @switched = false

      @_initResponsiveTables()

    _initResponsiveTables: =>
      $(window).on 'load', @_updateTables
      $(window).on 'redraw', =>
        @switched = false
        @_updateTables()
      $(window).on 'resize', @_updateTables

    _updateTables: =>
      console.log @options.widthToCollapse
      if $(window).width() <= @options.widthToCollapse and not @switched
        @switched = true
        @$el.each (i, element) =>
          @_splitTable($(element))
        true
      else if @switched and $(window).width() > @options.widthToCollapse
        @switched = false
        @$el.each (i, element) =>
          @_unsplitTable($(element))

    _splitTable: (table) =>
      table.wrap "<div class='table-wrapper' />"

      tableClone = table.clone()

      tableClone.find("td:not(:first-child), th:not(:first-child)").css("display", "none")
      tableClone.removeClass("responsive")

      table.closest(".table-wrapper").append(tableClone)

      tableClone.wrap("<div class='pinned' />")
      table.wrap("<div class='scrollable' />")

      @_setCellHeights(table, tableClone)

    _unsplitTable: (table) =>
      table.closest(".table-wrapper").find(".pinned").remove()
      table.unwrap()
      table.unwrap()

    _setCellHeights: (table, tableClone) =>
      tableRows = table.find('tr')
      tableRowsCopy = tableClone.find 'tr'
      heights = []

      tableRows.each (index) ->
        self = $(this)
        tableHeadersAndData = self.find 'th, td'

        tableHeadersAndData.each ->
          height = $(this).outerHeight(true)
          heights[index] = heights[index] || 0
          heights[index] = height if height > heights[index]

      tableRowsCopy.each (index) ->
        $(this).height heights[index]
    

  $.fn[pluginName] = (a, options) ->
    [_, args...] = arguments
    @each ->
      plugin = $.data @, "plugin_#{pluginName}"

      unless plugin
        $.data @, "plugin_#{pluginName}", new Furatto.ResponsiveTables(@, a, options)
      else if plugin[_]? and $.type(plugin[_]) == 'function'
        plugin[_].apply plugin, args

  Furatto.ResponsiveTables.version = "1.0.0"
) $, window, document
