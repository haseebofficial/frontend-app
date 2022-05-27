$(document).ready(function() {
  $.each(['#create_new_user', '#affiliate_form', '#new_client_support_ticket', '#create_new_interpreter'], function(index, form_id) {
    $(form_id.concat(' input.base-input-submit')).css("background-color","#aaa");
    $(form_id).keyup(function() {
      var empty = false;
      $(form_id.concat(' .controls input:visible')).each(function() {
        if ($(this).val() == '') {
          empty = true;
        }
      });

      if (empty) {
        $(form_id.concat(' input.base-input-submit')).css("background-color","#aaa");
      } else {
        $(form_id.concat(' input.base-input-submit')).css("background-color","#ffc602");
      }
    });
  });
});
