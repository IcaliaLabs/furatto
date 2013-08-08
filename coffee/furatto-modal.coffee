(($, window) ->

  class Modal
    constructor: (el, options) ->
      @options = $.extend {}, @defaults, options
      @$el = $(el)
      @body = $('body')
      @isShown = false

    toggle: ->
      @[(if not @isShown then @.show() else @.hide())]
    
    onDocumentKeyup: (event) =>
      if event.keyCode is 27
        @.hide()

    onDocumentClick: (event) =>
      if $(event.target).is('.modal-overlay') || $(event.target).parent().is('[data-toggle="close"]')
        @.hide()

    show: ->
      @isShown = true

      setTimeout (=>
        @body.addClass('modal-active')
      ), 100

      @body.append "<div class='modal-popin'>#{@$el.html()}</div>"

      @body.bind 'keyup', @.onDocumentKeyup
      @body.bind 'click', @.onDocumentClick

    hide: ->
      @isShown = false
      @body.unbind 'keyup', @.onDocumentKeyup
      @body.unbind 'click', @.onDocumentClick

      @body.removeClass 'modal-active'
      $('.modal-overlay').remove()

      setTimeout (->
        $('.modal-popin').remove()
      ), 500

  $.fn.extend modal: (option, args...) ->
    @each ->
      $this = $(this)
      data = $this.data('modal')

      if !data
        $this.data 'modal', (data = new Modal(this, option))
      if typeof option == 'string'
        data[option].apply(data, args)

      $('body').addClass('modal-ready')
      $('body').append('<div class="modal-overlay"></div>')

  $(document).on 'click', '[data-furatto="modal"]', (e) ->
    $this = $(this)
    $target = $($this.data('target'))
    $target.modal('toggle')

    e.preventDefault()

) window.jQuery, window
