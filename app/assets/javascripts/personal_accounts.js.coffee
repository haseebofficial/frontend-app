show_dialog = (button) ->
  $("#request_contacts_dialog").dialog
    modal: true
    width: 500
    height: 350
    autoOpen: true
    draggable: false
    resizable: false
    closeText: "test"
    title: button.data("dialog-title")
    buttons: [
      {
        text: I18n.t("js.buttons.confirm_order_date"),
        click: -> 
          window.location.replace(button.data("confirm-url"))
      },
      {
        text: I18n.t("js.cancel"),
        click: ->
          $(this).dialog("close")
          false
      }
    ]
  $('.ui-dialog-titlebar-close').hide()
$(document).on 'ready page:load', ->
  $("#order_cancel").on "click", (e) ->
    e.preventDefault()
    $("#order_cancel_modal").dialog 
      modal: true
      autoOpen: true
      draggable: false
      resizable: false
  $(".not_ready").on "click", (e)->
    e.preventDefault()
    console.log $($(this).data('target')).length
    $($(this).data('target')).dialog 
      modal: true
      autoOpen: true
      draggable: false
      resizable: false

  $(".request_contacts").on "click", (e) ->
    e.preventDefault()
    show_dialog($(this));
    false

  $("a[data-replace-with]").on("click", ->
    $target = $($(this).data("replace-with"))
    $target.show()
    $(this).replaceWith($target)
    false
  )