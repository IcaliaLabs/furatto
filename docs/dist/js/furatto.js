/*!
 * Furatto v3.0.3 (http://icalialabs.github.io/furatto/)
 * Copyright 2014-2014 Icalia Labs
 * Licensed under MIT (https://github.com/IcaliaLabs/furatto/blob/master/LICENSE)
 */
window.Furatto = {
  name: 'Furatto',
  version: '1.0.0'
};

$('.alert .close').each(function() {
  return $(this).click(function(e) {
    e.preventDefault();
    return $(this).parent().fadeOut();
  });
});

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($, window) {
  Furatto.Modal = (function() {
    function Modal(el, options) {
      this.hideOnDocumentClick = __bind(this.hideOnDocumentClick, this);
      this.hideOnEsc = __bind(this.hideOnEsc, this);
      this.show = __bind(this.show, this);
      this.init = __bind(this.init, this);
      this.options = $.extend({}, options);
      this.$el = $(el);
      this.modal = $(this.$el.data('target'));
      this.close = this.modal.find('.modal-close');
      this.transition = this.$el.data('transition') || "1";
      this.theme = this.$el.data('theme') || "default";
      this.modal.addClass("modal-effect-" + this.transition);
      this.modal.addClass("" + this.theme);
    }

    Modal.prototype.init = function() {
      var _this = this;
      this.$el.click(this.show);
      return this.close.click(function(ev) {
        ev.stopPropagation();
        return _this.hide();
      });
    };

    Modal.prototype.show = function(ev) {
      if (this.$el.is('div')) {
        this.$el.addClass('modal-show');
      } else {
        this.modal.addClass('modal-show');
      }
      $('.modal-overlay').addClass('modal-show-overlay');
      $('body').bind('keyup', this.hideOnEsc);
      return $('body').bind('click', this.hideOnDocumentClick);
    };

    Modal.prototype.hideOnEsc = function(event) {
      if (event.keyCode === 27) {
        return this.hide();
      }
    };

    Modal.prototype.hideOnDocumentClick = function(event) {
      if ($(event.target).is('.modal-overlay')) {
        return this.hide();
      }
    };

    Modal.prototype.hide = function() {
      $('.modal-overlay').removeClass('modal-show-overlay');
      if (this.$el.is('div')) {
        this.$el.removeClass('modal-show');
      } else {
        this.modal.removeClass('modal-show');
      }
      $('body').unbind('keyup', this.hideOnEsc);
      return $('body').unbind('click', this.hideOnDocumentClick);
    };

    return Modal;

  })();
  $.fn.modal = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('modal');
      options = $.extend({}, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('modal', (data = new Furatto.Modal(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };
  Furatto.Modal.version = "1.0.0";
  $(document).ready(function() {
    var elementToAppend;
    if ($('.off-screen').length > 0) {
      elementToAppend = $('.off-screen');
    } else {
      elementToAppend = $('body');
    }
    elementToAppend.append('<div class="modal-overlay"></div>');
    return $('[data-furatto="modal"]').each(function() {
      var modal;
      modal = $(this);
      return modal.modal('init');
    });
  });
  return $(document).on('click', '[data-furatto="modal"]', function(e) {
    var $this;
    $this = $(this);
    return $this.modal('init');
  });
})(window.jQuery, window);

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

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window, document) {
  "use strict";
  var closest, defaults, getLevelDepth, hasParent, isFromMobile, pluginName;
  pluginName = 'offScreen';
  defaults = {
    type: 'overlap',
    levelSpacing: 40,
    backClass: 'navigation-back'
  };
  getLevelDepth = function(level, id, waypoint, cnt) {
    if (cnt == null) {
      cnt = 0;
    }
    if (level.id.indexOf(id) >= 0) {
      return cnt;
    }
    if ($(level).hasClass(waypoint)) {
      ++cnt;
    }
    return level.parentNode && getLevelDepth(level.parentNode, id, waypoint, cnt);
  };
  hasParent = function(e, id) {
    var el;
    if (!e) {
      return false;
    }
    el = e.target || e.srcElement || e || false;
    while (el && el.id !== id) {
      el = el.parentNode || false;
    }
    return el !== false;
  };
  closest = function(e, classname) {
    if ($(e).hasClass(classname)) {
      return e;
    }
    return e.parentNode && closest(e.parentNode, classname);
  };
  isFromMobile = function() {
    var check;
    check = false;
    (function(a) {
      if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        return check = true;
      }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
  Furatto.OffScreen = (function() {
    function OffScreen(el, a, options) {
      this.el = el;
      this.openMenu = __bind(this.openMenu, this);
      this._closeMenu = __bind(this._closeMenu, this);
      this.resetMenu = __bind(this.resetMenu, this);
      this._setupLevelBack = __bind(this._setupLevelBack, this);
      this._setupLevelsClosing = __bind(this._setupLevelsClosing, this);
      this._hideOnDocumentClick = __bind(this._hideOnDocumentClick, this);
      this._hideOnEsc = __bind(this._hideOnEsc, this);
      this._setupMenuItems = __bind(this._setupMenuItems, this);
      this._bindEvents = __bind(this._bindEvents, this);
      this._shouldPreventOffScreenMenuFromOpening = __bind(this._shouldPreventOffScreenMenuFromOpening, this);
      this.options = $.extend({}, defaults, options);
      this.open = false;
      this.level = 0;
      this.wrapper = document.getElementById('off-screen');
      this.levels = Array.prototype.slice.call(this.el.querySelectorAll('div.off-screen-level'));
      this._setLevels();
      this.menuItems = Array.prototype.slice.call(this.el.querySelectorAll('li'));
      this.levelBack = Array.prototype.slice.call(this.el.querySelectorAll('.navigation-back'));
      this.eventType = isFromMobile() ? 'touchstart' : 'click';
      $(this.el).addClass("off-screen-" + this.options.type);
      this.trigger = document.getElementById('trigger');
      if ($(window).width() <= 768) {
        this._bindEvents();
      }
      this._shouldPreventOffScreenMenuFromOpening();
    }

    OffScreen.prototype._setLevels = function() {
      var level, _i, _len, _ref, _results;
      _ref = this.levels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        _results.push(level.setAttribute('data-level', getLevelDepth(level, this.el.id, 'off-screen-level')));
      }
      return _results;
    };

    OffScreen.prototype._shouldPreventOffScreenMenuFromOpening = function() {
      var _this = this;
      return $(window).resize(function() {
        _this.resetMenu();
        if ($(window).width() >= 768) {
          return _this.trigger.removeEventListener(_this.eventType);
        } else {
          return _this.trigger.addEventListener(_this.eventType, function(event) {
            event.stopPropagation();
            event.preventDefault();
            if (_this.open) {
              return _this.resetMenu();
            } else {
              _this.openMenu();
              return document.addEventListener(_this.eventType, function(event) {
                if (_this.open && !hasParent(event.target, _this.el.id)) {
                  return bodyClickBinding(_this);
                }
              });
            }
          });
        }
      });
    };

    OffScreen.prototype._bindEvents = function() {
      var bodyClickBinding,
        _this = this;
      bodyClickBinding = function(el) {
        _this.resetMenu();
        return el.removeEventListener(_this.eventType, bodyClickBinding);
      };
      this.trigger.addEventListener(this.eventType, function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (_this.open) {
          return _this.resetMenu();
        } else {
          _this.openMenu();
          return document.addEventListener(_this.eventType, function(event) {
            if (_this.open && !hasParent(event.target, _this.el.id)) {
              return bodyClickBinding(document);
            }
          });
        }
      });
      this._setupMenuItems();
      this._setupLevelsClosing();
      return this._setupLevelBack();
    };

    OffScreen.prototype._setupMenuItems = function() {
      var _this = this;
      return this.menuItems.forEach(function(el, i) {
        var subLevel;
        subLevel = el.querySelector('div.off-screen-level');
        if (subLevel) {
          return el.querySelector('a').addEventListener('click', function(event) {
            var level;
            event.preventDefault();
            level = closest(el, 'off-screen-level').getAttribute('data-level');
            if (_this.level <= level) {
              event.stopPropagation();
              $(closest(el, 'off-screen-level')).addClass('off-screen-level-overlay');
              return _this.openMenu(subLevel);
            }
          });
        }
      });
    };

    OffScreen.prototype._hideOnEsc = function(event) {
      if (event.keyCode === 27) {
        return this.resetMenu();
      }
    };

    OffScreen.prototype._hideOnDocumentClick = function(event) {
      return this.resetMenu();
    };

    OffScreen.prototype._setupLevelsClosing = function() {
      var levelEl, _i, _len, _ref, _results;
      _ref = this.levels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        levelEl = _ref[_i];
        _results.push(levelEl.addEventListener(this.eventType, function(event) {
          var level;
          event.stopPropagation();
          level = levelEl.getAttribute('data-level');
          if (this.level > level) {
            this.level = level;
            return this._closeMenu();
          }
        }));
      }
      return _results;
    };

    OffScreen.prototype._setupLevelBack = function() {
      var _this = this;
      return this.levelBack.forEach(function(el, i) {
        return el.addEventListener(_this.eventType, function(event) {
          var level;
          event.preventDefault();
          level = closest(el, 'off-screen-level').getAttribute('data-level');
          if (_this.level <= level) {
            event.stopPropagation();
            _this.level = closest(el, 'off-screen-level').getAttribute('data-level') - 1;
            if (_this.level === 0) {
              return _this.resetMenu();
            } else {
              return _this._closeMenu();
            }
          }
        });
      });
    };

    OffScreen.prototype.resetMenu = function() {
      this._setTransform('translate3d(0,0,0)');
      this.level = 0;
      $(this.wrapper).removeClass('off-screen-pushed');
      this._toggleLevels();
      this.open = false;
      return $(document).unbind('keyup', this._hideOnEsc);
    };

    OffScreen.prototype._closeMenu = function() {
      var translateVal;
      translateVal = this.options.type === 'overlap' ? this.el.offsetWidth + (this.level - 1) * this.options.levelSpacing : this.el.offsetWidth;
      this._setTransform("translate3d(" + translateVal + "px, 0, 0");
      return this._toggleLevels();
    };

    OffScreen.prototype.openMenu = function(subLevel) {
      var level, levelFactor, translateVal, _i, _len, _ref;
      ++this.level;
      levelFactor = (this.level - 1) * this.options.levelSpacing;
      translateVal = this.options.type === 'overlap' ? this.el.offsetWidth + levelFactor : this.el.offsetWidth;
      this._setTransform('translate3d(' + translateVal + 'px,0,0)');
      if (subLevel) {
        this._setTransform('', subLevel);
        _ref = this.levels;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          if (level !== subLevel && !$(level).hasClass('off-screen-level-open')) {
            this._setTransform("translate3d(-100%, 0, 0) translate3d(" + (-1 * levelFactor) + "px, 0, 0)", $(level));
          }
        }
      }
      if (this.level === 1) {
        $(this.wrapper).addClass('off-screen-pushed');
        this.open = true;
      }
      if (subLevel) {
        $(subLevel).addClass('off-screen-level-open');
      } else {
        $(this.levels[0]).addClass('off-screen-level-open');
      }
      $(document).bind('keyup', this._hideOnEsc);
      return $(document).on('touchstart', this._hideOnDocumentClick);
    };

    OffScreen.prototype._toggleLevels = function() {
      var level, _i, _len, _ref, _results;
      _ref = this.levels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        if (level.getAttribute('data-level') >= this.level + 1) {
          $(level).removeClass('off-screen-level-open');
          _results.push($(level).removeClass('off-screen-level-overlay'));
        } else if (Number(level.getAttribute('data-level') === this.level)) {
          _results.push($(level).removeClass('off-screen-level-overlay'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    OffScreen.prototype._setTransform = function(value, element) {
      if (element == null) {
        element = this.wrapper;
      }
      return $(element).css({
        '-webkit-transform': value,
        '-moz-transform': value,
        '-o-transform': value,
        'transform': value
      });
    };

    return OffScreen;

  })();
  $.fn[pluginName] = function(a, options) {
    var args, _;
    _ = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function() {
      var plugin;
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        return $.data(this, "plugin_" + pluginName, new Furatto.OffScreen(this, a, options));
      } else if ((plugin[_] != null) && $.type(plugin[_]) === 'function') {
        return plugin[_].apply(plugin, args);
      }
    });
  };
  $('.off-screen-navigation').offScreen();
  $(document).click(function() {
    return $('.off-screen-navigation').offScreen('resetMenu');
  });
  return Furatto.OffScreen.version = "1.0.0";
})(jQuery, window, document);

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

