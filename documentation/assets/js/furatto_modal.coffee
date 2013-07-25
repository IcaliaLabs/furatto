(($, window) ->

  class Modal
    defaults:
      width: 380,
      height: 280,
      showClose: true,
      showCloseText: 'Close',
      closeByEscape: true,
      closeByDocument: true,
      holderClass: '',
      overlayClass: '',
      enableStackAnimation: false,
      onBlurContainer: '',
      openOnEvent: true,
      setEvent: 'click',
      onLoad: false,
      onUnload: false,
      template: '<p>This is test popin content!</p>'

    constructor: (el, options) ->
      @options = $.extend {}, @defaults, options
      @$el = $(el)
      @body = $('body')
    
    onDocumentKeyup: (event) ->
      if @options.closeByEscape
        if event.keyCode is 27
          @.deactivate()

    onDocumentClick: (event) =>
      if @options.closeByDocument
        if $(event.target).is('.avgrund-overlay, .avgrund-close')
          event.preventDefault()
          @.deactivate()
      else
        if $(event.target).is('.avgrund-close')
          event.preventDefault()
          @.deactivate()

    activate: ->
      console.log @body
      @options.onLoad(@$el) if typeof @options.onLoad is 'function'

      setTimeout (=>
        @body.addClass('avgrund-active')
      ), 100

      @body.append "<div class='avgrund-popin #{@options.holderClass}'>#{@options.template}</div>"

      $('.avgrund-popin').css
        'width': "#{@options.width}px"
        'height': "#{@options.height}px"
        'margin-left': "-#{@options.width / 2 + 10}px"
        'margin-top': "-#{@options.height / 2 + 10}px"

      if @options.showClose
        $('.avgrund-popin').append("<a href='javascript:void(0)' class='avgrund-close'>#{@options.showCloseText}</a>")
    
      @body.bind 'keyup', @.onDocumentKeyup
      @body.bind 'click', @.onDocumentClick

    deactivate: ->
      @body.unbind 'keyup', @.onDocumentKeyup
      @body.unbind 'click', @.onDocumentClick

      @body.removeClass 'avgrund-active'

      setTimeout (->
        $('.avgrund-popin').remove()
      ), 500

      if typeof @options.onUnload is 'function'
        @options.onUnload(@$el)

  $.fn.extend Modal: (option, args...) ->
    @each ->
      $this = $(this)
      data = $this.data('Modal')

      if !data
        $this.data 'Modal', (data = new Modal(this, option))
      if typeof option == 'string'
        data[option].apply(data, args)

) window.jQuery, window
