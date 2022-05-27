$(document).on 'ready page:load', ->

  $('#main_slider .bg').each (index, element) ->
    img = $(this).attr('src')
    img = 'background:url(' + img + ') no-repeat top center;'
    $(this).parent('li').attr 'style', img
    $(this).remove()
    return

  mainSlider = $('#main_slider').bxSlider(
    mode: 'fade'
    speed: 400
    pager: false
    controls: false
    touchEnabled: false
    auto: true
    pause: 7000
  )
  $('.slider_arrows .prev_arrow').click (e) ->
    mainSlider.goToPrevSlide()
    return

  $('.slider_arrows .next_arrow').click (e) ->
    mainSlider.goToNextSlide()
    return

  $('.slider_wrapper').hover (->
    $('.slider_wrapper .slider_arrows a').stop().fadeTo 200, 1
    return
  ), ->
    $('.slider_wrapper .slider_arrows a').stop().fadeTo 200, 0
    return


  reviewsSlider = $('#client-reviews-slider').bxSlider(
    mode: 'fade'
    speed: 400
    pager: false
    controls: false
    auto: true
    touchEnabled: false
    pause: 7000
  )

  $('.client-reviews-arrows .prev_arrow').click (e) ->
    reviewsSlider.goToPrevSlide()
    return

  $('.client-reviews-arrows .next_arrow').click (e) ->
    reviewsSlider.goToNextSlide()
    return

  $('.client_reviews_slider_wrapper').hover (->
    $('.client_reviews_slider_wrapper .client-reviews-arrows a').stop().fadeTo 200, 1
    return
  ), ->
    $('.client_reviews_slider_wrapper .client-reviews-arrows a').stop().fadeTo 200, 0
    return

