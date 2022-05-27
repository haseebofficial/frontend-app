# JavaScript Document

#url parameters
setURLParameter = (paramName, paramValue) ->
  url = window.location.href
  if url.indexOf(paramName + "=") >= 0
    prefix = url.substring(0, url.indexOf(paramName))
    suffix = url.substring(url.indexOf(paramName)).substring(url.indexOf("=") + 1)
    suffix = (if (suffix.indexOf("&") >= 0) then suffix.substring(suffix.indexOf("&")) else "")
    url = prefix + paramName + "=" + paramValue + suffix
  else
    if url.indexOf("?") < 0
      url += "?" + paramName + "=" + paramValue
    else
      url += "&" + paramName + "=" + paramValue
  window.history.pushState("", "", url)

removeURLParameter = (paramName) ->
  url = window.location.href
  if url.indexOf(paramName + "=") >= 0
    prefix = url.substring(0, url.indexOf(paramName))
    if (prefix.slice(-1) is "?") or (prefix.slice(-1) is "&")
      prefix = prefix.slice(0, -1)
    suffix = url.substring(url.indexOf(paramName)).substring(url.indexOf("=") + 1)
    suffix = (if (suffix.indexOf("&") >= 0) then suffix.substring(suffix.indexOf("&")) else "")
    url = prefix + suffix
  window.history.pushState("", "", url)

$(window).on 'load', ->
  grayscale($('.grayscale'))

$.fn.disableInputFor = (ms) -> 
  input = this
  input.data('disabled', true)
  disable = -> 
    return false if $(this).data('disabled')
  input.on('keydown', disable)
  setTimeout((-> (input.data('disabled', false))), ms, input)

