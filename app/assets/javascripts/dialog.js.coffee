$.fn.show_dialog = (title) ->
  $(this).dialog
    modal: true
    width: 400
    height: 350
    autoOpen: true
    draggable: false
    resizable: false
    title: title
    buttons: [
      text: I18n.t("js.select")
      click: ->
        $(this).dialog 'close'
        $(selector).remove()
    ]
  $('.ui-dialog-titlebar-close').hide()