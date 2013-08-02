(($) ->
  "use strict"
  class Modal
    constructor: (element, options) ->
      @options = options
      @$element = $(element).on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(@hide(), @))
      @$backdrop = null
      @isShown = null

      if (@options.remote)
        @$elementement.find('.modal-body').load(@options.remote)

    @DEFAULTS = {
      backdrop: true
      keyboard: true
      show: true
    }


    toggle: ->
      @[(if not @isShown then 'show' else 'hide')]

    show: ->
      that = @
      event = $.Event('show.furatto.modal') #register the show event for furatto modal
      @$element.trigger(event)

      if @isShown || event.isDefaultPrevented()
        @isShown = true
        @escape()
        @backdrop ->
          transition = $.support.transition and that.$element.hasClass('fade')

          if not that.$element.parent().length
            that.$element.appendTo(document.body)

          that.$element.show()

          if transition
            that.$element[0].offsetWidth # force reflow

          that.$element.addClass('in').attr('aria-hidden', false)

          that.enforceFocus()

          if transition
            that.$element.one($.support.transition.end, ->
              that.$element.focus().trigger('shown.furatto.modal')
            )
          else
            that.$element.focus().trigger('shown.furatto.modal')

    hide: (event) ->
      event.preventDefault() if event

      event = $.Event('hide.furatto.modal')
  
      @$element.trigger(event)

      if not @isShown || event.isDefaultPrevented()
        @isShown = false
        @escape()

        $(document).off('focusin.furatto.modal')

        @$element.removeClass('in').attr('aria-hidden', true)

        if $.support.transition and @$element.hasClass('fade')
          @$element.one($.support.transition.end, $.proxy(@hideModal(), @)).emulateTransitionEnd(300)
        else
          @hideModal()

    enforceFocus: ->
      $(document)
        .off('focusin.furatto.modal')
        .on('focusin.furatto.modal', $.proxy (e) ->
          if @$element[0] isnt e.target and not @$element.has(e.target).length
            @$element.focus()
        , @)

    escape: ->
      if @isShown and @options.keyboard
        @$element.on('keyup.dismiss.furatto.modal', $.proxy (e) ->
          e.which == 27 and @hide()
        , @)
      else if not @isShown
        @$element.off('keyup.dismiss.furatto.modal')

     hideModal: ->
       that = @
       @$element.hide()
       @backdrop(->
        that.removeBackdrop()
        that.$element.trigger('hidden.furatto.modal')
       )

     removeBackdrop: ->
       @$backdrop and @$backdrop.remove()
       @$backdrop = null


     backdrop: (callback) ->
       that = @
       animate = if @$element.hasClass('fade') then 'fade' else ''

       if @isShown and @options.backdrop
         doAnimate = $.support.transition and animate

         @$backdrop = $("<div class='modal-backdrop #{animate}' />").appendTo(document.body)

         @$element.on 'click', $.proxy (e) ->
           if e.target isnt e.currentTarget
             if @options.backdrop is 'static'
               @$element[0].focus().call(@$element[0])
             else
               @hide.call(@)

         if doAnimate then @$backdrop[0].offsetWidth

         @$backdrop.addClass 'in'

         if not callback

           if doAnimate
             @$backdrop
               .one($.support.transition.end, callback)
               .emulateTransitionEnd(150)
             callback()
       else if not @isShown and @$backdrop
           @$backdrop.removeClass 'in'

           if $.support.transition and @$element.hasClass 'fade'
             @$backdrop
               .one($.support.transition.end, callback)
               .emulateTransitionEnd(150)
             callback()
       else if callback
         callback()

  old = $.fn.modal

  $.fn.modal = (option) ->
    @each ->
      $this = $(this)
      data = $this.data('furatto.modal')
      options = $.extend {}, Modal.DEFAULTS, $this.data(), typeof option == 'object' and option

      console.log $this

      if !data
        $this.data 'furatto.modal', (data = new Modal(this, options))
      if typeof option == 'string'
        data[option]()
      else if options.show then data.show()
  
  #$.fn.modal.Constructor = Modal

  $(document).on 'click.furatto.modal.data-api', '[data-toggle="modal"]', (e) ->
    $this = $(this)
    href = $this.attr('href')
    $target = $($this.attr('data-target') or (href and href.replace(/.*(?=#[^\s]+$)/, '')))
    option = if $target.data('modal') then 'toggle' else $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', ->
        $this.is(':visible') and $this.focus()
      )

  $body = $(document.body)
    .on('shown.furatto.modal', '.modal', ->
      $body.addClass('modal-open'))
    .on('hidden.furatto.modal', '.modal', ->
      $body.removeClass('modal-open'))
)(window.jQuery)
