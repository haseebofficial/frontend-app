$(document).on 'ready page:load', ->

  #validation localize
  jQuery.extend jQuery.validator.messages,
    required: I18n.t("js.validator.required")
    remote: I18n.t("js.validator.remote")
    email: I18n.t("js.validator.email")
    url: I18n.t("js.validator.url")
    date: I18n.t("js.validator.date")
    dateISO: I18n.t("js.validator.dateISO")
    number: I18n.t("js.validator.number")
    digits: I18n.t("js.validator.digits")
    creditcard: I18n.t("js.validator.creditcard")
    equalTo: I18n.t("js.validator.equalTo")
    accept: I18n.t("js.validator.accept")
    maxlength: jQuery.validator.format(I18n.t("js.validator.maxlength"))
    minlength: jQuery.validator.format(I18n.t("js.validator.minlength"))
    rangelength: jQuery.validator.format(I18n.t("js.validator.rangelength"))
    range: jQuery.validator.format(I18n.t("js.validator.range"))
    max: jQuery.validator.format(I18n.t("js.validator.max"))
    min: jQuery.validator.format(I18n.t("js.validator.min"))
    uniq_email: I18n.t("js.validator.uniq_email")
    phone_format: I18n.t("js.validator.phone_format")
    city_select: I18n.t("js.validator.city_select")

  #validate forms
  jQuery.validator.addMethod 'uniq_email', ((value, element) ->
    flag = false
    $.ajax
      type: 'POST'
      url: "#{API_BASE_URL}/email_validation"
      data: {email: value}
      success: (data) ->
        flag = data.uniq
      async: false
    return flag
  ), jQuery.validator.messages.uniq_email

  jQuery.validator.addMethod "phone", ((value, element) ->
    !!$(element).val().match(/^\+\d+$/)
  ), jQuery.validator.messages.phone_format

  errorBaseInput = (error, element) ->
    $element = $(element)
    $(error).addClass 'base-input-label'
    if $element.data("connected-elem")
      $connectedElem = $($element.data("connected-elem"))
      $('<span class="base-input-error-icon"></span>').insertAfter($connectedElem)

    $(element).after error
    $('<span class="base-input-error-icon"></span>').insertAfter(element)
    $(element).addClass 'base-input-error'

  successBaseInput = (element) ->
    $(element).parent().find('.base-input').removeClass('base-input-error').addClass('base-input-success')
    $(element).parent().find('span').removeClass('base-input-error-icon').addClass('base-input-success-icon')

  highlightBaseInput = (element) ->
    $(element).parent().find('.base-input').removeClass('base-input-success').addClass('base-input-error')
    $(element).parent().find('span').removeClass('base-input-success-icon').addClass('base-input-error-icon')


  $('.base-form form').validate
    rules:
      'client_support_message[surname]':
        required: true
      'client_support_message[content]':
        required: true
      'client_support_message[name]':
        required: true
      'client_support_message[phone]':
        required: true
      'client_support_message[email]':
        required: true
        email: true

    errorPlacement: errorBaseInput
    success: successBaseInput
    highlight: highlightBaseInput

  $('.edit_client_review').validate
    ignore: ":hidden:not(#client_review_score)",
    rules:
      'client_review[score]':
        required: true 

    errorPlacement: errorBaseInput
    success: successBaseInput
    highlight: highlightBaseInput


  $('#create_new_interpreter').validate
    rules:
      'user[name]':
        required: true
      'user[surname]':
        required: true
      'user[email]':
        required: true
        email: true
        uniq_email: true
      'questionnaire[mobile_phone]':
        required: true
        phone: true
      'questionnaire[phone_for_staff]':
        required: true
        phone: true
      'city_text':
        city_selector: true
        required: true

    errorPlacement: errorBaseInput
    success: successBaseInput
    highlight: highlightBaseInput

  $("#create_new_interpreter #city_text").on("keypress", ->
    $(this).closest("form").find("#city_id").val('') unless $(this).val()
  )

  $('.base-input').focusout ->
    $(this).valid()

  $('#create_new_user').validate
    rules:
      'user[name]':
        required: true
      'user[surname]':
        required: true
      'user[email]':
        required: true
        email: true
        uniq_email: true
      'user[phone]':
        required: true
        phone: true
      'user[password]':
        required: true
      'user[city]':
        city_selector: true
        required: true

    errorPlacement: errorBaseInput
    success: successBaseInput
    highlight: highlightBaseInput

  $('.base-input').focusout ->
    $(this).valid()
