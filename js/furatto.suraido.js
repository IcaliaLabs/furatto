var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window, document) {
  "use strict";
  var defaults, pluginName;
  pluginName = 'suraido';
  defaults = {
    speed: 500,
    delay: 3000,
    pause: false,
    loop: false,
    enableKeys: true,
    enableDots: true,
    enableArrows: true,
    prev: '«',
    next: '»',
    fluid: true,
    starting: false,
    completed: false,
    easing: 'swing',
    autoplay: false,
    paginationClass: 'pagination',
    paginationItemClass: 'dot',
    arrowsClass: 'arrows',
    arrowClass: 'arrow'
  };
  Furatto.Suraido = (function() {
    function Suraido(el, options) {
      var weakSelf,
        _this = this;
      this.el = el;
      this.prev = __bind(this.prev, this);
      this.next = __bind(this.next, this);
      this.stop = __bind(this.stop, this);
      this.play = __bind(this.play, this);
      this.to = __bind(this.to, this);
      this._createArrows = __bind(this._createArrows, this);
      this._createPagination = __bind(this._createPagination, this);
      this._enableBindKeys = __bind(this._enableBindKeys, this);
      this._enablesFluidBehavior = __bind(this._enablesFluidBehavior, this);
      this._enablesAutoPlay = __bind(this._enablesAutoPlay, this);
      this._setsMainElement = __bind(this._setsMainElement, this);
      this._setsItems = __bind(this._setsItems, this);
      this.$el = $(this.el);
      this.options = $.extend({}, defaults, options);
      this.itemsWrapper = this.$el.find('>ul');
      this.maxSize = {
        width: this.$el.outerWidth() | 0,
        height: this.$el.outerHeight() | 0
      };
      weakSelf = this;
      this.items = $(this.itemsWrapper).find('>li').each(function(index) {
        var $this, height, width;
        $this = $(this);
        width = $this.outerWidth();
        height = $this.outerHeight();
        if (width > weakSelf.maxSize.width) {
          weakSelf.maxSize.width = width;
        }
        if (height > weakSelf.maxSize.height) {
          return weakSelf.maxSize.height = height;
        }
      });
      this.itemsLength = this.items.length;
      this.currentItemIndex = 0;
      this.items.find('.caption').css({
        width: "" + (100 / this.itemsLength) + "%"
      });
      this._setsMainElement();
      this.itemsWrapper.css({
        position: "relative",
        left: 0,
        width: "" + (this.itemsLength * 100) + "%"
      });
      this._setsItems();
      if (this.options.autoplay) {
        this._enablesAutoPlay();
      }
      if (this.options.enableKeys) {
        this._enableBindKeys();
      }
      this.options.enableDots && this._createPagination();
      this.options.enableArrows && this._createArrows();
      if (this.options.fluid) {
        this._enablesFluidBehavior();
      }
      if (window.chrome) {
        this.items.css('background-size', '100% 100%');
      }
      if ($.event.special['swipe'] || $.Event('swipe')) {
        this.$el.on('swipeleft swiperight swipeLeft swipeRight', function(e) {
          if (e.type.toLowerCase() === 'swipeleft') {
            return _this.next();
          } else {
            return _this.prev();
          }
        });
      }
    }

    Suraido.prototype._setsItems = function() {
      return this.items.css({
        float: 'left',
        width: "" + (100 / this.itemsLength) + "%"
      });
    };

    Suraido.prototype._setsMainElement = function() {
      return this.$el.css({
        width: this.maxSize.width,
        height: this.items.first().outerHeight(),
        overflow: 'hidden'
      });
    };

    Suraido.prototype._enablesAutoPlay = function() {
      var _this = this;
      return setTimeout(function() {
        if (_this.options.delay | 0) {
          _this.play();
          if (_this.options.pause) {
            return _this.$el.on('mouseover, mouseout', function(event) {
              _this.stop();
              return event.type === 'mouseout' && _this.play();
            });
          }
        }
      }, this.options.autoPlayDelay | 0);
    };

    Suraido.prototype._enablesFluidBehavior = function() {
      var _this = this;
      return $(window).resize(function() {
        _this.resize && clearTimeout(_this.resize);
        return _this.resize = setTimeout(function() {
          var style, width;
          style = {
            height: _this.items.eq(_this.currentItemIndex).outerHeight() + 30
          };
          width = _this.$el.outerWidth();
          _this.itemsWrapper.css(style);
          style['width'] = "" + (Math.min(Math.round((width / _this.$el.parent().width()) * 100), 100)) + "%";
          return _this.$el.css(style, 50);
        });
      }).resize();
    };

    Suraido.prototype._enableBindKeys = function() {
      var _this = this;
      return $(document).on('keydown', function(event) {
        switch (event.which) {
          case 37:
            return _this.prev();
          case 39:
            return _this.next();
          case 27 || 32:
            return _this.stop();
        }
      });
    };

    Suraido.prototype._createPagination = function() {
      var html,
        _this = this;
      html = "<ol class='" + this.options.paginationClass + "'>";
      $.each(this.items, function(index) {
        return html += "<li class='" + (index === _this.currentItemIndex ? _this.options.paginationItemClass + ' active' : _this.options.paginationItemClass) + "'> " + (++index) + "</li>";
      });
      html += "</ol>";
      return this._bindPagination(this.options.paginationClass, this.options.paginationItemClass, html);
    };

    Suraido.prototype._createArrows = function() {
      var html;
      html = "<div class=\"";
      html = html + this.options.arrowsClass + "\">" + html + this.options.arrowClass + " prev\">" + this.options.prev + "</div>" + html + this.options.arrowClass + " next\">" + this.options.next + "</div></div>";
      return this._bindPagination(this.options.arrowsClass, this.options.arrowClass, html);
    };

    Suraido.prototype._bindPagination = function(className, itemClassName, html) {
      var weakSelf;
      weakSelf = this;
      return this.$el.addClass("has-" + className).append(html).find("." + itemClassName).click(function() {
        var $this;
        $this = $(this);
        if ($this.hasClass(weakSelf.options.paginationItemClass)) {
          return weakSelf.stop().to($this.index());
        } else if ($this.hasClass('prev')) {
          return weakSelf.prev();
        } else {
          return weakSelf.next();
        }
      });
    };

    Suraido.prototype.to = function(index, callback) {
      var easing, obj, speed, target,
        _this = this;
      if (this.t) {
        this.stop();
        this.play();
      }
      target = this.items.eq(index);
      $.isFunction(this.options.starting) && !callback && this.options.starting(this.$el, this.items.eq(this.currentItemIndex));
      if (!(target.length || index < 0) && this.options.loop === false) {
        return;
      }
      if (index < 0) {
        index = this.items.length - 1;
      }
      speed = callback ? 5 : this.options.speed | 0;
      easing = this.options.easing;
      obj = {
        height: target.outerHeight() + 30
      };
      if (!this.itemsWrapper.queue('fx').length) {
        this.$el.find("." + this.options.paginationItemClass).eq(index).addClass('active').siblings().removeClass('active');
        return this.$el.animate(obj, speed, easing) && this.itemsWrapper.animate($.extend({
          left: "-" + index + "00%"
        }, obj), speed, easing, function(data) {
          _this.currentItemIndex = index;
          return $.isFunction(_this.options.complete) && !callback && _this.options.complete(_this.el, target);
        });
      }
    };

    Suraido.prototype.play = function() {
      var _this = this;
      return this.t = setInterval(function() {
        return _this.to(_this.currentItemIndex + 1);
      }, this.options.delay | 0);
    };

    Suraido.prototype.stop = function() {
      this.t = clearInterval(this.t);
      return this;
    };

    Suraido.prototype.next = function() {
      if (this.currentItemIndex === (this.itemsLength - 1)) {
        return this.stop().to(0);
      } else {
        return this.stop().to(this.currentItemIndex + 1);
      }
    };

    Suraido.prototype.prev = function() {
      return this.stop().to(this.currentItemIndex - 1);
    };

    return Suraido;

  })();
  $.fn[pluginName] = function(options) {
    var args, sliders, _;
    sliders = this.length;
    _ = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function(index) {
      var instance, key, me, plugin;
      me = $(this);
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        key = "suraido" + (sliders > 1 ? '-' + ++index : '');
        instance = new Furatto.Suraido(this, options);
        return me.data(key, instance).data('key', key);
      } else if ((plugin[_] != null) && $.type(plugin[_]) === 'function') {
        return plugin[_].apply(plugin, args);
      }
    });
  };
  Furatto.Suraido.version = "1.0.0";
  return $(document).ready(function() {
    return $('[data-suraido]').each(function() {
      return $(this).suraido();
    });
  });
})($, window, document);
