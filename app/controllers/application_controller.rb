class ApplicationController < ActionController::Base
  include LocaleUrlsHelper
  NO_LOCALE_PATHS = ["/robots.txt", "/sitemap.xml", "/yandex_4708c032dba756eb.html"]
  NO_LOCALE_PATHS_FOR_REGEX = NO_LOCALE_PATHS.map {|p| Regexp.escape(p)}.join("|")
  RUB_CURRENCY_COUNTRIES = ["RU"]
  EUR_CURRENCY_COUNTRIES = ["BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "FIN", "SE", "UK"]

  before_action :set_raven_context
  before_filter :try_user_login, :check_email_ref, :ignore_newrelic_for_amp
  before_action :set_locale, :set_currency, except: [:error_500, :error_404]
  before_action :set_locale_without_redirect, only: [:error_500, :error_404]
  after_action :set_caching_cookie, :set_spa_session
  
  def stringify_json_parameters(uri, method, request_params={})
    # begin
      request_params = {locale: I18n.locale, browser_locale: browser_locale, current_user_id: current_user.try(:id)}.merge(request_params)
      logger.info '*** Stringify starts with request_params:' + request_params.inspect
      if method == 'get'
        json_data = RestClient.get(uri, :params => request_params)
      end
      if method == 'post'
        json_data = RestClient.post(uri, request_params)
      end
      remote_error = JSON.parse(json_data)["error"]
      unless remote_error.blank?
        @backtrace = JSON.parse(json_data)["backtrace"]
        raise remote_error
      end
    # rescue => e
    #   raise Exception.new(e)
    # end

    #
    # Backend Server not accessible
    #
    if json_data == "error: not_found\n"
      raise 'Backend Server not responding on: ' + uri
    end
    #
    # Service unavailable
    #

    return if json_data.empty?
    hash = JSON.parse(json_data)
    obj = Hashie::Mash.new hash
    obj.stringify_keys.keys.sort.each do |key|
      logger.info 'Instance variable assigns: ' + key
      instance_variable_set('@'+key, obj[key] )
    end
    logger.info '** Stringified successfully.'
    true
  end

  def render_debug_information
    render text: %{
        <div style='font-size: 20px; background-color: lightgray; text-align: center;
                    padding-top: 50px; text-shadow: 1px 1px 1px black, 0 0 2em black;'>
          <h1>Interpreters Frontend</h1>
          <hr/>
          Backend server error: #{@api_error_message} <br/>
          #{@api_error_url} (#{@api_error_method.upcase}) <br/>
          HTTP parameters: #{@api_error_params || 'empty'} <br/>
          <hr/>
        </div>
        <h2>Full Trace</h2>
        #{@backtrace if @backtrace}
      }
  end

  def default_url_options(options={})
    { locale: I18n.locale }
  end

  def set_locale
    locale = params[:locale]


    locale ||= if (params[:city_name] && params[:city_name].length == 2)
      params[:city_name]
    end

    return if request.original_url.match(/#{NO_LOCALE_PATHS_FOR_REGEX}/)
    
    if !locale || !available_page_locales.include?(locale)
      redirect_to current_url_with_locale(default_locale)
    else 
      I18n.locale = locale
    end
  end

  def auth_params
    params.merge(internal_api_token: ENV["INTERNAL_API_TOKEN"], user_id: current_user.id)
  end
    
  def set_help_interpreter_page_locale
    locale = params[:locale]
    return if request.original_url.match(/#{NO_LOCALE_PATHS_FOR_REGEX}/)
    if !locale or !HELP_INTERPRETER_PAGE_LOCALES.include?(locale)
      redirect_to current_url_with_locale(default_locale)
    else 
      I18n.locale = locale
    end
  end

  def set_locale_without_redirect
    I18n.locale = (params[:locale] || default_locale)
  end

  def default_locale
    locale = cookies[:locale]
    header = request.env['HTTP_ACCEPT_LANGUAGE']
    locale ||= header.scan(/^[a-z]{2}/).first if header
    result = available_page_locales.include?(locale) ? locale : I18n.default_locale
    cookies[:locale] ||= { value: result, expires: 90.days.from_now }
    result
  end

  def set_currency 
    return true if session[:current_currency] && session[:current_currency] != 'RUB'
    if request.location
      c = request.location.country_code
    else 
      return (session[:current_currency] = "EUR")
    end
    
    session[:current_currency] = if c == "US"
      "USD"
    else 
      "EUR"
    end
  end

  def after_sign_in_path_for(resource)
    session.delete(:redirect_url) || stored_location_for(resource) || personal_account_path
  end


  private 
    def ignore_newrelic_for_amp
      NewRelic::Agent.ignore_transaction if params[:format] == "amp"
    end

    def try_user_login
      return unless user_signed_in?
      unless current_user.is_client?
        sign_out current_user
        redirect_to "https://cp.interpreters.travel/"
      end
    end

    def check_email_ref
      if !user_signed_in? and (t = params[:email_ref])
        u = User.find_by_signin_token(t)
        sign_in u if u
      end
    end
    
    def browser_locale
      header = request.env['HTTP_ACCEPT_LANGUAGE']
      header.scan(/^[a-z]{2}/).first if header
    end

    def set_partner_id
      if params[:partner_id]
        cookies[:partner_id] = { value: params[:partner_id].to_s, expires: 30.days.from_now }
      end
    end

    def set_cities_countries_count(round: false)
      cities = City.published
      @cities_count, @countries_count = cities.count, cities.count(:country_id)
      if round 
        @cities_count, @countries_count = round_down(@cities_count), round_down(@countries_count)
      end
    end

    def round_down(n)
      if n > 1000
        n/100 * 100
      elsif n > 100
        n/10 * 10
      else 
        n
      end
    end

    def set_spa_session
      if u = current_user
        cookies[:current_user] ||= JSON.generate({id: u.id, name: u.name, surname: u.surname, role: u.role.name})
      else
        cookies.delete :current_user
      end
    end

    def set_caching_cookie
      if user_signed_in?
        cookies[:disable_nginx_caching] ||= {value: 1, expires: 3.weeks.from_now}
      else
        cookies.delete(:disable_nginx_caching)
      end
    end

    def set_default_request_format
      request.format = :html unless params[:format]
    end

    def set_raven_context
      if current_user
        Raven.user_context(id: current_user.id)
      end

      Raven.extra_context(params: params, url: request.url)
    end
end
