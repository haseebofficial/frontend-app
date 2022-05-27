 class HomeController < ApplicationController
  #before_filter :authenticate_user!, except: [:help]
  #layout 'intranet'

  layout 'application'

  def sitemap
    path = Rails.root.join("public", "sitemaps", "sitemap.xml")
    if File.exists?(path)
      render xml: open(path).read
    else
      render text: "Sitemap not found.", status: :not_found
    end
  end

  def robots
    render 'robots.text'
  end

  def dashboard
  end

  def set_current_locale
    url = (request.referer || root_url(locale: nil))
    cookies[:locale] = { value: params[:new_locale], expires: 90.days.from_now }
    redirect_to current_url_with_locale(params[:new_locale], url)
  end 

  def set_current_currency
    c = params[:currency]
    session[:current_currency] = c.to_s.upcase
    redirect_to (request.referer || root_path)
  end 

  def help
  end

  def help_interpreter
    @interpreter_inquiry ||= InterpreterInquiry.new
    @reviews = InterpreterReview.order("RANDOM()").limit(20)
  end

  def for_affiliates
  end

  def about
  end

  def info
    set_cities_countries_count(round: true)
  end

  def for_clients
    @reviews = ClientReview.for_current_locale
    set_cities_countries_count
  end

  def services_guide
  end

  def escort_delegations
  end

  def interview
  end

  def clinic_consultation
  end

  def press_conferences
  end

  def support_individuals
  end

  def conversation
  end

  def presentation
  end

  def protocol_translation
  end

  def seminar_conference
  end

  def judicial_translation
  end

  def phone_talking
  end

  def celebrations
  end

  def privacy_policy
  end

  def terms_conditions
  end

  def phone
    @interpreter_inquiry ||= InterpreterInquiry.new
  end
end
