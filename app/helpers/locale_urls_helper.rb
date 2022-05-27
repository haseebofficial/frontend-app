module LocaleUrlsHelper
  AVAILABLE_LOCALES = ["de", "en", "ru", "zh", "fr", 'es', "it", "ar", "ja"]
  HELP_INTERPRETER_PAGE_LOCALES = %W[fr it pt tr vi zh es en ru de ja]
  LOCALES_FOR_REGEX = AVAILABLE_LOCALES.join("|")

  def current_url_with_locale(locale, url=nil, absolute_url: false)
    # DO NOT put referer before original url
    url ||= (request.original_url || request.referer)

    url = root_url(locale: nil) if(!url or url.match("set_locale"))

    split_url = url.partition(/#{request.domain}(:#{request.port})?/)

    path = split_url[2]

    split_path = path.partition(/\A\/([a-zA-Z]{2})(\/|\z)/)

    # split_path[1] is a locale part of the url(e.g /en/)
    path = split_path[1].blank? ? path : split_path[2]

    join_with = path =~ /\A\// ? "" : "/"

    result = ["/#{locale}", path].join(join_with)
    if absolute_url
      "#{request.protocol}#{request.host_with_port}#{result}"
    else
      result
    end

  end

  def available_page_locales
    action_name == "help_interpreter" ? HELP_INTERPRETER_PAGE_LOCALES : AVAILABLE_LOCALES
  end
end