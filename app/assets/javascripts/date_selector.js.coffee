# JavaScript Document
show_dialog = (selector, elem) ->
  $(selector).dialog
    modal: true
    width: 400
    height: 350
    autoOpen: true
    draggable: false
    resizable: false
    title: I18n.t("js.date_selector.dialog.title")
    buttons: [
      {
        text: I18n.t("js.date_selector.dialog.confirm"),
        click: ->
          $(this).dialog 'close'

          $form = $("#search_form_wrapper")
          offset = $form.offset().top - $(window).scrollTop();
          if offset < 0
            $('html, body').animate(scrollTop: $form.offset().top - 100, 1000);

          msg = $('.data_cloud .result_hidden').val()
          $('.full_date_text').text(msg).addClass 'act'
          $('.data_cloud').css 'display', 'none'
          $(elem).parents('.label').removeClass 'act_label'
          $(elem).parents('.label_block').removeClass 'act_label'
          console.log $form.data("submit-on-date-change")
          $form.find("form").submit() if $form.data("submit-on-date-change")
      }
      {
        text: I18n.t("js.date_selector.dialog.change"),
        click: ->
          $(this).dialog 'close'
      }
    ]
  $('.ui-dialog-titlebar-close').hide()
window.showDateWindow = ->
  $('.timepicker .buttons .clear_intervals').click()
  $('.full_date_text').click()
  $mob_link = $(".result_mob_menu a[tabindex='2']")
  $mob_link.click() if $mob_link.is(":visible")
  return false


$(document).on 'ready page:load', ->
  #full_date
  $('.full_date_text').click ->
    if $(this).next('.data_cloud').css('display') is 'block'
      $(this).next('.data_cloud').css 'display', 'none'
      $(this).parents('.label').removeClass 'act_label'
      $(this).parents('.label_block').removeClass 'act_label'
    else
      $(this).next('.data_cloud').css 'display', 'block'
      $(this).parents('.label').addClass 'act_label'
      $(this).parents('.label_block').addClass 'act_label'
  $('.close-me').click ->
    if $('.data_cloud').css('display') is 'block'
      $('.data_cloud').css 'display', 'none'
      $('.label').removeClass 'act_label'
      $('.label_block').removeClass 'act_label'
  # Datepicker
  $.datepicker.setDefaults($.datepicker.regional[I18n.locale]);
  $('.datepicker:not(.datepicker-future)').datepicker
    altField: '.datepicker_hidden',
    altFormat: 'd/m/yy',
    inline: true,
    firstDay: 1,
    showOtherMonths: true,
    selectOtherMonths: false

  $('.datepicker-future').datepicker
    altField: '.datepicker_hidden',
    altFormat: 'd/m/yy',
    inline: true,
    firstDay: 1,
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date

  #Plus
  $('.timepicker .time .plus').click ->
    par = $(this).parents('.time')
    maxTime = 23  if par.hasClass('hour')
    maxTime = 59  if par.hasClass('minute')
    curVal = parseInt(par.children('input').val(), 10)
    curVal = curVal + 1
    if curVal > maxTime
      par.children('input').val '00'
    else
      if curVal < 10
        par.children('input').val '0' + curVal
      else
        par.children('input').val curVal

  #Minus
  $('.timepicker .time .minus').click ->
    par = $(this).parents('.time')
    maxTime = 23  if par.hasClass('hour')
    maxTime = 59  if par.hasClass('minute')
    curVal = parseInt(par.children('input').val(), 10)
    if curVal is 0
      curVal = curVal - 1
      par.children('input').val maxTime
    else
      curVal = curVal - 1
      if curVal < 10
        par.children('input').val '0' + curVal
      else
        par.children('input').val curVal

  #Add Time
  $('.timepicker .buttons #add_time').click ->
    par = $(this).parents('.timepicker')
    from_h = parseInt(par.children('.from').children('.hour').children('input').val())
    from_m = parseInt(par.children('.from').children('.minute').children('input').val())
    to_h = parseInt(par.children('.to').children('.hour').children('input').val())
    to_m = parseInt(par.children('.to').children('.minute').children('input').val())

    date = $('.datepicker').datepicker('getDate')

    from = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      from_h,
      from_m
    )

    to = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      to_h,
      to_m
    )

    try
      window.date_bag.add_interval(from,to)
    catch err
      alert err

  #Clear Time
  $('.timepicker .buttons #clear_time').click ->
    $('.datepicker').datepicker( 'setDate', new Date() )
    par = $(this).parents('.timepicker')
    par.children('.from').children('.hour').children('input').val('00')
    par.children('.from').children('.minute').children('input').val('00')
    par.children('.to').children('.hour').children('input').val('00')
    par.children('.to').children('.minute').children('input').val('00')

  #Clear intervals
  $('.timepicker .buttons .clear_intervals').click ->
    window.date_bag.intervals = []
    $('.data_cloud .result').text $(this).attr('data-total-text')
    $('.data_cloud .result_hidden').val('')
    $('#intervals').html('')
    $('.timepicker .buttons .clear_time').click()
    $('.full_date_text').text $(this).attr('data-input-text')

  #Select
  $('.data_cloud .select_result').click ->
    if $('.data_cloud .result_hidden').val() is ''
      alert I18n.t("js.date_selector.errors.no_periods_selected")
    else
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        if $('.data_cloud').css('display') is 'block'
          $('.data_cloud').css 'display', 'none'
          $('.label').removeClass 'act_label'
          $('.label_block').removeClass 'act_label'
        $('#my_dialog').html $('.data_cloud .result').clone()
        show_dialog('#my_dialog', this)
  $(".change_search_datetime").click showDateWindow


