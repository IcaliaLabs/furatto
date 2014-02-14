var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window, document) {
  "use strict";
  var pluginName;
  pluginName = 'responsiveNavBar';
  Furatto.ResponsiveNavBar = (function() {
    function ResponsiveNavBar(el, a, options) {
      this.el = el;
      this.closeNavbar = __bind(this.closeNavbar, this);
      this.openNavbar = __bind(this.openNavbar, this);
      this.toggleNavbar = __bind(this.toggleNavbar, this);
      this._initEvents = __bind(this._initEvents, this);
      this.navbarElements = $('.navigation-bar ul:not(.brand-section)');
      this.$el = $(this.el);
      this._initEvents();
    }

    ResponsiveNavBar.prototype._initEvents = function() {
      var _this = this;
      return $('.navigation-bar .menu-toggle').on('touchstart click', function(e) {
        e.preventDefault();
        return _this.toggleNavbar();
      });
    };

    ResponsiveNavBar.prototype.toggleNavbar = function() {
      return this.$el.toggleClass('opened');
    };

    ResponsiveNavBar.prototype.openNavbar = function() {
      return this.$el.addClass('opened');
    };

    ResponsiveNavBar.prototype.closeNavbar = function() {
      return this.$el.removeClass('opened');
    };

    return ResponsiveNavBar;

  })();
  $.fn[pluginName] = function(a, options) {
    var args, _;
    _ = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function() {
      var plugin;
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        return $.data(this, "plugin_" + pluginName, new Furatto.ResponsiveNavBar(this, a, options));
      } else if ((plugin[_] != null) && $.type(plugin[_]) === 'function') {
        return plugin[_].apply(plugin, args);
      }
    });
  };
  $('.navigation-bar').responsiveNavBar();
  return Furatto.ResponsiveNavBar.version = "1.0.0";
})(jQuery, window, document);
