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
      if (this.$el.is('.modal')) {
        this.$modal = this.$el;
      } else {
        this.$modal = $(this.$el.data('target'));
      }
      this.close = this.$modal.find('.modal-close');
      this.transition = this.$el.data('transition') || "1";
      this.theme = this.$el.data('theme') || "default";
      this.$modal.addClass("modal-effect-" + this.transition);
      this.$modal.addClass("" + this.theme);
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
      if (this.$el.is('.modal')) {
        this.$el.addClass('modal-show');
      } else {
        this.$modal.addClass('modal-show');
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
      if (this.$el.is('.modal')) {
        this.$el.removeClass('modal-show');
      } else {
        this.$modal.removeClass('modal-show');
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
  Furatto.Modal.version = "1.0.1";
  $(document).ready(function() {
    var elementToAppend;
    if ($('.off-screen').length > 0) {
      elementToAppend = $('.off-screen');
    } else {
      elementToAppend = $('body');
    }
    elementToAppend.append('<div class="modal-overlay"></div>');
    return $('[data-furatto="modal"], .modal').each(function() {
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