class Interval
  constructor: (@from, @to) ->
    throw I18n.t("js.date_selector.errors.invalid_interval") unless this.is_valid()

  is_valid: ->
    # to > fro and Future times
    @from < @to #and @from > (new Date()).getTime()

  is_overlaped_with: (other) ->
    @to > other.from and @from < other.to

  msecs: ->
    @to - @from

  text: ->
    to = utcFromEpoch(@to)
    from = utcFromEpoch(@from)
    if I18n.locale == "ja"
      year = I18n.strftime(from, I18n.t("date.formats.default"))
      since = I18n.strftime(from, I18n.t("time.formats.since"))
      to = I18n.strftime(to, I18n.t("time.formats.to"))
      I18n.t("date.intervals.year", {year, since, to})
    else
      append_zeros_to = (num) -> if (num < 10) then '0' + num else num
      from_h = append_zeros_to from.getUTCHours()
      from_m = append_zeros_to from.getUTCMinutes()
      to_h = append_zeros_to to.getUTCHours()
      to_m = append_zeros_to to.getUTCMinutes()
      $.datepicker.formatDate('dd/mm/yy', from) + I18n.t("js.date_selector.from") + from_h + ':' + from_m + I18n.t("js.date_selector.to") + to_h + ':' + to_m + '\n'

utcFromEpoch = (epoch) ->
  d = new Date(epoch)
  d

class DateBag
  constructor: ->
    @intervals = []

  add_interval: (from, to)->
    interval = new Interval(from, to)
    unless this.is_overlaped(interval)
      @intervals.push(interval)
      $('.data_cloud .result').text this.text()

      $('.data_cloud .result_hidden').val(@intervals[0].text()) #( 'Общее время - ' + this.total_time())
      $('#intervals').append("<input name='search[intervals_attributes][#{@intervals.length - 1}][since]' type='hidden' value='#{interval.from}'>")
      $('#intervals').append("<input name='search[intervals_attributes][#{@intervals.length - 1}][to]' type='hidden' value='#{interval.to}'>")

  is_overlaped: (interval) ->
    throw I18n.t("js.date_selector.errors.interval_exists") for i in @intervals when i.is_overlaped_with(interval)
    return false

  text: ->
    messages = ''
    messages += interval.text() for interval in @intervals
    I18n.t("js.date_selector.total_time") + this.total_time() + '\n' + messages

  total_time: ->
    msecs = @intervals.map( (i) -> i.msecs() ).reduce( (x,y) -> x + y)
    hours = Math.floor(msecs/3600000)
    reminder = msecs%3600000
    minutes = Math.round(reminder/60000)
    minutes = '0' + minutes  if minutes < 10
    "#{I18n.t('hours', {count: hours})} #{I18n.t('minutes', {count: minutes})}"

  remove_intervals: ->
    @intervals = []
window.date_bag = new DateBag()