$(document).on "ready page:load",(e) ->
  # Dropdown menu
  # $('.dropdown-toggle').on('click', (e) ->
  #   e.preventDefault()
  #   $(this).parent().find('.dropdown-menu').toggle()
  #   return false
  # )

  if $('.viewers-count-message').length
    $("div.jGrowl").jGrowl("close");
    $.jGrowl($('.viewers-count-message').text(), {position: 'bottom-right', life: 15000});    

  adjustDropdownsPosition = ->
    $(".dropdown-menu").each(-> 
      $this = $(this)
      $toggle = $this.closest("li").find(".dropdown-toggle")
      $this.css(left: $toggle.position().left)
    )
  adjustDropdownsPosition()
  $(window).resize(adjustDropdownsPosition)
  # Show register form
  $('.show-register-form').on('click', -> 
    $('.order_form.choice').hide()
    $('#register-form').show()
    return false
  )
  #input style
  $("input[type='file'], input[type='radio'], input[type='checkbox'], select:not(.chosen-select)").styler()

  $(".currency-selector").on("change", ->
    currency = $(this).val()
    $(".currency-field").val(currency)
  )

  $('.cart').change ->
    if $(this).val() is 'Visa'
      $(this).parent().parent().find('.order_card').removeClass('master_card')
      $(this).parent().parent().find('.order_card').addClass('visa')
    else if $(this).val() is 'MasterCard'
      $(this).parent().parent().find('.order_card').addClass('master_card')
      $(this).parent().parent().find('.order_card').removeClass('visa')
    else
      $(this).parent().parent().find('.order_card').removeClass('master_card')
      $(this).parent().parent().find('.order_card').removeClass('visa')

  #Raty
  $(".raty-stars").raty({
    click: (score, e) -> (
      $this = $(this)
      $this.parent().find('span').removeClass('base-input-error-icon').addClass('base-input-success-icon')
      $($this.data("target")).val(score)
    )  
  })

  $(".raty-stars[data-score]").each((i, el) -> (
    $(el).raty("score", $(el).data("score"))
  ))

  # Tab buttons
  $("a[data-tab-target]").click((e) ->
    e.preventDefault()
    $this = $(this)

    $tab = $($this.data("tab-target"))
    if $tab.is(":visible")
      $tab.slideUp()
    else 
      $tab.closest(".tabs").find(".tab:visible").slideUp()
      $tab.slideDown()
  )

  #back link
  currentParams = location.href.split("?")[1]
  serviceBackLink = $(".service_choice.back_link")

  if currentParams
    serviceBackLink.attr("href", serviceBackLink.attr("href") + "?" + currentParams)

  #reset

  #$(".find_translator_city").val("for example: city, country").removeClass("act");
  $(".find_translator_wrapper .jq-selectbox__dropdown li:first-child").click()

  #find where
  $('.find_translator_city').focusin (e) ->
    if $(this).val().indexOf('-') < 0
      $(this).val ''
      $(this).addClass 'act'
    $(this).parents('.label').addClass 'act_label'
    $(this).parents('.label_block').addClass 'act_label'

  $('.find_translator_city').focusout (e) ->
    if $(this).val() is ''
      $(this).val($(this).attr('data-default'))
      $(this).removeClass 'act'
    $(this).parents('.label').removeClass 'act_label'
    $(this).parents('.label_block').removeClass 'act_label'


  #find lang
  $(".find_translator_wrapper .jq-selectbox__dropdown li").click ->
    if $(".find_translator_wrapper .jq-selectbox__dropdown .selected").text() is "to choose from the list"
      $(".find_translator_wrapper .jq-selectbox__select-text").removeClass "act"
    else
      $(".find_translator_wrapper .jq-selectbox__select-text").addClass "act"
    $(this).parents(".label").removeClass "act_label"
    $(this).parents(".label_block").removeClass "act_label"

  $(".green_line .jq-selectbox__dropdown li").click ->
    if $(".green_line .jq-selectbox__dropdown .selected").text() is "Choice langueage"
      $(".green_line .jq-selectbox__select-text").removeClass "act"
    else
      $(".green_line .jq-selectbox__select-text").addClass "act"
    $(this).parents(".label").removeClass "act_label"
    $(this).parents(".label_block").removeClass "act_label"


  #full_select
  $(".green_line .jq-selectbox__select").click ->
    if $(this).parents(".jq-selectbox").hasClass("opened")
      $(this).parents(".label_block").addClass "act_label"
    else
      $(this).parents(".label_block").removeClass "act_label"

  $(".find_translator_wrapper .jq-selectbox__select").click ->
    if $(this).parents(".jq-selectbox").hasClass("opened")
      $(this).parents(".label").addClass "act_label"
    else
      $(this).parents(".label").removeClass "act_label"

  #graysc
  $(".type_trans_wrapper .type_trans .type_trans_block").hover (->
    $(this).addClass "hover"
    grayscale.reset $(this).children("img")
  ), ->
    $(this).removeClass "hover"
    grayscale $(this).children("img")

  #order form submit
  $(".order_type_tabs_block > li > form").submit (e) ->
    ind = $("li.vis .payment_tabs input[type='radio']:checked").val()
    block = $("li.vis .payment_tabs_block > li").eq(ind)
    $("li.vis input[name='order[card_attributes][number]']").val($(block).find("[name^='number']").val())
    $("li.vis input[name='order[card_attributes][brand]']").val($(block).find("[name^='brand']").val())
    $("li.vis input[name='order[card_attributes][month]']").val($(block).find("[name^='month']").val())
    $("li.vis input[name='order[card_attributes][year]']").val($(block).find("[name^='year']").val())
    $("li.vis input[name='order[card_attributes][first_name]']").val($(block).find("[name^='first_name']").val())
    $("li.vis input[name='order[card_attributes][verification_value]']").val($(block).find("[name^='verification_value']").val())
    true

  #company order form
  companyOrderModal =
    width: 562
    height: 230

  $("#company_order_modal").dialog
    modal: true
    width: companyOrderModal.width
    height: companyOrderModal.height
    autoOpen: false
    draggable: false
    dialogClass: "without-header"
    buttons: [
      text: "Order for personal"
      click: ->
        $(this).dialog "close"
    ,
      text: "Earliest date"
      click: ->
        companyOrder('availableOrder', true)
        interval_text = companyOrder('interval_text')

        $(".order .order_since input").val(companyOrder('since'))
        $(".order .order_to input").val(companyOrder('to'))
        $(".chosen-period").html("On " + interval_text)

        openTabByIndex(1)
        $(this).dialog "close"
    ,
      text: "Change date"
      click: ->
        searchID = companyOrder("searchID")
        location.href="/searches/" + searchID + "?company_order=true"
    ]

  companyOrder = (key, value) ->
    storeEl = $('input[name=companyOrder]')[0]
    if value
      jQuery.data(storeEl, key, value)
    else
      jQuery.data(storeEl, key)

  #order verification code
  codeConfirmationForm =
    width: 356
    height: 230

  smsVerificationEl = $("input[name=sms_verification]")[0]

  $("#code-confirmation-form").dialog
    modal: true
    width: codeConfirmationForm.width
    height: codeConfirmationForm.height
    autoOpen: false
    draggable: false
    dialogClass: "without-header"
    buttons: [
      text: "Cancel"
      click: ->
        confirmed = jQuery.data(smsVerificationEl, "confirmed")
        $(".phone-for-sms").val("")
        $(".phone-for-sms").valid()
        $(".phone-for-sms").removeClass("act_inp")
        $(this).dialog "close"
    ,
      text: "Ok"
      click: ->
        modalForm = $(this)
        verificationCode = $("#code-confirmation-form input[name=code]").val()
        if verificationCode
          $.post "/#{I18n.locale}/sms_service/verification_code",
            verification_code: verificationCode
          , (data, status) ->
            jQuery.data(smsVerificationEl, "confirmed", data.valid)
            if data.valid
              modalForm.dialog "close"
            else
              alert "Sorry, but the code is incorrect"
    ]

  # $(".phone-for-sms").on "focusout", ->
  #   phoneNumber = $(this).val()
  #   valid = Boolean($(this).valid())
  #   samePhoneNumber = phoneNumber is jQuery.data(smsVerificationEl, "phoneNumber")
  #   confirmed = jQuery.data(smsVerificationEl, "confirmed")
  #   url = ($(this).data('sms-url') or "/#{I18n.locale}/sms_service/send_code")
  #   if valid and not (confirmed and samePhoneNumber)
  #     $.post url,
  #       number: phoneNumber
  #     , (data, status) ->
  #       jQuery.data(smsVerificationEl, "phoneNumber", data.phone_number)
  #       $("#code-confirmation-form").dialog("open")

  #order_type_tabs
  $(".order_type_tabs a").click ->
    companyTabIndex = 1
    notActiveCompanyTab = not $(this).parent().hasClass("act")
    index = parseInt $(this).attr("tabindex")
    notAvailableOrder = not companyOrder('availableOrder')
    if (index is companyTabIndex) and notActiveCompanyTab and notAvailableOrder
      $("#company_order_modal").dialog("open")
    else
      openTabByIndex(index)

  openTabByIndex = (index) ->
    backLink = $(".service_choice.back_link")
    if index == 0
      "/searches/197/interpreter/86?company_order=true".split("?")
      removeURLParameter("company_order")
      backLink.attr("href", backLink.attr("href").split("?")[0])
    else
      setURLParameter("company_order", true)
      currentParams = window.location.href.split("?")[1]
      backLink.attr("href", backLink.attr("href").split("?")[0] + "?" + currentParams)

    tab = $(".order_type_tabs a").eq(index)
    $(".order_type_tabs .act").removeClass "act"
    tab.parent("li").addClass "act"
    $(".order_type_tabs_block > .vis").removeClass "vis"
    $(".order_type_tabs_block > li").eq(index).addClass "vis"

  #personal_form payment_tabs
  $(".personal_form .payment_tabs input[type='radio']").change ->
    ind = $(".personal_form .payment_tabs input[type='radio']:checked").val()
    $(".personal_form .payment_tabs_block .vis").removeClass "vis"
    $(".personal_form .payment_tabs_block > li").eq(ind).addClass "vis"

  #company_form payment_tabs
  $(".company_form .payment_tabs input[type='radio']").change ->
    ind = $(".company_form .payment_tabs input[type='radio']:checked").val()
    $(".company_form .payment_tabs_block .vis").removeClass "vis"
    $(".company_form .payment_tabs_block > li").eq(ind).addClass "vis"

  #mob_menu
  $(".mob_menu").click ->
    if $(".cabinet_sidebar_menu").css("display") is "block"
      $(".cabinet_sidebar_menu").stop().slideUp 300
    else
      $(".cabinet_sidebar_menu").stop().slideDown 300


  #.cart_sidebar .alike_trans_link
  $(".cart_sidebar .alike_trans_link").click ->
    if $(".cart_sidebar .alike_trans_wrapper .alike_trans_inner").css("display") is "block"
      $(".cart_sidebar .alike_trans_wrapper .alike_trans_inner").stop().slideUp 500
    else
      $(".cart_sidebar .alike_trans_wrapper .alike_trans_inner").stop().slideDown 500
    return false


  #map_mob
  $(".map_view_mob a").click ->
    $('.result_mob_menu li:nth-child(2) a').click()
    return false 


  #result_mob_menu
  $(".result_mob_menu a").click ->
    ind = $(this).attr("tabindex")
    $(".result_mob_menu .act").removeClass "act"
    $(this).parent("li").addClass "act"
    $(".tab-toggle").hide()
    $(".tab-toggle[data-tabindex=#{ind}]").show()

  #order page
  #custom jq-checkbox
  $(".order_type_tabs_block .jq-checkbox").click ->
    checkbox = $(this).parent().find("input[type=checkbox]")
    if checkbox.attr("checked") is "checked"
      checkbox.removeAttr("checked")
    else
      checkbox.attr("checked", "checked")

  #.order_type_tabs_block li .other_field
  $(".login_info .forgot-password").click ->
    $(".forgot_info").toggleClass("hide")
    $(".login_info").toggleClass("hide")

  $(".login-form-link").click ->
    $(".forgot_info").addClass("hide")
    $(".login_info").removeClass("hide")
    $(".login-form-link").hide()
    false

  $(".login_info form#new_user").bind "ajax:success", (e, data, status, xhr) ->
    document.location=document.location
  $("#forgot_password").on "submit", (e)->
    e.preventDefault()
    $.ajax this.action, 
           data: $(this).serialize() 
           method: "POST"
           success: ->
            $(".forgot_info").toggleClass("hide")
            $(".login_info").toggleClass("hide")
            $(".success").show()



  $(".order_type_tabs_block li .other_field input").removeAttr "checked"  if $(".order_type_tabs_block li .other_field input:checked")
  $(".order_type_tabs_block li .other_field").click ->
    if $(this).children(".jq-checkbox").hasClass("checked")
      $(".order_type_tabs_block li .other_field_block").stop().slideDown 200
    else
      $(".order_type_tabs_block li .other_field_block").stop().slideUp 200

  $(".order .jq-selectbox__dropdown li").not(".order .jq-selectbox__dropdown li:first-child").click ->
    $(this).parents(".jq-selectbox").children(".jq-selectbox__select").addClass "act_inp"

  $(".order .jq-selectbox__dropdown li:first-child").click ->
    $(this).parents(".jq-selectbox").children(".jq-selectbox__select").removeClass "act_inp"

  #fast login validate
  $(".order #new_user").submit ->
    $.ajax
      type: "POST"
      url: "/users/sign_in"
      data: $("#new_user").serialize()
      success: (data) ->
        $(".login-error").html()
        interpreter_id = $("input[name='order[interpreter_id]']").val()
        search_id = $("input[name='order[search_id]']").val()
        service_id = $("input[name='order[service_id]']").val()
        appender = (if (location.href.indexOf("?") is -1) then "?" else "&")
        location.href = location.href +
                        appender +
                        'order[interpreter_id]=' + interpreter_id +
                        '&order[search_id]=' + search_id +
                        '&order[service_id]=' + service_id
      error: (data) ->
        $(".login-error").html(data.responseText)

    false

  #validate forms
  jQuery.validator.addMethod "placeholder", ((value, element) ->
    value isnt $(element).attr("placeholder")
  ), jQuery.validator.messages.required

  jQuery.validator.addMethod "checked", ((value, element) ->
    $(element).attr("checked") is "checked"
  ), jQuery.validator.messages.required

  jQuery.validator.addMethod "phone", ((value, element) ->
    !!$(element).val().match(/^\+\d+$/)
  ), jQuery.validator.messages.phone_format

  jQuery.validator.addMethod "city_selector", ((value, element) ->
    $el = $(element)
    $form = $el.closest('form')
    $el.val() and ($form.find('.client_city_id').val() or $form.find('#city_id').val())
  ), jQuery.validator.messages.city_select

  errorHandler = (error, element) ->
    error.insertAfter(element)
    $('<li class="icon error"></li>').insertAfter(error)
  successHandler = (element) ->
    element.addClass("valid").closest(".input-container").find('li').removeClass("error").addClass("success").show()
  highlightHandler = (element) ->
    $(element).closest(".input-container").find('li').removeClass("success").addClass "error"

  $(".login_info form").validate
    rules:
      password:
        required: true
        placeholder: "Password:"
      email:
        required: true
        email: true
        placeholder: "Email:"
    errorPlacement: errorHandler
    success: successHandler
    highlight: highlightHandler

  $(".login_info form input[type='password']").on "focusout", ->
    $(this).valid()

  $(".begin-form form").validate
    rules:
      "questionnaire[mobile_phone]":
        phone: true
        required: true
        placeholder: true
      "city_text": 
        city_selector: true
        required: true
        placeholder: true

  $(".forgot_info form").validate
    rules:
      email:
        required: true
        email: true
        placeholder: true
      password:
        required: true
        placeholder: true
    errorPlacement: errorHandler
    success: successHandler
    highlight: highlightHandler

  $(".order .personal_form").validate
    rules:
      "order[client_attributes][name]":
        required: true
        placeholder: true
      "order[client_attributes][surname]":
        required: true
        placeholder: true
      "order[client_attributes][assigned_full_name]":
        required: true
        placeholder: true
      "order[client_attributes][phone]":
        required: true
        phone: true
        placeholder: true
      "order[city_name]":
        required: true
        placeholder: true
      "client[address]":
        required: true
        placeholder: true
      "order[client_attributes][email]":
        required: true
        email: true
        placeholder: true
      "order[surname]":
        required: true
        placeholder: true
      "order[name]":
        required: true
        placeholder: true
      "order[phone]":
        required: true
        phone: true
        placeholder: true
      "number1":
        required: true
        number: true
        placeholder: true
      "first_name1":
        required: true
        placeholder: true
      "verification_value1":
        required: true
        number: true
        placeholder: true
      "number2":
        required: true
        number: true
        placeholder: true
      "first_name2":
        required: true
        placeholder: true
      "verification_value2":
        required: true
        number: true
        placeholder: true
    errorPlacement: errorHandler
    success: successHandler
    highlight: highlightHandler

  $(".order .company_form").validate
    rules:
      "order[name]":
        required: true
        placeholder: true
      "order[company_address]":
        required: true
        placeholder: true
      "order[city_name]": 
        required: true
        placeholder: true
      "order[phone]":
        required: true
        phone: true
        placeholder: true
      "order[bank_name]":
        required: true
        placeholder: true
      "order[inn]":
        required: true
        placeholder: true
      "order[bik]":
        required: true
        placeholder: true
      "order[settlement_account]":
        required: true
        placeholder: true
      "order[correspondent_account]":
        required: true
        placeholder: true
      "order[client_attributes][surname]":
        required: true
        placeholder: true
      "order[client_attributes][name]":
        required: true
        placeholder: true
      "order[client_attributes][email]":
        required: true
        email: true
        placeholder: true
      "order[client_attributes][phone]":
        required: true
        phone: true
        placeholder: true
      "order[meeting_address]":
        required: true
        placeholder: true
      "number1":
        required: true
        number: true
        placeholder: true
      "first_name1":
        required: true
        placeholder: true
      "verification_value1":
        required: true
        number: true
        placeholder: true
      "number2":
        required: true
        number: true
        placeholder: true
      "first_name2":
        required: true
        placeholder: true
      "verification_value2":
        required: true
        number: true
        placeholder: true
    errorPlacement: errorHandler
    success: successHandler
    highlight: highlightHandler


  # $(".order form").submit ->
  #   is_agree = true
  #   if $(this).find("input[name='agree_rules']").attr('checked') != 'checked'
  #     is_agree = false
  #     $(".agreement_required").addClass('error')
  #   else
  #     $(".agreement_required").removeClass('error')
  #   is_agree'

  $emailInput = $("input[name='order[client_attributes][email]']")

  $emailInput.change ->
    email = $(this).val()
    $.get("/#{I18n.locale}/orders/validate_email.js", {email: email})

  # $(".open_map_link").click ->
  #   $(".map_modal").dialog("open")
  #   $(".map_modal").dialog(buttons: [{ text: I18n.t("js.select"), click: -> ($(this).dialog("close")) }])
  #   google.maps.event.trigger(map, 'resize')

  #address field
  $(".custom-dropdown").on "click", "li", ->
    parent = $(this).parents(".custom-dropdown")
    addressField = $(this).parents(".addr").find(".google-address")
    addressField.val($(this).html()).valid() unless $(this).hasClass("notification")
    $(".custom-dropdown").empty()
    $(".custom-dropdown").removeClass("active")

  $(".google-address").on "input", (e) ->
    hasntPlaceholder = $(this).val() isnt $(this).attr("placeholder")
    if hasntPlaceholder
      searchAddress(this)

  $(".addr").on "focusout", (event) ->
    dropdown = $(event.target).parent().find(".custom-dropdown.active:hover")[0]
    unless dropdown
      $(".custom-dropdown").empty()
      $(".custom-dropdown").removeClass("active")
