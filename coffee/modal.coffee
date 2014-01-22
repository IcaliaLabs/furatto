(($, window) ->

  class Modal
    constructor: (el, options) ->
      @options = $.extend {}, options
      @$el = $(el)
      @modal = $(@$el.data('target'))
      @close = @modal.find('.modal-close')
      @transition = @$el.data('transition') || "1"
      @theme = @$el.data('theme') || "default"
      @modal.addClass "modal-effect-#{@transition}"
      @modal.addClass "#{@theme}"

    init: =>
      @$el.click @show
      @close.click (ev) =>
        ev.stopPropagation()
        @hide()

    show: (ev) =>
      if @$el.is 'div'
        @$el.addClass 'modal-show'
      else
        @modal.addClass 'modal-show'
      $('.modal-overlay').addClass 'modal-show-overlay'

      $('body').bind 'keyup', @hideOnEsc
      $('body').bind 'click', @hideOnDocumentClick

    hideOnEsc: (event) =>
      if event.keyCode is 27
        @hide()

    hideOnDocumentClick: (event) =>
      if $(event.target).is('.modal-overlay')
        @hide()

    hide: ->
      $('.modal-overlay').removeClass 'modal-show-overlay'
      if @$el.is 'div'
        @$el.removeClass 'modal-show'
      else
        @modal.removeClass 'modal-show'

      $('body').unbind 'keyup', @hideOnEsc
      $('body').unbind 'click', @hideOnDocumentClick

  $.fn.modal = (option) ->
    @each ->
      $this = $(this)
      data = $this.data('modal')
      options = $.extend {}, $this.data(), typeof option is 'object' and option

      if not data
        $this.data 'modal', ( data = new Modal(this, options) )
      if typeof option is 'string'
        data[option]()

  Modal.version = "1.0.0"

  $(document).ready ->
    $('body').append('<div class="modal-overlay"></div>')
    $('[data-furatto="modal"]').each ->
      modal = $(@)
      modal.modal('init')

  $(document).on 'click', '[data-furatto="modal"]', (e) ->
    $this = $(this)
    $this.modal('init')

) window.jQuery, window
