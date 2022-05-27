module LocalizationHelper
  FALLBACK_LOCALE = :en

  def helper_intervals_text(search)
    if I18n.locale == :ja
      time_format = t("time.formats.hours_minutes")
      intervals = search.intervals.map do |i|
        since, to = [i.since_epoch, i.to_epoch].map { |t| Time.at(t).utc }

        since_text = l(since, format: time_format)
        to_text    = l(to, format: time_format) 
        date       = l(since, format: t("date.formats.month_day"))
        t("date.intervals.month_day", date: date, since: since_text, to: to_text)
      end
      intervals.join(", ")
    else
      search.intervals_text
    end
  end

  def l_object(method, object)    
    object.send(method)
  end

  # This method is supposed to be used for non-questionnaire objects only(City, Language etc.)
  def localized_method(method)
    method
  end
  
  def l_questionnaire(method, questionnaire = nil)
    questionnaire ||= @questionnaire
    raise ArgumentError.new("No questionnaire given to l_questionnaire method") unless questionnaire

    if questionnaire.respond_to?(:t)
      questionnaire.send(:t, method)
    else
      questionnaire.send(method)
    end
  end

  #
  # Returns city name in locative case, mostly used for :ru locale
  # set for_service to true to get city name for services list on search page
  # Example outputs for ru locale: 
  # If city has "loct_ru_name" attribute: "Бостоне"
  # # # For service: " в Бостоне"
  # Else: "городе Бостон"(default is used)
  # # # For service: ", Бостон"
  #
  # Example outputs for any other locale:
  # Default: "City Name"(the one specified in 'default' variable)
  # Default for service: ", City Name"
  # 
  def city_name_in_loct_case(city, default, for_service=false)
    ident = for_service ? ", " : nil
    return "#{ident}#{default}" if I18n.locale.to_sym != :ru

    n = city.loct_ru_name
    result = if n.present?
      ident = for_service ? " в " : nil
      "#{ident}#{n}"
    else 
      ident = for_service ? "," : "городе"
      "#{ident} #{default}"
    end
  end

  def languages_select_options(default_lang=nil, langs=nil)
    langs ||= Language.all.by_priority
    @languages_select_options =  if default_lang  
      options_from_collection_for_select(langs, "id", "to_s", default_lang.id)
    else
      options_from_collection_for_select(langs, "id", "to_s")
    end
  end
end 