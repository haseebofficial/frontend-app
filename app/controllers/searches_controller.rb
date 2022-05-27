class SearchesController < ApplicationController
  require 'rest_client'
  skip_before_filter :verify_authenticity_token, :only => [:create]
  before_action :set_default_request_format, only: [:new, :show, :show_interpreter]

  def show
    response.headers.delete "X-Frame-Options"
    id = params[:id]
    search = Search.find(id)
    unless search.url_city_name == params[:city_name]
      return redirect_to search_city_path(search.url_city_name_escaped, id, locale: params[:locale], format: params[:format]), status: 301
    end
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/#{id}.json", 'get', params)
    @show_currency_select = true
    if !@search.filter.sort_by_price.blank? and @free_interpreters
      if @search.filter.sort_by_price.upcase == 'ASC'
        @free_interpreters.sort_by!{|v| v.price}
      elsif @search.filter.sort_by_price.upcase == 'DESC'
        @free_interpreters.sort_by!{|v| v.price}.reverse!
      end
    end
  end

  def update
    id = params[:id]
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/#{id}.json", 'post', params)
    request.query_parameters.delete("clear_date")
    redirect_to search_path(@id, request.query_parameters)
  end

  def show_interpreter
    begin
      @show_currency_select = true
      interpreter_id = params[:interpreter_id]
      search_id = params[:search_id]
      User.find(interpreter_id)

      search = Search.find(search_id)
      if search.nearest_interval.since < DateTime.now.utc
        return redirect_to search_city_path(search.url_city_name_escaped, search.id, locale: params[:locale])
      end

      unless search.url_city_name == params[:city_name]
        return redirect_to search_interpreter_city_path(search.url_city_name_escaped, search_id, interpreter_id, locale: params[:locale], show_contact_form: params[:show_contact_form], format: params[:format]), status: 301
      end
      @ticket = InterpreterClientTicket.new(ic_ticket_params)
      @ticket.messages.build
      return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/#{search_id}/interpreter/#{interpreter_id}.json", 'get')
      @contacts_available = current_user.try(:interpreter_contacts_available?, User.find(interpreter_id))
    rescue
      @search = Search.find(params[:search_id])
      @city = @search.city 
      @questionnaires = Questionnaire.where(user_id: @search.free_interpreters_ids.split(',')).
                                      order('commission DESC, id ASC').
                                      where.not(user_id: params[:interpreter_id]).
                                      limit(5)
      render 'error_500'
    end
  end

  def new
    set_partner_id
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/new.json", 'get', params)
    set_cities_countries_count
    @on_home_page = true
  end

  def more_interpreters
    my_params = {page: params[:page], busy_int: params[:busy_int],  another_int: params[:another_int]}
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/#{params[:search_id]}/show_more_interpreters", 'get', my_params)
    render 'show.js'
  end

  def mini_more_interpreters
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/#{params[:search_id]}/min_show_more_interpreters", 'get', {page: params[:page], id: params[:current_id]})
    render 'show_interpreter.js'
  end

  def edit
  end

  def create
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches.json", 'post', params)
    #if !stringify_json_parameters("#{ENV['API_BASE_URL']}/searches.json", 'post', params)
    #  redirect_to new_search_path and return
    #end
    set_partner_id
    if @errors
      respond_to do |f|
        f.html {redirect_to root_path}
        f.amp  {render 'new'}
      end
    else 
      redirect_to search_city_path(@search.url_city_name_escaped, @search.id, locale: params[:locale], format: params[:format])
    end
  end

  def language_selector
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/language_selector.json", 'get', params)
    render partial: 'searches/form/language_selector'
  end

  def your_language_selector
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/your_language_selector.json", 'get', params)
    render partial: 'searches/form/your_language_selector'
  end

  def partner_search_form
    return redirect_to root_path unless PartnerAccount.find_by_id(params[:partner_id])
    response.headers.delete "X-Frame-Options"
    @search = Search.new
    render layout: 'search_form'
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def search_params
      params.require(:search).permit(:city_id, :language_id, :your_language_id, :filter_id,
                                     intervals_attributes: [:since, :to],
                                     filter_attributes: [:services, :specializations, :price_min, :price_max, :sort_by_price, :sort_by_level, :sort_by_updated_at])
    end

    def ic_ticket_params
      result = {search_id: params[:search_id]}
      if params[:interpreter_client_ticket]
        result.merge! params.require(:interpreter_client_ticket).permit(:name, :email, :phone)
      end
      result
    end
end
