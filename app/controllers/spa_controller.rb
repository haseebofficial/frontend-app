class SpaController < ActionController::Base
  before_action :ignore_newrelic

  def index
    @locale = normalize_locale()
  end

  private 
  def normalize_locale
    if path_locale = params[:locale]
      set_cookie_locale(path_locale) if cookie_locale != path_locale
      path_locale
    elsif cookie_locale && is_valid_locale(cookie_locale)
      cookie_locale
    else
      set_cookie_locale(I18n.default_locale)
      I18n.default_locale
    end
  end

  def cookie_locale
    cookies["userLocale"]
  end

  def set_cookie_locale(locale)
    cookies["userLocale"] = locale
  end

  def is_valid_locale(locale)
    I18n.available_locales.include?(locale.to_sym)
  end

  def ignore_newrelic
    NewRelic::Agent.ignore_transaction
    NewRelic::Agent.ignore_apdex
    NewRelic::Agent.ignore_enduser
  end
end