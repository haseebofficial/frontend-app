adjustTopMenu = ->
  $topMenu = $(".top_menu")
  $backLinkDesktop = $topMenu.find("> li.back-link-desktop")
  $backLinkMobile  = $topMenu.find("> li.back-link-mobile")
  $dropdownTriggers = $topMenu.find("a[data-jq-dropdown]")

  if $(window).width() <= 767
    $dropdownTriggers.attr("data-horizontal-offset", 0)
    $dropdownTriggers.attr("data-vertical-offset", 0)

  else 
    $dropdownTriggers.attr("data-horizontal-offset", -14)
    $dropdownTriggers.attr("data-vertical-offset", 0)

adjustElements = ->
  if $(window).width() <= 767
    $(".interpreter-info-wrapper").find(".right").insertAfter $(".interpreter-info-wrapper").find(".left")
  else 
    $(".interpreter-info-wrapper").find(".left").insertAfter $(".interpreter-info-wrapper").find(".right")

toggleMobileMenu = ->
  $menu = $("#top-menu-content")
  if $menu.length
    $menu.slideToggle(300)
  else 
    $menu = $("<div class='mobile-show' id='top-menu-content' style='display:none;'></div>")
    $("#top").after $menu
    $menu.append($(".top_menu").clone())
    $menu.slideToggle(300)

showDropdown = (e) ->
  $link = $(e.target)
  console.log($link.next($link.data("jq-dropdown")))
  $link.next($link.data("jq-dropdown")).slideToggle()


$(document).on('ready page:load', ->
  adjustTopMenu()
  adjustElements()

  $(".show-inter-mob-tabs li a").matchHeight()

  $(window).resize(adjustTopMenu)
  # $(document).click(".jq-dropdown-ignore", showDropdown)

  $(".top-menu-trigger").click(toggleMobileMenu)
  $(window).resize(adjustElements)
)