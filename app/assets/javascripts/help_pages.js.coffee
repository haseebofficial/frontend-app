$(document).on 'ready page:load', ->

  #accordion
  $('.accordion_list>li>.title').click ->
    if $(this).parent('li').hasClass('open')
      $('.accordion_list>.open>.block').slideUp 300
      $('.accordion_list>.open').removeClass 'open'
    else
      $('.accordion_list>.open>.block').slideUp 300
      $('.accordion_list>.open').removeClass 'open'
      $(this).next('.block').slideDown 300
      $(this).parent('li').addClass 'open'
      $('html, body').animate
        scrollTop: 0
      , 300
    return


  $('.about_sidebar_menu>li').hover (->
    $(this).children('ul').css display: 'block'
  ), ->
    $(this).children('ul').css display: 'none'