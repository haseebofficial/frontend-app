orderPath = '/'
redirectToOrder = -> 
show_dialog = ->
  $("#order-dialog").dialog
    modal: true
    width: 500
    height: 350
    autoOpen: true
    draggable: false
    resizable: false
    closeText: "test"
    title: I18n.t("js.titles.confirm_order_date")
    buttons: [
      {
        text: I18n.t("js.buttons.confirm_order_date"),
        click: redirectToOrder
      },
      {
        text: I18n.t("js.buttons.change_order_date"),
        click: ->
          Turbolinks.visit(orderPath)
          false
      }
    ]
  $('.ui-dialog-titlebar-close').hide()
$(document).on 'ready page:load', ->

  $(".new-order-button").click ->
    $btn = $(this)
    int = $btn.data("search-intervals")
    orderPath = $btn.data("clear-date-path")
    redirectToOrder = if $btn.is("input") 
      -> 
        ($btn.closest("form").submit(); false)
    else 
      ->
        (Turbolinks.visit($btn.attr('href')); false)

    $('#body').append '<div id="order-dialog" class="my_dialog"></div>'

    modalContent = $($btn.data("modal-content")).html()
    $("#order-dialog").html(modalContent)
    show_dialog()
    false