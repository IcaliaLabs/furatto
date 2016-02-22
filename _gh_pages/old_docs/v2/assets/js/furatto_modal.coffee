(($, window) ->

  class Modal
    constructor: (el, options) ->
      @options = $.extend {}, @defaults, options
      @$el = $(el)
      @body = $('body')
      @isShown = false

    toggle: ->
      @[(if not @isShown then @.activate() else @.deactivate())]
    
    onDocumentKeyup: (event) =>
      console.log  'esc'
      if event.keyCode is 27
        @.deactivate()

    onDocumentClick: (event) =>
      @.deactivate()

    activate: ->
      @isShown = true

      setTimeout (=>
        @body.addClass('avgrund-active')
      ), 100

      @body.append "<div class='avgrund-popin'>#{@$el.html()}</div>"

      @body.bind 'keyup', @.onDocumentKeyup
      @body.bind 'click', @.onDocumentClick

    deactivate: ->
      @isShown = false
      @body.unbind 'keyup', @.onDocumentKeyup
      @body.unbind 'click', @.onDocumentClick

      @body.removeClass 'avgrund-active'
      $('.avgrund-overlay').remove()

      setTimeout (->
        $('.avgrund-popin').remove()
      ), 500


  $.fn.extend modal: (option, args...) ->
    @each ->
      $this = $(this)
      data = $this.data('modal')

      if !data
        $this.data 'modal', (data = new Modal(this, option))
      if typeof option == 'string'
        data[option].apply(data, args)

      $('body').addClass('avgrund-ready')
      $('body').append('<div class="avgrund-overlay"></div>')

  $(document).on 'click', '[data-furatto="modal"]', (e) ->
    $this = $(this)
    $target = $($this.data('target'))
    $target.modal('toggle')

    e.preventDefault()

) window.jQuery, window
