addUrlParams = (elements) ->
  return unless elements and elements.length
  params = location.href.split("?")[1]
  return unless params

  elements.each (index, el) ->
    el = $(el)
    elParams = el.attr("href").split("?")[1]
    symbol = "&" if elParams
    symbol = "?" unless elParams
    el.attr("href", el.attr("href") + symbol + params)
    return

$(document).on 'ready page:load',(e) ->
  urlParams = location.href.split("?")[1]
  companyOrder = $("#company_order")
  newOrderButtons = $(".cart_content .service_table #new_order")
  editSearchForm = $('form.edit_search')
  newOrderButtons.attr('action', newOrderButtons.attr('action') + "?" + urlParams) if urlParams

  if urlParams
    editSearchForm.attr('action', editSearchForm.attr('action') + "?" + urlParams)
  else if companyOrder.length and companyOrder.val()
    location.href += "?company_order=true"
    editSearchForm.attr('action', editSearchForm.attr('action') + "?company_order=true")

  imageURLs = $(".result_trans_block > a")
  nameURLs = $(".result_trans_block > div > a.name")
  similarInterpreterNamesURLs = $(".cart_sidebar .alike_trans_block .desc a.name")

  addUrlParams(imageURLs)
  addUrlParams(nameURLs)
  addUrlParams(similarInterpreterNamesURLs)

  disable_connected_option = (selector) ->
    $select = $(this)
    $option = $select.find("option:selected")
    $connected_elem = $(selector)
    $connected_elem.find('li').removeClass("disabled")
    $connected_elem.find("li:contains(#{$option.text()})").addClass("disabled")    

  disable_connected_option.call($("#your_language_selector"), '#language_selector')
  disable_connected_option.call($("#language_selector"), '#your_language_selector')

  $('body').on('change', "#your_language_selector select", -> 
    disable_connected_option.call(this, '#language_selector')
  )

  $('body').on('change', "#language_selector select", -> 
    disable_connected_option.call(this, '#your_language_selector')
  )

  $('form.edit_search').submit ->
    form = $(this)
    service_filter = []
    $(".service_filter input:checkbox[type='checkbox']:checked").each ->
      service_filter.push($(this).attr('service_id'))

    specialization_filter = []
    $(".specialization_filter input:checkbox[type='checkbox']:checked").each ->
      specialization_filter.push($(this).attr('specialization_id'))


    if service_filter.length
      form.append("<input name='search[filter_attributes][services]' type='hidden' value='" + service_filter.toString() + "'>")
    if specialization_filter.length
      form.append("<input name='search[filter_attributes][specializations]' type='hidden' value='" + specialization_filter.toString() + "'>")
    $('.sort_filter input').each ->
      $input = $(this)
      $input.val('') unless $input.hasClass('selected-sort')
      form.append($input)

    price_min = parseInt($( "#slider-range" ).slider("values")[0])
    price_max = parseInt($( "#slider-range" ).slider("values")[1])
    $(this).append("<input name='search[filter_attributes][price_min]' type='hidden' value='" + price_min + "'>")
    $(this).append("<input name='search[filter_attributes][price_max]' type='hidden' value='" + price_max + "'>")

  # Add sort value to field on sort link click
  $(".sort_filter a.sort").on "click", (e) ->
    $link = $(this)
    $input = $link.siblings("input")
    
    oldValueIsAsc = $input.val() == "asc"
    $link.toggleClass('up').toggleClass('down')
    newValue = if oldValueIsAsc then 'desc' else 'asc'

    $input.val(newValue)
    $input.addClass('selected-sort')
    $('form.edit_search').submit()


  $("#slider-range").slider stop: (event, ui) ->
    $('form.edit_search').submit()
  # Test comment
  $(".result_filter_block .block label input").on "change", ->
    $('form.edit_search').submit()

  $('#base_form_search, .edit_search').submit ->
    result = true

    if $('#search_city_id').val().length == 0
      $('#search_city_id').parent().find('.error').text I18n.t("js.search.errors.blank_city")
      result = false
    if $('#intervals').children().length == 0
      $('.data_wrapper').parent().find('.error').text I18n.t("js.search.errors.blank_intervals")
      result = false
    if $('#search_language_id').children("option[value='']").length > 0
      $('#language_selector').parent().find('.error').text I18n.t("js.search.errors.blank_language")
      result = false

    return result

  $('.show-more').click -># FIXME
    search_id = $('#search_id').val()
    page_count = parseInt($(this).attr('data-page_count'))
    busy_int = parseInt($(this).attr('data-busy_int'))
    another_int = parseInt($(this).attr('data-another_int'))
    current_page = parseInt($(this).attr('data-current_page'))

    data = {another_int: another_int, busy_int: busy_int}

    if current_page < page_count
      current_page++
      $(this).attr('data-current_page', current_page)
      $(this).attr('data-busy_int', 0)# FIXME
      busy_int = 0
      $(this).attr('data-another_int', 0)# FIXME
      another_int = 0
      #Test tst
      data.page = current_page

      $.get($(this).data("url"), data)

    if current_page >= page_count and busy_int == 0 and another_int == 0
      $(this).hide()

  $('.show-more-mini').click ->
    search_id = $('#search_id').val()
    page_count = parseInt($(this).attr('data-page_count'))
    current_page = parseInt($(this).attr('data-current_page'))
    current_id = parseInt($(this).attr('data-current_id'))

    if current_page < page_count
      current_page++
      $(this).attr('data-current_page', current_page)

      $.get($(this).data("url"), {
        page: current_page
        current_id: current_id
      })

    if current_page >= page_count
      $(this).hide()

  $(".specialization_filter .fold").click ->
    $(".specialization_filter .specs").addClass("folded")
    $(".specialization_filter .fold").hide()
    $(".specialization_filter .unfold").show()
    $(".specialization_filter .fader").show()

  $(".specialization_filter .unfold").click ->
    $(".specialization_filter .specs").removeClass("folded")
    $(".specialization_filter .fold").show()
    $(".specialization_filter .unfold").hide()
    $(".specialization_filter .fader").hide()