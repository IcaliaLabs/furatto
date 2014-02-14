var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window, document) {
  var defaults, pluginName;
  pluginName = 'tabu';
  defaults = {
    startIndex: 0,
    tabContentClass: 'tabu-content',
    tabContentsClass: 'content'
  };
  Furatto.Tabu = (function() {
    function Tabu(el, options) {
      this.el = el;
      this._toggle = __bind(this._toggle, this);
      this._setActiveElements = __bind(this._setActiveElements, this);
      this._preventsIndexOutofBounds = __bind(this._preventsIndexOutofBounds, this);
      this.$el = $(this.el);
      this.options = $.extend(defaults, options, this.$el.data());
      this.tabItems = this.$el.find('li');
      this.tabItemsLength = this.tabItems.length;
      this.tabContents = this.$el.next("." + this.options.tabContentClass).find(">." + this.options.tabContentsClass);
      this._preventsIndexOutofBounds();
      this._setActiveElements();
      this._toggle();
    }

    Tabu.prototype._preventsIndexOutofBounds = function() {
      if (this.options.startIndex >= this.tabItemsLength) {
        return this.options.startIndex = this.tabItemsLength - 1;
      }
    };

    Tabu.prototype._setActiveElements = function() {
      $(this.tabItems[this.options.startIndex]).addClass('active');
      return $(this.tabContents[this.options.startIndex]).addClass('active');
    };

    Tabu.prototype._toggle = function() {
      var weakSelf;
      weakSelf = this;
      return this.tabItems.on('touchstart click', function(event) {
        var id;
        event.preventDefault();
        weakSelf.tabItems.removeClass('active');
        $(this).addClass('active');
        weakSelf.tabContents.removeClass('active');
        id = $(this).find('a').attr('href');
        return $(id).addClass('active');
      });
    };

    return Tabu;

  })();
  $.fn[pluginName] = function(options) {
    var args, tabsLength, _;
    tabsLength = this.length;
    _ = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function(index) {
      var instance, key, me, plugin;
      me = $(this);
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        key = "tabu" + (tabsLength > 1 ? '-' + ++index : '');
        instance = new Furatto.Tabu(this, options);
        return me.data(key, instance).data('key', key);
      } else if ((plugin[_] != null) && $.type(plugin[_]) === 'function') {
        return plugin[_].apply(plugin, args);
      }
    });
  };
  Furatto.Tabu.version = "1.0.0";
  return $(document).ready(function() {
    return $('[data-tabu]').each(function() {
      return $(this).tabu();
    });
  });
})($, window, document);
