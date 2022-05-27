module CallSearchesHelper
  def default_languages_for_search(search, all_languages)
    if all_languages == []
      { language: nil, your_language: nil }
    else
      language, your_language = get_default_language_locales(search, all_languages)

      { language: language, your_language: your_language }
    end
  end

  private

  def get_default_language_locales(search, all_languages) 
    if search
      [search.language, search.your_language]
    else 
      your_language = find_language_by_locale(I18n.locale, all_languages) || "en"
      language = first_different_from(your_language, all_languages, preferred: "en")

      [language, your_language]
    end
  end

  def find_language_by_locale(locale, langs) 
    result = langs.find {|l| l.locale.to_sym == I18n.locale }
    result && result.locale
  end

  def first_different_from(locale, langs, preferred: )
    if preferred != locale
      preferred
    else 
      result = langs.find {|l| l.locale != locale }
      result && result.locale
    end
  end
end