/*
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
*/

if (typeof Object.create !== "function") {
  Object.create = function(obj) {
    var F;
    F = function() {};
    F.prototype = obj;
    return new F();
  };
}

(function($, window, document, undefined_) {
  var ToolBar;
  ToolBar = {
    init: function(options, elem) {
      var self;
      self = this;
      self.elem = elem;
      self.$elem = $(elem);
      self.options = $.extend({}, $.fn.toolbar.options, options);
      self.toolbar = $("<div class='tool-container gradient ' />").addClass("tool-" + self.options.position).addClass("tool-rounded").addClass(self.options.theme).append("<div class=\"tool-items\" />").append("<div class='arrow " + self.options.theme + "' />").appendTo("body").css("opacity", 0).hide();
      self.toolbar_arrow = self.toolbar.find(".arrow");
      return self.initializeToolbar();
    },
    initializeToolbar: function() {
      var self;
      self = this;
      self.populateContent();
      self.setTrigger();
      return self.toolbarWidth = self.toolbar.width();
    },
    setTrigger: function() {
      var self;
      self = this;
      self.$elem.on("click", function(event) {
        event.preventDefault();
        if (self.$elem.hasClass("pressed")) {
          return self.hide();
        } else {
          return self.show();
        }
      });
      if (self.options.hideOnClick) {
        $("html").on("click.toolbar", function(event) {
          if (event.target !== self.elem && self.$elem.has(event.target).length === 0 && self.toolbar.has(event.target).length === 0 && self.toolbar.is(":visible")) {
            return self.hide();
          }
        });
      }
      return $(window).resize(function(event) {
        event.stopPropagation();
        if (self.toolbar.is(":visible")) {
          self.toolbarCss = self.getCoordinates(self.options.position, 20);
          self.collisionDetection();
          self.toolbar.css(self.toolbarCss);
          return self.toolbar_arrow.css(self.arrowCss);
        }
      });
    },
    populateContent: function() {
      var content, location, self;
      self = this;
      location = self.toolbar.find(".tool-items");
      content = $(self.options.content).clone(true).find("a").addClass("tool-item gradient").addClass(self.options.theme);
      location.html(content);
      return location.find(".tool-item").on("click", function(event) {
        event.preventDefault();
        return self.$elem.trigger("toolbarItemClick", this);
      });
    },
    calculatePosition: function() {
      var self;
      self = this;
      self.arrowCss = {};
      self.toolbarCss = self.getCoordinates(self.options.position, 0);
      self.toolbarCss.position = "absolute";
      self.toolbarCss.zIndex = self.options.zIndex;
      self.collisionDetection();
      self.toolbar.css(self.toolbarCss);
      return self.toolbar_arrow.css(self.arrowCss);
    },
    getCoordinates: function(position, adjustment) {
      var self;
      self = this;
      self.coordinates = self.$elem.offset();
      if (self.options.adjustment && self.options.adjustment[self.options.position]) {
        adjustment = self.options.adjustment[self.options.position];
      }
      switch (self.options.position) {
        case "top":
          return {
            left: self.coordinates.left - (self.toolbar.width() / 2) + (self.$elem.outerWidth() / 2),
            top: self.coordinates.top - self.$elem.height() - adjustment,
            right: "auto"
          };
        case "left":
          return {
            left: self.coordinates.left - (self.toolbar.width() / 2) - (self.$elem.width() / 2) - adjustment,
            top: self.coordinates.top - (self.toolbar.height() / 2) + (self.$elem.outerHeight() / 2),
            right: "auto"
          };
        case "right":
          return {
            left: self.coordinates.left + (self.toolbar.width() / 2) + (self.$elem.width() / 3) + adjustment,
            top: self.coordinates.top - (self.toolbar.height() / 2) + (self.$elem.outerHeight() / 2),
            right: "auto"
          };
        case "bottom":
          return {
            left: self.coordinates.left - (self.toolbar.width() / 2) + (self.$elem.outerWidth() / 2),
            top: self.coordinates.top + self.$elem.height() + adjustment,
            right: "auto"
          };
      }
    },
    collisionDetection: function() {
      var edgeOffset, self;
      self = this;
      edgeOffset = 20;
      if (self.options.position === "top" || self.options.position === "bottom") {
        self.arrowCss = {
          left: "50%",
          right: "50%"
        };
        if (self.toolbarCss.left < edgeOffset) {
          self.toolbarCss.left = edgeOffset;
          return self.arrowCss.left = self.$elem.offset().left + self.$elem.width() / 2 - edgeOffset;
        } else if (($(window).width() - (self.toolbarCss.left + self.toolbarWidth)) < edgeOffset) {
          self.toolbarCss.right = edgeOffset;
          self.toolbarCss.left = "auto";
          self.arrowCss.left = "auto";
          return self.arrowCss.right = ($(window).width() - self.$elem.offset().left) - (self.$elem.width() / 2) - edgeOffset - 5;
        }
      }
    },
    show: function() {
      var animation, self;
      self = this;
      animation = {
        opacity: 1
      };
      self.$elem.addClass("pressed");
      self.calculatePosition();
      switch (self.options.position) {
        case "top":
          animation.top = "-=20";
          break;
        case "left":
          animation.left = "-=20";
          break;
        case "right":
          animation.left = "+=20";
          break;
        case "bottom":
          animation.top = "+=20";
      }
      self.toolbar.show().animate(animation, 200);
      return self.$elem.trigger("toolbarShown");
    },
    hide: function() {
      var animation, self;
      self = this;
      animation = {
        opacity: 0
      };
      self.$elem.removeClass("pressed");
      switch (self.options.position) {
        case "top":
          animation.top = "+=20";
          break;
        case "left":
          animation.left = "+=20";
          break;
        case "right":
          animation.left = "-=20";
          break;
        case "bottom":
          animation.top = "-=20";
      }
      self.toolbar.animate(animation, 200, function() {
        return self.toolbar.hide();
      });
      return self.$elem.trigger("toolbarHidden");
    },
    getToolbarElement: function() {
      return this.toolbar.find(".tool-items");
    }
  };
  $.fn.toolbar = function(options) {
    var method, toolbarObj;
    if ($.isPlainObject(options)) {
      return this.each(function() {
        var toolbarObj;
        toolbarObj = Object.create(ToolBar);
        toolbarObj.init(options, this);
        return $(this).data("toolbarObj", toolbarObj);
      });
    } else if (typeof options === "string" && options.indexOf("_") !== 0) {
      toolbarObj = $(this).data("toolbarObj");
      method = toolbarObj[options];
      return method.apply(toolbarObj, $.makeArray(arguments_).slice(1));
    }
  };
  $.fn.toolbar.options = {
    content: "#myContent",
    position: "top",
    hideOnClick: false,
    zIndex: 120,
    theme: ""
  };
  return $(document).ready(function() {
    return $('[data-furatto="toolbar"]').each(function() {
      return $(this).toolbar({
        content: $(this).data('content'),
        position: $(this).data('position') || 'top',
        hideOnClick: true,
        theme: $(this).data('theme')
      });
    });
  });
})(jQuery, window, document);

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

/* ===========================================================
 * bootstrap-tooltip.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

  $(document).on('ready', function(){
    $("[data-toggle=tooltip]").tooltip();
  });

}(window.jQuery);

jQuery(function() {
  $(document).mouseup(function(e) {
    var dropdown_container;
    dropdown_container = $('.with-dropdown');
    if (!dropdown_container.is(e.target) && dropdown_container.has(e.target).length === 0) {
      return dropdown_container.removeClass('opened');
    }
  });
  $(document).on('touchstart click', '.with-dropdown', function(e) {
    var $container;
    e.preventDefault();
    $container = $(e.target).parent();
    $container.siblings('.with-dropdown').removeClass('opened');
    return $container.toggleClass('opened');
  });
  return $(document).on('touchstart click', '.with-dropdown > ul.dropdown', function(e) {
    return e.stopPropagation();
  });
});

/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );
