var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window, document) {
  "use strict";
  var defaults, pluginName;
  pluginName = "responsiveTables";
  defaults = {
    widthToCollapse: 768
  };
  Furatto.ResponsiveTables = (function() {
    function ResponsiveTables(el, a, options) {
      this.el = el;
      this._setCellHeights = __bind(this._setCellHeights, this);
      this._unsplitTable = __bind(this._unsplitTable, this);
      this._splitTable = __bind(this._splitTable, this);
      this._updateTables = __bind(this._updateTables, this);
      this._initResponsiveTables = __bind(this._initResponsiveTables, this);
      this.options = $.extend({}, defaults, options);
      this.$el = $(this.el);
      this.switched = false;
      this._initResponsiveTables();
    }

    ResponsiveTables.prototype._initResponsiveTables = function() {
      var _this = this;
      $(window).on('load', this._updateTables);
      $(window).on('redraw', function() {
        _this.switched = false;
        return _this._updateTables();
      });
      return $(window).on('resize', this._updateTables);
    };

    ResponsiveTables.prototype._updateTables = function() {
      var _this = this;
      console.log(this.options.widthToCollapse);
      if ($(window).width() <= this.options.widthToCollapse && !this.switched) {
        this.switched = true;
        this.$el.each(function(i, element) {
          return _this._splitTable($(element));
        });
        return true;
      } else if (this.switched && $(window).width() > this.options.widthToCollapse) {
        this.switched = false;
        return this.$el.each(function(i, element) {
          return _this._unsplitTable($(element));
        });
      }
    };

    ResponsiveTables.prototype._splitTable = function(table) {
      var tableClone;
      table.wrap("<div class='table-wrapper' />");
      tableClone = table.clone();
      tableClone.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
      tableClone.removeClass("responsive");
      table.closest(".table-wrapper").append(tableClone);
      tableClone.wrap("<div class='pinned' />");
      table.wrap("<div class='scrollable' />");
      return this._setCellHeights(table, tableClone);
    };

    ResponsiveTables.prototype._unsplitTable = function(table) {
      table.closest(".table-wrapper").find(".pinned").remove();
      table.unwrap();
      return table.unwrap();
    };

    ResponsiveTables.prototype._setCellHeights = function(table, tableClone) {
      var heights, tableRows, tableRowsCopy;
      tableRows = table.find('tr');
      tableRowsCopy = tableClone.find('tr');
      heights = [];
      tableRows.each(function(index) {
        var self, tableHeadersAndData;
        self = $(this);
        tableHeadersAndData = self.find('th, td');
        return tableHeadersAndData.each(function() {
          var height;
          height = $(this).outerHeight(true);
          heights[index] = heights[index] || 0;
          if (height > heights[index]) {
            return heights[index] = height;
          }
        });
      });
      return tableRowsCopy.each(function(index) {
        return $(this).height(heights[index]);
      });
    };

    return ResponsiveTables;

  })();
  $.fn[pluginName] = function(a, options) {
    var args, _;
    _ = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function() {
      var plugin;
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        return $.data(this, "plugin_" + pluginName, new Furatto.ResponsiveTables(this, a, options));
      } else if ((plugin[_] != null) && $.type(plugin[_]) === 'function') {
        return plugin[_].apply(plugin, args);
      }
    });
  };
  Furatto.ResponsiveTables.version = "1.0.0";
  return $(document).ready(function() {
    return $('table.responsive').responsiveTables();
  });
})($, window, document);
