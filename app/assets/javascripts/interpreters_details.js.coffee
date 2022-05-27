show_dialog = (selector, title, keepAfterShow) ->
  $(selector).dialog
    modal: true
    width: 500
    height: 380
    autoOpen: true
    draggable: false
    resizable: false
    title: title
    buttons: [
      text: I18n.t("js.select")
      click: ->
        $(this).dialog 'close'
        unless keepAfterShow
          $(selector).remove() 
    ]
  $('.ui-dialog-titlebar-close').hide()

$(document).on 'ready page:load', ->
  SINCE_WORD = I18n.t("js.time.since_word")
  TO_WORD = I18n.t("js.time.to_word")

  $('.service-links .service-link, .cancellation, .link-with-text').click ->
    if data = $(this).data('text')
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        $('#my_dialog').html data
        show_dialog('#my_dialog')
    false

$(document).on 'ready', ->
  SINCE_WORD = I18n.t("js.time.since_word")
  TO_WORD = I18n.t("js.time.to_word")
  
  $(document).on 'click', '.close-dialog', -> 
    $this = $(this)
    id = $this.data("close-dialog-id")
    $("##{id}").dialog('close')
    true

  $(document).on 'click', '.show_dialog',  ->
    $this = $(this)
    id = $this.data("dialog-id")
    unless $this.data('dialog-opened')
      show_dialog("##{id}", $(this).data('dialog-title'), true)
      $this.data("dialog-opened", true)
    else 
      $("##{id}").dialog('open')
    false



  $(document).on 'click', '.diplom', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        diplomas = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/educations_info/diploma?locale=#{I18n.locale}"
        diplomas.success (data) ->
          if data
            html_text = ''
            if data.length > 0
              $.each data, (key, value) ->
                img_url = value.verification_image
                img = if img_url then "<img src='#{img_url}'></img>" else ''
                html_text += "<p><b>#{value.name}:</b><br/> #{SINCE_WORD} <u>#{value.begin_date}</u> #{TO_WORD} <u>#{value.end_date}</u><br>#{img}</p>"

              $('#my_dialog').html html_text
              show_dialog('#my_dialog', I18n.t("interpreter.diplomas"))
    false

  $(document).on 'click', '.cert', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        certificates = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/educations_info/certificate?locale=#{I18n.locale}"
        certificates.success (data) ->
          if data
            html_text = ''
            if data.length > 0
              $.each data, (key, value) ->
                img_url = value.verification_image
                img = if img_url then "<img src='#{img_url}'></img>" else ''
                html_text += "<p><b>#{value.name} :</b><br/> #{SINCE_WORD} <u>#{value.begin_date}</u> #{TO_WORD} <u>#{value.end_date}</u>#{img}</p>"

              $('#my_dialog').html html_text
              show_dialog('#my_dialog', I18n.t("interpreter.certificates"))
    false

  $(document).on 'click', '.education-remote', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        certificates = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/educations?locale=#{I18n.locale}"
        certificates.success (data) ->
          if data
            html_text = ''
            if data.length > 0
              $.each data, (key, value) ->
                img_url = value.verification_image
                img = if img_url then "<img src='#{img_url}'></img>" else ''
                html_text += "<p><b>#{value.name} :</b><br/> #{SINCE_WORD} <u>#{value.begin_date}</u> #{TO_WORD} <u>#{value.end_date}</u>#{img}</p>"

              $('#my_dialog').html html_text
              show_dialog('#my_dialog', I18n.t("interpreter.certificates"))
    false

  $(document).on 'click', '.experience', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        experiences = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/experience_info?locale=#{I18n.locale}"
        experiences.success (data) ->
          if data
            html_text = ''
            if data.length > 0
              $.each data, (key, value) ->
                lang_taxt = value.language_pairs
                if value.company

                  html_text += "<p><b>#{value.company} :</b><br/>#{value.speciality}<br/>#{lang_taxt}<br/>#{SINCE_WORD} <u>#{value.begin_date}</u> #{TO_WORD} <u>#{value.end_date}</u></p>"
                else
                  html_text += "<p><b>#{value.private_practice} :</b><br/>#{lang_taxt}<br/>#{SINCE_WORD} <u>#{value.begin_date}</u> #{TO_WORD} <u>#{value.end_date}</u></p>"

              $('#my_dialog').html html_text
              show_dialog('#my_dialog', I18n.t("interpreter.experience"))
    false

  $(document).on 'click', '.experience_event', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        experiences = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/experience_event_info?locale=#{I18n.locale}"
        experiences.success (data) ->
          if data
            html_text = ''
            if data.length > 0
              $.each data, (key, value) ->
                lang_taxt = value.language_pairs
                html_text += "<p><b>#{value.action} :</b><br/>#{value.organizer}<br/>#{lang_taxt}<br/><u>#{value.date}</u></p>"

              $('#my_dialog').html html_text
              show_dialog('#my_dialog', I18n.t("interpreter.events"))
    false

  $(document).on 'click', '.recommendations', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        experiences = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/recommendations_info?locale=#{I18n.locale}"
        experiences.success (data) ->
          if data
            html_text = "<p>#{data.recommendations}</p>"

            $('#my_dialog').html html_text
            show_dialog('#my_dialog', I18n.t("interpreter.recommendations"))
    false

  $(document).on 'click', '.level', ->
    if $(this).attr 'data-id'
      if $('#body').append '<div id="my_dialog" class="my_dialog"></div>'
        reviews = $.get "#{API_BASE_URL}/interpreters/#{$(this).attr('data-id')}/client_reviews?locale=#{I18n.locale}"
        html_text = "<p>#{I18n.t('interpreter.rating_text')}</p>"
        reviews.success (data) ->
          console.log data
          if data and data.length > 0
            html_text += "<br/><h3 style='margin-bottom: 0;'>#{I18n.t('interpreter.reviews')}:</h3>"
            html_text += "<p class='normal'>#{I18n.t('interpreter.reviews_text')}</p>"
            $.each data,  ->
              review = this
              console.log review
              score = review.score 
              score = 2 if score < 2
              html_text += "<div class='client-review'><div class='questionnaire-stars stars_#{score}'></div><b>#{review.client}</b><div class='review-comment'>&laquo;#{review.comment}&raquo;</div></div>"

          $('#my_dialog').html html_text
          show_dialog('#my_dialog', I18n.t("interpreter.rating"))
    false