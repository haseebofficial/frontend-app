$("#payment-block").html("<%= j render('orders/new/payment_block') %>")
$("form.order_form").on('submit', -> 
  return false
)
$("form.order_form .order_form_submit").remove()

$('html, body').animate({
    scrollTop: $("#payment-container").offset().top
}, 2000);