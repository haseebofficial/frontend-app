$(document).on 'ready page:load', ->
  $(".choose-call-date-tabs .select-time").click(-> 
    form = $(this).closest("form")

    par = form.find('.timepicker')
    h = parseInt(par.children('.time').children('.hour').children('input').val())
    m = parseInt(par.children('.time').children('.minute').children('input').val())

    date = $('.datepicker').datepicker('getDate')

    date = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      h,
      m
    ))

    $("a[tabindex=set_time]").html(date.toUTCString())
    form.find("input[name='call_search[scheduled_at]']").val(date.toISOString())
    form.find("input[name='call_search[scheduled_at]']").data("current-date", date.toISOString())

    return false
  ) 
  
  $(".toggle-call-date a").click ->
    ind = $(this).attr("tabindex")
    $(".toggle-call-date .act").removeClass "act"
    $(this).parent("li").addClass "act"
    $(".tab-toggle").hide()

    $immediateCallInput = $("input[name='call_search[scheduled_at]']")

    $targetTab = $(".tab-toggle[data-tabindex=#{ind}]")
    $targetTab.show()

    if ind == 'immediate'
      $immediateCallInput.val(null)
    else 
      $immediateCallInput.val($immediateCallInput.data("current-date"))