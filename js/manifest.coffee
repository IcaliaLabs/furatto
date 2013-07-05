jQuery ->
  jPM = $.jPanelMenu()
  jPM.on()

  # Custom selects
  $("select[data-furatto='select']").dropkick()

  #Custom checkboxes
  $("input[data-furatto='checkbox'], input[data-furatto='radio']").each ->
    input = $(@)
    color = $(@).data('color') || 'blue'
    input.iCheck
      checkboxClass: "icheckbox_flat-#{color}"
      radioClass: "iradio_flat-#{color}"
