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
