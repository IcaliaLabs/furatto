
(function($, window, i) {
  return $.fn.responsiveSlides = function(options) {
    var settings;
    settings = $.extend({
      auto: true,
      speed: 500,
      timeout: 4000,
      pager: false,
      nav: false,
      random: false,
      pause: false,
      pauseControls: true,
      prevText: "Previous",
      nextText: "Next",
      maxwidth: "",
      navContainer: "",
      manualControls: "",
      namespace: "rslides",
      before: $.noop,
      after: $.noop
    }, options);
    return this.each(function() {
      var $pager, $prev, $slide, $tabs, $this, $trigger, activeClass, fadeTime, hidden, index, length, maxw, namespace, namespaceIdx, navClass, navMarkup, restartCycle, rotate, selectTab, slideClassPrefix, slideTo, startCycle, supportsTransitions, tabMarkup, vendor, visible, visibleClass, waitTime, widthSupport;
      i++;
      $this = $(this);
      vendor = void 0;
      selectTab = void 0;
      startCycle = void 0;
      restartCycle = void 0;
      rotate = void 0;
      $tabs = void 0;
      index = 0;
      $slide = $this.children();
      length = $slide.size();
      fadeTime = parseFloat(settings.speed);
      waitTime = parseFloat(settings.timeout);
      maxw = parseFloat(settings.maxwidth);
      namespace = settings.namespace;
      namespaceIdx = namespace + i;
      navClass = namespace + "_nav " + namespaceIdx + "_nav";
      activeClass = namespace + "_here";
      visibleClass = namespaceIdx + "_on";
      slideClassPrefix = namespaceIdx + "_s";
      $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />");
      visible = {
        float: "left",
        position: "relative",
        opacity: 1,
        zIndex: 2
      };
      hidden = {
        float: "none",
        position: "absolute",
        opacity: 0,
        zIndex: 1
      };
      supportsTransitions = (function() {
        var docBody, prop, styles;
        docBody = document.body || document.documentElement;
        styles = docBody.style;
        prop = "transition";
        if (typeof styles[prop] === "string") {
          return true;
        }
        vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
        prop = prop.charAt(0).toUpperCase() + prop.substr(1);
        i = void 0;
        i = 0;
        while (i < vendor.length) {
          if (typeof styles[vendor[i] + prop] === "string") {
            return true;
          }
          i++;
        }
        return false;
      })();
      slideTo = function(idx) {
        settings.before(idx);
        if (supportsTransitions) {
          $slide.removeClass(visibleClass).css(hidden).eq(idx).addClass(visibleClass).css(visible);
          index = idx;
          return setTimeout((function() {
            return settings.after(idx);
          }), fadeTime);
        } else {
          return $slide.stop().fadeOut(fadeTime, function() {
            return $(this).removeClass(visibleClass).css(hidden).css("opacity", 1);
          }).eq(idx).fadeIn(fadeTime, function() {
            $(this).addClass(visibleClass).css(visible);
            settings.after(idx);
            return index = idx;
          });
        }
      };
      if (settings.random) {
        $slide.sort(function() {
          return Math.round(Math.random()) - 0.5;
        });
        $this.empty().append($slide);
      }
      $slide.each(function(i) {
        return this.id = slideClassPrefix + i;
      });
      $this.addClass(namespace + " " + namespaceIdx);
      if (options && options.maxwidth) {
        $this.css("max-width", maxw);
      }
      $slide.hide().css(hidden).eq(0).addClass(visibleClass).css(visible).show();
      if (supportsTransitions) {
        $slide.show().css({
          "-webkit-transition": "opacity " + fadeTime + "ms ease-in-out",
          "-moz-transition": "opacity " + fadeTime + "ms ease-in-out",
          "-o-transition": "opacity " + fadeTime + "ms ease-in-out",
          transition: "opacity " + fadeTime + "ms ease-in-out"
        });
      }
      if ($slide.size() > 1) {
        if (waitTime < fadeTime + 100) {
          return;
        }
        if (settings.pager && !settings.manualControls) {
          tabMarkup = [];
          $slide.each(function(i) {
            var n;
            n = i + 1;
            return tabMarkup += "<li>" + "<a href='#' class='" + slideClassPrefix + n + "'>" + n + "</a>" + "</li>";
          });
          $pager.append(tabMarkup);
          if (options.navContainer) {
            $(settings.navContainer).append($pager);
          } else {
            $this.after($pager);
          }
        }
        if (settings.manualControls) {
          $pager = $(settings.manualControls);
          $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
        }
        if (settings.pager || settings.manualControls) {
          $pager.find("li").each(function(i) {
            return $(this).addClass(slideClassPrefix + (i + 1));
          });
        }
        if (settings.pager || settings.manualControls) {
          $tabs = $pager.find("a");
          selectTab = function(idx) {
            return $tabs.closest("li").removeClass(activeClass).eq(idx).addClass(activeClass);
          };
        }
        if (settings.auto) {
          startCycle = function() {
            return rotate = setInterval(function() {
              var idx;
              $slide.stop(true, true);
              idx = (index + 1 < length ? index + 1 : 0);
              if (settings.pager || settings.manualControls) {
                selectTab(idx);
              }
              return slideTo(idx);
            }, waitTime);
          };
          startCycle();
        }
        restartCycle = function() {
          if (settings.auto) {
            clearInterval(rotate);
            return startCycle();
          }
        };
        if (settings.pause) {
          $this.hover((function() {
            return clearInterval(rotate);
          }), function() {
            return restartCycle();
          });
        }
        if (settings.pager || settings.manualControls) {
          $tabs.bind("click", function(e) {
            var idx;
            e.preventDefault();
            if (!settings.pauseControls) {
              restartCycle();
            }
            idx = $tabs.index(this);
            if (index === idx || $("." + visibleClass).queue("fx").length) {
              return;
            }
            selectTab(idx);
            return slideTo(idx);
          }).eq(0).closest("li").addClass(activeClass);
          if (settings.pauseControls) {
            $tabs.hover((function() {
              return clearInterval(rotate);
            }), function() {
              return restartCycle();
            });
          }
        }
        if (settings.nav) {
          navMarkup = "<a href='#' class='" + navClass + " prev'>" + settings.prevText + "</a>" + "<a href='#' class='" + navClass + " next'>" + settings.nextText + "</a>";
          if (options.navContainer) {
            $(settings.navContainer).append(navMarkup);
          } else {
            $this.after(navMarkup);
          }
          $trigger = $("." + namespaceIdx + "_nav");
          $prev = $trigger.filter(".prev");
          $trigger.bind("click", function(e) {
            var $visibleClass, idx, nextIdx, prevIdx;
            e.preventDefault();
            $visibleClass = $("." + visibleClass);
            if ($visibleClass.queue("fx").length) {
              return;
            }
            idx = $slide.index($visibleClass);
            prevIdx = idx - 1;
            nextIdx = (idx + 1 < length ? index + 1 : 0);
            slideTo(($(this)[0] === $prev[0] ? prevIdx : nextIdx));
            if (settings.pager || settings.manualControls) {
              selectTab(($(this)[0] === $prev[0] ? prevIdx : nextIdx));
            }
            if (!settings.pauseControls) {
              return restartCycle();
            }
          });
          if (settings.pauseControls) {
            $trigger.hover((function() {
              return clearInterval(rotate);
            }), function() {
              return restartCycle();
            });
          }
        }
      }
      if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
        widthSupport = function() {
          $this.css("width", "100%");
          if ($this.width() > maxw) {
            return $this.css("width", maxw);
          }
        };
        widthSupport();
        return $(window).bind("resize", function() {
          return widthSupport();
        });
      }
    });
  };
})(jQuery, this, 0);

