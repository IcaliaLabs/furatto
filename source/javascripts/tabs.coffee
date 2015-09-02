$.fn.extend
  tabSection: (options) ->
    self = $.fn.tabSection
    opts = $.extend {}, self.default_options, options
    $(this).each (i, element) ->
      $element = $(element)
      $element.find(".tab.link").on 'click', ->
        $this = $(this)
        $element.find('.tab.option').removeClass('active')
        $this.parent().addClass('active')

        self.open $element, $this.data('target')

      self.init element, opts

$.extend $.fn.tabSection,
  default_options:
    active: 0

  init: (element, opts) ->
    console.log element

  open:(element, target) ->
    element.find(".tab.view").removeClass('active');
    element.find("*[data-name='#{target}']").addClass('active');


$ ->
  $('section.tabs').tabSection();